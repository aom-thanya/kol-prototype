export function getCampaignCalculations(brief, activeOptId) {
  const budgetOptions = brief.budgetOptions && brief.budgetOptions.length > 0 
    ? brief.budgetOptions 
    : [{
        id: "legacy",
        name: "Option A",
        budgetSpending: brief.budgetSpending,
        vat: brief.vat,
        budgetCondition: brief.budgetCondition,
        estimatedBrandSpending: brief.estimatedBrandSpending,
        budgetPerInfluencer: brief.budgetPerInfluencer,
        expectedNumInfluencers: brief.expectedNumInfluencers,
        expectedReach: brief.expectedReach,
        scopeOfWorks: brief.scopeOfWorks || []
      }];

  const activeOpt = budgetOptions.find(o => o.id === activeOptId) || budgetOptions[0];

  const totalBudget = parseFloat(String(activeOpt.budgetSpending || brief.budgetSpending || 15000).replace(/,/g, '')) || 15000;
  const totalBoostAds = parseFloat(String(activeOpt.budgetBoostSpending || brief.budgetBoostSpending || 0).replace(/,/g, '')) || 0;
  const totalOtherServices = parseFloat(String(activeOpt.estimatedBrandSpending || brief.estimatedBrandSpending || 0).replace(/,/g, '')) || 0;
  
  const availableBudget = totalBudget - totalBoostAds - totalOtherServices;
  const rawCostForInfluencer = availableBudget / 2.1;
  const contingencies = rawCostForInfluencer * 0.05;
  const rawCostForCampaign = rawCostForInfluencer - contingencies;

  // Logistics parameters
  const productValue = parseFloat(String(brief.productValue || activeOpt.productValue || 200).replace(/,/g, '')) || 200;
  const travelExpense = parseFloat(String(brief.reviewerTravelExpense || 500).replace(/,/g, '')) || 500;
  const logisticsFee = parseFloat(String(brief.logisticsPerInfluencer || 0).replace(/,/g, '')) || 0;

  const getFollowerTier = (str) => {
    if (!str) return 2; // Default to 10K-50K (index 2)
    const normalized = str.toLowerCase().replace(/,/g, '');
    if (normalized.includes('100k') || normalized.includes('100000')) return 4;
    if (normalized.includes('50k') || normalized.includes('50000')) return 3;
    if (normalized.includes('10k') || normalized.includes('10000')) return 2;
    if (normalized.includes('5k') || normalized.includes('5000')) return 1;
    return 0; // default to 1K-5K
  };

  const getPlatformRates = (platformName, tierIdx) => {
    const plat = String(platformName || "").toLowerCase();
    if (plat.includes("tiktok")) {
      const socialRates = [50, 125, 325, 625, 1250];
      const supportRates = [1250, 1675, 1875, 1875, 3250];
      return {
        social: socialRates[tierIdx] || 325,
        support: supportRates[tierIdx] || 1875
      };
    } else if (plat.includes("facebook")) {
      const socialRates = [50, 100, 150, 400, 1000];
      const supportRates = [900, 1200, 1500, 2000, 3000];
      return {
        social: socialRates[tierIdx] || 150,
        support: supportRates[tierIdx] || 1500
      };
    } else if (plat.includes("lemon")) {
      const supportRates = [1500, 2000, 2250, 3000, 3000];
      return {
        social: 0,
        support: supportRates[tierIdx] || 2250
      };
    } else {
      const socialRates = [100, 200, 450, 2000, 3000];
      const supportRates = [900, 1200, 1500, 2000, 3000];
      return {
        social: socialRates[tierIdx] || 450,
        support: supportRates[tierIdx] || 1500
      };
    }
  };

  const sowItems = activeOpt.scopeOfWorks && activeOpt.scopeOfWorks.length > 0
    ? activeOpt.scopeOfWorks
    : [{ id: "default", name: "All in TikTok 10,000 - 50,000", platforms: ["TikTok"], followerReq: "10K - 50K", allocationPercent: 100 }];

  const parsedChannels = sowItems.map(sow => {
    const platform = sow.platforms?.[0] || "TikTok";
    const tierIdx = getFollowerTier(sow.followerReq);
    const rates = getPlatformRates(platform, tierIdx);
    
    const social = rates.social;
    const support = rates.support;
    const logistics = logisticsFee;
    const product = productValue;
    const travel = travelExpense;
    
    const channelCost = social + support + product + travel + logistics;
    const allocationPercent = parseFloat(String(sow.allocationPercent || sow.allocation || 100).replace(/%/g, '')) || 100;
    
    return {
      id: sow.id,
      name: sow.name || `All in ${platform} ${sow.followerReq || "10,000 - 50,000"}`,
      platform,
      followerReq: sow.followerReq || "10,000 - 50,000",
      allocationPercent,
      channelCost,
      social,
      support,
      logistics,
      product,
      travel,
      special: 0,
      via: 0,
      other: 0
    };
  });

  const averageInfluencerCost = parsedChannels.reduce((acc, c) => acc + c.channelCost * (c.allocationPercent / 100), 0);
  const totalInfluencers = averageInfluencerCost > 0 ? Math.floor(rawCostForCampaign / averageInfluencerCost) : 0;

  let remainingInfs = totalInfluencers;
  const channelBreakdown = parsedChannels.map((c, idx) => {
    let numInfs = Math.round(totalInfluencers * (c.allocationPercent / 100));
    if (idx === parsedChannels.length - 1) {
      numInfs = remainingInfs;
    } else {
      remainingInfs -= numInfs;
    }
    numInfs = Math.max(0, numInfs);
    const reserveInfs = Math.floor(numInfs / 20);
    
    const influencerCost = c.channelCost * numInfs;
    
    return {
      ...c,
      numInfs,
      reserveInfs,
      influencerCost
    };
  });

  const sumInfluencers = channelBreakdown.reduce((acc, c) => acc + c.numInfs, 0);
  const sumReserveInfluencers = channelBreakdown.reduce((acc, c) => acc + c.reserveInfs, 0);
  
  const totalInfluencerCost = channelBreakdown.reduce((acc, c) => acc + c.influencerCost, 0);
  const totalLogisticCost = channelBreakdown.reduce((acc, c) => acc + c.reserveInfs * (c.logistics + c.product + c.travel), 0);
  const totalInfluencerRawCost = totalInfluencerCost + totalLogisticCost;
  const remainingRaw = rawCostForCampaign - totalInfluencerRawCost;

  // KPI
  const influencerReach = channelBreakdown.reduce((acc, c) => acc + (c.social * 10 * c.numInfs), 0);
  const combinedFollower = influencerReach * 3;
  const adsReach = 0;
  const estimatedReach = influencerReach + adsReach;
  const committedReach = estimatedReach * 0.8;
  const estimatedEngagement = influencerReach * 0.05;

  // Profitability
  const salesPrice = totalBudget;
  const campaignCost = totalBoostAds + totalOtherServices + totalInfluencerRawCost + contingencies;
  const grossProfitPercent = salesPrice > 0 ? (1 - (campaignCost / salesPrice)) * 100 : 0;

  return {
    budgetOptions,
    activeOpt,
    totalBudget,
    totalBoostAds,
    totalOtherServices,
    availableBudget,
    rawCostForInfluencer,
    contingencies,
    rawCostForCampaign,
    averageInfluencerCost,
    sumInfluencers,
    sumReserveInfluencers,
    channelBreakdown,
    totalInfluencerCost,
    totalLogisticCost,
    totalInfluencerRawCost,
    remainingRaw,
    influencerReach,
    combinedFollower,
    adsReach,
    estimatedReach,
    committedReach,
    estimatedEngagement,
    salesPrice,
    campaignCost,
    grossProfitPercent
  };
}
