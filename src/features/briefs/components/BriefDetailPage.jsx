import React, { useState, useEffect, useMemo, useRef } from "react";
/* eslint-disable no-unused-vars */

import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, History, Users, FileText, Calendar, ExternalLink, Link as LinkIcon, Download,
  MessageCircle, Send, Check, GripVertical, Paperclip,
  CheckCircle, Loader2, Info, Folder, Coins, Edit,
  Briefcase, Compass, Sparkles, ChevronUp, ChevronDown, MapPin
} from "lucide-react";
import { formatCurrency, formatNumber, cn } from "../../../utils/helpers";
import { defaultPillars, platformOptions } from "../../../constants/appConstants";
import SimpleHtmlEditor from "../../../components/common/SimpleHtmlEditor";
import Select from "../../../components/common/Select";
import MultiSelect from "../../../components/common/MultiSelect";
import Button from "../../../components/common/Button";
import ActivityTimeline from "../../../components/common/ActivityTimeline";
import RateCardListPage from "../../../components/brief/RateCardListPage";
import RecapSetup from "../../../components/brief/RecapSetup";

export default function BriefDetailPage({ brief, onBack, onUpdateBrief, onStartRecap }) {
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditStep, setCurrentEditStep] = useState(1);
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

  const [activeOptId, setActiveOptId] = useState(() => budgetOptions[0]?.id);

  useEffect(() => {
    if (brief.budgetOptions && brief.budgetOptions.length > 0) {
      if (!brief.budgetOptions.some(o => o.id === activeOptId)) {
        setActiveOptId(brief.budgetOptions[0].id);
      }
    } else {
      setActiveOptId("legacy");
    }
  }, [brief]);

  const activeOpt = budgetOptions.find(o => o.id === activeOptId) || budgetOptions[0];
  const allSowsWithOpt = budgetOptions.flatMap((opt, oIdx) => (opt.scopeOfWorks || []).map(s => ({ ...s, optionName: opt.name || `Option ${String.fromCharCode(65 + oIdx)}` })));

  const handleEditSection = (step) => {
    setCurrentEditStep(step);
    setEditModalOpen(true);
  };

  const handleEditSubmit = (updatedData) => {
    const fieldNames = {
      brand: "แบรนด์", clientStatus: "สถานะลูกค้า", customerType: "ประเภทลูกค้า", salesOwner: "เจ้าของโปรเจกต์ (Sales)",
      campaignName: "ชื่อแคมเปญ", packageType: "ประเภทแพ็กเกจ", packageTypeOther: "แพ็กเกจอื่นๆ", product: "สินค้า",
      objective: "วัตถุประสงค์", objectiveNote: "รายละเอียดวัตถุประสงค์", gender: "เพศ", country: "ประเทศ",
      province: "จังหวัด", ageRange: "ช่วงอายุ", lifestyle: "ไลฟ์สไตล์", persona: "ลักษณะนิสัย (Persona)",
      occupation: "อาชีพ", campaignStartDate: "วันที่เริ่มแคมเปญ", campaignEndDate: "วันที่สิ้นสุดแคมเปญ",
      platform: "แพลตฟอร์ม", platformOther: "แพลตฟอร์มอื่นๆ", previousCampaign: "แคมเปญที่ผ่านมา",
      competitor: "คู่แข่ง", additionalInfo: "ข้อมูลเพิ่มเติม", budgetSpending: "งบประมาณใช้จ่าย",
      budgetBoostSpending: "งบประมาณ Boost by Page", isBuddyBoostRequired: "ต้องการ Buddy Boost",
      targetBoost: "Target Boost", buddyBoostDetail: "รายละเอียด Buddy Boost", vat: "ภาษี (VAT)", budgetCondition: "เงื่อนไขงบประมาณ",
      estimatedBrandSpending: "ประเมินค่าใช้จ่ายแบรนด์", budgetPerInfluencer: "งบประมาณต่อ Influencer",
      expectedNumInfluencers: "จำนวน Influencer ที่คาดหวัง", expectedReach: "Reach ที่คาดหวัง",
      buyoutRequired: "ต้องการ Buyout", buyoutDuration: "ระยะเวลา Buyout", boostRequired: "ต้องการ Boost",
      boostDuration: "ระยะเวลา Boost", addAdsRequired: "ต้องการ Add Ads", addAdsDuration: "ระยะเวลา Add Ads",
      paidPartnershipRequired: "ต้องการ Paid Partnership", paidPartnershipDuration: "ระยะเวลา Paid Partnership",
      genCodeRequired: "ต้องการ Gen Code", genCodeDuration: "ระยะเวลา Gen Code", tiktokShopRequired: "ต้องการ Tiktok Shop",
      tiktokShopDuration: "ระยะเวลา Tiktok Shop", crossPostingRequired: "ต้องการ Cross Posting",
      crossPostingDuration: "ระยะเวลา Cross Posting",
      youtubeDiscoveryRequired: "ต้องการ Youtube Discovery", youtubeDiscoveryDuration: "ระยะเวลา Youtube Discovery",
      fbBrandedContentRequired: "ต้องการ FB Branded Content", fbBrandedContentDuration: "ระยะเวลา FB Branded Content",
      xWhitelistingRequired: "ต้องการ X/Twitter Whitelisting", xWhitelistingDuration: "ระยะเวลา X/Twitter Whitelisting",
      brandSupport: "การสนับสนุนจากแบรนด์",
      influencerBuyValue: "มูลค่าที่ Influencer ซื้อได้", influencerPickupLocation: "สถานที่รับสินค้า",
      condition: "เงื่อนไข (Condition)", requireTravel: "ต้องการเดินทาง/รับบริการ",
      onSiteType: "ประเภท On-Site", eventDuration: "ระยะเวลา Event", locationDetails: "รายละเอียดสถานที่",
      buddyReviewSupport: "Buddy Review Support", reviewerTravelExpense: "ค่าเดินทางต่อ Influencer",
      logisticsPerInfluencer: "ค่าจัดส่งต่อ Influencer"
    };

    const changes = [];
    Object.keys(updatedData).forEach(key => {
      if (key === 'scopeOfWorks') return;

      const isOldEmpty = brief[key] === "" || brief[key] === undefined || brief[key] === null || (Array.isArray(brief[key]) && brief[key].length === 0);
      const isNewEmpty = updatedData[key] === "" || updatedData[key] === null || (Array.isArray(updatedData[key]) && updatedData[key].length === 0);

      if (isOldEmpty && isNewEmpty) return; // Ignore if both are empty

      const oldStr = JSON.stringify(brief[key]);
      const newStr = JSON.stringify(updatedData[key]);

      if (oldStr !== newStr) {
        const formatVal = (val) => {
          if (val === "" || val === undefined || val === null || (Array.isArray(val) && val.length === 0)) return "ว่างเปล่า";
          if (Array.isArray(val)) return val.join(", ");
          if (typeof val === "boolean") return val ? "ใช่" : "ไม่ใช่";
          return String(val);
        };
        const oldVal = formatVal(brief[key]);
        const newVal = formatVal(updatedData[key]);
        const fieldName = fieldNames[key] || key;
        changes.push({ field: fieldName, oldVal, newVal });
      }
    });

    const log = {
      date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action: `อัปเดตข้อมูล Brief ส่วนที่ ${currentEditStep}`,
      details: changes.length > 0 ? changes : "ไม่มีการเปลี่ยนแปลงข้อมูล"
    };
    onUpdateBrief({
      ...brief,
      ...updatedData,
      activityLog: [...(brief.activityLog || []), log]
    });
    setEditModalOpen(false);
  };

  const [selectedSows, setSelectedSows] = useState([]);

  const renderList = (items) => {
    if (!items || items.length === 0) return "-";
    if (typeof items === "string") return items;
    if (Array.isArray(items)) return items.join(", ");
    return String(items);
  };

  const formatCurrency = (val) => {
    if (val === "" || val === undefined || val === null) return "-";
    const num = typeof val === "string" ? parseFloat(val.replace(/,/g, "")) : Number(val);
    if (isNaN(num)) return val;
    return `฿${num.toLocaleString()}`;
  };

  const hasStandard = Array.isArray(brief.packageType)
    ? brief.packageType.some(p => p.toLowerCase().includes("standard"))
    : (typeof brief.packageType === "string" && brief.packageType.toLowerCase().includes("standard"));

  const handleSubmitToTraffic = () => {
    const log = {
      date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action: hasStandard ? "Dealsheet Created" : "Brief Submitted",
      details: hasStandard ? "Standard Dealsheet created automatically." : "Brief created and submitted to Traffic."
    };
    onUpdateBrief({
      ...brief,
      version: 1,
      internalStatus: hasStandard ? "Draft Dealsheet" : "Example List",
      activeTab: hasStandard ? "dealsheet" : "exampleList",
      submittedSows: hasStandard ? allSowsWithOpt.map(s => s.id) : selectedSows,
      activityLog: [...(brief.activityLog || []), log]
    });
    setSubmitModalOpen(false);
  };

  const toggleSowSelection = (sowId) => {
    if (selectedSows.includes(sowId)) {
      setSelectedSows(selectedSows.filter(id => id !== sowId));
    } else {
      setSelectedSows([...selectedSows, sowId]);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Folder },
    { id: "budget", label: "Budget & SOW Options", icon: Coins, count: activeOpt.scopeOfWorks?.length },
    { id: "logistics", label: "Conditions", icon: FileText },
    { id: "activity", label: "Activity Log", icon: History, count: brief.activityLog?.length }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pb-20 text-base">

      {/* Top Breadcrumb & Back Row */}
      <div className="flex items-center justify-end mb-5">
        <div className="text-sm text-slate-400">
          Brief ID: <span className="font-semibold text-slate-650">{brief.id}</span>
        </div>
      </div>

      {/* Modern Gradient Header Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 p-6 lg:p-8 shadow-2xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-sm font-bold text-[#6D5DF6] ring-1 ring-violet-100/50">
                {brief.brand || "Client Name"}
              </span>
              <span className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold border",
                brief.clientStatus === "New" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-blue-50 text-blue-700 border-blue-100"
              )}>
                {brief.clientStatus || "New Client"}
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 border border-slate-200">
                {brief.customerType || "Key Account"}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
              {brief.campaignName || "Unnamed Campaign"}
            </h1>

            {/* Timeline Progress Row */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 mt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-400" />
                <span className="font-semibold text-slate-700">Period:</span>
                <span className="bg-white px-3 py-1.5 rounded-md border border-slate-200 text-slate-800 font-bold">{brief.campaignStartDate || "-"}</span>
                <span className="text-slate-400">to</span>
                <span className="bg-white px-3 py-1.5 rounded-md border border-slate-200 text-slate-800 font-bold">{brief.campaignEndDate || "-"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                const url = `${window.location.origin}${window.location.pathname}?briefId=${brief.id}`;
                navigator.clipboard.writeText(url);
                alert("คัดลอกลิงก์สำเร็จ!");
                if (window.showToast) window.showToast("Copied Brief Link!");
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-5 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              title="Copy link to this brief"
            >
              <Copy className="h-5 w-5" />
              Copy Link
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left Column (Main content area with Tabbed Panels) */}
        <div className="w-full lg:w-3/4 space-y-6 min-w-0">

          {/* Dashboard Tab Buttons Row */}
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
                      "ml-1.5 text-xs font-bold px-2 py-0.5 rounded-full",
                      isActive ? "bg-violet-100 text-[#6D5DF6]" : "bg-slate-100 text-slate-600"
                    )}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel Content */}
          <div className="bg-white border border-slate-200 border-t-0 rounded-b-3xl p-6 lg:p-8 shadow-2xs">

            {/* TAB 1: OVERVIEW */}
            {activeSubTab === "overview" && (
              <div className="space-y-8">

                {/* Visual Header & Edit Button */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Project & Client Information</h3>
                    <p className="text-sm text-slate-400 mt-1">Key parameters, target brand specs, and targeted audiences.</p>
                  </div>
                  <button
                    onClick={() => handleEditSection(1)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-655 hover:bg-slate-55 transition cursor-pointer"
                  >
                    <Edit className="h-4 w-4" /> Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Client Profile Box */}
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

                  {/* Channel & Platforms Box */}
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

                      {/* Buddy Boost specs */}
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

                  {/* Target Audience Profile */}
                  <div className="md:col-span-2 p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/60 pb-2.5">
                      <Users className="h-5 w-5 text-[#6D5DF6]" />
                      Target Audience Demographics
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
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
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs">
                        <span className="text-xs text-slate-400 font-bold block uppercase">Lifestyle</span>
                        <span className="font-bold text-slate-800 text-base mt-1 block">{brief.lifestyle || "-"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Campaign Objectives */}
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
                                : "bg-white text-slate-300 border-slate-200 opacity-50 line-through"
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

                  {/* Collapsible Reference Sheets (Product Info, Competitors etc.) */}
                  <div className="md:col-span-2 space-y-4 pt-2">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="h-5 w-5 text-slate-450" />
                      Brand Specifications & Reference Sheets
                    </h4>

                    {/* Product Details Document */}
                    {brief.product && (
                      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs bg-white">
                        <button
                          onClick={() => toggleDoc("product")}
                          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition text-left cursor-pointer"
                        >
                          <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Product Name & Specifications</span>
                          {expandedDocs.product ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                        </button>
                        {expandedDocs.product && (
                          <div className="p-5 border-t border-slate-200 text-sm text-slate-750 leading-relaxed max-h-[300px] overflow-y-auto">
                            <div className="prose prose-sm max-w-none text-sm" dangerouslySetInnerHTML={{ __html: brief.product }} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Previous Campaigns Document */}
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
                          <div className="p-5 border-t border-slate-200 text-sm text-slate-750 leading-relaxed max-h-[250px] overflow-y-auto">
                            <div className="prose prose-sm max-w-none text-sm" dangerouslySetInnerHTML={{ __html: brief.previousCampaign }} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Competitor Info Document */}
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
                          <div className="p-5 border-t border-slate-200 text-sm text-slate-750 leading-relaxed max-h-[250px] overflow-y-auto">
                            <div className="prose prose-sm max-w-none text-sm" dangerouslySetInnerHTML={{ __html: brief.competitor }} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Additional Info Document */}
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
                          <div className="p-5 border-t border-slate-200 text-sm text-slate-750 leading-relaxed max-h-[200px] overflow-y-auto">
                            <div className="prose prose-sm max-w-none text-sm" dangerouslySetInnerHTML={{ __html: brief.additionalInfo }} />
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                </div>
              </div>
            )}

            {/* TAB 2: BUDGET & SOW OPTIONS */}
            {activeSubTab === "budget" && (
              <div className="space-y-6">

                {/* Header Row */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Budget Packages & Scopes of Work</h3>
                    <p className="text-sm text-slate-400 mt-1">Option variations, budget details, and scope guidelines.</p>
                  </div>
                  <button
                    onClick={() => handleEditSection(2)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-55 transition cursor-pointer"
                  >
                    <Edit className="h-4 w-4" /> Edit Options
                  </button>
                </div>

                {/* Option Tabs Navigation (within this tab) */}
                {budgetOptions.length > 1 && (
                  <div className="flex flex-wrap items-center gap-2.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200/50">
                    {budgetOptions.map((opt, oIdx) => {
                      const isActive = opt.id === activeOptId;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setActiveOptId(opt.id)}
                          className={cn(
                            "px-5 py-2.5 text-sm font-bold rounded-lg transition cursor-pointer",
                            isActive
                              ? "bg-white text-slate-900 shadow-3xs border border-slate-200"
                              : "text-slate-600 hover:text-slate-900"
                          )}
                        >
                          {opt.name || `Option ${String.fromCharCode(65 + oIdx)}`}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Financial Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">

                  {/* Budget Spending */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Budget Spending</span>
                      <span className="text-2xl font-bold text-[#6D5DF6] block mt-1.5">
                        {formatCurrency(activeOpt.budgetSpending)}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-450 mt-3 block">
                      Tax Status: {activeOpt.vat || "-"}
                    </span>
                  </div>

                  {/* Estimated Brand Spending */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Est. Brand Spend</span>
                      <span className="text-2xl font-bold text-slate-800 block mt-1.5">
                        {formatCurrency(activeOpt.estimatedBrandSpending)}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-455 mt-3 block">
                      Evaluation estimate
                    </span>
                  </div>

                  {/* Budget / KOL */}
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

                  {/* Target Deliverables */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Expected KOLs & Reach</span>
                      <span className="text-lg font-bold text-slate-800 block mt-1.5">
                        KOLs: {activeOpt.expectedNumInfluencers || "-"}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 mt-2 block">
                      Reach: {activeOpt.expectedReach || "-"}
                    </span>
                  </div>

                </div>

                {/* Option Level Condition */}
                {activeOpt.budgetCondition && (
                  <div className="p-4.5 rounded-xl bg-slate-50 border border-slate-200 text-sm">
                    <span className="font-bold text-slate-700 block mb-1">Option Condition / Note:</span>
                    <p className="text-slate-650 leading-relaxed whitespace-pre-wrap">{activeOpt.budgetCondition}</p>
                  </div>
                )}

                {/* SOW Scope list */}
                <div className="space-y-5 pt-2">
                  <h4 className="text-sm font-bold text-slate-450 uppercase tracking-wider flex items-center justify-between">
                    <span>Scope of Work List ({activeOpt.scopeOfWorks?.length || 0})</span>
                  </h4>

                  {activeOpt.scopeOfWorks && activeOpt.scopeOfWorks.length > 0 ? (
                    activeOpt.scopeOfWorks.map((sow, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 text-base shadow-3xs space-y-4.5 hover:shadow-2xs transition">

                        {/* Scope Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                          <span className="font-bold text-slate-900 text-base">
                            Scope {idx + 1}: {sow.name || "Unnamed Scope"}
                          </span>
                          <div className="flex gap-2">
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
                          </div>
                        </div>

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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                          {/* Influencer Persona */}
                          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3.5 text-sm">
                            <h5 className="font-bold text-slate-750 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
                              <span className="w-2 h-2 rounded-full bg-[#6D5DF6]" /> Influencer details
                            </h5>

                            {sow.influencerDetails && sow.influencerDetails.length > 0 ? (
                              <div className="space-y-4">
                                {sow.influencerDetails.map((detail, dIdx) => (
                                  <div key={detail.id || dIdx} className="bg-white p-4 rounded-xl border border-slate-200">
                                    <h6 className="text-sm font-bold text-slate-800 mb-3">Group {dIdx + 1}</h6>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                      <div><span className="text-slate-400 block mb-1 text-xs">KOL Qty</span> <span className="font-semibold text-slate-800">{detail.numInfluencers || "-"}</span></div>
                                      <div>
                                        <span className="text-slate-400 block mb-1 text-xs">Followers</span> <span className="font-semibold text-slate-800">
                                          {detail.followerReqFrom || detail.followerReqTo ? `${detail.followerReqFrom ? Number(detail.followerReqFrom).toLocaleString() : "0"} - ${detail.followerReqTo ? Number(detail.followerReqTo).toLocaleString() : "Any"}` : "-"}
                                        </span>
                                      </div>
                                      <div><span className="text-slate-400 block mb-1 text-xs">Demographic</span> <span className="font-semibold text-slate-800">{renderList(detail.persona?.demographic)}</span></div>
                                      <div><span className="text-slate-400 block mb-1 text-xs">Location</span> <span className="font-semibold text-slate-800">{renderList(detail.persona?.location)}</span></div>
                                      <div><span className="text-slate-400 block mb-1 text-xs">Occupation</span> <span className="font-semibold text-slate-800">{renderList(detail.persona?.occupation)}</span></div>
                                      <div><span className="text-slate-400 block mb-1 text-xs">Tone</span> <span className="font-semibold text-slate-800">{renderList(detail.persona?.persona)}</span></div>
                                      <div><span className="text-slate-400 block mb-1 text-xs">Content Category</span> <span className="font-semibold text-slate-800">{renderList(detail.persona?.contentCategory)}</span></div>
                                      <div><span className="text-slate-400 block mb-1 text-xs">Storytelling</span> <span className="font-semibold text-slate-800">{renderList(detail.persona?.storyTelling)}</span></div>
                                    </div>

                                    {/* Reference Influencers Display */}
                                    {detail.referenceInfluencers && detail.referenceInfluencers.length > 0 && (
                                      <div className="mt-4 pt-4 border-t border-slate-100">
                                        <div className="text-slate-400 mb-3 text-xs font-semibold uppercase tracking-wider">Reference Influencers</div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          {detail.referenceInfluencers.map(ref => (
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
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <div><span className="text-slate-400">KOL Qty:</span> <span className="font-semibold text-slate-800">{sow.numInfluencers || "-"}</span></div>
                                <div>
                                  <span className="text-slate-400">Followers:</span> <span className="font-semibold text-slate-800">
                                    {sow.followerReqFrom || sow.followerReqTo ? `${sow.followerReqFrom ? Number(sow.followerReqFrom).toLocaleString() : "0"} - ${sow.followerReqTo ? Number(sow.followerReqTo).toLocaleString() : "Any"}` : (sow.followerReq || "-")}
                                  </span>
                                </div>
                                <div><span className="text-slate-400">Demographic:</span> <span className="font-semibold text-slate-800">{renderList(sow.persona?.demographic || sow.persona?.infDemographic)}</span></div>
                                <div><span className="text-slate-400">Location:</span> <span className="font-semibold text-slate-800">{renderList(sow.persona?.location || sow.persona?.infLocation)}</span></div>
                                <div><span className="text-slate-400">Occupation:</span> <span className="font-semibold text-slate-800">{renderList(sow.persona?.occupation || sow.persona?.infOccupation)}</span></div>
                                <div><span className="text-slate-400">Tone:</span> <span className="font-semibold text-slate-800">{renderList(sow.persona?.persona || sow.persona?.infPersona)}</span></div>
                                <div className="col-span-2"><span className="text-slate-400">Content Category:</span> <span className="font-semibold text-slate-800">{renderList(sow.persona?.contentCategory || sow.persona?.infContent)}</span></div>
                                <div className="col-span-2"><span className="text-slate-400">Storytelling:</span> <span className="font-semibold text-slate-800">{renderList(sow.persona?.storyTelling || sow.persona?.infStoryTelling)}</span></div>
                                {sow.persona?.specialConditions && sow.persona.specialConditions.length > 0 && (
                                  <div className="col-span-2">
                                    <span className="text-slate-400">Special Condition:</span> <span className="font-semibold text-slate-800">{sow.persona.specialConditions.join(', ')}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {sow.persona?.infPreference && (
                              <div className="mt-3 pt-3 border-t border-slate-200/50 text-slate-650">
                                <span className="text-xs text-slate-400 font-bold block mb-1.5 uppercase">Influencer Preferences</span>
                                <div className="bg-white p-3 rounded-lg border border-slate-250 max-h-[120px] overflow-y-auto text-sm" dangerouslySetInnerHTML={{ __html: sow.persona?.infPreference }} />
                              </div>
                            )}
                          </div>

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

                        {/* Reference Influencers Display */}
                        {sow.referenceInfluencers && sow.referenceInfluencers.length > 0 && (
                          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3.5 mt-4">
                            <h5 className="font-bold text-slate-750 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
                              <Users className="h-4 w-4 text-[#6D5DF6]" /> Reference Influencers
                            </h5>
                            <div className="flex flex-wrap gap-3">
                              {sow.referenceInfluencers.map(ref => (
                                <a key={ref.id} href={ref.profileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white border border-slate-200 hover:border-[#6D5DF6] rounded-full py-1.5 pl-1.5 pr-4 transition-colors">
                                  <img src={ref.avatar} alt={ref.username} className="h-8 w-8 rounded-full object-cover border border-slate-100" />
                                  <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-800 leading-tight">{ref.username}</span>
                                    <span className="text-[10px] text-slate-500 leading-tight">{ref.platform}</span>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 italic text-center py-8 bg-slate-50 border border-slate-200 rounded-xl text-base">
                      No scope of work items configured.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 3: CONDITION */}
            {activeSubTab === "logistics" && (
              <div className="space-y-6">

                {/* Header Row */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Campaign Conditions</h3>
                    <p className="text-sm text-slate-400 mt-1">General terms, notes, and conditions for this campaign.</p>
                  </div>
                  <button
                    onClick={() => handleEditSection(3)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-655 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <Edit className="h-4 w-4" /> Edit Conditions
                  </button>
                </div>

                {brief.condition && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-3.5">
                    <div className="text-slate-700 bg-white border border-slate-200 p-5 rounded-xl whitespace-pre-wrap leading-relaxed text-sm shadow-3xs">
                      {brief.condition}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 4: ACTIVITY LOG */}
            {activeSubTab === "activity" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-800">Brief Version & Audit Log</h3>
                  <p className="text-sm text-slate-400 mt-1">Audit log history of all field changes and timeline events.</p>
                </div>
                <div className="text-sm">
                  <ActivityTimeline logs={brief.activityLog || []} />
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Column (Actions Sidebar) */}
        <div className="w-full lg:w-1/4 shrink-0 text-sm">
          <div className="sticky top-6 space-y-6">

            {/* Actions Panel */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-3xs p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Brief Status & Actions</h3>

              <div className="flex flex-col gap-3">
                {onStartRecap ? (
                  <Button
                    className="w-full py-3 text-base font-bold bg-[#6D5DF6] hover:bg-[#5b4dcc] text-white"
                    onClick={onStartRecap}
                  >
                    Start Recap
                  </Button>
                ) : (
                  (!brief.internalStatus || brief.internalStatus === "Draft") && (
                    <Button
                      className="w-full py-3 text-base font-bold"
                      onClick={() => {
                        if (hasStandard) {
                          handleSubmitToTraffic();
                        } else {
                          setSubmitModalOpen(true);
                        }
                      }}
                    >
                      {hasStandard ? "Create Dealsheet" : "Submit to Traffic"}
                    </Button>
                  )
                )}
                <Button variant="secondary" className="w-full py-3 text-base font-bold cursor-pointer">
                  <Copy className="mr-2 h-5 w-5" /> Duplicate Brief
                </Button>
              </div>
            </div>


          </div>
        </div>

      </div>

      {/* Submit Modal */}
      <AnimatePresence>
        {submitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-2xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  {hasStandard ? "Create Dealsheet" : "Submit to Traffic"}
                </h2>
                <p className="text-sm text-slate-500 mb-6">Select the Scope of Work (SOW) items you want to submit.</p>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {allSowsWithOpt && allSowsWithOpt.length > 0 ? (
                    allSowsWithOpt.map((sow, idx) => (
                      <label
                        key={idx}
                        className={cn(
                          "flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition",
                          selectedSows.includes(sow.id)
                            ? 'border-[#6D5DF6] bg-violet-50/50'
                            : 'border-slate-200 hover:border-slate-300'
                        )}
                      >
                        <div className="mt-1 flex h-4 w-4 items-center justify-center rounded border border-slate-300 bg-white relative">
                          <input
                            type="checkbox"
                            className="h-full w-full opacity-0 cursor-pointer absolute inset-0 z-10"
                            checked={selectedSows.includes(sow.id)}
                            onChange={() => toggleSowSelection(sow.id)}
                          />
                          {selectedSows.includes(sow.id) && <Check className="absolute h-3 w-3 text-[#6D5DF6]" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-slate-900">
                            Scope {idx + 1}: {sow.name || sow.contentType || "Unnamed SOW"}
                            <span className="ml-2 inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-xs font-bold text-[#6D5DF6]">
                              {sow.optionName}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {renderList(sow.platforms)} • {sow.numInfluencers} Influencers
                          </div>
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500 text-center py-4">No Scope of Work available in this brief.</div>
                  )}
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <Button variant="secondary" onClick={() => setSubmitModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleSubmitToTraffic} disabled={!allSowsWithOpt || allSowsWithOpt.length === 0}>
                    {hasStandard ? "Create Dealsheet" : "Submit Brief"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editModalOpen && (
          <BriefFormModal
            key={brief.id}
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSubmit={handleEditSubmit}
            initialData={brief}
            initialStep={currentEditStep}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}// --- Sub-components for Tracker ---


// --- Planner Tracker Page Component ---
