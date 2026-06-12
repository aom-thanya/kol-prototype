import React from "react";
import { Calculator, TrendingUp, Clock, Coins, Users } from "lucide-react";
import { formatCurrency } from "../../utils/formatHelpers";
import { getCampaignCalculations } from "../../utils/campaignCalculations";

export default function CampaignCalculationsView({ brief, activeOptId, setActiveOptId }) {
  const calc = getCampaignCalculations(brief, activeOptId);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-xs mb-8 space-y-8">
      {/* Title & Option Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-violet-50 text-[#6D5DF6] flex items-center justify-center">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Campaign Calculations</h3>
            <p className="text-xs text-slate-500">Auto-calculated metrics based on selected budget option</p>
          </div>
        </div>

        {calc.budgetOptions.length > 1 && (
          <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-xl border border-slate-200/50">
            {calc.budgetOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => setActiveOptId(opt.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeOptId === opt.id 
                    ? "bg-white text-slate-800 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {opt.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cost Structure Card */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
            <Coins className="h-4 w-4 text-[#6D5DF6]" />
            Cost Structure
          </h4>
          <div className="space-y-2.5 text-sm text-slate-650">
            <div className="flex justify-between">
              <span>Total Influencer Cost:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(calc.totalInfluencerCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Logistics / Product:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(calc.totalLogisticCost)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200/50 pt-2 text-slate-800 font-bold">
              <span>Total Cost (Net):</span>
              <span className="text-slate-900">{formatCurrency(calc.totalInfluencerRawCost)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500 pt-1">
              <span>Remaining Budget buffer:</span>
              <span className={calc.remainingRaw >= 0 ? "text-emerald-600 font-semibold" : "text-rose-500 font-semibold"}>
                {formatCurrency(calc.remainingRaw)}
              </span>
            </div>
          </div>
        </div>

        {/* Budget Allocation Card */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
            <Calculator className="h-4 w-4 text-[#6D5DF6]" />
            Budget Allocation
          </h4>
          <div className="space-y-2.5 text-sm text-slate-650">
            <div className="flex justify-between">
              <span>Campaign Budget:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(calc.totalBudget)}</span>
            </div>
            <div className="flex justify-between">
              <span>Boost Post Budget:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(calc.totalBoostAds)}</span>
            </div>
            <div className="flex justify-between">
              <span>Other Brand Spending:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(calc.totalOtherServices)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200/50 pt-2 text-slate-800 font-bold">
              <span>Available Budget:</span>
              <span className="text-slate-900">{formatCurrency(calc.availableBudget)}</span>
            </div>
            <div className="flex justify-between">
              <span>Budget per KOL (Gross):</span>
              <span className="font-semibold text-slate-800">{formatCurrency(calc.rawCostForInfluencer)}</span>
            </div>
            <div className="flex justify-between">
              <span>Contingencies (5%):</span>
              <span className="font-semibold text-slate-800">{formatCurrency(calc.contingencies)} (5%)</span>
            </div>
            <div className="flex justify-between border-t border-slate-200/50 pt-2 font-bold text-[#6D5DF6]">
              <span>Target Cost per KOL (Net):</span>
              <span className="text-[#6D5DF6]">{formatCurrency(calc.rawCostForCampaign)}</span>
            </div>
          </div>
        </div>

        {/* Expected KPIs Card */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
            <TrendingUp className="h-4 w-4 text-[#6D5DF6]" />
            Expected KPIs
          </h4>
          <div className="space-y-3.5 text-sm text-slate-650">
            <div className="flex justify-between items-center">
              <span>Expected Influencers:</span>
              <div className="text-right">
                <span className="font-bold text-slate-800 text-base">{calc.sumInfluencers} KOLs</span>
                <span className="text-[10px] text-slate-500 block">Avg. cost: {formatCurrency(calc.averageInfluencerCost)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200/50 pt-2.5">
              <span>Expected Reserve:</span>
              <span className="font-bold text-slate-800">{calc.sumReserveInfluencers} KOLs</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200/50 pt-2.5">
              <span>Expected Reach:</span>
              <div className="text-right">
                <span className="font-bold text-slate-800">{calc.estimatedReach.toLocaleString()} Views</span>
                <span className="text-[10px] text-slate-500 block">Committed: {Math.round(calc.committedReach).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200/50 pt-2.5">
              <span>Expected Engagement:</span>
              <span className="font-bold text-slate-800">{calc.estimatedEngagement.toLocaleString()} Engs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profitability Analysis & Channel Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-slate-100 pt-6">
        {/* Profitability Analysis */}
        <div className="lg:col-span-4 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[#6D5DF6]" />
            Profitability Analysis
          </h4>
          <div className="bg-slate-50 rounded-2xl border border-slate-200/50 p-5 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Sales Price:</span>
                <span className="font-bold text-slate-900">{formatCurrency(calc.salesPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Campaign Cost:</span>
                <span className="font-semibold text-slate-800">{formatCurrency(calc.campaignCost)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200/50 pt-3">
                <span className="text-sm font-semibold text-slate-700">Gross Profit:</span>
                <div className="text-right">
                  <span className={`text-lg font-bold ${calc.grossProfitPercent >= 40 ? "text-emerald-600" : calc.grossProfitPercent >= 20 ? "text-amber-500" : "text-rose-500"}`}>
                    {calc.grossProfitPercent.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Target: 40.0% min GP</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Channel & Platforms Breakdown */}
        <div className="lg:col-span-8 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="h-4 w-4 text-[#6D5DF6]" />
            SOW / Platform Breakdown
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calc.channelBreakdown.map((chan) => (
              <div key={chan.id} className="bg-slate-50 rounded-2xl border border-slate-200/50 p-4 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200/40 pb-2">
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 text-xs block truncate">{chan.name}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">{chan.platform} | {chan.followerReq}</span>
                  </div>
                  <span className="bg-slate-200/60 text-slate-700 border border-slate-300/30 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide">
                    {chan.allocationPercent}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-[10px] text-slate-500">
                  <div className="flex flex-col">
                    <span>Social Rate:</span>
                    <span className="font-semibold text-slate-700">{formatCurrency(chan.social)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span>Support Rate:</span>
                    <span className="font-semibold text-slate-700">{formatCurrency(chan.support)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span>Other Services:</span>
                    <span className="font-semibold text-slate-700">{formatCurrency(chan.other)}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex gap-4">
                    <div>
                      <span className="text-slate-500 font-semibold">Number of Influencers:</span> <span className="font-bold text-slate-800">{chan.numInfs}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">Reserve Influencers:</span> <span className="font-bold text-slate-800">{chan.reserveInfs}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold">Influencer Cost:</span> <span className="font-bold text-[#6D5DF6]">{formatCurrency(chan.influencerCost)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
