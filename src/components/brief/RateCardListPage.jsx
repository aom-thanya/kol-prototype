import Stepper from "../common/Stepper";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Plus, X, ArrowLeft, Users, FileText, 
  Trash2, ExternalLink,
  Clock, MapPin, Briefcase, User, Tag, MessageSquare,
  Folder, ChevronUp, ChevronDown, Compass, Sparkles, Check, Coins
} from "lucide-react";
import { formatCurrency } from "../../utils/formatHelpers";
import InfluencerSelectModal from "../tracker/InfluencerSelectModal";
import PlannerTrackerPage from "../tracker/PlannerTrackerPage";
import RecapSetup from "./RecapSetup";

const getAvailableServices = (platforms = []) => {
  const list = [];
  list.push({ label: "Buyout (Asset)", key: "buyoutRequired" });
  
  const hasPlatform = (plats) => platforms.some(p => plats.includes(p));
  
  if (hasPlatform(["Facebook", "Facebook Page", "Instagram", "TikTok"])) {
    list.push({ label: "Boost by Page", key: "boostPostRequired" });
  }
  
  if (hasPlatform(["Facebook", "Facebook Page", "Instagram", "TikTok", "YouTube", "X"])) {
    list.push({ label: "Add Ads", key: "addAdsRequired" });
  }
  
  if (hasPlatform(["Facebook", "Facebook Page", "Instagram", "TikTok"])) {
    list.push({ label: "Paid Partnership", key: "paidPartnershipRequired" });
  }
  
  if (hasPlatform(["YouTube"])) {
    list.push({ label: "YouTube Discovery", key: "discoveryRequired" });
  }
  
  if (hasPlatform(["TikTok"])) {
    list.push({ label: "Gen Code", key: "genCodeRequired" });
    list.push({ label: "TikTok Shop", key: "tiktokShopRequired" });
  }
  
  if (hasPlatform(["Facebook", "Facebook Page"])) {
    list.push({ label: "FB Branded Content", key: "brandedContentRequired" });
  }
  
  if (hasPlatform(["X"])) {
    list.push({ label: "X Whitelisting", key: "whitelistingRequired" });
  }
  
  return list;
};

