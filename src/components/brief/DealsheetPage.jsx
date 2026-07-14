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
  
  const filteredTrackers = {};
  let totalDoneCount = 0;
  
  activeGroups.forEach(grp => {
    const tracker = brief.groupTrackers[grp];
    const doneInfluencers = tracker.influencers.filter(inf => 
      inf.contactStatus === "Selected" || inf.contactStatus === "Done" || inf.lot
    );
    if (doneInfluencers.length > 0) {
      filteredTrackers[grp] = { ...tracker, influencers: doneInfluencers };
      totalDoneCount += doneInfluencers.length;
    }
  });

  const filteredGroups = Object.keys(filteredTrackers);

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

  // KPI calculations
  const kpiTotalInfluencer = totalInfluencers - totalReserveInfs;
  const influencerReach = recalculatedChannels.reduce((acc, c) => acc + (c.social * 10 * c.numInfs), 0);
  const combinedFollower = influencerReach * 3;
  const adsReach = 0;
  const estimatedReach = influencerReach + adsReach;
  const committedReach = estimatedReach * 0.8;
  const estimatedEngagement = influencerReach * 0.05;

  const formatNumber = (val) => {
    if (val === undefined || val === null || isNaN(val)) return "0";
    return Math.round(Number(val)).toLocaleString('en-US');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4 space-y-6 min-w-0">
          {hasStandard ? (
            <DealsheetStandardView 
               brief={brief} 
               onUpdateBrief={onUpdateBrief} 
               showToast={showToast} 
               activeOptId={activeOptId} 
               setActiveOptId={setActiveOptId} 
            />
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm p-6 lg:p-8">
              <div className="mb-6 border-b border-slate-100 pb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dealsheet Preview</h1>
                  <p className="text-slate-500 mt-1">{brief.campaignName} • {brief.id}</p>
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
                  {filteredGroups.map(grp => (
                    <TrackerTable 
                      key={grp}
                      groupName={grp}
                      brief={brief}
                      trackerData={filteredTrackers[grp]}
                      onUpdateTracker={(updatedTracker) => {
                        const newTrackers = { ...brief.groupTrackers };
                        const originalInfluencers = newTrackers[grp].influencers;
                        const updatedMap = {};
                        updatedTracker.influencers.forEach(inf => {
                          updatedMap[inf.id] = inf;
                        });
                        const mergedInfluencers = originalInfluencers.map(inf => {
                          return updatedMap[inf.id] ? updatedMap[inf.id] : inf;
                        });
                        newTrackers[grp] = { ...newTrackers[grp], influencers: mergedInfluencers };
                        onUpdateBrief({ ...brief, groupTrackers: newTrackers });
                      }}
                      onAddClick={() => {}}
                      hideAddButton={true}
                      readOnly={true}
                      isDealsheetView={true}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
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
                    if (hasStandard) {
                      window.open("https://docs.google.com/spreadsheets/d/18ns-87lEe4Ct2qzfQ0nsEYrb4WdpJlmqoRSnP2J_UF0/edit?usp=sharing", "_blank");
                    } else {
                      showToast && showToast("download dealsheet soon");
                    }
                  }}
                >
                  <Download className="mr-2 h-4 w-4" /> Export Dealsheet
                </Button>
              </div>
            </div>

            {/* Summary Section */}
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

            {/* Campaign KPI Section */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200 px-5 py-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-800">Campaign KPI</h3>
              </div>
              <div className="p-5 space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550 font-medium flex items-center gap-1">
                    <Users className="h-3 w-3 text-slate-400" /> Total Influencer
                  </span>
                  <span className="font-semibold text-slate-800">{kpiTotalInfluencer} คน</span>
                </div>
                
                {/* Channels breakdown lists */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-150 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-450">Channel Breakdown</span>
                  {recalculatedChannels.map((chan, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">{chan.platform || "Platform"}</span>
                      <span className="font-semibold text-slate-850">{chan.numInfs} คน</span>
                    </div>
                  ))}
                </div>

                <div className="h-[1px] bg-slate-100 my-1" />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Combined Follower</span>
                  <span className="font-semibold text-slate-800">{formatNumber(combinedFollower)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Influencer Reach</span>
                  <span className="font-semibold text-slate-800">{formatNumber(influencerReach)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Ads Reach</span>
                  <span className="font-semibold text-slate-800">{formatNumber(adsReach)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Estimated Reach</span>
                  <span className="font-semibold text-slate-800">{formatNumber(estimatedReach)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Committed Reach</span>
                  <span className="font-semibold text-slate-800">{formatNumber(committedReach)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-550">Estimated Engagement</span>
                  <span className="font-semibold text-slate-800">{formatNumber(estimatedEngagement)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}

