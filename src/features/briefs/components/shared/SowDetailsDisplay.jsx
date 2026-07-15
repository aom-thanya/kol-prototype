import React, { useState } from "react";
import { cn } from "../../../../utils/helpers";
import { Coins, MapPin, ChevronDown, ChevronUp, Edit2 } from "lucide-react";

const renderList = (arr) => {
  if (!arr) return "-";
  if (Array.isArray(arr)) return arr.length > 0 ? arr.join(", ") : "-";
  return String(arr);
};

export default function SowDetailsDisplay({ sow, index, children, onEdit, initialCollapsed = false }) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 text-base shadow-3xs transition">
      {/* Scope Header */}
      <div 
        className={cn("flex items-center justify-between cursor-pointer group", !isCollapsed && "border-b border-slate-100 pb-3.5")}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="font-bold text-slate-900 text-base group-hover:text-[#6D5DF6] transition-colors">
          Scope {index !== undefined ? index + 1 : ""}: {sow.name || "Unnamed Scope"}
        </span>
        <div className="flex gap-2 items-center">
          {(sow.platforms || []).map(plat => (
            <span key={plat} className={cn(
              "text-xs font-bold px-2.5 py-0.5 rounded-full border",
              plat === "TikTok" ? "bg-black text-white border-black" :
                plat === "Instagram" ? "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white border-pink-500" :
                  plat === "YouTube" ? "bg-red-50 text-red-750 border-red-200" :
                    plat === "Facebook" || plat === "Facebook Page" ? "bg-blue-50 text-blue-750 border-blue-200" :
                      plat === "X" ? "bg-slate-900 text-white border-slate-900" :
                        plat === "Lemon8" ? "bg-yellow-50 text-yellow-800 border-yellow-200" :
                          "bg-slate-100 text-slate-700 border-slate-200"
            )}>
              {plat}
            </span>
          ))}
          {onEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }} 
              className="text-slate-400 hover:text-[#6D5DF6] bg-white p-1 rounded-full shadow-xs border border-slate-100 ml-2"
              title="Edit Scope"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          <button className="text-slate-400 hover:text-slate-600 ml-1">
            {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="space-y-4.5 pt-4.5 animate-in slide-in-from-top-2 fade-in duration-200">
          {/* Deliverables Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 font-bold block mb-1">Content Type</span>
          <span className="font-bold text-slate-800 text-base">{renderList(sow.contentType)}</span>
        </div>

        {sow.serviceScope?.selectedVias && sow.serviceScope.selectedVias.length > 0 && (
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold block mb-1">Via</span>
            <span className="font-bold text-slate-800 text-base">{sow.serviceScope.selectedVias.join(', ')}</span>
          </div>
        )}

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 font-bold block mb-1">Budget Allocation</span>
          <span className="font-bold text-slate-800 text-base">
            {sow.allocationPercent ? `${sow.allocationPercent}%` : sow.allocation ? `${sow.allocation}%` : "-"}
          </span>
        </div>
      </div>

      {/* SOW Details Content */}
      {sow.details && (
        <div className="text-sm p-4 rounded-xl border border-slate-150 bg-slate-50/30">
          <h5 className="font-bold text-slate-400 mb-1.5">Details & Guidelines</h5>
          <div className="font-medium text-slate-600 leading-relaxed prose prose-sm max-w-none max-h-[150px] overflow-y-auto text-sm" dangerouslySetInnerHTML={{ __html: sow.details }} />
        </div>
      )}

      {/* Columns split for Persona and Active services */}
      <div className={cn("grid gap-4", children ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2")}>
        {children}

        {/* Active Services */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-sm">
          <h5 className="font-bold text-slate-750 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Boost by page
          </h5>
          <div className="flex flex-wrap gap-2 pt-1">
            {sow.serviceScope?.buyoutRequired && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md font-semibold text-xs">
                buyout: {renderList(sow.serviceScope?.buyoutDuration)}
              </span>
            )}
            {(sow.serviceScope?.boostPostRequired || sow.serviceScope?.boostRequired) && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md font-semibold text-xs">
                boost: {renderList(sow.serviceScope?.boostPostDuration || sow.serviceScope?.boostDuration)}
              </span>
            )}
            {sow.serviceScope?.addAdsRequired && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md font-semibold text-xs">
                add ads: {renderList(sow.serviceScope?.addAdsDuration)}
              </span>
            )}
            {sow.serviceScope?.paidPartnershipRequired && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md font-semibold text-xs">
                partnership: {renderList(sow.serviceScope?.paidPartnershipDuration)}
              </span>
            )}
            {sow.serviceScope?.genCodeRequired && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md font-semibold text-xs">
                gen code: {renderList(sow.serviceScope?.genCodeDuration)}
              </span>
            )}
            {sow.serviceScope?.tiktokShopRequired && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md font-semibold text-xs">
                shop: {renderList(sow.serviceScope?.tiktokShopDuration)}
              </span>
            )}
            {(sow.serviceScope?.brandedContentRequired || sow.serviceScope?.fbBrandedContentRequired) && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md font-semibold text-xs">
                branded: {renderList(sow.serviceScope?.brandedContentDuration || sow.serviceScope?.fbBrandedContentDuration)}
              </span>
            )}
            {(sow.serviceScope?.discoveryRequired || sow.serviceScope?.youtubeDiscoveryRequired) && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md font-semibold text-xs">
                discovery: {renderList(sow.serviceScope?.discoveryDuration || sow.serviceScope?.youtubeDiscoveryDuration)}
              </span>
            )}
            {(sow.serviceScope?.whitelistingRequired || sow.serviceScope?.xWhitelistingRequired) && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md font-semibold text-xs">
                whitelisting: {renderList(sow.serviceScope?.whitelistingDuration || sow.serviceScope?.xWhitelistingDuration)}
              </span>
            )}

            {/* Empty State for services */}
            {!sow.serviceScope?.buyoutRequired &&
              !sow.serviceScope?.boostPostRequired && !sow.serviceScope?.boostRequired &&
              !sow.serviceScope?.addAdsRequired &&
              !sow.serviceScope?.paidPartnershipRequired &&
              !sow.serviceScope?.genCodeRequired &&
              !sow.serviceScope?.tiktokShopRequired &&
              !sow.serviceScope?.brandedContentRequired && !sow.serviceScope?.fbBrandedContentRequired &&
              !sow.serviceScope?.discoveryRequired && !sow.serviceScope?.youtubeDiscoveryRequired &&
              !sow.serviceScope?.whitelistingRequired && !sow.serviceScope?.xWhitelistingRequired && (
                <span className="text-slate-400 italic font-semibold">No special rights or whitelisting requested.</span>
              )}
          </div>
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
      )}
    </div>
  );
}
