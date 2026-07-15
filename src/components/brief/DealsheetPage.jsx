import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download, TrendingUp, Calculator, Users } from "lucide-react";
import Button from "../common/Button";
import TrackerTable from "../tracker/TrackerTable";
import { getCampaignCalculations } from "../../utils/campaignCalculations";
import { formatCurrency } from "../../utils/formatHelpers";
import DealsheetStandardView from "./DealsheetStandardView";

export default function DealsheetPage({ brief, onUpdateBrief, showToast }) {
  const [activeOptId, setActiveOptId] = useState(() => {
    if (brief.budgetOptions && brief.budgetOptions.length > 0) return brief.budgetOptions[0].id;
    return "legacy";
  });

  const activeGroups = Object.keys(brief.groupTrackers || {});
  
  const lotsData = {};
  let totalDoneCount = 0;

  activeGroups.forEach(grp => {
    const tracker = brief.groupTrackers[grp];
    const groupDef = brief.groups?.find(g => g.id === grp);
    const groupName = groupDef ? groupDef.name : grp;

    tracker.influencers.forEach(inf => {
      if (inf.contactStatus === "Selected" || inf.contactStatus === "Done" || inf.lot) {
        totalDoneCount++;
        const lotKey = inf.lot || "Unassigned Lot";
        if (!lotsData[lotKey]) {
          lotsData[lotKey] = { influencers: [] };
        }
        lotsData[lotKey].influencers.push({ ...inf, _originalGroupId: grp, _groupName: groupName });
      }
    });
  });

  const sortedLots = Object.keys(lotsData)
    .filter(lotKey => brief.lotDealsheetCreated && brief.lotDealsheetCreated[lotKey])
    .sort((a, b) => {
      if (a === "Unassigned Lot") return 1;
      if (b === "Unassigned Lot") return -1;
      return a.localeCompare(b, undefined, { numeric: true });
    });

  const hasStandard = brief && (
    Array.isArray(brief.packageType) 
      ? brief.packageType.some(p => p.toLowerCase().includes("standard"))
      : (typeof brief.packageType === "string" && brief.packageType.toLowerCase().includes("standard"))
  );

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

  const calculatedOptions = budgetOptions.map(opt => getCampaignCalculations(brief, opt.id));

  // Recalculations for Sidebar Summary & KPIs matching DealsheetStandardView overrides
  const calc = getCampaignCalculations(brief, activeOptId);

  const contingencyPercent = brief.customContingencyPercent?.[activeOptId] !== undefined 
    ? brief.customContingencyPercent[activeOptId] 
    : 5;

  const defaultDivisor = brief.customerType === "Non-Key Account" ? 2.3 : 2.1;
  const divisor = brief.customDivisor?.[activeOptId] !== undefined 
    ? brief.customDivisor[activeOptId] 
    : defaultDivisor;

  const buddyboostAds = brief.customBuddyboostAds?.[activeOptId] !== undefined 
    ? brief.customBuddyboostAds[activeOptId] 
    : calc.totalBoostAds;

  const buddyboostFeePercent = brief.customBuddyboostFeePercent?.[activeOptId] !== undefined 
    ? brief.customBuddyboostFeePercent[activeOptId] 
    : 20;

  const buddyboostFee = buddyboostAds * (buddyboostFeePercent / 100);

  const otherServices = brief.customOtherServices?.[activeOptId] || [];
  const totalOtherServicesVal = otherServices.reduce((sum, s) => {
    const price = Number(s.price) || 0;
    const feeType = s.feeType || (s.feePercent !== undefined ? "percent" : "baht");
    let feeVal = 0;
    if (s.feeValue !== undefined) {
      feeVal = Number(s.feeValue) || 0;
    } else if (s.feePercent !== undefined) {
      feeVal = Number(s.feePercent) || 0;
    } else if (s.fee !== undefined) {
      feeVal = Number(s.fee) || 0;
    }
    const calculatedFeeAmt = feeType === "percent" ? Math.round(calc.totalBudget * feeVal / 100) : feeVal;
    return sum + price + calculatedFeeAmt;
  }, 0);

  const availableBudget = calc.totalBudget - buddyboostAds - buddyboostFee - totalOtherServicesVal;
  const rawCostForInfluencer = divisor > 0 ? (availableBudget / divisor) : 0;
  const contingencies = rawCostForInfluencer * (contingencyPercent / 100);
  const rawCostForCampaign = rawCostForInfluencer - contingencies;

  const channelCostsOverrides = brief.customChannelCosts?.[activeOptId] || {};
  const overriddenChannels = calc.channelBreakdown.map(c => {
    const overrides = channelCostsOverrides[c.id] || {};
    const logistics = overrides.logistics !== undefined ? overrides.logistics : c.logistics;
    const product = overrides.product !== undefined ? overrides.product : c.product;
    const travel = overrides.travel !== undefined ? overrides.travel : c.travel;
    const social = overrides.social !== undefined ? overrides.social : c.social;
    const support = overrides.support !== undefined ? overrides.support : c.support;
    const special = overrides.special !== undefined ? overrides.special : c.special;
    const via = overrides.via !== undefined ? overrides.via : c.via;
    const other = overrides.other !== undefined ? overrides.other : c.other;

    const channelCost = logistics + product + travel + social + support + special + via + other;
    return {
      ...c,
      logistics,
      product,
      travel,
      social,
      support,
      special,
      via,
      other,
      channelCost
    };
  });

  const calculatedAvgCost = overriddenChannels.reduce((acc, c) => acc + c.channelCost * (c.allocationPercent / 100), 0);
  const avgCostToUse = brief.customAvgCost?.[activeOptId] !== undefined ? brief.customAvgCost[activeOptId] : calculatedAvgCost;
  const totalInfluencers = avgCostToUse > 0 ? Math.floor(rawCostForCampaign / avgCostToUse) : 0;

  let remainingInfs = totalInfluencers;
  const recalculatedChannels = overriddenChannels.map((c, idx) => {
    let numInfs = Math.round(totalInfluencers * (c.allocationPercent / 100));
    if (idx === overriddenChannels.length - 1) {
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

  const totalReserveInfs = recalculatedChannels.reduce((acc, c) => acc + c.reserveInfs, 0);
  // Pure influencer cost (rates only: social, support, special, via, other) to avoid double counting logistics
  const totalInfluencerCost = recalculatedChannels.reduce(
    (acc, c) => acc + (c.social + c.support + c.special + c.via + c.other) * c.numInfs, 
    0
  );
  // Logistic = (logistics + product + travel) * (numInfs + reserveInfs) across channels
  const totalLogisticCost = recalculatedChannels.reduce(
    (acc, c) => acc + (c.numInfs + c.reserveInfs) * (c.logistics + c.product + c.travel), 
    0
  );
  const totalInfluencerRawCost = totalInfluencerCost + totalLogisticCost;
  const remainingRaw = rawCostForCampaign - totalInfluencerRawCost;

  const salesValue = calc.totalBudget;
  const salesPrice = calc.totalBudget;
  const campaignCost = buddyboostAds + buddyboostFee + totalOtherServicesVal + totalInfluencerRawCost + contingencies;
  const gpPercent = salesPrice > 0 ? (1 - (campaignCost / salesPrice)) * 100 : 0;

  // KPI calculations (Mock / Options based)
  const kpiTotalInfluencer = totalInfluencers - totalReserveInfs;
  const influencerReach = recalculatedChannels.reduce((acc, c) => acc + (c.social * 10 * c.numInfs), 0);
  const combinedFollower = influencerReach * 3;
  const adsReach = 0;
  const estimatedReach = influencerReach + adsReach;
  const committedReach = estimatedReach * 0.8;
  const estimatedEngagement = influencerReach * 0.05;

  // NEW KPI CALCULATIONS based on actual tracker data!
  let kpiSellingPrice = 0;
  let kpiRawCost = 0;
  let kpiContingencies = 0;
  let kpiPageCount = 0;
  let kpiTotalFollower = 0;

  activeGroups.forEach(grp => {
    const tracker = brief.groupTrackers[grp];
    if (!tracker || !tracker.influencers) return;
    tracker.influencers.forEach(inf => {
      if (inf.contactStatus === "Selected" || inf.contactStatus === "Done" || inf.lot) {
        kpiPageCount++;
        
        let fStr = String(inf.follower || "0").replace(/,/g, '').replace(/followers?/i, '').trim();
        let followerNum = 0;
        if (fStr.toLowerCase().endsWith('m')) followerNum = parseFloat(fStr) * 1000000;
        else if (fStr.toLowerCase().endsWith('k')) followerNum = parseFloat(fStr) * 1000;
        else followerNum = parseFloat(fStr);
        if (!isNaN(followerNum)) kpiTotalFollower += followerNum;

        const rawStr = String(inf.rawCost || "0").replace(/,/g, '');
        const rawNum = parseFloat(rawStr) || 0;
        kpiRawCost += rawNum;

        const grossNum = rawNum / 0.97;
        let cont = grossNum;
        if (grossNum > 0) {
          if (grossNum < 5000) cont = 1000;
          else if (grossNum <= 49999) cont = grossNum * 0.2;
          else cont = grossNum * 0.1;
        } else {
          cont = 0;
        }
        kpiContingencies += cont;

        let selectedPrice = 0;
        if (grossNum > 0) {
          if (grossNum < 10000) selectedPrice = grossNum * 2.3;
          else if (grossNum <= 49999) selectedPrice = Math.max(grossNum * 1.3, grossNum + 8000);
          else selectedPrice = grossNum * 1.15;
        }

        const influPrice = cont + selectedPrice;
        let sellingPrice = grossNum > 0 ? Math.ceil(influPrice / 1000) * 1000 : 0;
        
        let rowSumOther = 0;
        if (brief.requiredServices && inf.services) {
           brief.requiredServices.forEach(srv => {
             let srvData = inf.services?.[srv.key];
             if (srvData && (typeof srvData === 'object' ? srvData.status === "รับ" : srvData !== "ไม่รับ")) {
                const p = typeof srvData === 'object' ? srvData.price : srvData;
                if (p) rowSumOther += Number(p);
             }
           });
        }
        const refer = sellingPrice * 0.05;
        const tp = sellingPrice + rowSumOther + refer;
        const tsp = Math.ceil(tp / 1000) * 1000;

        kpiSellingPrice += tsp;
      }
    });
  });

  const kpiRemaining = kpiSellingPrice - kpiRawCost;
  const kpiPercentGP = kpiSellingPrice > 0 ? (kpiRemaining / kpiSellingPrice) * 100 : 0;
  const kpiPercentContingencies = kpiSellingPrice > 0 ? (kpiContingencies / kpiSellingPrice) * 100 : 0;
  const kpiPercentSum = kpiPercentGP + kpiPercentContingencies;

  const kpiAdsReach = 0;
  const kpiPageReach = kpiTotalFollower * 0.08;
  const kpiEstReach = kpiPageReach + kpiAdsReach;
  const kpiCommittedReach = kpiEstReach * 0.8;
  const kpiEstEngagement = kpiPageReach * 0.05;

  const formatNumber = (val) => {
    if (val === undefined || val === null || isNaN(val)) return "0";
    return Math.round(Number(val)).toLocaleString('en-US');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4 space-y-6 min-w-0">
          <DealsheetStandardView 
             brief={brief} 
             onUpdateBrief={onUpdateBrief} 
             showToast={showToast} 
             activeOptId={activeOptId} 
             setActiveOptId={setActiveOptId} 
          />
        </div>

        <div className="w-full lg:w-1/4 shrink-0">
          <div className="sticky top-6 space-y-6">
            {/* Actions Card */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Actions</h3>
              <div className="flex flex-col gap-3">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    window.open("https://docs.google.com/spreadsheets/d/1RhYMgVvT3N3hrZflC0QqwtteFYs6YFZO/edit?usp=sharing&ouid=106210278425034632604&rtpof=true&sd=true", "_blank");
                  }}
                >
                  <Download className="mr-2 h-4 w-4" /> Export Dealsheet
                </Button>
              </div>
            </div>

            {/* Summary Section */}
            {hasStandard && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200 px-5 py-4 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">Summary</h3>
              </div>
              <div className="p-5 space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Total # Influencer</span>
                  <span className="font-semibold text-slate-800">{totalInfluencers - totalReserveInfs} คน</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Reserve Influencer</span>
                  <span className="font-semibold text-slate-800">{totalReserveInfs} คน</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Total Influencer Cost</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(totalInfluencerCost)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Logistic</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(totalLogisticCost)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Total Influ Raw Cost</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(totalInfluencerRawCost)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Remaining Raw</span>
                  <span className="font-semibold text-slate-850">{formatCurrency(remainingRaw)}</span>
                </div>
                <div className="h-[1px] bg-slate-100 my-1" />
                <div className="space-y-2.5 pt-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-450 block">Sales Value</span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-550">Sales Price</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(salesPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-550">Campaign Cost</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(campaignCost)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
                    <span className="text-xs font-semibold text-emerald-800">%GP</span>
                    <span className="text-sm font-bold text-emerald-800">{gpPercent.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Campaign KPI Section */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200 px-5 py-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-800">Campaign KPI</h3>
              </div>
              <div className="p-5 space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Selling Price</span>
                  <span className="font-semibold text-[#6D5DF6]">{formatCurrency(kpiSellingPrice)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Raw Cost</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(kpiRawCost)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Remaining</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(kpiRemaining)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Contingencies</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(kpiContingencies)}</span>
                </div>
                
                <div className="h-[1px] bg-slate-100 my-2" />
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">%GP</span>
                  <span className="font-semibold text-emerald-600">{kpiPercentGP.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">%Contigencies</span>
                  <span className="font-semibold text-amber-600">{kpiPercentContingencies.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">%Sum</span>
                  <span className="font-semibold text-blue-600">{kpiPercentSum.toFixed(2)}%</span>
                </div>

                <div className="h-[1px] bg-slate-100 my-2" />

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">#Page</span>
                  <span className="font-semibold text-slate-800">{formatNumber(kpiPageCount)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Total Follower</span>
                  <span className="font-semibold text-slate-800">{formatNumber(kpiTotalFollower)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Ads Reach</span>
                  <span className="font-semibold text-slate-800">{formatNumber(kpiAdsReach)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Page Reach</span>
                  <span className="font-semibold text-slate-800">{formatNumber(kpiPageReach)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Est. Reach</span>
                  <span className="font-semibold text-slate-800">{formatNumber(kpiEstReach)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Committed Reach</span>
                  <span className="font-semibold text-slate-800">{formatNumber(kpiCommittedReach)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Est. Engagement</span>
                  <span className="font-semibold text-slate-800">{formatNumber(kpiEstEngagement)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Full-width Influencer List for Non-Standard */}
      {!hasStandard && (
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm p-6 lg:p-8">
          <div className="mb-6 border-b border-slate-100 pb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Influencer List</h1>
              <p className="text-slate-500 mt-1">Trackers separated by Lot</p>
            </div>
          </div>

          {totalDoneCount === 0 ? (
            <div className="text-center py-16 text-slate-550 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mb-4 border border-slate-200">
                <CheckCircle2 className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">No Influencers Ready</h3>
              <p className="mb-4 text-sm text-slate-500 mt-1">Change influencer status to "Selected" in Rate card list to view them here.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {sortedLots.map(lotKey => {
                const lotTitle = lotKey === "Unassigned Lot" ? "Unassigned Lot" : `Lot ${lotKey}`;
                const mockGroup = { 
                  sows: brief.groups?.flatMap(g => g.sows || []) || [], 
                  questions: Array.from(new Set(brief.groups?.flatMap(g => g.questions || []) || [])) 
                };
                return (
                  <TrackerTable 
                    key={lotKey}
                    groupName={lotTitle}
                    group={mockGroup}
                    brief={brief}
                    trackerData={lotsData[lotKey]}
                    onUpdateTracker={(updatedTracker) => {
                      const newTrackers = JSON.parse(JSON.stringify(brief.groupTrackers));
                      updatedTracker.influencers.forEach(inf => {
                        const grpId = inf._originalGroupId;
                        if (grpId && newTrackers[grpId]) {
                          const idx = newTrackers[grpId].influencers.findIndex(i => i.id === inf.id);
                          if (idx !== -1) {
                            const { _originalGroupId, _groupName, ...cleanInf } = inf;
                            newTrackers[grpId].influencers[idx] = cleanInf;
                          }
                        }
                      });
                      onUpdateBrief({ ...brief, groupTrackers: newTrackers });
                    }}
                    onAddClick={() => {}}
                    hideAddButton={true}
                    readOnly={true}
                    isDealsheetView={true}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