function BriefDetailPageReadOnly({ brief, handleUpdateStatus }) {
  const [activeSubTab, setActiveSubTab] = useState("overview");
  const [expandedDocs, setExpandedDocs] = useState({
    product: true,
    previous: false,
    competitor: false,
    additional: false
  });

  const toggleDoc = (key) => {
    setExpandedDocs(prev => ({ ...prev, [key]: !prev[key] }));
  };

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

  const [activeOptId, setActiveOptId] = useState(budgetOptions[0]?.id);
  const activeOpt = budgetOptions.find(o => o.id === activeOptId) || budgetOptions[0];

  const renderList = (items) => {
    if (!items || items.length === 0) return "-";
    if (typeof items === "string") return items;
    if (Array.isArray(items)) return items.join(", ");
    return String(items);
  };

  const cn = (...classes) => classes.filter(Boolean).join(" ");

  const tabs = [
    { id: "overview", label: "Overview", icon: Folder },
    { id: "budget", label: "Budget & SOW Options", icon: Coins, count: activeOpt.scopeOfWorks?.length },
    { id: "logistics", label: "Conditions", icon: FileText },
  ];

  return (
    <div className="pb-10 text-base">

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full space-y-6 min-w-0">
          <div className="flex border-b border-slate-200 bg-white px-2 pt-2 rounded-t-2xl shadow-3xs overflow-x-auto whitespace-nowrap scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-6 py-4.5 text-base font-semibold border-b-2 transition-all cursor-pointer relative",
                    isActive 
                      ? "border-[#6D5DF6] text-[#6D5DF6] font-bold" 
                      : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-[#6D5DF6]" : "text-slate-400")} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={cn(
                      "ml-1.5 rounded-full px-2 py-0.5 text-xs font-bold",
                      isActive ? "bg-violet-100 text-[#6D5DF6]" : "bg-slate-100 text-slate-600"
                    )}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {activeSubTab === "overview" && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/60 pb-2.5">
                    <Briefcase className="h-5 w-5 text-[#6D5DF6]" />
                    Client Profile & Lead
                  </h4>
                  <div className="space-y-3.5 text-base">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Client Status:</span>
                      <span className={cn(
                        "text-xs font-bold px-2.5 py-0.5 rounded-full border",
                        brief.clientStatus === "New" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-blue-50 text-blue-700 border-blue-100"
                      )}>
                        {brief.clientStatus || "New"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Customer Type:</span>
                      <span className="font-semibold text-slate-800">{brief.customerType || "Key Account"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Project Owner (Sales):</span>
                      <span className="font-semibold text-[#6D5DF6]">{brief.salesOwner || "-"}</span>
                    </div>
                    <div className="flex justify-between items-start border-t border-slate-200/50 pt-3.5">
                      <span className="text-slate-500 mt-0.5">Package Type:</span>
                      <div className="flex flex-wrap gap-1.5 justify-end max-w-[65%]">
                        {(Array.isArray(brief.packageType) ? brief.packageType : [brief.packageType || "Standard"]).map(pkg => (
                          <span key={pkg} className="bg-violet-50 text-[#6D5DF6] border border-violet-100 px-2.5 py-0.5 rounded-md text-xs font-bold">
                            {pkg === "Others" && brief.packageTypeOther ? `Others (${brief.packageTypeOther})` : pkg}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/60 pb-2.5">
                    <Compass className="h-5 w-5 text-[#6D5DF6]" />
                    Campaign Channels
                  </h4>
                  <div className="space-y-3.5 text-base">
                    <div>
                      <span className="text-slate-500 text-sm block mb-1.5">Target Platforms:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(Array.isArray(brief.platform) ? brief.platform : [brief.platform || "Instagram"]).map(plat => (
                          <span key={plat} className={cn(
                            "text-xs font-semibold px-2.5 py-0.5 rounded-lg border",
                            plat === "TikTok" ? "bg-black text-white border-black" :
                            plat === "Instagram" ? "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white border-pink-400" :
                            plat === "YouTube" ? "bg-red-50 text-red-700 border-red-200" :
                            plat === "Facebook" || plat === "Facebook Page" ? "bg-blue-50 text-blue-700 border-blue-200" :
                            "bg-slate-100 text-slate-700 border-slate-200"
                          )}>
                            {plat === "Others" && brief.platformOther ? `Others (${brief.platformOther})` : plat}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-200/50 pt-3.5">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">Buddy Boost Required:</span>
                        <span className={cn("text-xs font-bold px-2.5 py-0.5 rounded-full border", brief.isBuddyBoostRequired ? "bg-violet-100 text-[#6D5DF6] border-violet-200" : "bg-slate-200 text-slate-700 border-slate-350")}>
                          {brief.isBuddyBoostRequired ? "Yes" : "No"}
                        </span>
                      </div>
                      {brief.isBuddyBoostRequired && (
                        <div className="mt-2.5 p-3 rounded-lg bg-white border border-slate-200 text-sm space-y-1.5 shadow-3xs">
                          <div className="flex justify-between"><span className="text-slate-400">Target Boost:</span> <span className="font-semibold text-slate-800">{renderList(brief.targetBoost)}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Boost Budget:</span> <span className="font-semibold text-[#6D5DF6]">{brief.budgetBoostSpending || "-"}</span></div>
                          {brief.buddyBoostDetail && <div className="border-t border-slate-100 pt-1.5 mt-1 text-slate-500 italic">{brief.buddyBoostDetail}</div>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/60 pb-2.5">
                    <Users className="h-5 w-5 text-[#6D5DF6]" />
                    Target Audience Demographics
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs">
                      <span className="text-xs text-slate-400 font-bold block uppercase">Gender</span>
                      <span className="font-bold text-slate-800 text-base mt-1 block">{renderList(brief.gender)}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs">
                      <span className="text-xs text-slate-400 font-bold block uppercase">Age Range</span>
                      <span className="font-bold text-slate-800 text-base mt-1 block">{renderList(brief.ageRange) || "-"}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs">
                      <span className="text-xs text-slate-400 font-bold block uppercase">Country</span>
                      <span className="font-bold text-slate-800 text-base mt-1 block">{brief.country || "-"}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs">
                      <span className="text-xs text-slate-400 font-bold block uppercase">Province</span>
                      <span className="font-bold text-slate-800 text-base mt-1 block">{brief.province || "-"}</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/60 pb-2.5">
                    <Sparkles className="h-5 w-5 text-[#6D5DF6]" />
                    Campaign Objectives & Goals
                  </h4>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2.5">
                      {["Awareness (Reach)", "Interest (Engagement)", "Trust (Post)"].map(obj => {
                        const isSelected = brief.objective && brief.objective.includes(obj);
                        return (
                          <span key={obj} className={cn(
                            "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border transition",
                            isSelected 
                              ? "bg-violet-50 text-[#6D5DF6] border-violet-200 shadow-3xs" 
                              : "bg-white text-slate-350 border-slate-200 opacity-50 line-through"
                          )}>
                            {isSelected && <Check className="h-4 w-4 text-[#6D5DF6] stroke-[3]" />}
                            {obj}
                          </span>
                        );
                      })}
                    </div>
                    {brief.objectiveNote && (
                      <div className="text-sm text-slate-650 bg-white p-4 rounded-xl border border-slate-200 leading-relaxed shadow-3xs mt-2.5">
                        <span className="font-bold text-slate-700 block mb-1">Objective Note:</span>
                        {brief.objectiveNote}
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4 pt-2">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="h-5 w-5 text-slate-450" />
                    Brand Specifications & Reference Sheets
                  </h4>

                  {brief.product && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs bg-white">
                      <button 
                        onClick={() => toggleDoc("product")}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition text-left cursor-pointer animate-none"
                      >
                        <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Product Name & Specifications</span>
                        {expandedDocs.product ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                      </button>
                      {expandedDocs.product && (
                        <div className="p-5 border-t border-slate-200 text-sm text-slate-755 leading-relaxed">
                          <p className="whitespace-pre-line">{brief.product}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {brief.previousCampaign && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs bg-white">
                      <button 
                        onClick={() => toggleDoc("previous")}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition text-left cursor-pointer"
                      >
                        <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Previous Campaign References</span>
                        {expandedDocs.previous ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                      </button>
                      {expandedDocs.previous && (
                        <div className="p-5 border-t border-slate-200 text-sm text-slate-755 leading-relaxed">
                          <p className="whitespace-pre-line">{brief.previousCampaign}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {brief.competitor && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs bg-white">
                      <button 
                        onClick={() => toggleDoc("competitor")}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition text-left cursor-pointer"
                      >
                        <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Competitor Analysis & Notes</span>
                        {expandedDocs.competitor ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                      </button>
                      {expandedDocs.competitor && (
                        <div className="p-5 border-t border-slate-200 text-sm text-slate-755 leading-relaxed">
                          <p className="whitespace-pre-line">{brief.competitor}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {brief.additionalInfo && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs bg-white">
                      <button 
                        onClick={() => toggleDoc("additional")}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition text-left cursor-pointer"
                      >
                        <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Additional Campaign Guidelines</span>
                        {expandedDocs.additional ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                      </button>
                      {expandedDocs.additional && (
                        <div className="p-5 border-t border-slate-200 text-sm text-slate-755 leading-relaxed">
                          <p className="whitespace-pre-line">{brief.additionalInfo}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "budget" && (
            <div className="space-y-6 pt-4">
              {budgetOptions.length > 1 && (
                <div className="flex border border-slate-200 bg-slate-100/80 p-1 rounded-xl shadow-3xs w-fit">
                  {budgetOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setActiveOptId(opt.id)}
                      className={cn(
                        "px-4.5 py-2 text-xs font-semibold rounded-lg transition",
                        activeOptId === opt.id ? "bg-[#6D5DF6] text-white" : "text-slate-550 hover:text-slate-900"
                      )}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Campaign Budget</span>
                    <span className="text-2xl font-bold text-slate-800 block mt-1.5">
                      {formatCurrency(activeOpt.budgetSpending || activeOpt.totalBudget)}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-450 mt-3 block">
                    Tax Status: {activeOpt.vat || "-"}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Est. Brand Spend</span>
                    <span className="text-2xl font-bold text-slate-800 block mt-1.5">
                      {formatCurrency(activeOpt.estimatedBrandSpending || activeOpt.totalOtherServices)}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-455 mt-3 block">
                    Evaluation estimate
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Budget Per Influencer</span>
                    <span className="text-2xl font-bold text-slate-800 block mt-1.5">
                      {formatCurrency(activeOpt.budgetPerInfluencer)}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-455 mt-3 block">
                    Target budget average
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Expected KOLs</span>
                    <span className="text-lg font-bold text-slate-800 block mt-1.5">
                      KOLs: {activeOpt.expectedNumInfluencers || "-"}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 mt-2 block">
                    Reach: {activeOpt.expectedReach || "-"}
                  </span>
                </div>
              </div>

              {activeOpt.budgetCondition && (
                <div className="p-4.5 rounded-xl bg-slate-50 border border-slate-200 text-sm">
                  <span className="font-bold text-slate-700 block mb-1">Option Condition / Note:</span>
                  <p className="text-slate-650 leading-relaxed whitespace-pre-wrap">{activeOpt.budgetCondition}</p>
                </div>
              )}

              <div className="space-y-5 pt-2">
                <h4 className="text-sm font-bold text-slate-450 uppercase tracking-wider flex items-center justify-between">
                  <span>Scope of Work List ({activeOpt.scopeOfWorks?.length || 0})</span>
                </h4>
                
                {activeOpt.scopeOfWorks && activeOpt.scopeOfWorks.length > 0 ? (
                  activeOpt.scopeOfWorks.map((sow, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 text-base shadow-3xs space-y-4 hover:shadow-2xs transition">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="font-bold text-slate-900 text-base">
                          Scope {idx + 1}: {sow.name || "Unnamed Scope"}
                        </span>
                        <div className="flex gap-2">
                          {(sow.platforms ? (Array.isArray(sow.platforms) ? sow.platforms : [sow.platforms]) : []).map(plat => (
                            <span key={plat} className={cn(
                              "text-xs font-bold px-2.5 py-0.5 rounded-full border",
                              plat === "TikTok" ? "bg-black text-white border-black" :
                              plat === "Instagram" ? "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white border-pink-500" :
                              plat === "YouTube" ? "bg-red-50 text-red-750 border-red-200" :
                              plat === "Facebook" || plat === "Facebook Page" ? "bg-blue-50 text-blue-750 border-blue-200" :
                              plat === "X" ? "bg-slate-900 text-white border-slate-900" :
                              plat === "Lemon8" ? "bg-yellow-50 text-yellow-850 border-yellow-200" :
                              "bg-slate-100 text-slate-700 border-slate-200"
                            )}>
                              {plat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 font-bold block mb-1">Content Type</span>
                          <span className="font-bold text-slate-800 text-base">{renderList(sow.contentType)}</span>
                        </div>
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 font-bold block mb-1">Followers Required</span>
                          <span className="font-bold text-slate-800 text-base">
                            {sow.influencerDetails && sow.influencerDetails.length > 0 ? (
                              <div className="text-[11px] font-medium leading-tight space-y-0.5 mt-0.5">
                                {sow.influencerDetails.map((d, i) => (
                                  <div key={i}><span className="text-slate-400 mr-1">G{i+1}:</span>{d.followerReqFrom ? Number(d.followerReqFrom).toLocaleString() : "0"} - {d.followerReqTo ? Number(d.followerReqTo).toLocaleString() : "Any"}</div>
                                ))}
                              </div>
                            ) : sow.followerReqFrom || sow.followerReqTo ? (
                              <>
                                {sow.followerReqFrom ? Number(sow.followerReqFrom).toLocaleString() : "0"} - {sow.followerReqTo ? Number(sow.followerReqTo).toLocaleString() : "Any"}
                              </>
                            ) : (
                              sow.followerReq || "-"
                            )}
                          </span>
                        </div>
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 font-bold block mb-1">KOL Qty</span>
                          <span className="font-bold text-slate-800 text-base">
                            {sow.influencerDetails && sow.influencerDetails.length > 0 ? (
                              sow.influencerDetails.reduce((sum, d) => sum + (Number(d.numInfluencers) || 0), 0)
                            ) : (
                              sow.numInfluencers || "-"
                            )}
                          </span>
                        </div>
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 font-bold block mb-1">Budget Allocation</span>
                          <span className="font-bold text-slate-800 text-base">
                            {sow.allocationPercent ? `${sow.allocationPercent}%` : sow.allocation ? `${sow.allocation}%` : "-"}
                          </span>
                        </div>
                      </div>

                      {sow.details && (
                        <div className="text-sm p-4 rounded-xl border border-slate-150 bg-slate-50/30">
                          <span className="font-bold text-slate-450 block mb-1.5 uppercase text-[10px] tracking-wider">Detailed Scope Description</span>
                          <p className="text-slate-650 leading-relaxed whitespace-pre-line">{sow.details}</p>
                        </div>
                      )}

                      {sow.influencerDetails && sow.influencerDetails.length > 0 ? (
                        <div className="space-y-4 mt-4">
                          {sow.influencerDetails.map((detail, idx) => (
                             <div key={detail.id || idx} className="bg-white p-4 rounded-xl border border-slate-200">
                               <h6 className="text-sm font-bold text-slate-800 mb-3">Group {idx + 1}</h6>
                               <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
                                 <div><span className="text-slate-400 block mb-1 text-xs">KOL Qty</span> <span className="font-semibold text-slate-800 text-sm">{detail.numInfluencers || "-"}</span></div>
                                 <div>
                                   <span className="text-slate-400 block mb-1 text-xs">Followers</span> <span className="font-semibold text-slate-800 text-sm">
                                     {detail.followerReqFrom || detail.followerReqTo ? `${detail.followerReqFrom ? Number(detail.followerReqFrom).toLocaleString() : "0"} - ${detail.followerReqTo ? Number(detail.followerReqTo).toLocaleString() : "Any"}` : "-"}
                                   </span>
                                 </div>
                                 <div><span className="text-slate-400 block mb-1 text-xs">Demographics</span> <span className="font-semibold text-slate-850 text-sm">{renderList(detail.persona?.demographic)}</span></div>
                                 <div><span className="text-slate-400 block mb-1 text-xs">Location</span> <span className="font-semibold text-slate-850 text-sm">{renderList(detail.persona?.location)}</span></div>
                                 <div><span className="text-slate-400 block mb-1 text-xs">Occupation</span> <span className="font-semibold text-slate-850 text-sm">{renderList(detail.persona?.occupation)}</span></div>
                                 <div><span className="text-slate-400 block mb-1 text-xs">Tone</span> <span className="font-semibold text-slate-850 text-sm">{renderList(detail.persona?.persona)}</span></div>
                                 <div><span className="text-slate-400 block mb-1 text-xs">Content Category</span> <span className="font-semibold text-slate-850 text-sm">{renderList(detail.persona?.contentCategory)}</span></div>
                                 <div><span className="text-slate-400 block mb-1 text-xs">Storytelling</span> <span className="font-semibold text-slate-850 text-sm">{renderList(detail.persona?.storyTelling)}</span></div>
                               </div>

                               {/* Reference Influencers Display */}
                               {(() => {
                                 const originalSowRefs = brief.budgetOptions?.[0]?.scopeOfWorks?.flatMap(s => s.referenceInfluencers || []) || [];
                                 const fallbackRefs = brief.referenceInfluencers && brief.referenceInfluencers.length > 0 
                                   ? brief.referenceInfluencers 
                                   : originalSowRefs;
                                 const displayRefs = detail.referenceInfluencers && detail.referenceInfluencers.length > 0 
                                   ? detail.referenceInfluencers 
                                   : fallbackRefs;
                                 
                                 if (!displayRefs || displayRefs.length === 0) return null;
                                 
                                 return (
                                 <div className="mt-4 pt-4 border-t border-slate-100">
                                   <div className="text-slate-400 mb-3 text-xs font-semibold uppercase tracking-wider">Reference Influencers</div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                     {displayRefs.map(ref => (
                                       <div key={ref.id} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                                         <img src={ref.avatar} alt={ref.username} className="h-10 w-10 rounded-full object-cover border border-slate-200 mt-1" />
                                         <div className="flex-1 min-w-0 space-y-1">
                                           <div className="flex items-center justify-between">
                                             <a href={ref.profileUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-800 hover:text-[#6D5DF6] text-sm flex items-center gap-1 transition-colors">
                                               {ref.username} <ExternalLink className="h-3 w-3" />
                                             </a>
                                             <span className="text-[10px] font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full">{ref.platform}</span>
                                           </div>
                                           <div className="flex items-center gap-3 text-xs text-slate-500 pb-1">
                                             <span><strong className="text-slate-700">Folls:</strong> {ref.followers}</span>
                                             <span><strong className="text-slate-700">ER:</strong> {ref.engagement}</span>
                                           </div>
                                           <div className="flex flex-wrap gap-1.5">
                                             {ref.category && ref.category.map(c => (
                                               <span key={c} className="text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-md">{c}</span>
                                             ))}
                                             {ref.persona && ref.persona.map(p => (
                                               <span key={p} className="text-[10px] font-semibold bg-purple-50 text-purple-600 border border-purple-100 px-1.5 py-0.5 rounded-md">{p}</span>
                                             ))}
                                           </div>
                                         </div>
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                               ); })()}
                             </div>
                          ))}
                        </div>
                      ) : (
                        sow.persona && Object.values(sow.persona).some(Boolean) && (
                          <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-150 text-xs mt-4">
                            <span className="font-bold text-slate-450 block mb-3 uppercase text-[10px] tracking-wider">Influencer Persona Requirements</span>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3.5">
                              <div><span className="text-slate-400 font-bold block mb-0.5">Demographics</span> <span className="font-semibold text-slate-850 text-sm">{renderList(sow.persona.demographic)}</span></div>
                              <div><span className="text-slate-400 font-bold block mb-0.5">Location</span> <span className="font-semibold text-slate-850 text-sm">{renderList(sow.persona.location)}</span></div>
                              <div><span className="text-slate-400 font-bold block mb-0.5">Occupation</span> <span className="font-semibold text-slate-850 text-sm">{renderList(sow.persona.occupation)}</span></div>
                              <div><span className="text-slate-400 font-bold block mb-0.5">Tone</span> <span className="font-semibold text-slate-850 text-sm">{renderList(sow.persona.persona)}</span></div>
                              <div><span className="text-slate-400 font-bold block mb-0.5">Content Category</span> <span className="font-semibold text-slate-850 text-sm">{renderList(sow.persona.contentCategory)}</span></div>
                              <div><span className="text-slate-400 font-bold block mb-0.5">Storytelling Styles</span> <span className="font-semibold text-slate-850 text-sm">{renderList(sow.persona.storyTelling)}</span></div>
                            </div>
                          </div>
                        )
                      )}

                      <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-150 text-xs space-y-3">
                        <span className="font-bold text-slate-450 block uppercase text-[10px] tracking-wider">Rights, Whitelisting & Boost Terms</span>
                        <div className="flex flex-wrap gap-2.5">
                          {sow.serviceScope?.buyoutRequired && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md font-semibold text-xs">
                              Buyout: {renderList(sow.serviceScope?.buyoutDuration)}
                            </span>
                          )}
                          {(sow.serviceScope?.boostPostRequired || sow.serviceScope?.boostRequired) && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md font-semibold text-xs">
                              Boost: {renderList(sow.serviceScope?.boostPostDuration || sow.serviceScope?.boostDuration)}
                            </span>
                          )}
                          {sow.serviceScope?.addAdsRequired && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md font-semibold text-xs">
                              Add Ads: {renderList(sow.serviceScope?.addAdsDuration)}
                            </span>
                          )}
                          {sow.serviceScope?.paidPartnershipRequired && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md font-semibold text-xs">
                              Partnership: {renderList(sow.serviceScope?.paidPartnershipDuration)}
                            </span>
                          )}
                          {sow.serviceScope?.genCodeRequired && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md font-semibold text-xs">
                              Gen Code: {renderList(sow.serviceScope?.genCodeDuration)}
                            </span>
                          )}
                          {sow.serviceScope?.tiktokShopRequired && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md font-semibold text-xs">
                              Shop: {renderList(sow.serviceScope?.tiktokShopDuration)}
                            </span>
                          )}
                          {sow.serviceScope?.brandedContentRequired && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md font-semibold text-xs">
                              Branded: {renderList(sow.serviceScope?.brandedContentDuration)}
                            </span>
                          )}
                          {sow.serviceScope?.whitelistingRequired && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md font-semibold text-xs">
                              Whitelisting: {renderList(sow.serviceScope?.whitelistingDuration)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Brand Support & On-Site Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
                        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3.5">
                          <h5 className="font-bold text-slate-750 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
                            <Coins className="h-4 w-4 text-[#6D5DF6]" /> Brand Support & Delivery
                          </h5>
                          <div className="space-y-2.5">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Support Type:</span>
                              <span className="font-bold text-slate-800">
                                {sow.brandSupportType || "No Sponsor"}
                                {sow.brandSupportType === "Other" && sow.brandSupportTypeOther && ` (${sow.brandSupportTypeOther})`}
                              </span>
                            </div>
                            {sow.productReceiveMethod && (
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">Receive Method:</span>
                                <span className="font-semibold text-slate-800">{sow.productReceiveMethod}</span>
                              </div>
                            )}
                            {sow.logisticsPerInfluencer ? (
                              <div className="flex justify-between items-center border-t border-slate-200/50 pt-2">
                                <span className="text-slate-400">Logistics Cost / KOL:</span>
                                <span className="font-bold text-[#6D5DF6]">{Number(sow.logisticsPerInfluencer).toLocaleString()} บาท</span>
                              </div>
                            ) : null}
                            {sow.reimbursement && (
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">Reimbursement Type:</span>
                                <span className="font-semibold text-slate-800">{sow.reimbursement}</span>
                              </div>
                            )}
                            {sow.productValue ? (
                              <div className="flex justify-between items-center border-t border-slate-200/50 pt-2 font-semibold">
                                <span className="text-slate-400 font-normal">Product Value:</span>
                                <span className="font-bold text-[#6D5DF6]">{Number(sow.productValue).toLocaleString()} บาท</span>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3.5">
                          <h5 className="font-bold text-slate-750 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
                            <MapPin className="h-4 w-4 text-[#6D5DF6]" /> On-Site & Travel Details
                          </h5>
                          <div className="space-y-2.5">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Travel Required:</span>
                              <span className={cn(
                                "text-xs font-bold px-3 py-1 rounded-full border",
                                sow.requireTravel && sow.requireTravel.includes("ต้อง") ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-600 border-slate-200"
                              )}>
                                {sow.requireTravel || "ไม่ต้อง"}
                              </span>
                            </div>
                            {sow.requireTravel && sow.requireTravel.includes("ต้อง") && (
                              <>
                                <div className="flex justify-between items-center border-t border-slate-200/50 pt-2">
                                  <span className="text-slate-400">On-Site Type:</span>
                                  <span className="font-semibold text-slate-800">{sow.onSiteType || "-"}</span>
                                </div>
                                {sow.onSiteType === "เข้าร่วม Event" && sow.eventDuration && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Event Duration:</span>
                                    <span className="font-semibold text-slate-800">{sow.eventDuration} Hours</span>
                                  </div>
                                )}
                                {sow.reviewerTravelExpense && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Travel Expense:</span>
                                    <span className="font-semibold text-slate-800">{sow.reviewerTravelExpense}</span>
                                  </div>
                                )}
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-400">Buddy Frontline Support:</span>
                                  <span className="font-semibold text-slate-800">{sow.buddyReviewSupport || "No"}</span>
                                </div>
                                {sow.locationDetails && (
                                  <div className="border-t border-slate-200/50 pt-2 text-xs">
                                    <span className="text-slate-400 font-bold block mb-1">Location Details</span>
                                    <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed whitespace-pre-wrap">{sow.locationDetails}</p>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="text-slate-400 italic text-center py-8 bg-slate-50 border border-slate-200 rounded-xl text-base">
                    No SOW items configured.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSubTab === "logistics" && (
            <div className="space-y-6 pt-4">
              {brief.condition && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-3.5">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Campaign Conditions & Remarks</h4>
                  <div className="text-slate-700 bg-white border border-slate-200 p-5 rounded-xl whitespace-pre-wrap leading-relaxed text-sm shadow-3xs">
                    {brief.condition}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function RateCardListPage({ briefs, onUpdateBriefs, showToast }) {
  const [activeTab, setActiveTab] = useState("SOW & Rate Card");
  const [currentListId, setCurrentListId] = useState(null);
  
  const renderList = (items) => {
    if (!items || items.length === 0) return "-";
    if (typeof items === "string") return items;
    if (Array.isArray(items)) return items.join(", ");
    return String(items);
  };
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [briefIdInput, setBriefIdInput] = useState("");
  const [selectedBriefToLink, setSelectedBriefToLink] = useState("");
  const [activeRecapOptionId, setActiveRecapOptionId] = useState(null);
  const [headerActions, setHeaderActions] = useState(null);
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // New Group & Pillar Setup states
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedPillars, setSelectedPillars] = useState([]); // Selected active pillars e.g. ["Demographic"]
  const [groupPillars, setGroupPillars] = useState([]); // Assigned pillars to group
  const [pillarValues, setPillarValues] = useState({
    Demographic: [],
    Location: [],
    Occupation: [],
    Persona: [],
    ContentCategory: [],
    StoryTelling: []
  });
  const [isSowModalOpen, setIsSowModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeModalSowId, setActiveModalSowId] = useState(null);

  const currentList = briefs.find(b => b.id === currentListId);
  const status = currentList?.internalStatus === "Example List" || currentList?.internalStatus === "Group" || currentList?.internalStatus === "Pillar & Group"
    ? "Example List"
    : (currentList?.internalStatus === "Rate Card List" ? "Rate Card List" : (currentList?.internalStatus === "Recap" ? "Recap" : "Brief Info"));

  const budgetOptions = currentList?.budgetOptions && currentList.budgetOptions.length > 0
    ? currentList.budgetOptions
    : [{
        id: "default-opt",
        name: "Option A",
        scopeOfWorks: currentList?.scopeOfWorks || []
      }];
  
  const activeOptId = activeRecapOptionId || budgetOptions[0]?.id;
  const selectedOption = budgetOptions.find(o => o.id === activeOptId) || budgetOptions[0];
  const optionSows = selectedOption?.scopeOfWorks || [];

  const hasPillars = selectedPillars.length > 0;
  const activePillarKeys = selectedPillars;

  // Filter lists
  const filteredBriefs = briefs.filter(b => {
    const matchesSearch = b.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (b.campaignName && b.campaignName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (b.salesOwner && b.salesOwner.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const displayStatus = b.internalStatus || "Example List";
    const matchesStatus = statusFilter === "All" || displayStatus.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateRateCardList = () => {
    let targetBriefId = briefIdInput.trim();
    let updatedBriefs = [...briefs];

    if (!targetBriefId) {
      targetBriefId = `RC-${Date.now().toString().slice(-6)}`;
    }

    // Check if brief already exists
    let brief = briefs.find(b => b.id === targetBriefId);

    if (brief) {
      // Update existing brief internalStatus
      updatedBriefs = briefs.map(b => {
        if (b.id === targetBriefId) {
          return { ...b, internalStatus: "Brief Info" };
        }
        return b;
      });
      onUpdateBriefs(updatedBriefs);
      showToast(`Success: Created rate card list from Brief ${targetBriefId}`);
      setCurrentListId(targetBriefId);
    } else {
      // Create a new empty rate card list brief (no default influencer profiles)
      const newBrief = {
        id: targetBriefId,
        internalStatus: "Brief Info",
        campaignName: `Campaign ${targetBriefId}`,
        salesOwner: "",
        buyer: "buyer.team@buddyreview.co",
        createdAt: new Date().toISOString().split("T")[0],
        packageType: ["Rate Card"],
        platform: [],
        scopeOfWorks: [],
        groupTrackers: {}
      };
      updatedBriefs = [newBrief, ...briefs];
      onUpdateBriefs(updatedBriefs);
      showToast(`Success: Created new Rate card list ${targetBriefId}`);
      setCurrentListId(targetBriefId);
    }

    setBriefIdInput("");
    setCreateModalOpen(false);
  };

  // Delete rate card list
  const handleDeleteRateCardList = (id) => {
    const updated = briefs.map(b => {
      if (b.id === id) {
        return { ...b, internalStatus: "Draft" }; // revert to draft or remove
      }
      return b;
    });
    onUpdateBriefs(updated);
    showToast("Rate card list removed.");
  };

  const handleUpdateStatus = (newStatus) => {
    if (!currentListId) return;
    const updated = briefs.map(b => {
      if (b.id === currentListId) {
        return { ...b, internalStatus: newStatus };
      }
      return b;
    });
    onUpdateBriefs(updated);
    showToast(`Status updated to ${newStatus}`);
  };
  // Update SOW special services
  const handleUpdateSowServiceScope = (sowId, field, checked) => {
    const updated = briefs.map(b => {
      if (b.id !== currentListId) return b;
      
      const updatedBudgetOptions = (b.budgetOptions && b.budgetOptions.length > 0 ? b.budgetOptions : [{
        id: "default-opt",
        name: "Option A",
        scopeOfWorks: b.scopeOfWorks || []
      }]).map(opt => {
        if (opt.id !== activeOptId) return opt;
        
        const updatedSows = (opt.scopeOfWorks || []).map(s => {
          if (s.id !== sowId) return s;
          const currentScope = s.serviceScope || {};
          return {
            ...s,
            serviceScope: {
              ...currentScope,
              [field]: checked
            }
          };
        });
        
        return {
          ...opt,
          scopeOfWorks: updatedSows
        };
      });

      const activeOpt = updatedBudgetOptions.find(o => o.id === activeOptId);
      
      return {
        ...b,
        budgetOptions: updatedBudgetOptions,
        scopeOfWorks: activeOpt ? activeOpt.scopeOfWorks : b.scopeOfWorks
      };
    });
    onUpdateBriefs(updated);
  };
  // Update SOW example creators
  const handleUpdateSowExampleCreators = (groupId, sowId, creators) => {
    const updated = briefs.map(b => {
      if (b.id !== currentListId) return b;
      
      const updatedGroups = (b.groups || []).map(g => {
        if (g.id !== groupId) return g;
        
        const updatedSows = (g.sows || []).map(s => {
          if (s.id !== sowId) return s;
          return {
            ...s,
            exampleCreators: creators
          };
        });
        
        return {
          ...g,
          sows: updatedSows
        };
      });

      // Sync to groupTrackers
      const updatedTrackers = { ...b.groupTrackers };
      const activeGroup = updatedGroups.find(g => g.id === groupId);
      if (activeGroup) {
        activeGroup.sows.forEach(sow => {
          const groupName = sow.name || sow.contentType;
          const selectedList = (sow.exampleCreators || []).filter(c => c.selected !== false);
          
          const influencers = selectedList.map(creator => {
            return {
              id: creator.id,
              accountName: creator.username,
              accountLink: `https://${creator.platform.toLowerCase()}.com/${creator.username.replace("@", "")}`,
              follower: creator.followers.toLocaleString(),
              channel: creator.platform,
              contact: "Line: @contact",
              rawCost: creator.rawCost ? creator.rawCost.replace(/[^0-9]/g, "") : "15000",
              contactStatus: "Selected",
              services: {}
            };
          });

          updatedTrackers[groupName] = {
            influencers: influencers
          };
        });
      }
      
      return {
        ...b,
        groups: updatedGroups,
        groupTrackers: updatedTrackers
      };
    });
    onUpdateBriefs(updated);
  };
  // Update Group questions
  const handleUpdateGroupQuestions = (groupId, questions) => {
    const updated = briefs.map(b => {
      if (b.id !== currentListId) return b;
      
      const updatedGroups = (b.groups || []).map(g => {
        if (g.id !== groupId) return g;
        
        return {
          ...g,
          questions: questions
        };
      });
      
      return {
        ...b,
        groups: updatedGroups
      };
    });
    onUpdateBriefs(updated);
  };
  // Add influencer inside Detail Page
  const handleAddInfluencer = (groupName) => {
    if (!currentList) return;
    const newInf = {
      id: `inf-${Date.now()}`,
      accountName: `@creator_${Math.floor(Math.random() * 1000)}`,
      accountLink: "https://tiktok.com",
      follower: "100K",
      channel: currentList.platform?.[0] || "TikTok",
      contact: "Line: @contact",
      rawCost: "15000",
      contactStatus: "Selected",
      services: {}
    };

    const updatedTrackers = { ...currentList.groupTrackers };
    if (!updatedTrackers[groupName]) {
      updatedTrackers[groupName] = { influencers: [] };
    }
    updatedTrackers[groupName].influencers = [
      ...updatedTrackers[groupName].influencers,
      newInf
    ];

    const updatedBriefs = briefs.map(b => {
      if (b.id === currentListId) {
        return { ...b, groupTrackers: updatedTrackers };
      }
      return b;
    });
    onUpdateBriefs(updatedBriefs);
    showToast("Added mock influencer to group.");
  };

  // Remove influencer inside Detail Page
  const handleRemoveInfluencer = (groupName, infId) => {
    if (!currentList) return;
    const updatedTrackers = { ...currentList.groupTrackers };
    updatedTrackers[groupName].influencers = updatedTrackers[groupName].influencers.filter(i => i.id !== infId);

    const updatedBriefs = briefs.map(b => {
      if (b.id === currentListId) {
        return { ...b, groupTrackers: updatedTrackers };
      }
      return b;
    });
    onUpdateBriefs(updatedBriefs);
    showToast("Influencer removed.");
  };

  const renderMultiSelect = (key, icon, label, options, sowId = null) => {
    const stateKey = sowId ? `${sowId}-${key}` : key;
    const selected = pillarValues[stateKey] || [];
    const isOpen = openDropdown === stateKey;

    return (
      <div className="relative space-y-1">
        <label className="block text-[11px] font-bold text-slate-400 pl-1">{label}</label>
        
        {/* Toggle Button */}
        <div 
          onClick={() => setOpenDropdown(isOpen ? null : stateKey)}
          className="relative flex items-center border border-slate-200 rounded-xl bg-white focus-within:border-[#6D5DF6] transition shadow-xs cursor-pointer py-3 px-3.5"
        >
          <div className="text-slate-450 mr-2 flex-shrink-0">
            {icon}
          </div>
          
          <div className="flex-1 pr-6 truncate text-xs font-semibold text-slate-700 select-none font-sans">
            {selected.length > 0 ? selected.join(", ") : "เลือก"}
          </div>

          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
            <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-100 bg-white p-2 shadow-lg z-50 space-y-0.5">
              {options.map((option) => {
                const isOptionChecked = selected.includes(option);
                return (
                  <label 
                    key={option} 
                    className="flex items-center gap-2 px-2.5 py-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-semibold text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={isOptionChecked}
                      onChange={() => {
                        let nextSelected;
                        if (isOptionChecked) {
                          nextSelected = selected.filter(x => x !== option);
                        } else {
                          nextSelected = [...selected, option];
                        }
                        setPillarValues(prev => ({ ...prev, [stateKey]: nextSelected }));
                      }}
                      className="rounded border-slate-300 text-[#6D5DF6] focus:ring-[#6D5DF6] h-3.5 w-3.5"
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  const handleAddGroup = () => {
    if (selectedPillars.length === 0) {
      showToast("Please select at least one Pillar first.");
      return;
    }
    if (!newGroupName.trim()) {
      showToast("Please enter a Group Name.");
      return;
    }
    if (groupPillars.length === 0) {
      showToast("Please assign at least one Pillar to this group.");
      return;
    }

    // Check if assigned pillars have values
    const invalidPillars = groupPillars.filter(key => !pillarValues[key] || pillarValues[key].length === 0);
    if (invalidPillars.length > 0) {
      showToast(`Please select at least one value for: ${invalidPillars.join(", ")}`);
      return;
    }

    // Map assigned group pillars to "Key: Value1, Value2"
    const assignedPillarStrings = groupPillars.map(key => `${key}: ${(pillarValues[key] || []).join(", ")}`);

    const newSow = {
      id: `sow-${crypto.randomUUID()}`,
      name: newGroupName.trim(),
      platforms: assignedPillarStrings,
      followerReq: "10K - 50K",
      numInfluencers: "0"
    };

    const updatedSows = [...(currentList.scopeOfWorks || []), newSow];
    const updatedTrackers = { ...(currentList.groupTrackers || {}) };
    updatedTrackers[newGroupName.trim()] = { influencers: [] };

    const updatedBriefs = briefs.map(b => {
      if (b.id === currentListId) {
        return {
          ...b,
          scopeOfWorks: updatedSows,
          groupTrackers: updatedTrackers,
          platform: Array.from(new Set([...(b.platform || []), ...assignedPillarStrings]))
        };
      }
      return b;
    });

    onUpdateBriefs(updatedBriefs);
    showToast(`Successfully created group "${newGroupName}" with pillars [${assignedPillarStrings.join(", ")}]`);

    setNewGroupName("");
    setSelectedPillars([]);
    setGroupPillars([]);
    setPillarValues({
      Demographic: [],
      Location: [],
      Occupation: [],
      Persona: [],
      ContentCategory: [],
      StoryTelling: []
    });
    setIsSowModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {!currentListId ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-[28px]">Rate Card List</h1>
                <p className="mt-1 text-sm text-slate-500">Add, view, and manage rate card lists linked to campaign briefs.</p>
              </div>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#6D5DF6] px-5 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-[#5a4add]"
              >
                <Plus className="h-4 w-4" /> Add Rate Card List
              </button>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Brief ID, Campaign Name, or Sales Owner..."
                  className="h-10 w-full bg-transparent pl-10 pr-4 text-sm outline-none text-slate-700 placeholder:text-slate-400"
                />
              </div>
              <div className="hidden sm:block h-6 w-px bg-slate-200"></div>
              <div className="w-full sm:w-auto flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 outline-none cursor-pointer focus:border-blue-300"
                >
                  <option value="All">All Status</option>
                  <option value="Example List">Example List</option>
                  <option value="Pillar & Group">Pillar & Group</option>
                  <option value="Rate Card List">Rate Card List</option>
                </select>
              </div>
            </div>

            {/* List Table */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Brief ID</th>
                      <th className="px-6 py-4">Campaign Name / SOW Info</th>
                      <th className="px-6 py-4">Sales Owner</th>
                      <th className="px-6 py-4">Created By</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Created Date</th>
                      <th className="px-6 py-4 text-center">Management</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredBriefs.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-16 text-slate-400 font-medium">
                          No matching rate card lists found.
                        </td>
                      </tr>
                    ) : (
                      filteredBriefs.map((b) => {
                        const isRateCardList = b.internalStatus === "Rate Card List";
                        
                        // User Groups and Pillars extraction
                        const userGroups = b.groups || [];
                        const sowGroups = b.scopeOfWorks || [];

                        return (
                          <tr key={b.id} className="transition hover:bg-slate-50/50">
                            <td className="px-6 py-4 font-bold text-[#6D5DF6] text-xs align-top pt-5">
                              {b.id}
                            </td>
                            <td className="px-6 py-4 align-top pt-5">
                              <div className="font-semibold text-slate-900 text-sm">{b.campaignName || "Untitled Campaign"}</div>
                              <div className="text-[11px] text-slate-400 mt-1">{b.brand || "No Brand"}</div>
                              
                              {/* Groups & platforms */}
                              {userGroups.length > 0 ? (
                                <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                                  {userGroups.map((group, i) => {
                                    const platforms = new Set();
                                    (group.sows || []).forEach(sow => {
                                      const plats = sow.platforms ? (Array.isArray(sow.platforms) ? sow.platforms : [sow.platforms]) : [];
                                      plats.forEach(p => platforms.add(p));
                                    });
                                    const platformPillars = Array.from(platforms);

                                    return (
                                      <div key={i} className="flex flex-wrap items-center gap-1.5 text-[11px]">
                                        <span className="font-semibold text-slate-600">Group:</span>
                                        <span className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md font-medium">{group.name}</span>
                                        {platformPillars.length > 0 && (
                                          <>
                                            <span className="text-slate-400">·</span>
                                            <span className="font-semibold text-slate-600">Platform:</span>
                                            {platformPillars.map((p, pIdx) => (
                                              <span key={pIdx} className="bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded-md font-bold text-[10px] uppercase border border-blue-100">{p}</span>
                                            ))}
                                          </>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : sowGroups.length > 0 ? (
                                <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 opacity-70">
                                  {sowGroups.map((sow, i) => (
                                    <div key={i} className="flex flex-wrap items-center gap-1.5 text-[11px]">
                                      <span className="font-semibold text-slate-600">SOW (Sales):</span>
                                      <span className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md font-medium">{sow.name || sow.contentType}</span>
                                      <span className="text-slate-400">·</span>
                                      <span className="font-semibold text-slate-600">Pillar:</span>
                                      {(sow.platforms ? (Array.isArray(sow.platforms) ? sow.platforms : [sow.platforms]) : []).map((p, pIdx) => (
                                        <span key={pIdx} className="bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-md font-bold text-[10px] uppercase border border-slate-300">{p}</span>
                                      ))}
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </td>
                            <td className="px-6 py-4 text-slate-700 text-xs font-semibold align-top pt-5">
                              {b.salesOwner || "No Owner"}
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs align-top pt-5 truncate max-w-[150px]" title={b.buyer || "buyer.team@buddyreview.co"}>
                              {b.buyer || "buyer.team@buddyreview.co"}
                            </td>
                            <td className="px-6 py-4 align-top pt-5">
                              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
                                b.internalStatus === "Rate Card List" 
                                  ? "bg-purple-50 text-purple-750 border-purple-100" 
                                  : b.internalStatus === "Pillar & Group"
                                  ? "bg-blue-50 text-blue-755 border-blue-100"
                                  : "bg-amber-50 text-amber-700 border-amber-100"
                              }`}>
                                {b.internalStatus || "Example List"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs align-top pt-5">
                              {b.createdAt || "2025-01-01"}
                            </td>
                            <td className="px-6 py-4 align-top pt-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => setCurrentListId(b.id)}
                                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-[#6D5DF6] transition hover:bg-violet-50 hover:border-violet-200"
                                >
                                  View Detail
                                </button>
                                <button
                                  onClick={() => handleDeleteRateCardList(b.id)}
                                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-rose-50 text-rose-500 transition hover:bg-rose-100"
                                  title="Delete List"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        ) : (
          /* Detail Page */
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            
            {
              (() => {
                const stepsOrder = ["Brief Info", "Recap", "Example List", "Rate Card List"];
                const currentStepIdx = stepsOrder.indexOf(status);
                return (
                  <>
            {/* Back Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button 
                onClick={() => setCurrentListId(null)}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#6D5DF6] cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Rate Card List
              </button>
            </div>

            <Stepper 
              steps={stepsOrder} 
              currentStepIndex={currentStepIdx} 
              onStepClick={(index) => handleUpdateStatus(stepsOrder[index])} 
            />

            {/* Brief Info display for Step 1 */}
            {status === "Brief Info" && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-6">
                <BriefDetailPageReadOnly brief={currentList} handleUpdateStatus={handleUpdateStatus} />
              </div>
            )}

            {/* Recap Table display for Step 2 */}
            {status === "Recap" && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-6">
                <RecapSetup
                  brief={currentList}
                  onUpdateBrief={(updatedBrief) => {
                    const updated = briefs.map(b => b.id === currentListId ? updatedBrief : b);
                    onUpdateBriefs(updated);
                  }}
                  onNext={() => handleUpdateStatus("Example List")}
                />
              </div>
            )}

            {/* Step 3: Example List */}
            {status === "Example List" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Example List & Questions</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Choose example influencers and write questions for each group.</p>
                  </div>
                </div>

                {(currentList.groups && currentList.groups.length > 0 ? currentList.groups : []).map((group, groupIndex) => (
                  <div key={group.id || groupIndex} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-6">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
                      <h4 className="text-sm font-bold text-slate-800">{group.name || `Group ${groupIndex + 1}`}</h4>
                      {group?.pillar && typeof group.pillar === "string" && (
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide border border-indigo-100">
                          {group.pillar}
                        </span>
                      )}
                      {group?.pillars && Object.values(group.pillars).some(arr => arr && arr.length > 0) && (
                        <div className="flex flex-wrap gap-2">
                          {Object.values(group.pillars).flat().filter(Boolean).map((val, i) => (
                            <span key={i} className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide border border-indigo-100">
                              {val}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse table-layout-fixed" style={{ minWidth: "800px" }}>
                        <thead>
                          <tr className="border-b border-slate-200 bg-white">
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 bg-slate-50/50" style={{ width: "220px" }}>Detail</th>
                            {group.sows?.map((sow, idx) => (
                              <th key={sow.id || idx} className="p-4 text-xs font-bold text-slate-700 uppercase tracking-wider border-r border-slate-200 last:border-r-0 bg-white" style={{ width: "300px" }}>
                                <div className="flex flex-col gap-1">
                                  <span className="text-slate-900 font-bold text-xs">{sow.name || sow.contentType}</span>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    {(sow.platforms || []).map((plat) => (
                                      <span key={plat} className="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-[9px] font-bold text-[#6D5DF6] border border-violet-100">
                                        {plat}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </th>
                            ))}
                            {(!group.sows || group.sows.length === 0) && <th className="p-4 text-slate-400 italic bg-white">N/A</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {/* Follower */}
                          <tr className="border-b border-slate-100">
                            <td className="p-4 font-bold bg-slate-50/50 text-slate-700 align-top border-r border-slate-200">Follower Requirement</td>
                            {group.sows?.map((sow, idx) => (
                              <td key={sow.id || idx} className="p-4 align-top border-r border-slate-200 last:border-r-0 text-sm text-slate-700 bg-white">
                                {sow.influencerDetails && sow.influencerDetails.length > 0 ? (
                                  <div className="text-[11px] font-medium leading-tight space-y-0.5 mt-0.5">
                                    {sow.influencerDetails.map((d, i) => (
                                      <div key={i}><span className="text-slate-400 mr-1">G{i+1}:</span>{d.followerReqFrom ? Number(d.followerReqFrom).toLocaleString() : "0"} - {d.followerReqTo ? Number(d.followerReqTo).toLocaleString() : "Any"}</div>
                                    ))}
                                  </div>
                                ) : sow.followerReqFrom && sow.followerReqTo ? (
                                  `${Number(sow.followerReqFrom).toLocaleString()} - ${Number(sow.followerReqTo).toLocaleString()}`
                                ) : (
                                  sow.followerReqFrom || sow.followerReqTo || "-"
                                )}
                              </td>
                            ))}
                            {(!group.sows || group.sows.length === 0) && <td className="p-4 text-slate-400 italic bg-white">N/A</td>}
                          </tr>
                          
                          {/* Num Influencers */}
                          <tr className="border-b border-slate-100">
                            <td className="p-4 font-bold bg-slate-50/50 text-slate-700 align-top border-r border-slate-200">Number of Influencers</td>
                            {group.sows?.map((sow, idx) => (
                              <td key={sow.id || idx} className="p-4 align-top border-r border-slate-200 last:border-r-0 text-sm text-slate-700 bg-white">
                                {sow.influencerDetails && sow.influencerDetails.length > 0 ? (
                                  sow.influencerDetails.reduce((sum, d) => sum + (Number(d.numInfluencers) || 0), 0)
                                ) : (
                                  sow.numInfluencers || "-"
                                )}
                              </td>
                            ))}
                            {(!group.sows || group.sows.length === 0) && <td className="p-4 text-slate-400 italic bg-white">N/A</td>}
                          </tr>


                          {/* Requirement */}
                          <tr className="border-b border-slate-100">
                            <td className="p-4 font-bold bg-slate-50/50 text-slate-700 align-top border-r border-slate-200">Boost by Page</td>
                            {group.sows?.map((sow, idx) => {
                              const reqs = [];
                              
                              const addReq = (label, durations) => {
                                if (!durations || durations.length === 0) {
                                  reqs.push(label);
                                } else {
                                  durations.forEach(d => {
                                    reqs.push(`${label} (${d})`);
                                  });
                                }
                              };

                              if (sow.serviceScope?.buyoutRequired) addReq("Buyout", sow.serviceScope.buyoutDuration);
                              if (sow.serviceScope?.boostPostRequired) addReq("Boost by Page", sow.serviceScope.boostPostDuration);
                              if (sow.serviceScope?.addAdsRequired) addReq("Add Ads", sow.serviceScope.addAdsDuration);
                              if (sow.serviceScope?.paidPartnershipRequired) addReq("Paid Partnership", sow.serviceScope.paidPartnershipDuration);
                              if (sow.serviceScope?.discoveryRequired) addReq("YouTube Discovery", sow.serviceScope.discoveryDuration);
                              if (sow.serviceScope?.genCodeRequired) addReq("Gen Code", sow.serviceScope.genCodeDuration);
                              if (sow.serviceScope?.tiktokShopRequired) addReq("TikTok Shop", null);
                              if (sow.serviceScope?.brandedContentRequired) addReq("FB Branded Content", sow.serviceScope.brandedContentDuration);
                              if (sow.serviceScope?.whitelistingRequired) addReq("X Whitelisting", sow.serviceScope.whitelistingDuration);
                              
                              return (
                                <td key={sow.id || idx} className="p-4 align-top border-r border-slate-200 last:border-r-0 text-sm text-slate-700 bg-white">
                                  {reqs.length > 0 ? (
                                    <div className="flex flex-col gap-1.5">
                                      {reqs.map((r, rIdx) => <span key={rIdx} className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#6D5DF6]" />{r}</span>)}
                                    </div>
                                  ) : <span className="text-slate-400">-</span>}
                                </td>
                              );
                            })}
                            {(!group.sows || group.sows.length === 0) && <td className="p-4 text-slate-400 italic bg-white">N/A</td>}
                          </tr>

                          {/* Question - Merged Cell */}
                          <tr className="border-b border-slate-100">
                            <td className="p-4 font-bold bg-slate-50/50 text-slate-700 align-top border-r border-slate-200">Questions</td>
                            <td colSpan={Math.max(1, group.sows?.length || 1)} className="p-4 align-top text-sm bg-white">
                              <div className="space-y-3 max-w-3xl">
                                {(group.questions || []).map((q, qIdx) => (
                                  <div key={qIdx} className="flex gap-2 items-start">
                                    <span className="mt-2 text-xs font-bold text-slate-400 w-4 text-right">{qIdx + 1}.</span>
                                    <input 
                                      type="text" 
                                      value={q}
                                      onChange={(e) => {
                                        const newQs = [...(group.questions || [])];
                                        newQs[qIdx] = e.target.value;
                                        handleUpdateGroupQuestions(group.id, newQs);
                                      }}
                                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#6D5DF6]"
                                      placeholder="Enter question..."
                                    />
                                    <button 
                                      onClick={() => {
                                        const newQs = [...(group.questions || [])];
                                        newQs.splice(qIdx, 1);
                                        handleUpdateGroupQuestions(group.id, newQs);
                                      }}
                                      className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors mt-0.5"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                                <div className="pl-6">
                                  <button 
                                    onClick={() => {
                                      const newQs = [...(group.questions || []), ""];
                                      handleUpdateGroupQuestions(group.id, newQs);
                                    }}
                                    className="flex items-center gap-1.5 text-xs font-bold text-[#6D5DF6] hover:bg-violet-50 px-3 py-1.5 rounded-lg transition-colors border border-dashed border-[#6D5DF6]"
                                  >
                                    <Plus className="w-3.5 h-3.5" /> Add Question
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>

                          {/* Example List row */}
                          <tr className="border-b border-slate-100">
                            <td className="p-4 font-bold bg-slate-50/50 text-slate-700 align-top border-r border-slate-200">Example list</td>
                            {group.sows?.map((sow, idx) => {
                              const selectedCreators = sow.exampleCreators || [];
                              return (
                                <td key={sow.id || idx} className="p-4 align-top border-r border-slate-200 last:border-r-0 space-y-3 bg-white">
                                  {/* Selected creators list */}
                                  <div className="flex flex-col gap-1.5">
                                    {selectedCreators.map((creator) => (
                                      <div key={creator.id} className={`flex items-center justify-between border rounded-lg p-1.5 pr-2 transition-all ${
                                        creator.selected !== false 
                                          ? "bg-white border-slate-200/60 shadow-xs" 
                                          : "bg-slate-50/50 border-slate-100/60 opacity-60"
                                      }`}>
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                          <input 
                                            type="checkbox"
                                            checked={creator.selected !== false}
                                            onChange={(e) => {
                                              const updated = selectedCreators.map((c) => 
                                                c.id === creator.id ? { ...c, selected: e.target.checked } : c
                                              );
                                              handleUpdateSowExampleCreators(group.id, sow.id, updated);
                                            }}
                                            className="rounded border-slate-350 text-[#6D5DF6] focus:ring-[#6D5DF6] h-3.5 w-3.5 cursor-pointer flex-shrink-0"
                                          />
                                          <img 
                                            src={creator.avatar || "https://i.pravatar.cc/160"} 
                                            alt={creator.name} 
                                            className="w-6 h-6 rounded-full object-cover bg-slate-100 flex-shrink-0" 
                                          />
                                          <div className="flex flex-col min-w-0">
                                            <span className={`text-[11px] font-semibold truncate leading-tight ${
                                              creator.selected !== false ? "text-slate-800" : "text-slate-450"
                                            }`}>
                                              {creator.name}
                                            </span>
                                            <span className="text-[9px] text-slate-450 leading-tight truncate">
                                              {creator.username}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    {selectedCreators.length === 0 && (
                                      <span className="text-slate-400 italic text-[10px]">ยังไม่ได้เพิ่มรายชื่อ</span>
                                    )}
                                  </div>

                                  {/* Add Creator button */}
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() => setActiveModalSowId({ groupId: group.id, sowId: sow.id })}
                                      className="w-full flex items-center justify-center gap-1 py-1.5 px-3 border border-dashed border-slate-300 rounded-lg text-[11px] font-bold text-[#6D5DF6] hover:bg-violet-50/50 hover:border-[#6D5DF6] transition"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>เพิ่มคน</span>
                                    </button>
                                  </div>
                                </td>
                              );
                            })}
                            {(!group.sows || group.sows.length === 0) && <td className="p-4 text-slate-400 italic bg-white">N/A</td>}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}

              </div>
            )}

            {/* Step 5: Rate Card List */}
            {status === "Rate Card List" && (
              <PlannerTrackerPage
                brief={currentList}
                setHeaderActions={setHeaderActions}
                onUpdateBrief={(updatedBrief) => {
                  const updated = briefs.map(b => b.id === currentListId ? updatedBrief : b);
                  onUpdateBriefs(updated);
                }}
              />
            )}
                  </>
                );
              })()
            }
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal Dialog */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/35" 
              onClick={() => setCreateModalOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 12 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.96, y: 12 }} 
              className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="text-lg font-semibold text-slate-900">Create Rate Card List</h2>
                <button onClick={() => setCreateModalOpen(false)} className="rounded-xl p-2 hover:bg-slate-100"><X className="h-5 w-5 text-slate-500" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-755">Brief ID</label>
                  <input
                    type="text"
                    value={briefIdInput}
                    onChange={(e) => setBriefIdInput(e.target.value)}
                    placeholder="E.g. NRP202501090"
                    className="w-full text-sm border border-slate-200 focus:border-blue-500 outline-none px-3 py-2.5 rounded-lg bg-transparent text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setCreateModalOpen(false)} 
                  className="rounded-lg bg-slate-150 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateRateCardList}
                  className="rounded-lg bg-[#6D5DF6] px-5 py-2 text-xs font-semibold text-white hover:bg-[#5a4add]"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SOW Wizard Modal */}
      <AnimatePresence>
        {isSowModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/35" 
              onClick={() => {
                setIsSowModalOpen(false);
                setOpenDropdown(null);
              }} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 12 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.96, y: 12 }} 
              className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl space-y-5 overflow-visible"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Configure Group & Pillar</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Select active pillars, name the group, then assign pillars and choose options.</p>
                </div>
                <button 
                  onClick={() => {
                    setIsSowModalOpen(false);
                    setOpenDropdown(null);
                  }} 
                  className="rounded-xl p-2 hover:bg-slate-100"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
                {/* Step 1: Select Active Pillars & Choose Options */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">1</span>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-550">1. Select Pillars & Choose Options</label>
                  </div>
                  
                  <div className="pl-7 space-y-3">
                    <p className="text-[11px] text-slate-400">Select active pillars and choose their specific options.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {["Demographic", "Location", "Occupation", "Persona", "ContentCategory", "StoryTelling"].map((pillarKey) => {
                        const labelMap = {
                          Demographic: "Demographic",
                          Location: "Location",
                          Occupation: "Occupation",
                          Persona: "Persona",
                          ContentCategory: "Content Category",
                          StoryTelling: "Story Telling"
                        };
                        const isChecked = selectedPillars.includes(pillarKey);
                        
                        let icon = <Clock className="h-4 w-4" />;
                        if (pillarKey === "Location") icon = <MapPin className="h-4 w-4" />;
                        if (pillarKey === "Occupation") icon = <Briefcase className="h-4 w-4" />;
                        if (pillarKey === "Persona") icon = <User className="h-4 w-4" />;
                        if (pillarKey === "ContentCategory") icon = <Tag className="h-4 w-4" />;
                        if (pillarKey === "StoryTelling") icon = <MessageSquare className="h-4 w-4" />;

                        const optionsMap = {
                          Demographic: ["18-24 Female", "25-34 Female", "18-35 Unisex", "Gen Z", "Gen Y", "Gen Alpha"],
                          Location: ["Bangkok & Vicinity", "Upcountry", "Major Cities", "Nationwide"],
                          Occupation: ["Office Workers", "Students / University", "Freelancers", "Business Owners", "First Jobbers"],
                          Persona: ["Beauty Enthusiasts", "Tech Geeks", "Modern Moms", "Pet Lovers", "Foodies", "Lifestyle Travellers"],
                          ContentCategory: ["Beauty & Cosmetics", "Fashion & Lifestyle", "Food & Dining", "Travel & Vlogs", "IT & Gadgets", "Finance & Investment"],
                          StoryTelling: ["Review / Unboxing", "How-to / Tutorial", "Daily Vlog", "ASMR", "Comedy / Entertain", "Storytelling"]
                        };

                        return (
                          <div key={pillarKey} className={`p-3 border rounded-2xl transition-all ${
                            isChecked ? "bg-blue-50/20 border-blue-200 shadow-xs" : "bg-slate-50/50 border-slate-200"
                          }`}>
                            <button
                              type="button"
                              onClick={() => {
                                if (isChecked) {
                                  setSelectedPillars(selectedPillars.filter(p => p !== pillarKey));
                                  setGroupPillars(groupPillars.filter(p => p !== pillarKey));
                                } else {
                                  setSelectedPillars([...selectedPillars, pillarKey]);
                                  setGroupPillars([...groupPillars, pillarKey]);
                                }
                              }}
                              className={`w-full flex items-center justify-between text-left text-xs font-bold transition-all ${
                                isChecked ? "text-blue-750" : "text-slate-550"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`flex h-4 w-4 items-center justify-center rounded border ${
                                  isChecked ? "bg-blue-650 border-blue-650 text-white" : "border-slate-300"
                                }`}>
                                  {isChecked && "✓"}
                                </span>
                                <span>{labelMap[pillarKey]}</span>
                              </div>
                            </button>

                            {isChecked && (
                              <div className="mt-3 bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-xs">
                                {renderMultiSelect(pillarKey, icon, `Choose ${labelMap[pillarKey]} Options`, optionsMap[pillarKey])}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Step 2: Define Group Name */}
                <div className={`space-y-2.5 transition-all duration-200 ${selectedPillars.length === 0 ? "opacity-45 pointer-events-none" : "opacity-100"}`}>
                  <div className="flex items-center gap-2">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${selectedPillars.length > 0 ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-400"}`}>2</span>
                    <label className="text-xs font-bold text-slate-700">2. Define Group Name <span className="text-red-500">*</span></label>
                  </div>
                  
                  <div className="pl-7">
                    <input
                      type="text"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      disabled={selectedPillars.length === 0}
                      placeholder={selectedPillars.length === 0 ? "Select pillars first..." : "E.g. Beauty Reviewers, Nano Shortlist"}
                      className="w-full text-sm border border-slate-200 focus:border-[#6D5DF6] outline-none px-3 py-2.5 rounded-lg bg-transparent text-slate-800 disabled:bg-slate-50"
                    />
                  </div>
                </div>

                {/* Step 3: Assign Configured Pillars to Group */}
                <div className={`space-y-3 transition-all duration-200 ${(!newGroupName.trim() || selectedPillars.length === 0) ? "opacity-45 pointer-events-none" : "opacity-100"}`}>
                  <div className="flex items-center gap-2">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${newGroupName.trim() && selectedPillars.length > 0 ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-400"}`}>3</span>
                    <label className="text-xs font-bold text-slate-700">3. Assign Pillars to Group "{newGroupName || '...'}" <span className="text-red-500">*</span></label>
                  </div>
                  
                  <div className="pl-7 space-y-3">
                    <p className="text-[11px] text-slate-400">Choose which of your configured active pillars belong to this group.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedPillars.map((key) => {
                        const isAssigned = groupPillars.includes(key);
                        const labelMap = {
                          Demographic: "Demographic",
                          Location: "Location",
                          Occupation: "Occupation",
                          Persona: "Persona",
                          ContentCategory: "Content Category",
                          StoryTelling: "Story Telling"
                        };
                        const selectedValues = pillarValues[key] || [];

                        return (
                          <div 
                            key={key} 
                            onClick={() => {
                              if (isAssigned) {
                                setGroupPillars(groupPillars.filter(p => p !== key));
                              } else {
                                setGroupPillars([...groupPillars, key]);
                              }
                            }}
                            className={`p-3 border rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                              isAssigned 
                                ? "bg-blue-50/10 border-blue-200 shadow-xs" 
                                : "bg-white border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isAssigned}
                              readOnly
                              className="rounded border-slate-350 text-[#6D5DF6] focus:ring-[#6D5DF6] mt-0.5"
                            />
                            <div>
                              <div className="text-xs font-bold text-slate-750">Assign {labelMap[key]}</div>
                              <div className="text-[10px] text-slate-450 mt-1 line-clamp-2">
                                Options: {selectedValues.length > 0 ? selectedValues.join(", ") : "No options selected"}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => {
                    setIsSowModalOpen(false);
                    setOpenDropdown(null);
                  }} 
                  className="rounded-lg bg-slate-150 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGroup}
                  disabled={selectedPillars.length === 0 || !newGroupName.trim() || groupPillars.length === 0}
                  className="rounded-lg bg-[#6D5DF6] px-5 py-2 text-xs font-semibold text-white hover:bg-[#5a4add] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Group
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Influencer Select Modal for Example list */}
      <InfluencerSelectModal
        open={activeModalSowId !== null}
        onClose={() => setActiveModalSowId(null)}
        onSelect={(creator) => {
          if (creator && activeModalSowId) {
            const { groupId, sowId } = activeModalSowId;
            const group = currentList?.groups?.find(g => g.id === groupId);
            if (group) {
              const sow = group.sows?.find(s => s.id === sowId);
              if (sow) {
                const selectedCreators = sow.exampleCreators || [];
                if (!selectedCreators.some(c => c.id === creator.id)) {
                  handleUpdateSowExampleCreators(groupId, sowId, [...selectedCreators, creator]);
                }
              }
            }
          }
          setActiveModalSowId(null);
        }}
      />
    </div>
  );
}
