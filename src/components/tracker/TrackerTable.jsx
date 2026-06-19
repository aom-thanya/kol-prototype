import React, { useState } from "react";
import { Plus, GripVertical, ExternalLink, ChevronUp, ChevronDown } from "lucide-react";
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
  const [isExpanded, setIsExpanded] = useState(true);
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

  const updateInfQuestionAnswer = (id, idx, value) => {
    const updated = influencers.map(inf => {
      if (inf.id === id) {
        const answers = [...(inf.questionAnswers || [])];
        answers[idx] = value;
        return { ...inf, questionAnswers: answers };
      }
      return inf;
    });
    onUpdateTracker({ ...trackerData, influencers: updated });
  };

  const STATUS_OPTIONS = [
    { value: "", label: "Status...", bg: "bg-slate-100", text: "text-slate-500" },
    { value: "ทักแล้ว", label: "ทักแล้ว", bg: "bg-[#FDE68A]", text: "text-[#92400E]" },
    { value: "โทรแล้ว", label: "โทรแล้ว", bg: "bg-[#FFDCC8]", text: "text-[#8C3A10]" },
    { value: "ตอบแล้ว", label: "ตอบแล้ว", bg: "bg-[#D1FAE5]", text: "text-[#065F46]" },
    { value: "Done", label: "Done", bg: "bg-[#166534]", text: "text-white" },
    { value: "ข้อมูลไม่ครบ", label: "ข้อมูลไม่ครบ", bg: "bg-[#DBEAFE]", text: "text-[#1E3A8A]" },
    { value: "ไม่รับงาน", label: "ไม่รับงาน", bg: "bg-[#4B5563]", text: "text-white" }
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
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900">{groupName}</h2>
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
          <p className="text-sm text-slate-500 mt-1">Influencers in this group</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {!hideAddButton && (
            <Button onClick={() => onAddClick(groupName)}><Plus className="h-4 w-4" /> Add Influencer</Button>
          )}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-slate-200/50 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 transition-colors shrink-0 shadow-sm"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
            <thead className="bg-slate-50">
              <tr>
                <th colSpan="2" className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-700 text-center bg-slate-100 sticky left-0 z-20 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]">Influencer Detail</th>
                <th colSpan="2" className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-700 text-center bg-slate-100">Status & Lot</th>
                <th className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-700 text-center bg-slate-100">Contact</th>
                <th colSpan="3" className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-700 text-center bg-slate-100">Payment</th>
                {requiredServices.length > 0 && <th colSpan={requiredServices.length} className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-700 text-center bg-slate-100">Boost by Page</th>}
                <th colSpan="2" className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-700 text-center bg-slate-100">SOW & Condition</th>
                {group.questions && group.questions.length > 0 && <th colSpan={group.questions.length} className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-700 text-center bg-slate-100">Questions</th>}
                {brandSupports.length > 0 && <th colSpan={brandSupports.length} className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-700 text-center bg-slate-100">Brand Support</th>}
                {hasCompetitor && <th className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-700 text-center bg-slate-100">Competitor</th>}
                <th colSpan="2" className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-700 text-center bg-slate-100">Note</th>
              </tr>
              <tr className="border-b border-slate-200 bg-[#F8FAFC] text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                <th className="px-3 py-3 border-r border-slate-200 w-[50px] min-w-[50px] sticky left-0 z-20 bg-[#F8FAFC]">No.</th>
                <th className="px-5 py-3 border-r border-slate-200 w-[280px] min-w-[280px] sticky left-[50px] z-20 bg-[#F8FAFC] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]">Influencer</th>
                <th className="px-3 py-2 border-r border-slate-200 min-w-[120px]">Status</th>
                <th className="px-3 py-2 border-r border-slate-200 min-w-[80px] text-center">Lot</th>
                <th className="px-3 py-2 border-r border-slate-200 min-w-[280px]">Contact</th>
                <th className="px-3 py-2 border-r border-slate-200">Raw Cost</th>
                <th className="px-3 py-2 border-r border-slate-200">Credit Term (Days)</th>
                <th className="px-3 py-2 border-r border-slate-200">ชำระเงินในนาม</th>
                {requiredServices.map(srv => <th key={srv.key} className="px-3 py-2 border-r border-slate-200">{srv.label}</th>)}
                <th className="px-3 py-2 border-r border-slate-200 min-w-[200px]">Scope of Work</th>
                <th className="px-3 py-2 border-r border-slate-200 min-w-[400px]">Condition</th>
                {(group.questions || []).map((q, idx) => (
                  <th key={idx} className="px-3 py-2 border-r border-slate-200 min-w-[200px] whitespace-normal leading-relaxed">{q}</th>
                ))}
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
                      "group transition relative",
                      canReorder && "cursor-move",
                      inf.contactStatus === "Selected" && "bg-[#ECFDF5] hover:bg-[#D1FAE5]",
                      inf.contactStatus === "Rejected" && "bg-rose-50/50 hover:bg-rose-100/50 text-rose-700 decoration-rose-450 decoration-1",
                      inf.contactStatus === "ถูกแทนที่" && "bg-slate-100 opacity-70",
                      inf.contactStatus === "ไม่รับงาน" && "opacity-50 grayscale hover:opacity-60 bg-slate-50",
                      inf.contactStatus !== "Selected" && inf.contactStatus !== "Rejected" && inf.contactStatus !== "ถูกแทนที่" && inf.contactStatus !== "ไม่รับงาน" && "hover:bg-slate-50"
                    )}
                  >
                    <td className={cn(
                      "px-3 py-2 border-r border-slate-100 text-slate-500 text-center sticky left-0 z-10 w-[50px] min-w-[50px] transition",
                      inf.contactStatus === "Selected" && "bg-[#ECFDF5] group-hover:bg-[#D1FAE5]",
                      inf.contactStatus === "Rejected" && "bg-[#FFF5F5] group-hover:bg-[#FEE2E2] text-rose-700",
                      inf.contactStatus === "ถูกแทนที่" && "bg-slate-100 group-hover:bg-slate-200",
                      inf.contactStatus === "ไม่รับงาน" && "bg-slate-50",
                      inf.contactStatus !== "Selected" && inf.contactStatus !== "Rejected" && inf.contactStatus !== "ถูกแทนที่" && inf.contactStatus !== "ไม่รับงาน" && "bg-white group-hover:bg-slate-50"
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
                      inf.contactStatus === "ไม่รับงาน" && "bg-slate-50",
                      inf.contactStatus !== "Selected" && inf.contactStatus !== "Rejected" && inf.contactStatus !== "ถูกแทนที่" && inf.contactStatus !== "ไม่รับงาน" && "bg-white hover:bg-slate-50"
                    )}>
                      <div className="flex gap-3 text-left w-full">
                        <img src={inf.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(inf.accountName || "New")}&background=random`} alt="" className="h-11 w-11 rounded-full object-cover shrink-0" />
                        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                          {readOnly ? (
                            <>
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "font-semibold text-[13px] truncate",
                                  inf.contactStatus === "Rejected" && "line-through text-rose-700 decoration-rose-500 decoration-1",
                                  inf.contactStatus === "ถูกแทนที่" && "line-through text-slate-500",
                                  inf.contactStatus !== "Rejected" && inf.contactStatus !== "ถูกแทนที่" && "text-slate-900"
                                )}>
                                  {inf.accountName || "New Influencer"}
                                </span>
                                {inf.accountLink && (
                                  <a href={inf.accountLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#6D5DF6] transition-colors shrink-0">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {inf.channel && (
                                  <span className={cn(
                                    "text-[10px] font-bold tracking-wider text-slate-700 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 uppercase shrink-0",
                                    inf.contactStatus === "Rejected" && "line-through text-rose-400 border-rose-200 bg-rose-50"
                                  )}>
                                    {inf.channel === "Instagram" ? "IG" : inf.channel === "TikTok" ? "TT" : inf.channel === "Facebook" ? "FB" : inf.channel === "YouTube" ? "YT" : inf.channel === "Lemon8" ? "L8" : inf.channel}
                                  </span>
                                )}
                                <span className={cn(
                                  "text-xs text-slate-500 truncate",
                                  inf.contactStatus === "Rejected" && "line-through"
                                )}>
                                  {inf.follower ? `${isNaN(inf.follower) ? inf.follower : Number(inf.follower).toLocaleString()}${String(inf.follower).toLowerCase().includes('follower') ? '' : ' Followers'}` : "-"}
                                </span>
                              </div>
                              {inf.replacedFor && (
                                <div className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded w-fit border border-rose-100 mt-0.5">
                                  แทนที่: {inf.replacedFor}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col gap-1.5 w-full pr-1">
                              <input 
                                type="text" 
                                value={inf.accountName || ""} 
                                onChange={e => updateInf(inf.id, "accountName", e.target.value)} 
                                placeholder="@username" 
                                className={cn(
                                  "w-full font-semibold text-[13px] bg-slate-50 hover:bg-white px-2 py-1 rounded outline-none border border-transparent focus:border-[#6D5DF6] placeholder:text-slate-400 transition-colors",
                                  inf.contactStatus === "Rejected" && "line-through text-rose-700 decoration-rose-500 decoration-1",
                                  inf.contactStatus === "ถูกแทนที่" && "line-through text-slate-500",
                                  inf.contactStatus !== "Rejected" && inf.contactStatus !== "ถูกแทนที่" && "text-slate-900"
                                )} 
                              />
                              <div className="flex items-center gap-1.5 w-full">
                                <select 
                                  value={inf.channel || ""} 
                                  onChange={e => updateInf(inf.id, "channel", e.target.value)} 
                                  className={cn("w-[64px] shrink-0 text-[10px] font-bold tracking-wider text-slate-700 bg-slate-50 hover:bg-white border border-transparent focus:border-[#6D5DF6] rounded px-1 py-1 outline-none cursor-pointer uppercase transition-colors", inf.contactStatus === "Rejected" && "line-through")}
                                >
                                  <option value="">Plat</option>
                                  <option value="Instagram">IG</option>
                                  <option value="TikTok">TT</option>
                                  <option value="Facebook">FB</option>
                                  <option value="YouTube">YT</option>
                                  <option value="X">X</option>
                                  <option value="Lemon8">Lemon8</option>
                                  <option value="Other">Other</option>
                                </select>
                                <input 
                                  type="text" 
                                  value={inf.follower || ""} 
                                  onChange={e => updateInf(inf.id, "follower", e.target.value)} 
                                  placeholder="Followers" 
                                  className={cn("w-full flex-1 min-w-0 text-xs text-slate-600 bg-slate-50 hover:bg-white px-2 py-1 rounded outline-none border border-transparent focus:border-[#6D5DF6] placeholder:text-slate-400 transition-colors", inf.contactStatus === "Rejected" && "line-through")} 
                                />
                              </div>
                              <div className="flex items-center gap-1.5 w-full">
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <input 
                                  type="text" 
                                  value={inf.accountLink || ""} 
                                  onChange={e => updateInf(inf.id, "accountLink", e.target.value)} 
                                  placeholder="Profile URL" 
                                  className={cn("w-full flex-1 min-w-0 text-[11px] text-blue-500 bg-slate-50 hover:bg-white px-2 py-1 rounded outline-none border border-transparent focus:border-[#6D5DF6] placeholder:text-slate-400 transition-colors", inf.contactStatus === "Rejected" && "line-through")} 
                                />
                              </div>
                              {inf.replacedFor && (
                                <div className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded w-fit border border-rose-100">
                                  แทนที่: {inf.replacedFor}
                                </div>
                              )}
                            </div>
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
                    <td className="px-3 py-2 border-r border-slate-100 text-center align-middle">
                      {inf.lot ? (
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold tracking-wider">{inf.lot}</span>
                      ) : (
                        <span className="text-slate-300">-</span>
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
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs min-w-[200px] max-w-[280px] whitespace-normal">
                      <div className="text-slate-600 font-medium leading-relaxed">
                        {(() => {
                          const matchingSow = submittedSows.find(s => s.id === inf.scopeOfWork);
                          const idx = submittedSows.indexOf(matchingSow);
                          return matchingSow ? `Scope ${idx + 1}: ${matchingSow.name}` : "-";
                        })()}
                      </div>
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs min-w-[400px] max-w-[600px] whitespace-pre-wrap leading-relaxed">
                      {readOnly ? (
                        inf.condition || "-"
                      ) : (
                        <textarea rows={6} value={inf.condition || ""} disabled={readOnly} onChange={e => updateInf(inf.id, "condition", e.target.value)} className="w-full min-w-[400px] rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] resize-y text-xs bg-white"></textarea>
                      )}
                    </td>
                    {(group.questions || []).map((q, idx) => (
                      <td key={idx} className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs min-w-[200px] whitespace-pre-wrap leading-relaxed">
                        {readOnly ? (
                          inf.questionAnswers?.[idx] || "-"
                        ) : (
                          <textarea rows={3} value={inf.questionAnswers?.[idx] || ""} disabled={readOnly} onChange={e => updateInfQuestionAnswer(inf.id, idx, e.target.value)} className="w-full min-w-[200px] rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] resize-y text-xs bg-white"></textarea>
                        )}
                      </td>
                    ))}
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
      )}
    </div>
  );
}
