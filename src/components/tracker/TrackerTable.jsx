import React, { useState } from "react";
import { Plus, GripVertical } from "lucide-react";
import Button from "../common/Button";
import { cn } from "../../utils/cn";

export default function TrackerTable({
  group,
  groupName,
  brief,
  trackerData,
  onUpdateTracker,
  onAddClick,
  onReplaceClick,
  hideAddButton = false,
  readOnly = false,
  allowStatusEdit = false,
  isDealsheetView = false,
  allowReorder = null
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragAllowedIndex, setDragAllowedIndex] = useState(null);
  const canReorder = allowReorder !== null ? allowReorder : !readOnly;
  const influencers = trackerData.influencers || [];
  const allSOWs = group?.sows?.length > 0
    ? group.sows
    : (brief.budgetOptions && brief.budgetOptions.length > 0 
      ? brief.budgetOptions.flatMap(opt => opt.scopeOfWorks || []) 
      : (brief.scopeOfWorks || []));
  const submittedSows = brief.internalStatus === "Submitted to Traffic" && brief.submittedSows 
    ? allSOWs.filter(s => brief.submittedSows.includes(s.id))
    : allSOWs;

  const updateInf = (id, field, value) => {
    const updated = influencers.map(inf => inf.id === id ? { ...inf, [field]: value } : inf);
    onUpdateTracker({ ...trackerData, influencers: updated });
  };

  const updateInfServiceField = (id, serviceName, field, value) => {
    const updated = influencers.map(inf => {
      if (inf.id === id) {
        let currentServiceObj = inf.services?.[serviceName];
        if (typeof currentServiceObj === 'string' || !currentServiceObj) {
          currentServiceObj = { 
            status: currentServiceObj === "ไม่รับ" ? "ไม่รับ" : (currentServiceObj ? "รับ" : ""), 
            price: currentServiceObj && currentServiceObj !== "ไม่รับ" ? currentServiceObj : "", 
            note: "" 
          };
        }
        let newValue = value;
        if (field === "price") {
           newValue = value.replace(/[^0-9]/g, "");
        }
        return {
          ...inf,
          services: {
            ...inf.services,
            [serviceName]: {
              ...currentServiceObj,
              [field]: newValue
            }
          }
        };
      }
      return inf;
    });
    onUpdateTracker({ ...trackerData, influencers: updated });
  };

  const STATUS_OPTIONS = allowStatusEdit ? [
    { value: "", label: "Status...", bg: "bg-slate-100", text: "text-slate-500" },
    { value: "Selected", label: "Selected", bg: "bg-emerald-55 text-[#047857] border-[#A7F3D0]", text: "text-[#047857] font-medium" },
    { value: "Rejected", label: "Rejected", bg: "bg-rose-50 text-rose-700 border-rose-200", text: "text-rose-750 font-medium" }
  ] : [
    { value: "", label: "Status...", bg: "bg-slate-100", text: "text-slate-500" },
    { value: "ทักแล้ว", label: "ทักแล้ว", bg: "bg-[#FDE68A]", text: "text-[#92400E]" },
    { value: "โทรแล้ว", label: "โทรแล้ว", bg: "bg-[#FFDCC8]", text: "text-[#8C3A10]" },
    { value: "ตอบแล้ว", label: "ตอบแล้ว", bg: "bg-[#D1FAE5]", text: "text-[#065F46]" },
    { value: "Selected", label: "Selected", bg: "bg-emerald-55 text-[#047857] border-[#A7F3D0]", text: "text-[#047857] font-bold" },
    { value: "ข้อมูลไม่ครบ", label: "ข้อมูลไม่ครบ", bg: "bg-[#DBEAFE]", text: "text-[#1E3A8A]" },
    { value: "ไม่รับงาน", label: "ไม่รับงาน", bg: "bg-[#4B5563]", text: "text-white" },
    { value: "Rejected", label: "Rejected", bg: "bg-rose-50 text-rose-700 border-rose-250", text: "text-rose-700 font-bold" },
    { value: "ถูกแทนที่", label: "ถูกแทนที่", bg: "bg-rose-100", text: "text-rose-700" },
  ];

  const getStatusColor = (statusValue) => {
    const opt = STATUS_OPTIONS.find(o => o.value === statusValue);
    if (!opt || !opt.value) return "bg-slate-100 text-slate-600 border-slate-200";
    return `${opt.bg} ${opt.text} border-transparent font-medium`;
  };

  const updateInfBrandSupport = (id, supportName, value) => {
    const updated = influencers.map(inf => inf.id === id ? { ...inf, brandSupports: { ...inf.brandSupports, [supportName]: value } } : inf);
    onUpdateTracker({ ...trackerData, influencers: updated });
  };

  const requiredServices = [];
  const addServiceColumns = (reqKey, durationKey, labelPrefix) => {
    const durations = new Set();
    let isRequired = false;

    if (group && group.sows) {
      group.sows.forEach(sow => {
        const sc = sow.serviceScope || {};
        if (sc[reqKey]) {
          isRequired = true;
          const d = Array.isArray(sc[durationKey]) ? sc[durationKey] : (sc[durationKey] ? [sc[durationKey]] : []);
          d.forEach(val => durations.add(val));
        }
      });
    }

    if (isRequired) {
      if (durations.size > 0) {
        Array.from(durations).forEach(d => {
          requiredServices.push({ 
            key: `${reqKey}_${d}`, 
            label: `${labelPrefix} (${d})`,
            baseReqKey: reqKey,
            durationKey: durationKey,
            durationVal: d
          });
        });
      } else {
        requiredServices.push({ 
          key: reqKey, 
          label: labelPrefix,
          baseReqKey: reqKey
        });
      }
    }
  };

  addServiceColumns("buyoutRequired", "buyoutDuration", "Buyout");
  addServiceColumns("boostPostRequired", "boostPostDuration", "Boost by Page");
  addServiceColumns("addAdsRequired", "addAdsDuration", "Add Ads");
  addServiceColumns("paidPartnershipRequired", "paidPartnershipDuration", "Paid Partnership");
  addServiceColumns("discoveryRequired", "discoveryDuration", "Youtube Discovery");
  addServiceColumns("genCodeRequired", "genCodeDuration", "Gen Code");
  addServiceColumns("tiktokShopRequired", "tiktokShopDuration", "TikTok Shop");
  addServiceColumns("brandedContentRequired", "brandedContentDuration", "FB Branded Content");
  addServiceColumns("whitelistingRequired", "whitelistingDuration", "X/Twitter Whitelisting");
  
  // Note: For custom SOW scopes like crossPostingRequired, you could also check brief.
  // We keep affiliate as a default if it was part of standard, but wait, the plan just said dynamic.
  // Actually, we can keep Affiliate statically or dynamically based on if it's there. 
  // We'll leave Affiliate off unless it's specifically needed, or we can just append it:
  // requiredServices.push({ key: "Affiliate", label: "Affiliate" }); // Not in serviceScope list currently.  
  const brandSupports = Array.isArray(brief.brandSupport) ? brief.brandSupport : [];
  const hasCompetitor = brief.competitor && brief.competitor.length > 0 && brief.competitor !== "<p><br></p>";

  if (isDealsheetView) {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 p-6 lg:px-8 bg-slate-50/50 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{groupName}</h2>
            <p className="text-sm text-slate-500 mt-1">Summary of selected influencers and costs</p>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 text-center w-[60px]">No.</th>
                <th className="px-6 py-3.5 min-w-[280px]">Influencer</th>
                <th className="px-6 py-3.5 min-w-[180px]">Scope of Work</th>
                <th className="px-6 py-3.5 min-w-[200px]">Service details & Costs</th>
                <th className="px-6 py-3.5 text-right min-w-[120px]">Raw Cost</th>
                {brandSupports.length > 0 && <th className="px-6 py-3.5 min-w-[155px]">Brand Support</th>}
                <th className="px-6 py-3.5 min-w-[200px]">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {influencers.map((inf, idx) => {
                const matchingSow = submittedSows.find(s => s.id === inf.scopeOfWork);
                const sowIdx = submittedSows.indexOf(matchingSow);
                const sowText = matchingSow ? `Scope ${sowIdx + 1}: ${matchingSow.name || matchingSow.contentType}` : "-";
                
                const activeServices = [];
                requiredServices.forEach(srv => {
                  let srvData = inf.services?.[srv.key];
                  if (srvData && (typeof srvData === 'object' ? srvData.status === "รับ" : srvData !== "ไม่รับ")) {
                    const price = typeof srvData === 'object' ? srvData.price : srvData;
                    activeServices.push({ label: srv.label, price });
                  }
                });

                return (
                  <tr key={inf.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-4 py-4.5 text-slate-500 text-center font-medium">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <img src={inf.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(inf.accountName || "New")}&background=random`} alt="" className="h-10 w-10 rounded-full object-cover bg-slate-100" />
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">
                            {inf.accountName || "New Influencer"}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {inf.follower && (
                              <span className="text-xs text-slate-500">
                                {inf.follower} Followers
                              </span>
                            )}
                            {inf.channel && (
                              <span className="text-[10px] font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5">
                                {inf.channel}
                              </span>
                            )}
                          </div>
                          {inf.accountLink && (
                            <a href={inf.accountLink} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline block mt-1 max-w-[200px] truncate">
                              {inf.accountLink}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-slate-700 text-xs font-medium">
                      {sowText}
                    </td>
                    <td className="px-6 py-4.5 text-xs text-slate-700">
                      {activeServices.length > 0 ? (
                        <div className="space-y-1.5">
                          {activeServices.map((as, asIdx) => (
                            <div key={asIdx} className="flex items-center justify-between gap-4">
                              <span className="text-slate-500">• {as.label}:</span>
                              <span className="font-semibold text-slate-800">฿{Number(as.price || 0).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4.5 text-right font-bold text-slate-900 text-sm">
                      {inf.rawCost ? inf.rawCost : "-"}
                    </td>
                    {brandSupports.length > 0 && (
                      <td className="px-6 py-4.5 text-slate-700 text-xs">
                        <div className="space-y-1 text-left">
                          {brandSupports.map(bs => {
                            const val = inf.brandSupports?.[bs];
                            if (!val) return null;
                            return (
                              <div key={bs} className="flex gap-1.5 items-center">
                                <span className="text-slate-400">{bs}:</span>
                                <span className="font-semibold">{val}</span>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4.5 text-slate-500 text-xs min-w-[200px] max-w-[300px] whitespace-pre-wrap leading-relaxed">
                      {inf.note || inf.detail || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 p-6 lg:px-8 bg-slate-50/50 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{groupName}</h2>
          <p className="text-sm text-slate-500 mt-1">Influencers in this group</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {!hideAddButton && (
            <Button onClick={() => onAddClick(groupName)}><Plus className="h-4 w-4" /> Add Influencer</Button>
          )}
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
            <thead className="bg-slate-50">
              <tr>
                <th colSpan="2" className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-violet-50 sticky left-0 z-20 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]">Influencer Detail</th>
                <th className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-emerald-50/50">Status</th>
                <th className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-violet-50/50">Contact</th>
                <th colSpan="3" className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-blue-50/50">Payment</th>
                {requiredServices.length > 0 && <th colSpan={requiredServices.length} className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-amber-50/50">Boost by Page</th>}
                <th colSpan="2" className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-indigo-50/50">SOW & Condition</th>
                {brandSupports.length > 0 && <th colSpan={brandSupports.length} className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-rose-50/50">Brand Support</th>}
                {hasCompetitor && <th className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-orange-50/50">Competitor</th>}
                <th colSpan="2" className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-slate-100/50">Note</th>
              </tr>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-3 py-2 border-r border-slate-200 w-[50px] min-w-[50px] sticky left-0 z-20 bg-slate-50">No.</th>
                <th className="px-5 py-4 border-r border-slate-200 w-[280px] min-w-[280px] sticky left-[50px] z-20 bg-slate-50 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]">Influencer</th>
                <th className="px-3 py-2 border-r border-slate-200 min-w-[120px]">Status</th>
                <th className="px-3 py-2 border-r border-slate-200 min-w-[280px]">Contact</th>
                <th className="px-3 py-2 border-r border-slate-200">Raw Cost</th>
                <th className="px-3 py-2 border-r border-slate-200">Credit Term (Days)</th>
                <th className="px-3 py-2 border-r border-slate-200">ชำระเงินในนาม</th>
                {requiredServices.map(srv => <th key={srv.key} className="px-3 py-2 border-r border-slate-200">{srv.label}</th>)}
                <th className="px-3 py-2 border-r border-slate-200 min-w-[200px]">Scope of Work</th>
                <th className="px-3 py-2 border-r border-slate-200 min-w-[250px]">Condition</th>
                {brandSupports.map(bs => <th key={bs} className="px-3 py-2 border-r border-slate-200">{bs}</th>)}
                {hasCompetitor && <th className="px-3 py-2 border-r border-slate-200">Competitor Note</th>}
                <th className="px-3 py-2 border-r border-slate-200 min-w-[200px]">Detail</th>
                <th className="px-3 py-2 min-w-[200px]">Additional Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {influencers.length === 0 ? (
                <tr>
                  <td colSpan="100%" className="px-4 py-8 text-center text-slate-500">
                    No influencers added yet. Click "Add Influencer" to start tracking.
                  </td>
                </tr>
              ) : (
                influencers.map((inf, idx) => (
                  <tr 
                    key={inf.id} 
                    draggable={canReorder && dragAllowedIndex === idx}
                    onDragStart={(e) => {
                      setDraggedIndex(idx);
                      e.currentTarget.style.opacity = "0.4";
                    }}
                    onDragEnd={(e) => {
                      setDraggedIndex(null);
                      setDragAllowedIndex(null);
                      e.currentTarget.style.opacity = "";
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDragEnter={(e) => {
                      if (draggedIndex !== null && draggedIndex !== idx) {
                        e.currentTarget.classList.add("bg-violet-50/50");
                      }
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove("bg-violet-50/50");
                    }}
                    onDrop={(e) => {
                      e.currentTarget.classList.remove("bg-violet-50/50");
                      if (draggedIndex === null || draggedIndex === idx) return;
                      const reordered = [...influencers];
                      const [draggedItem] = reordered.splice(draggedIndex, 1);
                      reordered.splice(idx, 0, draggedItem);
                      onUpdateTracker({ ...trackerData, influencers: reordered });
                    }}
                    className={cn(
                      "group transition",
                      canReorder && "cursor-move",
                      inf.contactStatus === "Selected" && "bg-[#ECFDF5] hover:bg-[#D1FAE5]",
                      inf.contactStatus === "Rejected" && "bg-rose-50/50 hover:bg-rose-100/50 text-rose-700 decoration-rose-450 decoration-1",
                      inf.contactStatus === "ถูกแทนที่" && "bg-slate-100 opacity-70",
                      inf.contactStatus !== "Selected" && inf.contactStatus !== "Rejected" && inf.contactStatus !== "ถูกแทนที่" && "hover:bg-slate-50"
                    )}
                  >
                    <td className={cn(
                      "px-3 py-2 border-r border-slate-100 text-slate-500 text-center sticky left-0 z-10 w-[50px] min-w-[50px] transition",
                      inf.contactStatus === "Selected" && "bg-[#ECFDF5] group-hover:bg-[#D1FAE5]",
                      inf.contactStatus === "Rejected" && "bg-[#FFF5F5] group-hover:bg-[#FEE2E2] text-rose-700",
                      inf.contactStatus === "ถูกแทนที่" && "bg-slate-100 group-hover:bg-slate-200",
                      inf.contactStatus !== "Selected" && inf.contactStatus !== "Rejected" && inf.contactStatus !== "ถูกแทนที่" && "bg-white group-hover:bg-slate-50"
                    )}>
                      <div className="flex items-center justify-center gap-0.5">
                        {canReorder && (
                          <GripVertical 
                            className="h-3 w-3 text-slate-400 cursor-grab active:cursor-grabbing flex-shrink-0"
                            onMouseDown={() => setDragAllowedIndex(idx)}
                            onMouseUp={() => setDragAllowedIndex(null)}
                          />
                        )}
                        <span>{idx + 1}</span>
                      </div>
                    </td>
                    <td className={cn(
                      "px-5 py-3 border-r border-slate-100 min-w-[280px] w-[280px] sticky left-[50px] z-10 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)] transition",
                      inf.contactStatus === "Selected" && "bg-[#ECFDF5] group-hover:bg-[#D1FAE5]",
                      inf.contactStatus === "Rejected" && "bg-rose-50/50 hover:bg-rose-100/50 text-rose-700 decoration-rose-450 decoration-1",
                      inf.contactStatus === "ถูกแทนที่" && "bg-slate-100 opacity-70",
                      inf.contactStatus !== "Selected" && inf.contactStatus !== "Rejected" && inf.contactStatus !== "ถูกแทนที่" && "bg-white hover:bg-slate-50"
                    )}>
                      <div className="flex gap-3 text-left w-full">
                        <img src={inf.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(inf.accountName || "New")}&background=random`} alt="" className="h-11 w-11 rounded-full object-cover shrink-0" />
                        <div className="flex-1 min-w-0 flex flex-col gap-1.5 justify-center">
                          {readOnly ? (
                            <span className={cn(
                              "font-semibold text-[13px] px-1.5 py-0.5",
                              inf.contactStatus === "Rejected" && "line-through text-rose-700 decoration-rose-500 decoration-1",
                              inf.contactStatus === "ถูกแทนที่" && "line-through text-slate-500",
                              inf.contactStatus !== "Rejected" && inf.contactStatus !== "ถูกแทนที่" && "text-slate-900"
                            )}>
                              {inf.accountName || "New Influencer"}
                            </span>
                          ) : (
                            <input 
                              type="text" 
                              value={inf.accountName || ""} 
                              disabled={readOnly} 
                              onChange={e => updateInf(inf.id, "accountName", e.target.value)} 
                              placeholder="Account Name (@handle)" 
                              className={cn(
                                "w-full font-semibold text-[13px] bg-transparent px-1.5 py-1 rounded outline-none border border-transparent placeholder:text-slate-300",
                                inf.contactStatus === "Rejected" && "line-through text-rose-700 decoration-rose-500 decoration-1",
                                inf.contactStatus === "ถูกแทนที่" && "line-through text-slate-500",
                                inf.contactStatus !== "Rejected" && inf.contactStatus !== "ถูกแทนที่" && "text-slate-900 hover:text-[#6D5DF6]"
                              )} 
                            />
                          )}
                          {inf.replacedFor && (
                            <div className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded w-fit border border-rose-100 mt-1 mb-0.5">
                              แทนที่: {inf.replacedFor}
                            </div>
                          )}
                          <div className="flex items-center gap-2 w-full">
                            {readOnly ? (
                              <span className={cn(
                                "text-xs text-slate-500 px-1.5 py-0.5",
                                inf.contactStatus === "Rejected" && "line-through"
                              )}>
                                {inf.follower ? `${Number(inf.follower.replace(/[^0-9]/g, '') || inf.follower).toLocaleString()} Followers` : "-"}
                              </span>
                            ) : (
                              <input type="text" value={inf.follower || ""} disabled={readOnly} onChange={e => updateInf(inf.id, "follower", e.target.value)} placeholder="Followers" className={cn("w-20 text-xs text-slate-500 bg-white px-1.5 py-1 rounded outline-none border border-slate-200 focus:border-[#6D5DF6] placeholder:text-slate-300", inf.contactStatus === "Rejected" && "line-through")} />
                            )}
                            {readOnly ? (
                              inf.channel && (
                                <span className={cn(
                                  "text-[10px] font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5",
                                  inf.contactStatus === "Rejected" && "line-through"
                                )}>
                                  {inf.channel}
                                </span>
                              )
                            ) : (
                              <select value={inf.channel || ""} disabled={readOnly} onChange={e => updateInf(inf.id, "channel", e.target.value)} className={cn("text-[10px] font-medium text-slate-600 bg-white border border-slate-200 rounded px-1.5 py-1 outline-none cursor-pointer focus:border-[#6D5DF6]", inf.contactStatus === "Rejected" && "line-through")}>
                                <option value="">Platform</option>
                                <option value="Instagram">IG</option>
                                <option value="TikTok">TT</option>
                                <option value="Facebook">FB</option>
                                <option value="YouTube">YT</option>
                                <option value="X">X</option>
                                <option value="Other">Other</option>
                              </select>
                            )}
                          </div>
                          {readOnly ? (
                            inf.accountLink && (
                              <a href={inf.accountLink} target="_blank" rel="noopener noreferrer" className={cn("w-full text-[10px] text-blue-500 hover:underline px-1.5 py-0.5 block truncate max-w-[200px]", inf.contactStatus === "Rejected" && "line-through")}>
                                {inf.accountLink}
                              </a>
                            )
                          ) : (
                            <input type="text" value={inf.accountLink || ""} disabled={readOnly} onChange={e => updateInf(inf.id, "accountLink", e.target.value)} placeholder="Link URL" className={cn("w-full text-[10px] text-blue-500 bg-white px-1.5 py-1 rounded outline-none border border-slate-200 focus:border-[#6D5DF6] placeholder:text-slate-300", inf.contactStatus === "Rejected" && "line-through")} />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-center align-middle relative">
                      <select 
                        value={inf.contactStatus || ""} 
                        disabled={readOnly && !allowStatusEdit} 
                        onChange={e => updateInf(inf.id, "contactStatus", e.target.value)}
                        className={cn(
                          "w-full rounded-full border px-2 py-1 outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#6D5DF6]/50 text-[11px] text-center cursor-pointer appearance-none",
                          getStatusColor(inf.contactStatus)
                        )}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value} className="bg-white text-slate-900 font-normal">{opt.label}</option>
                        ))}
                      </select>
                      {inf.contactStatus === "Selected" && !readOnly && onReplaceClick && (
                        <button 
                          onClick={() => onReplaceClick(groupName, inf.id, inf.accountName || "Unknown")}
                          className="mt-1.5 text-[10px] font-medium text-rose-500 hover:text-rose-600 underline block w-full text-center"
                        >
                          Replace
                        </button>
                      )}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs min-w-[280px] align-top">
                      {readOnly ? (
                        <div className="flex flex-col gap-1.5">
                          {(inf.contacts || []).map((c, cIdx) => (
                            <div key={cIdx} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                              <span className="font-semibold text-slate-500 bg-slate-100 px-1 rounded text-[10px]">
                                {c.type === "Tel" ? "เบอร์" : c.type === "Line" ? "Line" : "Email"}
                              </span>
                              <span className="font-medium">{c.value}</span>
                              {c.name && <span className="text-slate-400">({c.name})</span>}
                            </div>
                          ))}
                          {(!inf.contacts || inf.contacts.length === 0) && (
                            <span className={cn(inf.contactStatus === "Rejected" && "line-through text-rose-700")}>
                              {inf.contact || "-"}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {(() => {
                            const currentContacts = inf.contacts || (inf.contact ? [{ type: "Tel", value: inf.contact, name: "" }] : []);
                            return (
                              <>
                                <div className="space-y-1.5">
                                  {currentContacts.map((c, cIdx) => (
                                    <div key={cIdx} className="flex items-center gap-1">
                                      <select
                                        value={c.type}
                                        onChange={(e) => {
                                          const next = [...currentContacts];
                                          next[cIdx] = { ...c, type: e.target.value };
                                          updateInf(inf.id, "contacts", next);
                                          const summary = next.filter(x => x.value.trim()).map(x => `${x.type === "Tel" ? "เบอร์" : x.type}: ${x.value}${x.name ? ` (${x.name})` : ""}`).join(", ");
                                          updateInf(inf.id, "contact", summary);
                                        }}
                                        className="rounded border border-slate-200 px-1.5 py-1 text-[11px] outline-none focus:border-[#6D5DF6] bg-white w-[65px]"
                                      >
                                        <option value="Tel">เบอร์</option>
                                        <option value="Line">Line</option>
                                        <option value="Email">Email</option>
                                      </select>
                                      <input
                                        type="text"
                                        value={c.value}
                                        placeholder="ข้อมูลติดต่อ"
                                        onChange={(e) => {
                                          const next = [...currentContacts];
                                          next[cIdx] = { ...c, value: e.target.value };
                                          updateInf(inf.id, "contacts", next);
                                          const summary = next.filter(x => x.value.trim()).map(x => `${x.type === "Tel" ? "เบอร์" : x.type}: ${x.value}${x.name ? ` (${x.name})` : ""}`).join(", ");
                                          updateInf(inf.id, "contact", summary);
                                        }}
                                        className="rounded border border-slate-200 px-1.5 py-1 text-[11px] outline-none focus:border-[#6D5DF6] bg-white w-[90px]"
                                      />
                                      <input
                                        type="text"
                                        value={c.name}
                                        placeholder="ติดต่อใคร"
                                        onChange={(e) => {
                                          const next = [...currentContacts];
                                          next[cIdx] = { ...c, name: e.target.value };
                                          updateInf(inf.id, "contacts", next);
                                          const summary = next.filter(x => x.value.trim()).map(x => `${x.type === "Tel" ? "เบอร์" : x.type}: ${x.value}${x.name ? ` (${x.name})` : ""}`).join(", ");
                                          updateInf(inf.id, "contact", summary);
                                        }}
                                        className="rounded border border-slate-200 px-1.5 py-1 text-[11px] outline-none focus:border-[#6D5DF6] bg-white w-[90px]"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const next = currentContacts.filter((_, i) => i !== cIdx);
                                          updateInf(inf.id, "contacts", next);
                                          const summary = next.filter(x => x.value.trim()).map(x => `${x.type === "Tel" ? "เบอร์" : x.type}: ${x.value}${x.name ? ` (${x.name})` : ""}`).join(", ");
                                          updateInf(inf.id, "contact", summary);
                                        }}
                                        className="text-slate-400 hover:text-rose-500 hover:bg-slate-100 rounded p-1 transition"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ))}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = [...currentContacts, { type: "Tel", value: "", name: "" }];
                                    updateInf(inf.id, "contacts", next);
                                  }}
                                  className="w-fit flex items-center justify-center gap-1 py-1 px-2 border border-dashed border-slate-300 rounded text-[10px] font-bold text-slate-500 hover:bg-slate-50 hover:text-[#6D5DF6] hover:border-[#6D5DF6] transition"
                                >
                                  + เพิ่มช่องทางติดต่อ
                                </button>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs">
                      {readOnly ? (
                        <span>{inf.rawCost || "-"}</span>
                      ) : (
                        <input type="text" value={inf.rawCost || ""} disabled={readOnly} onChange={e => updateInf(inf.id, "rawCost", e.target.value)} className="w-24 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] bg-white" />
                      )}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs">
                      {readOnly ? (
                        <span>{inf.creditTerm ? `${inf.creditTerm} วัน` : "-"}</span>
                      ) : (
                        <input type="text" value={inf.creditTerm || ""} disabled={readOnly} onChange={e => updateInf(inf.id, "creditTerm", e.target.value)} className="w-20 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] bg-white" placeholder="วัน" />
                      )}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs">
                      {readOnly ? (
                        <span>{inf.paymentType || "-"}</span>
                      ) : (
                        <select value={inf.paymentType || ""} disabled={readOnly} onChange={e => updateInf(inf.id, "paymentType", e.target.value)} className="w-24 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] bg-white">
                          <option value="">Select...</option>
                          <option value="บุคคล">บุคคล</option>
                          <option value="บริษัท">บริษัท</option>
                        </select>
                      )}
                    </td>
                    {requiredServices.map(srv => {
                      let isIrrelevant = false;
                      if (inf.scopeOfWork) {
                        const mySow = submittedSows.find(s => s.id === inf.scopeOfWork);
                        if (mySow && mySow.serviceScope) {
                          const isReq = !!mySow.serviceScope[srv.baseReqKey];
                          if (srv.durationVal) {
                            const sowDurations = Array.isArray(mySow.serviceScope[srv.durationKey]) 
                              ? mySow.serviceScope[srv.durationKey] 
                              : (mySow.serviceScope[srv.durationKey] ? [mySow.serviceScope[srv.durationKey]] : []);
                            
                            if (!isReq || !sowDurations.includes(srv.durationVal)) {
                              isIrrelevant = true;
                            }
                          } else {
                            if (!isReq) isIrrelevant = true;
                          }
                        }
                      }

                      if (isIrrelevant) {
                        return (
                          <td key={srv.key} className="border-r border-slate-700 min-w-[150px] bg-[#111111]">
                          </td>
                        );
                      }

                      let srvData = inf.services?.[srv.key];
                      if (typeof srvData === 'string' || !srvData) {
                        srvData = { 
                          status: srvData === "ไม่รับ" ? "ไม่รับ" : (srvData ? "รับ" : ""), 
                          price: srvData && srvData !== "ไม่รับ" ? srvData : "", 
                          note: "" 
                        };
                      }
                      return (
                        <td key={srv.key} className="px-3 py-2 border-r border-slate-100 min-w-[150px] align-top text-xs text-slate-750">
                          {readOnly ? (
                            <div className="flex flex-col gap-1">
                              <div className="font-medium">
                                {srvData.status === "รับ" ? (
                                  <span className="text-emerald-650 font-semibold">รับ</span>
                                ) : srvData.status === "ไม่รับ" ? (
                                  <span className="text-rose-500 font-semibold">ไม่รับ</span>
                                ) : (
                                  <span className="text-slate-400">-</span>
                                )}
                              </div>
                              {srvData.status === "รับ" && srvData.price && (
                                <div className="text-slate-700 font-medium">฿{Number(srvData.price).toLocaleString()}</div>
                              )}
                              {srvData.note && (
                                <div className="text-[10px] text-slate-500 italic bg-slate-50/50 p-1.5 rounded border border-slate-100 whitespace-pre-wrap">{srvData.note}</div>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2">
                              <select value={srvData.status || ""} onChange={e => updateInfServiceField(inf.id, srv.key, "status", e.target.value)} className="w-full rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] text-xs bg-white">
                                <option value="">เลือกสถานะ</option>
                                <option value="รับ">รับ</option>
                                <option value="ไม่รับ">ไม่รับ</option>
                              </select>
                              {srvData.status === "รับ" && (
                                <input type="text" value={srvData.price || ""} onChange={e => updateInfServiceField(inf.id, srv.key, "price", e.target.value)} className="w-full rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] text-xs bg-white" placeholder="ราคา" />
                              )}
                              <textarea rows={1} value={srvData.note || ""} onChange={e => updateInfServiceField(inf.id, srv.key, "note", e.target.value)} className="w-full rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] resize-y text-[10px] bg-white" placeholder="Note..."></textarea>
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs">
                      {readOnly ? (
                        (() => {
                          const matchingSow = submittedSows.find(s => s.id === inf.scopeOfWork);
                          const idx = submittedSows.indexOf(matchingSow);
                          return matchingSow ? `Scope ${idx + 1}: ${matchingSow.name}` : "-";
                        })()
                      ) : (
                        <select value={inf.scopeOfWork || ""} disabled={true} onChange={e => updateInf(inf.id, "scopeOfWork", e.target.value)} className="w-full min-w-[180px] rounded border border-slate-200 px-2 py-1 outline-none text-xs bg-slate-50 text-slate-500 cursor-not-allowed">
                          <option value="">Select SOW</option>
                          {submittedSows.map(sow => (
                            <option key={sow.id} value={sow.id}>Scope {submittedSows.indexOf(sow) + 1}: {sow.name}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs min-w-[220px] max-w-[300px] whitespace-pre-wrap leading-relaxed">
                      {readOnly ? (
                        inf.condition || "-"
                      ) : (
                        <textarea rows={6} value={inf.condition || ""} disabled={readOnly} onChange={e => updateInf(inf.id, "condition", e.target.value)} className="w-full min-w-[220px] rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] resize-y text-xs bg-white"></textarea>
                      )}
                    </td>
                    {brandSupports.map(bs => (
                      <td key={bs} className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs text-center">
                        {readOnly ? (
                          inf.brandSupports?.[bs] || "-"
                        ) : (
                          <input type="text" value={inf.brandSupports?.[bs] || ""} onChange={e => updateInfBrandSupport(inf.id, bs, e.target.value)} className="w-24 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] bg-white" />
                        )}
                      </td>
                    ))}
                    {hasCompetitor && (
                      <td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs min-w-[150px] whitespace-pre-wrap">
                        {readOnly ? (
                          inf.competitorNote || "-"
                        ) : (
                          <textarea rows={3} value={inf.competitorNote || ""} disabled={readOnly} onChange={e => updateInf(inf.id, "competitorNote", e.target.value)} className="w-full min-w-[150px] rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] resize-y text-xs bg-white"></textarea>
                        )}
                      </td>
                    )}
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs min-w-[180px] whitespace-pre-wrap">
                      {readOnly ? (
                        inf.detail || "-"
                      ) : (
                        <textarea rows={3} value={inf.detail || ""} disabled={readOnly} onChange={e => updateInf(inf.id, "detail", e.target.value)} className="w-full min-w-[180px] rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] resize-y text-xs bg-white"></textarea>
                      )}
                    </td>
                    <td className="px-3 py-2 border-slate-100 text-slate-700 text-xs min-w-[180px] whitespace-pre-wrap">
                      {readOnly ? (
                        inf.note || "-"
                      ) : (
                        <textarea rows={3} value={inf.note || ""} disabled={readOnly} onChange={e => updateInf(inf.id, "note", e.target.value)} className="w-full min-w-[180px] rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] resize-y text-xs bg-white"></textarea>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
      </div>
    </div>
  );
}
