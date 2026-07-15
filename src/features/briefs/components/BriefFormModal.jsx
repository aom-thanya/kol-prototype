import React, { useState, useEffect, useMemo, useRef } from "react";
/* eslint-disable no-unused-vars */

import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Edit2, Copy, Trash2, Search, ChevronRight, ChevronLeft, ChevronDown,
  X, CheckCircle2, History, AlertCircle, Save, Filter, Upload,
  RefreshCw, Users, FileText, Image, Video, Calendar,
  MoreVertical, ExternalLink, Link as LinkIcon, Download,
  MessageCircle, Send, Check, GripVertical, Paperclip,
  CheckCircle, Loader2, Info
} from "lucide-react";
import { formatCurrency, formatNumber, cn } from "../../../utils/helpers";
import { defaultPillars, platformOptions } from "../../../constants/appConstants";
import SimpleHtmlEditor from "../../../components/common/SimpleHtmlEditor";
import Select from "../../../components/common/Select";
import MultiSelect from "../../../components/common/MultiSelect";
import Modal from "../../../components/common/Modal";
import Stepper from "../../../components/common/Modal";
import Button from "../../../components/common/Button";
import ActivityTimeline from "../../../components/common/ActivityTimeline";
import RateCardListPage from "../../../components/brief/RateCardListPage";
import RecapSetup from "../../../components/brief/RecapSetup";
import InfluencerDetailModal from "./InfluencerDetailModal";

export default function BriefFormModal({ open, onClose, onSubmit, initialData = null, initialStep = 1, customers = [] }) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  useEffect(() => { if (open) setCurrentStep(initialStep); }, [open, initialStep]);
  const totalSteps = 3;

  // Step 1: Client & Project Details
  const [customerId, setCustomerId] = useState(initialData?.customerId || "");
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [clientStatus, setClientStatus] = useState(initialData?.clientStatus || "New");
  const [customerType, setCustomerType] = useState(initialData?.customerType || "Key Account");
  const [salesOwner, setSalesOwner] = useState(initialData?.salesOwner || "รัตน์วิภา แสนโย");
  const [campaignName, setCampaignName] = useState(initialData?.campaignName || "");
  const [packageType, setPackageType] = useState(initialData?.packageType ? (Array.isArray(initialData.packageType) ? initialData.packageType[0] : initialData.packageType) : "");
  const [packageTypeOther, setPackageTypeOther] = useState(initialData?.packageTypeOther || "");
  const [product, setProduct] = useState(initialData?.product || "");
  
  const [objective, setObjective] = useState(initialData?.objective || []);
  const [objectiveNote, setObjectiveNote] = useState(initialData?.objectiveNote || "");
  
  const [gender, setGender] = useState(initialData?.gender || []);
  const [ageRange, setAgeRange] = useState(initialData?.ageRange || []);
  const [country, setCountry] = useState(initialData?.country || "");
  const [province, setProvince] = useState(initialData?.province || "");
  const [lifestyle, setLifestyle] = useState(initialData?.lifestyle || "");
  
  const [campaignStartDate, setCampaignStartDate] = useState(initialData?.campaignStartDate || "");
  const [campaignEndDate, setCampaignEndDate] = useState(initialData?.campaignEndDate || "");
  
  const [platform, setPlatform] = useState(initialData?.platform || []);
  const [platformOther, setPlatformOther] = useState("");
  const [isBuddyBoostRequired, setIsBuddyBoostRequired] = useState(initialData?.isBuddyBoostRequired || false);
  const [targetBoost, setTargetBoost] = useState(initialData?.targetBoost || []);
  const [buddyBoostDetail, setBuddyBoostDetail] = useState(initialData?.buddyBoostDetail || "");
  const [budgetBoostSpending, setBudgetBoostSpending] = useState(initialData?.budgetBoostSpending || "");

  const [previousCampaign, setPreviousCampaign] = useState(initialData?.previousCampaign || "");
  const [competitor, setCompetitor] = useState(initialData?.competitor || "");
  const [additionalInfo, setAdditionalInfo] = useState(initialData?.additionalInfo || "");

  // Step 2 & 3 Combined: Budget & SOW Options
  const defaultSOW = { 
    name: "", 
    platforms: [], 
    contentType: [], 
    notes: "",
    allocation: "",
    numInfluencers: "",
    followerReq: "",
    followerReqFrom: "",
    followerReqTo: "",
    details: "",
    brandSupportType: "No Sponsor",
    brandSupportTypeOther: "",
    productValue: "",
    productReceiveMethod: "",
    logisticsPerInfluencer: "",
    logisticBrandToBuddy: "",
    logisticInfluencerToBuddy: "",
    reimbursement: "",
    requireTravel: "ไม่ต้อง (Remote / ถ่ายทำที่ไหนก็ได้)",
    reviewerTravelExpense: "",
    onSiteType: "",
    eventDuration: "",
    locationDetails: "",
    buddyReviewSupport: "No",
    persona: {
      demographic: "",
      location: "",
      occupation: "",
      persona: "",
      contentCategory: "",
      storyTelling: ""
    },
    serviceScope: {
      buyoutRequired: false, buyoutDuration: [],
      boostPostRequired: false, boostPostDuration: [],
      addAdsRequired: false, addAdsDuration: [],
      paidPartnershipRequired: false, paidPartnershipDuration: [],
      discoveryRequired: false, discoveryDuration: [],
      genCodeRequired: false, genCodeDuration: [],
      tiktokShopRequired: false, tiktokShopDuration: [],
      brandedContentRequired: false, brandedContentDuration: [],
      whitelistingRequired: false, whitelistingDuration: [],
      viaRequired: false, viaDuration: []
    }
  };

  const [budgetOptions, setBudgetOptions] = useState(() => {
    if (initialData?.budgetOptions && initialData.budgetOptions.length > 0) {
      return initialData.budgetOptions.map(opt => {
        let condType = opt.budgetConditionType || "Refer";
        let condVal = opt.budgetConditionValue !== undefined ? opt.budgetConditionValue : "";
        if (opt.budgetCondition && !opt.budgetConditionType) {
          if (opt.budgetCondition.startsWith("Refer:")) {
            condType = "Refer";
            condVal = opt.budgetCondition.replace("Refer:", "").trim().replace("%", "");
          } else if (opt.budgetCondition.startsWith("Rebate:")) {
            condType = "Rebate";
            condVal = opt.budgetCondition.replace("Rebate:", "").trim().replace("%", "");
          } else if (opt.budgetCondition.startsWith("Inventory:")) {
            condType = "Inventory";
            condVal = opt.budgetCondition.replace("Inventory:", "").trim().replace("บาท", "").trim();
          }
        }
        return {
          ...opt,
          budgetConditionType: condType,
          budgetConditionValue: condVal
        };
      });
    }
    // Fallback/Legacy import: convert single budget and SOW into Option 1
    let legacyCondType = "Refer";
    let legacyCondVal = "";
    if (initialData?.budgetCondition) {
      if (initialData.budgetCondition.startsWith("Refer:")) {
        legacyCondType = "Refer";
        legacyCondVal = initialData.budgetCondition.replace("Refer:", "").trim().replace("%", "");
      } else if (initialData.budgetCondition.startsWith("Rebate:")) {
        legacyCondType = "Rebate";
        legacyCondVal = initialData.budgetCondition.replace("Rebate:", "").trim().replace("%", "");
      } else if (initialData.budgetCondition.startsWith("Inventory:")) {
        legacyCondType = "Inventory";
        legacyCondVal = initialData.budgetCondition.replace("Inventory:", "").trim().replace("บาท", "").trim();
      }
    }
    return [{
      id: Date.now(),
      name: "Option A",
      budgetSpending: initialData?.budgetSpending || "",
      vat: initialData?.vat || "Incl. VAT",
      budgetCondition: initialData?.budgetCondition || "",
      budgetConditionType: legacyCondType,
      budgetConditionValue: legacyCondVal,
      estimatedBrandSpending: initialData?.estimatedBrandSpending || "",
      budgetPerInfluencer: initialData?.budgetPerInfluencer || "",
      expectedNumInfluencers: initialData?.expectedNumInfluencers || "",
      expectedReach: initialData?.expectedReach || "",
      scopeOfWorks: initialData?.scopeOfWorks || [{ ...defaultSOW, id: Date.now() }]
    }];
  });

  const [activeOptionId, setActiveOptionId] = useState(() => budgetOptions[0]?.id);

  const [infDetailModalOpen, setInfDetailModalOpen] = useState(false);
  const [currentEditingInfDetail, setCurrentEditingInfDetail] = useState(null);
  const [currentEditingScopeInfo, setCurrentEditingScopeInfo] = useState(null);

  const updateActiveOption = (field, value) => {
    setBudgetOptions(prev => prev.map(opt => opt.id === activeOptionId ? { ...opt, [field]: value } : opt));
  };

  const updateActiveOptionCondition = (type, value) => {
    setBudgetOptions(prev => prev.map(opt => {
      if (opt.id === activeOptionId) {
        let finalStr = "";
        if (type === "Refer") {
          finalStr = `Refer: ${value}%`;
        } else if (type === "Rebate") {
          finalStr = `Rebate: ${value}%`;
        } else if (type === "Inventory") {
          finalStr = `Inventory: ${value} บาท`;
        }
        return {
          ...opt,
          budgetConditionType: type,
          budgetConditionValue: value,
          budgetCondition: finalStr
        };
      }
      return opt;
    }));
  };

  const handleAddOption = () => {
    const newId = Date.now();
    const newOption = {
      id: newId,
      name: `Option ${String.fromCharCode(65 + budgetOptions.length)}`,
      budgetSpending: "",
      vat: "Incl. VAT",
      budgetCondition: "",
      estimatedBrandSpending: "",
      budgetPerInfluencer: "",
      expectedNumInfluencers: "",
      expectedReach: "",
      scopeOfWorks: [{ ...defaultSOW, id: Date.now() + 1 }]
    };
    setBudgetOptions(prev => [...prev, newOption]);
    setActiveOptionId(newId);
  };

  const handleRemoveOption = (optId) => {
    if (budgetOptions.length <= 1) return;
    const remaining = budgetOptions.filter(opt => opt.id !== optId);
    setBudgetOptions(remaining);
    if (activeOptionId === optId) {
      setActiveOptionId(remaining[0].id);
    }
  };

  const handleAddScope = () => {
    setBudgetOptions(prev => prev.map(opt => {
      if (opt.id === activeOptionId) {
        return {
          ...opt,
          scopeOfWorks: [...(opt.scopeOfWorks || []), { ...defaultSOW, id: Date.now() }]
        };
      }
      return opt;
    }));
  };

  const handleDuplicateScope = (scope) => {
    setBudgetOptions(prev => prev.map(opt => {
      if (opt.id === activeOptionId) {
        return {
          ...opt,
          scopeOfWorks: [...(opt.scopeOfWorks || []), { ...scope, id: Date.now() }]
        };
      }
      return opt;
    }));
  };

  const handleRemoveScope = (sowId) => {
    setBudgetOptions(prev => prev.map(opt => {
      if (opt.id === activeOptionId) {
        return {
          ...opt,
          scopeOfWorks: (opt.scopeOfWorks || []).filter(s => s.id !== sowId)
        };
      }
      return opt;
    }));
  };

  const handleUpdateScope = (sowId, field, value) => {
    setBudgetOptions(prev => prev.map(opt => {
      if (opt.id === activeOptionId) {
        return {
          ...opt,
          scopeOfWorks: (opt.scopeOfWorks || []).map(s => {
            if (s.id === sowId) {
              const updated = { ...s, [field]: value };
              if (field === 'name') updated.isCustomName = true;
              
              if (!updated.isCustomName) {
                updated.name = generateScopeName(updated.platforms || [], updated.contentType || [], updated.serviceScope || {});
              }
              return updated;
            }
            return s;
          })
        };
      }
      return opt;
    }));
  };

  const handleUpdatePersona = (sowId, field, value) => {
    setBudgetOptions(prev => prev.map(opt => {
      if (opt.id === activeOptionId) {
        return {
          ...opt,
          scopeOfWorks: (opt.scopeOfWorks || []).map(s => s.id === sowId ? { ...s, persona: { ...s.persona, [field]: value } } : s)
        };
      }
      return opt;
    }));
  };

  const handleUpdateServiceScope = (sowId, field, value) => {
    setBudgetOptions(prev => prev.map(opt => {
      if (opt.id === activeOptionId) {
        return {
          ...opt,
          scopeOfWorks: (opt.scopeOfWorks || []).map(s => {
            if (s.id === sowId) {
              const updatedServiceScope = { ...(s.serviceScope || {}), [field]: value };
              const updated = { ...s, serviceScope: updatedServiceScope };
              if (!updated.isCustomName) {
                updated.name = generateScopeName(updated.platforms || [], updated.contentType || [], updated.serviceScope || {});
              }
              return updated;
            }
            return s;
          })
        };
      }
      return opt;
    }));
  };

  // Step 4: Brand Support & Condition
  const [brandSupportType, setBrandSupportType] = useState(initialData?.brandSupportType || "No Sponsor");
  const [brandSupportTypeOther, setBrandSupportTypeOther] = useState(initialData?.brandSupportTypeOther || "");
  const [productValue, setProductValue] = useState(initialData?.productValue || "");
  const [productReceiveMethod, setProductReceiveMethod] = useState(initialData?.productReceiveMethod || "");
  const [logisticsPerInfluencer, setLogisticsPerInfluencer] = useState(initialData?.logisticsPerInfluencer || "");
  const [reimbursement, setReimbursement] = useState(initialData?.reimbursement || "");
  const [requireTravel, setRequireTravel] = useState(initialData?.requireTravel || "");
  const [reviewerTravelExpense, setReviewerTravelExpense] = useState(initialData?.reviewerTravelExpense || "");
  const [onSiteType, setOnSiteType] = useState(initialData?.onSiteType || "");
  const [eventDuration, setEventDuration] = useState(initialData?.eventDuration || "");
  const [locationDetails, setLocationDetails] = useState(initialData?.locationDetails || "");
  const [buddyReviewSupport, setBuddyReviewSupport] = useState(initialData?.buddyReviewSupport || "");
  
  const defaultCondition = `1. Brand สามารถเลือก Influencer ได้จำนวน ... ครั้ง\n2. Brand สามารถตรวจ Content Idea ได้ ... ครั้ง\n3. Brand สามารถตรวจ Draft ได้จำนวน ... ครั้ง (แก้ไขได้เฉพาะการตัดต่อและแคปชั่นในกรณีที่ทำออกมาไม่ตรงตาม Final Brief เท่านั้น)\n4. Buddy Review เป็นผู้ประสานงานกับ Influencer\n5. Recheck คิวและราคาอีกครั้ง ก่อน Confirm งาน\n6. ราคานำเสนอดังกล่าว สามารถใช้ได้ถึง .........`;
  const [condition, setCondition] = useState(initialData?.condition || defaultCondition);

  const handleSubmit = (status) => {
    const primaryOpt = budgetOptions[0] || {};

    onSubmit({
      // Step 1
      customerId, brand, clientStatus, customerType, salesOwner,
      campaignName, packageType: packageType ? [packageType] : [], packageTypeOther, product, objective, objectiveNote, 
      gender, country, province, ageRange, lifestyle,
      campaignStartDate, campaignEndDate, platform, platformOther,
      isBuddyBoostRequired, targetBoost, buddyBoostDetail,
      previousCampaign, competitor, additionalInfo,
      budgetBoostSpending,
      // Step 2 (Legacy mapped fields)
      budgetSpending: primaryOpt.budgetSpending || "",
      vat: primaryOpt.vat || "Incl. VAT",
      budgetCondition: primaryOpt.budgetCondition || "",
      estimatedBrandSpending: primaryOpt.estimatedBrandSpending || "",
      budgetPerInfluencer: primaryOpt.budgetPerInfluencer || "",
      expectedNumInfluencers: primaryOpt.expectedNumInfluencers || "",
      expectedReach: primaryOpt.expectedReach || "",
      scopeOfWorks: primaryOpt.scopeOfWorks || [],
      // New: budgetOptions
      budgetOptions,
      // Step 3
      brandSupportType, brandSupportTypeOther, productValue, productReceiveMethod, logisticsPerInfluencer, reimbursement, requireTravel, onSiteType, eventDuration, locationDetails, buddyReviewSupport, condition, reviewerTravelExpense
    }, status);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (!open) return null;

  const activeOpt = budgetOptions.find(opt => opt.id === activeOptionId) || budgetOptions[0];

  return (
    <>
      <InfluencerDetailModal 
        open={infDetailModalOpen} 
        onClose={() => setInfDetailModalOpen(false)}
        initialData={currentEditingInfDetail}
        onSave={(data) => {
          setBudgetOptions(prev => prev.map(opt => {
            if (opt.id === currentEditingScopeInfo?.optId) {
              return {
                ...opt,
                scopeOfWorks: opt.scopeOfWorks.map(s => {
                  if (s.id === currentEditingScopeInfo?.sowId) {
                    const newDetails = [...(s.influencerDetails || [])];
                    if (currentEditingScopeInfo.detailId) {
                      const idx = newDetails.findIndex(d => d.id === currentEditingScopeInfo.detailId);
                      if (idx >= 0) newDetails[idx] = { ...data, id: currentEditingScopeInfo.detailId };
                    } else {
                      newDetails.push({ ...data, id: Date.now() + Math.random() });
                    }
                    return { ...s, influencerDetails: newDetails };
                  }
                  return s;
                })
              }
            }
            return opt;
          }));
        }}
      />
      <Modal
        isOpen={open}
        onClose={onClose}
        maxWidth="max-w-4xl"
        className="h-[90vh]"
        header={(
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{initialData ? `Edit Section ${currentStep}` : "Create New Brief"}</h2>
                {!initialData && <div className="text-sm font-medium text-slate-500 mt-1">Step {currentStep} of {totalSteps}</div>}
              </div>
              <button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            {!initialData && (
              <div className="border-b border-slate-100 bg-slate-50/50">
                <Stepper 
                  steps={["Client & Project", "Budget & SOW", "Support & Conditions"]}
                  currentStepIndex={currentStep - 1}
                />
              </div>
            )}
          </div>
        )}
      >

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-10">
              
              {/* Section 1 */}
              {currentStep === 1 && (
              <section>
                <h3 className="mb-4 text-base font-semibold text-[#6D5DF6] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs">1</span> 
                  Client & Project Details
                </h3>
                <div className="mb-6 rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <h4 className="mb-3 text-sm font-semibold text-slate-900">Client</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Sales Owner *</label>
                      <input type="text" value={salesOwner} onChange={e => setSalesOwner(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Select Customer</label>
                      <div className="relative">
                        <select 
                          value={customerId} 
                          onChange={e => {
                            const val = e.target.value;
                            setCustomerId(val);
                            const cust = customers.find(c => c.id === val);
                            if (cust && cust.type) {
                              setCustomerType(cust.type);
                            }
                          }}
                          className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]"
                        >
                          <option value="" disabled>Select Customer...</option>
                          {customers.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Client Status *</label>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-not-allowed opacity-60">
                          <input type="radio" name="clientStatus" value="New" checked={clientStatus === "New"} disabled className="h-4 w-4 text-[#6D5DF6]" />
                          <span className="text-sm text-slate-700">New</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-not-allowed opacity-60">
                          <input type="radio" name="clientStatus" value="Existing" checked={clientStatus === "Existing"} disabled className="h-4 w-4 text-[#6D5DF6]" />
                          <span className="text-sm text-slate-700">Existing</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Customer Type</label>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-not-allowed opacity-60">
                          <input type="radio" name="customerType" value="Key Account" checked={customerType === "Key Account"} disabled className="h-4 w-4 text-[#6D5DF6]" />
                          <span className="text-sm text-slate-700">Key Account</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-not-allowed opacity-60">
                          <input type="radio" name="customerType" value="Non-Key Account" checked={customerType === "Non-Key Account"} disabled className="h-4 w-4 text-[#6D5DF6]" />
                          <span className="text-sm text-slate-700">Non-Key Account</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <div className="mb-6 rounded-xl bg-slate-50 p-4 border border-slate-200">
                    <h4 className="mb-3 text-sm font-semibold text-slate-900">Project Details</h4>
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Project Name *</label>
                      <input type="text" value={campaignName} onChange={e => setCampaignName(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                    </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Package Type *</label>
                        <div className="grid grid-cols-2 gap-3 mb-2">
                          {[
                            "Standard (1 D)", "Standard KPI (0.5 D)", 
                            "Rate Card (2 D)", "Rate Card KPI (1.5 D)", 
                            "Combine (3 D)", "Combine KPI (2 D)", 
                            "Strategy (4 D)", "Strategy KPI (3 D)"
                          ].map(pkg => (
                            <label key={pkg} className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="packageType" checked={packageType === pkg} onChange={() => setPackageType(pkg)} className="h-4 w-4 text-[#6D5DF6]" />
                              <span className="text-sm text-slate-700">{pkg}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                            <input type="radio" name="packageType" checked={packageType === "Others"} onChange={() => setPackageType("Others")} className="h-4 w-4 text-[#6D5DF6]" />
                            <span className="text-sm text-slate-700">Others :</span>
                          </label>
                          {packageType === "Others" && (
                            <input type="text" value={packageTypeOther} onChange={e => setPackageTypeOther(e.target.value)} className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#6D5DF6]" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">*Remark : 11:00 = Half Day / 16:00 = Next Day</p>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Product Name *</label>
                        <input type="text" value={brand} onChange={e => setBrand(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Product Detail *</label>
                        <SimpleHtmlEditor value={product} onChange={setProduct} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 flex flex-col gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Objective *</label>
                        <div className="flex flex-wrap items-center gap-6">
                          {["Awareness (Reach)", "Interest (Engagement)", "Trust (Post)"].map(obj => (
                            <label key={obj} className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={objective.includes(obj)} onChange={e => {
                                if (e.target.checked) setObjective([...objective, obj]);
                                else setObjective(objective.filter(o => o !== obj));
                              }} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6] focus:ring-[#6D5DF6]" />
                              <span className="text-sm text-slate-700">{obj}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Objective Note</label>
                        <textarea rows={2} value={objectiveNote} onChange={e => setObjectiveNote(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]"></textarea>
                      </div>
                    </div>
                      
                      <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                        <h5 className="mb-3 text-sm font-semibold text-slate-900">Target Audience Campaign</h5>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Gender</label>
                            <div className="flex items-center gap-4">
                              {["Male", "Female"].map(g => (
                                <label key={g} className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" checked={gender.includes(g)} onChange={e => {
                                    if (e.target.checked) setGender([...gender, g]);
                                    else setGender(gender.filter(i => i !== g));
                                  }} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6] focus:ring-[#6D5DF6]" />
                                  <span className="text-sm text-slate-700">{g}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-slate-700">Age Range</label>
                            <div className="flex flex-wrap items-center gap-4">
                              {["13-17", "18-24", "25-34", "35-44", "45-64"].map(age => (
                                <label key={age} className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" checked={ageRange.includes(age)} onChange={e => {
                                    if (e.target.checked) setAgeRange([...ageRange, age]);
                                    else setAgeRange(ageRange.filter(i => i !== age));
                                  }} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6] focus:ring-[#6D5DF6]" />
                                  <span className="text-sm text-slate-700">{age}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Country</label>
                            <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Province</label>
                            <input type="text" value={province} onChange={e => setProvince(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-slate-700">Lifestyle</label>
                            <input type="text" value={lifestyle} onChange={e => setLifestyle(e.target.value)} placeholder="e.g. Cafe hopper, Sports, Lifestyle, Family" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 flex flex-col gap-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">Campaign Period *</label>
                          <div className="flex items-center gap-2">
                            <input type="date" value={campaignStartDate} onChange={e => setCampaignStartDate(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                            <span className="text-slate-400">-</span>
                            <input type="date" value={campaignEndDate} onChange={e => setCampaignEndDate(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 flex flex-col gap-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">Previous Campaign / Work Reference</label>
                          <SimpleHtmlEditor value={previousCampaign} onChange={setPreviousCampaign} />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">Competitor Info</label>
                          <SimpleHtmlEditor value={competitor} onChange={setCompetitor} />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">Additional Info</label>
                          <SimpleHtmlEditor value={additionalInfo} onChange={setAdditionalInfo} />
                        </div>
                      </div>
                    </div>
                  </div>
              </section>
              )}

              {/* Section 2 */}
              {currentStep === 2 && (
              <section className="flex-1 overflow-y-auto px-6 py-4">
                <h3 className="mb-4 text-base font-semibold text-[#6D5DF6] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs">2</span> 
                  Budget & SOW Options
                </h3>
                
                {/* Budget Options Tab Headers */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 mb-6">
                  {budgetOptions.map((opt, oIdx) => {
                    const isActive = opt.id === activeOptionId;
                    return (
                      <div key={opt.id} className="relative flex items-center pr-3 pb-1">
                        <button
                          type="button"
                          onClick={() => setActiveOptionId(opt.id)}
                          className={cn(
                            "px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2",
                            isActive
                              ? "bg-[#6D5DF6] text-white shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          <span>{opt.name || `Option ${String.fromCharCode(65 + oIdx)}`}</span>
                        </button>
                        {budgetOptions.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveOption(opt.id);
                            }}
                            className={cn(
                              "absolute top-0 right-2 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold shadow-sm transition",
                              isActive
                                ? "bg-rose-500 text-white hover:bg-rose-600"
                                : "bg-slate-300 text-slate-700 hover:bg-slate-400"
                            )}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#6D5DF6] px-3 text-xs font-semibold text-[#6D5DF6] transition hover:bg-violet-50"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Option
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  {/* Option Name & Budget Fields */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">Budget Details for {activeOpt.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700 font-semibold text-[#6D5DF6]">Option Name</label>
                        <input
                          type="text"
                          value={activeOpt.name}
                          onChange={e => updateActiveOption("name", e.target.value)}
                          placeholder="e.g. Option A: 300K Budget"
                          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#6D5DF6]"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Budget Spending</label>
                        <div className="relative">
                          <input type="text" value={activeOpt.budgetSpending} onChange={e => updateActiveOption("budgetSpending", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white pl-4 pr-12 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
                          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">THB</span>
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">VAT</label>
                        <div className="flex items-center gap-6 py-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name={`vat-${activeOpt.id}`} value="Incl. VAT" checked={activeOpt.vat === "Incl. VAT"} onChange={e => updateActiveOption("vat", e.target.value)} className="h-4 w-4 text-[#6D5DF6]" />
                            <span className="text-sm text-slate-700">Incl. VAT</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name={`vat-${activeOpt.id}`} value="Excl. VAT" checked={activeOpt.vat === "Excl. VAT"} onChange={e => updateActiveOption("vat", e.target.value)} className="h-4 w-4 text-[#6D5DF6]" />
                            <span className="text-sm text-slate-700">Excl. VAT</span>
                          </label>
                        </div>
                      </div>
                      <div className="md:col-span-2 border-t border-slate-100 pt-4 space-y-3">
                        <label className="block text-sm font-semibold text-slate-800">Condition Options</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Option 1: Refer */}
                          <div className={cn("p-4 rounded-xl border transition-all cursor-pointer", (activeOpt.budgetConditionType || "Refer") === "Refer" ? "bg-violet-50/50 border-[#6D5DF6]" : "bg-white border-slate-200 hover:bg-slate-50")} onClick={() => updateActiveOptionCondition("Refer", activeOpt.budgetConditionValue || "")}>
                            <div className="flex items-center gap-2 mb-2">
                              <input type="radio" name={`budgetCondRadio-${activeOpt.id}`} checked={(activeOpt.budgetConditionType || "Refer") === "Refer"} onChange={() => updateActiveOptionCondition("Refer", activeOpt.budgetConditionValue || "")} className="h-4 w-4 text-[#6D5DF6]" />
                              <span className="text-sm font-semibold text-slate-800">Refer</span>
                            </div>
                            {(activeOpt.budgetConditionType || "Refer") === "Refer" && (
                              <div className="mt-2" onClick={e => e.stopPropagation()}>
                                <label className="text-xs text-slate-500 block mb-1">Referral Percentage (%) *</label>
                                <input type="number" placeholder="e.g. 10" value={activeOpt.budgetConditionValue || ""} onChange={e => updateActiveOptionCondition("Refer", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#6D5DF6]" />
                              </div>
                            )}
                          </div>

                          {/* Option 2: Rebate */}
                          <div className={cn("p-4 rounded-xl border transition-all cursor-pointer", activeOpt.budgetConditionType === "Rebate" ? "bg-violet-50/50 border-[#6D5DF6]" : "bg-white border-slate-200 hover:bg-slate-50")} onClick={() => updateActiveOptionCondition("Rebate", activeOpt.budgetConditionValue || "")}>
                            <div className="flex items-center gap-2 mb-2">
                              <input type="radio" name={`budgetCondRadio-${activeOpt.id}`} checked={activeOpt.budgetConditionType === "Rebate"} onChange={() => updateActiveOptionCondition("Rebate", activeOpt.budgetConditionValue || "")} className="h-4 w-4 text-[#6D5DF6]" />
                              <span className="text-sm font-semibold text-slate-800">Rebate</span>
                            </div>
                            {activeOpt.budgetConditionType === "Rebate" && (
                              <div className="mt-2" onClick={e => e.stopPropagation()}>
                                <label className="text-xs text-slate-500 block mb-1">Rebate Percentage (%) *</label>
                                <input type="number" placeholder="e.g. 5" value={activeOpt.budgetConditionValue || ""} onChange={e => updateActiveOptionCondition("Rebate", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#6D5DF6]" />
                              </div>
                            )}
                          </div>

                          {/* Option 3: Inventory */}
                          <div className={cn("p-4 rounded-xl border transition-all cursor-pointer", activeOpt.budgetConditionType === "Inventory" ? "bg-violet-50/50 border-[#6D5DF6]" : "bg-white border-slate-200 hover:bg-slate-50")} onClick={() => updateActiveOptionCondition("Inventory", activeOpt.budgetConditionValue || "")}>
                            <div className="flex items-center gap-2 mb-2">
                              <input type="radio" name={`budgetCondRadio-${activeOpt.id}`} checked={activeOpt.budgetConditionType === "Inventory"} onChange={() => updateActiveOptionCondition("Inventory", activeOpt.budgetConditionValue || "")} className="h-4 w-4 text-[#6D5DF6]" />
                              <span className="text-sm font-semibold text-slate-800">Inventory</span>
                            </div>
                            {activeOpt.budgetConditionType === "Inventory" && (
                              <div className="mt-2" onClick={e => e.stopPropagation()}>
                                <label className="text-xs text-slate-500 block mb-1">Inventory Amount (Baht) *</label>
                                <input type="number" placeholder="e.g. 50000" value={activeOpt.budgetConditionValue || ""} onChange={e => updateActiveOptionCondition("Inventory", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#6D5DF6]" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Estimated Brand Spending</label>
                        <div className="relative">
                          <input type="text" value={activeOpt.estimatedBrandSpending} onChange={e => updateActiveOption("estimatedBrandSpending", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white pl-4 pr-12 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
                          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">THB</span>
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Budget per Influencer (If any)</label>
                        <div className="relative">
                          <input type="text" value={activeOpt.budgetPerInfluencer} onChange={e => updateActiveOption("budgetPerInfluencer", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white pl-4 pr-12 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
                          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">THB</span>
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Expected Number of Influencers (If any)</label>
                        <input type="number" value={activeOpt.expectedNumInfluencers} onChange={e => updateActiveOption("expectedNumInfluencers", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700">Expected Reach</label>
                        <input type="text" value={activeOpt.expectedReach} onChange={e => updateActiveOption("expectedReach", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#6D5DF6]/5 p-4 border border-[#6D5DF6]/10 mt-6 mb-6">
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Buddy Boost Required?</label>
                    <div className="flex items-center gap-6 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="buddyBoost" checked={isBuddyBoostRequired === true} onChange={() => setIsBuddyBoostRequired(true)} className="h-4 w-4 text-[#6D5DF6]" />
                        <span className="text-sm text-slate-700">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="buddyBoost" checked={isBuddyBoostRequired === false} onChange={() => {
                          setIsBuddyBoostRequired(false);
                          setTargetBoost([]);
                          setBuddyBoostDetail("");
                          setBudgetBoostSpending("");
                        }} className="h-4 w-4 text-[#6D5DF6]" />
                        <span className="text-sm text-slate-700">No</span>
                      </label>
                    </div>

                    {isBuddyBoostRequired && (
                      <div className="space-y-4 pt-4 border-t border-[#6D5DF6]/10">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">Target Boost</label>
                          <div className="flex flex-wrap items-center gap-4">
                            {["Awareness", "Engagement", "View", "Follower", "Drive sale", "Traffic"].map(target => (
                              <label key={target} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={targetBoost.includes(target)} onChange={e => {
                                  if (e.target.checked) setTargetBoost([...targetBoost, target]);
                                  else setTargetBoost(targetBoost.filter(t => t !== target));
                                }} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6] focus:ring-[#6D5DF6]" />
                                <span className="text-sm text-slate-700">{target}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">Budget Boost Spending</label>
                          <div className="relative">
                            <input type="text" value={budgetBoostSpending} onChange={e => setBudgetBoostSpending(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white pl-3 pr-12 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">THB</span>
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">Detail</label>
                          <textarea rows={2} value={buddyBoostDetail} onChange={e => setBuddyBoostDetail(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                        </div>
                      </div>
                    )}
                  </div>
                
                  {/* SOW list nested under option */}
                  <div className="mt-8 space-y-4 border-t border-slate-200 pt-6">
                    <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700">Scope of Work Items</label>
                    <Button variant="ghost" onClick={handleAddScope} className="h-8 px-2 text-xs">
                      <Plus className="h-4 w-4" /> Add Scope
                    </Button>
                  </div>
                  {activeOpt.scopeOfWorks.map((scope, index) => {
                    const getAvailableContentTypes = (plats) => {
                      const allTypes = new Set();
                      plats.forEach(p => {
                        if (p === "Facebook" || p === "Facebook Page") {
                          ["Text Post", "Photos", "Reels", "Story", "Live", "Event", "Share", "Like", "Seeding Comment", "Seeding Comment Photo"].forEach(t => allTypes.add(t));
                        } else if (p === "Instagram") {
                          ["Photos", "Reels", "Story", "Live", "Note", "Repost", "Like", "Save", "Share", "Seeding Comment", "Seeding Comment Photo"].forEach(t => allTypes.add(t));
                        } else if (p === "TikTok") {
                          ["Video", "Photos", "Text Post", "Story", "Live", "Repost", "Like", "Save", "Share", "Seeding Comment", "Seeding Comment Photo"].forEach(t => allTypes.add(t));
                        } else if (p === "YouTube") {
                          ["Video", "Shorts", "Live", "Like", "Share", "Save", "Seeding Comment", "Seeding Comment Photo", "Podcast", "Text Community Post", "Photos Community Post", "Poll", "Quiz"].forEach(t => allTypes.add(t));
                        } else if (p === "Threads") {
                          ["Text Post", "Photos", "Video", "Reply", "Repost", "Quote", "Like"].forEach(t => allTypes.add(t));
                        } else if (p === "X") {
                          ["Text Post", "Photos", "Video", "Repost", "Reply", "Quote", "Like", "Poll"].forEach(t => allTypes.add(t));
                        } else if (p === "Application") {
                          ["Download App", "Rating App", "Seeding Comment", "Seeding Comment Photo"].forEach(t => allTypes.add(t));
                        } else if (p === "E-COMMERCE App") {
                          ["Download App", "Rating App", "Photos", "Seeding Comment", "Seeding Comment Photo"].forEach(t => allTypes.add(t));
                        } else if (p === "Lemon8") {
                          allTypes.add("Photo"); allTypes.add("Carousel");
                        }
                      });
                      if (plats.includes("Others")) allTypes.add("Custom");
                      return Array.from(allTypes);
                    };
                    const getAvailableViaOptions = (plats) => {
                      const allPlatforms = ["Facebook", "Facebook Page", "Instagram", "TikTok", "YouTube", "Threads", "X", "Lemon8", "Application", "E-COMMERCE App"];
                      const currentPlat = plats?.[0] || "";
                      return allPlatforms.filter(p => p !== currentPlat);
                    };
                    const scopePlats = Array.isArray(scope.platforms) 
                      ? scope.platforms 
                      : (scope.platforms ? [scope.platforms] : []);
                    const availableContentTypes = getAvailableContentTypes(scopePlats);

                    return (
                    <div key={scope.id} className="rounded-xl border border-slate-200 bg-slate-50 p-6 relative mb-6">
                      {activeOpt.scopeOfWorks.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveScope(scope.id)}
                          className="absolute top-4 right-4 text-slate-400 hover:text-rose-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                      <h4 className="mb-6 text-base font-semibold text-slate-900 border-b border-slate-200 pb-2">Scope {index + 1}</h4>
                      
                      <div className="grid gap-6 md:grid-cols-2 mb-8">
                        <div className="md:col-span-2">
                          <label className="mb-2 block text-sm font-medium text-slate-700">Platform *</label>
                          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
                            {["Facebook", "Facebook Page", "Instagram", "TikTok", "YouTube", "Threads", "X", "Lemon8", "Application", "E-COMMERCE App", "Others"].map(plat => (
                              <label key={plat} className="flex items-center gap-2 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name={`sow-platform-${scope.id}`}
                                  checked={scopePlats.includes(plat)} 
                                  onChange={e => {
                                    if (e.target.checked) {
                                      handleUpdateScope(scope.id, 'platforms', [plat]);
                                    }
                                  }} 
                                  className="h-4 w-4 text-[#6D5DF6] focus:ring-[#6D5DF6]" 
                                />
                                <span className="text-sm text-slate-700">{plat}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-2 block text-sm font-medium text-slate-700">Via</label>
                          <div className="flex flex-wrap gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-3xs">
                            {getAvailableViaOptions(scopePlats).map(viaOpt => {
                              const selectedVias = scope.serviceScope?.selectedVias || [];
                              const isViaChecked = selectedVias.includes(viaOpt);
                              return (
                                <label key={viaOpt} className="flex items-center gap-2 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={isViaChecked} 
                                    onChange={e => {
                                      let updatedVias = [...selectedVias];
                                      if (e.target.checked) {
                                        updatedVias.push(viaOpt);
                                      } else {
                                        updatedVias = updatedVias.filter(v => v !== viaOpt);
                                      }
                                      handleUpdateServiceScope(scope.id, 'selectedVias', updatedVias);
                                    }} 
                                    className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" 
                                  />
                                  <span className="text-sm text-slate-700">{viaOpt}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-2 block text-sm font-medium text-slate-700">Content Type</label>
                          <MultiSelect 
                            value={scope.contentType || []} 
                            onChange={val => handleUpdateScope(scope.id, 'contentType', val)} 
                            options={availableContentTypes.length ? availableContentTypes : ["Photo", "Video", "Reel"]} 
                            placeholder={availableContentTypes.length ? "Select content types" : "Select platform first"}
                          />
                        </div>



                        <div className="md:col-span-2">
                          <h5 className="mb-4 text-sm font-semibold text-slate-900 pt-6 mt-4 border-t border-slate-200">Boost by page</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div>
                              <label className="flex items-center gap-2 cursor-pointer mb-2">
                                <input type="checkbox" checked={scope.serviceScope?.buyoutRequired} onChange={e => handleUpdateServiceScope(scope.id, 'buyoutRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                <span className="text-sm font-medium text-slate-700">Buyout</span>
                              </label>
                              {scope.serviceScope?.buyoutRequired && (
                                <div className="pl-6">
                                  <MultiSelect value={scope.serviceScope?.buyoutDuration || []} onChange={val => handleUpdateServiceScope(scope.id, 'buyoutDuration', val)} options={packageType?.startsWith("Standard") ? ["7 วัน", "15 วัน", "30 วัน"] : ["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                </div>
                              )}
                            </div>

                            {scopePlats.some(p => ["Facebook", "Facebook Page", "Instagram", "TikTok"].includes(p)) && (
                              <div>
                                <label className="flex items-center gap-2 cursor-pointer mb-2">
                                  <input type="checkbox" checked={scope.serviceScope?.boostPostRequired} onChange={e => handleUpdateServiceScope(scope.id, 'boostPostRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-350 text-[#6D5DF6]" />
                                  <span className="text-sm font-medium text-slate-700">Boost by Page</span>
                                </label>
                                {scope.serviceScope?.boostPostRequired && (
                                  <div className="pl-6">
                                    <MultiSelect value={scope.serviceScope?.boostPostDuration || []} onChange={val => handleUpdateServiceScope(scope.id, 'boostPostDuration', val)} options={packageType?.startsWith("Standard") ? ["7 วัน", "15 วัน", "30 วัน"] : ["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                  </div>
                                )}
                              </div>
                            )}

                            {scopePlats.some(p => ["Facebook", "Facebook Page", "Instagram", "TikTok", "YouTube", "X"].includes(p)) && (
                              <div>
                                <label className="flex items-center gap-2 cursor-pointer mb-2">
                                  <input type="checkbox" checked={scope.serviceScope?.addAdsRequired} onChange={e => handleUpdateServiceScope(scope.id, 'addAdsRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                  <span className="text-sm font-medium text-slate-700">Add Ads</span>
                                </label>
                                {scope.serviceScope?.addAdsRequired && (
                                  <div className="pl-6">
                                    <MultiSelect value={scope.serviceScope?.addAdsDuration || []} onChange={val => handleUpdateServiceScope(scope.id, 'addAdsDuration', val)} options={packageType?.startsWith("Standard") ? ["7 วัน", "15 วัน", "30 วัน"] : ["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                  </div>
                                )}
                              </div>
                            )}

                            {scopePlats.some(p => ["Facebook", "Facebook Page", "Instagram", "TikTok"].includes(p)) && (
                              <div>
                                <label className="flex items-center gap-2 cursor-pointer mb-2">
                                  <input type="checkbox" checked={scope.serviceScope?.paidPartnershipRequired} onChange={e => handleUpdateServiceScope(scope.id, 'paidPartnershipRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-350 text-[#6D5DF6]" />
                                  <span className="text-sm font-medium text-slate-700">Paid Partnership</span>
                                </label>
                                {scope.serviceScope?.paidPartnershipRequired && (
                                  <div className="pl-6">
                                    <MultiSelect value={scope.serviceScope?.paidPartnershipDuration || []} onChange={val => handleUpdateServiceScope(scope.id, 'paidPartnershipDuration', val)} options={packageType?.startsWith("Standard") ? ["7 วัน", "15 วัน", "30 วัน"] : ["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                  </div>
                                )}
                              </div>
                            )}

                            {scopePlats.includes("YouTube") && (
                              <div>
                                <label className="flex items-center gap-2 cursor-pointer mb-2">
                                  <input type="checkbox" checked={scope.serviceScope?.discoveryRequired} onChange={e => handleUpdateServiceScope(scope.id, 'discoveryRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                  <span className="text-sm font-medium text-slate-700">Youtube Discovery</span>
                                </label>
                                {scope.serviceScope?.discoveryRequired && (
                                  <div className="pl-6">
                                    <MultiSelect value={scope.serviceScope?.discoveryDuration || []} onChange={val => handleUpdateServiceScope(scope.id, 'discoveryDuration', val)} options={packageType?.startsWith("Standard") ? ["7 วัน", "15 วัน", "30 วัน"] : ["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                  </div>
                                )}
                              </div>
                            )}

                            {scopePlats.includes("TikTok") && (
                              <>
                                <div>
                                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                                    <input type="checkbox" checked={scope.serviceScope?.genCodeRequired} onChange={e => handleUpdateServiceScope(scope.id, 'genCodeRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-350 text-[#6D5DF6]" />
                                    <span className="text-sm font-medium text-slate-700">Gen Code</span>
                                  </label>
                                  {scope.serviceScope?.genCodeRequired && (
                                    <div className="pl-6">
                                      <MultiSelect value={scope.serviceScope?.genCodeDuration || []} onChange={val => handleUpdateServiceScope(scope.id, 'genCodeDuration', val)} options={packageType?.startsWith("Standard") ? ["7 วัน", "15 วัน", "30 วัน"] : ["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={scope.serviceScope?.tiktokShopRequired} onChange={e => handleUpdateServiceScope(scope.id, 'tiktokShopRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                    <span className="text-sm font-medium text-slate-700">TikTok Shop</span>
                                  </label>
                                </div>
                              </>
                            )}

                            {scopePlats.some(p => ["Facebook", "Facebook Page"].includes(p)) && (
                              <div>
                                <label className="flex items-center gap-2 cursor-pointer mb-2">
                                  <input type="checkbox" checked={scope.serviceScope?.brandedContentRequired} onChange={e => handleUpdateServiceScope(scope.id, 'brandedContentRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                  <span className="text-sm font-medium text-slate-700">FB Branded Content</span>
                                </label>
                                {scope.serviceScope?.brandedContentRequired && (
                                  <div className="pl-6">
                                    <MultiSelect value={scope.serviceScope?.brandedContentDuration || []} onChange={val => handleUpdateServiceScope(scope.id, 'brandedContentDuration', val)} options={packageType?.startsWith("Standard") ? ["7 วัน", "15 วัน", "30 วัน"] : ["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                  </div>
                                )}
                              </div>
                            )}

                            {scopePlats.includes("X") && (
                              <div>
                                <label className="flex items-center gap-2 cursor-pointer mb-2">
                                  <input type="checkbox" checked={scope.serviceScope?.whitelistingRequired} onChange={e => handleUpdateServiceScope(scope.id, 'whitelistingRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                  <span className="text-sm font-medium text-slate-700">X Whitelisting</span>
                                </label>
                                {scope.serviceScope?.whitelistingRequired && (
                                  <div className="pl-6">
                                    <MultiSelect value={scope.serviceScope?.whitelistingDuration || []} onChange={val => handleUpdateServiceScope(scope.id, 'whitelistingDuration', val)} options={packageType?.startsWith("Standard") ? ["7 วัน", "15 วัน", "30 วัน"] : ["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                  </div>
                                )}
                              </div>
                            )}

                          </div>
                        </div>
                        <div className="md:col-span-2 pt-2">
                          <label className="mb-2 block text-sm font-medium text-slate-700">Scope Name</label>
                          <input 
                            type="text" 
                            value={scope.name || ""} 
                            onChange={e => handleUpdateScope(scope.id, 'name', e.target.value)} 
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
                            placeholder="e.g. TikTok Video (Boost by Page 30 วัน)"
                          />
                        </div>


                        <div className="md:col-span-2">
                          <label className="mb-2 block text-sm font-medium text-slate-700">Details</label>
                          <SimpleHtmlEditor value={scope.details} onChange={val => handleUpdateScope(scope.id, 'details', val)} />
                        </div>
                      </div>

                      {/* Persona under SOW */}
                      <div className="flex items-center justify-between mb-4 border-t border-slate-200 pt-6">
                        <h5 className="text-sm font-semibold text-slate-900">Influencer details</h5>
                        {!packageType?.startsWith("Standard") && (
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentEditingScopeInfo({ optId: activeOpt.id, sowId: scope.id, detailId: null });
                              setCurrentEditingInfDetail(null);
                              setInfDetailModalOpen(true);
                            }}
                            className="flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-semibold text-[#6D5DF6] hover:bg-violet-100 transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add Influencer Details
                          </button>
                        )}
                      </div>
                      
                      {packageType?.startsWith("Standard") ? (
                        <div className="grid gap-4 md:grid-cols-2 mb-8">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Number of Influencers</label>
                            <input type="number" value={scope.numInfluencers} onChange={e => handleUpdateScope(scope.id, 'numInfluencers', e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Follower Requirement</label>
                            <Select 
                              value={scope.followerReq || ""} 
                              onChange={val => handleUpdateScope(scope.id, 'followerReq', val)} 
                              options={["1K - 5K", "5K - 10K", "10K - 50K", "50K - 100K", "100K+"]} 
                              placeholder="Select follower range" 
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-slate-700">Special Condition</label>
                            <MultiSelect 
                              value={scope.persona?.specialConditions || []} 
                              onChange={val => handleUpdatePersona(scope.id, 'specialConditions', val)} 
                              options={getSpecialConditionsForPlatforms(scopePlats)} 
                              placeholder="Select special conditions"
                            />
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Demographic</label>
                            <input 
                              type="text" 
                              value={scope.persona?.demographic || ""} 
                              onChange={e => handleUpdatePersona(scope.id, 'demographic', e.target.value)} 
                              placeholder="e.g. 18-24 Female, Gen Z" 
                              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
                            />
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
                            <input 
                              type="text" 
                              value={scope.persona?.location || ""} 
                              onChange={e => handleUpdatePersona(scope.id, 'location', e.target.value)} 
                              placeholder="e.g. Bangkok, Upcountry" 
                              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
                            />
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Occupation</label>
                            <input 
                              type="text" 
                              value={scope.persona?.occupation || ""} 
                              onChange={e => handleUpdatePersona(scope.id, 'occupation', e.target.value)} 
                              placeholder="e.g. Office worker, Student" 
                              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
                            />
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Persona</label>
                            <input 
                              type="text" 
                              value={scope.persona?.persona || ""} 
                              onChange={e => handleUpdatePersona(scope.id, 'persona', e.target.value)} 
                              placeholder="e.g. Friendly, Informative" 
                              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
                            />
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Content Category</label>
                            <input 
                              type="text" 
                              value={scope.persona?.contentCategory || ""} 
                              onChange={e => handleUpdatePersona(scope.id, 'contentCategory', e.target.value)} 
                              placeholder="e.g. Beauty, Lifestyle, Tech" 
                              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
                            />
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Story Telling</label>
                            <input 
                              type="text" 
                              value={scope.persona?.storyTelling || ""} 
                              onChange={e => handleUpdatePersona(scope.id, 'storyTelling', e.target.value)} 
                              placeholder="e.g. Soft-sell, Daily vlog" 
                              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="mb-8 space-y-3">
                          {scope.influencerDetails && scope.influencerDetails.length > 0 ? (
                            scope.influencerDetails.map((detail, idx) => (
                              <div key={detail.id || idx} className="rounded-xl border border-slate-200 bg-white p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h6 className="text-sm font-bold text-slate-800">Group {idx + 1}</h6>
                                  <div className="flex items-center gap-2">
                                    <button 
                                      type="button" 
                                      onClick={() => {
                                        setCurrentEditingScopeInfo({ optId: activeOpt.id, sowId: scope.id, detailId: detail.id });
                                        setCurrentEditingInfDetail(detail);
                                        setInfDetailModalOpen(true);
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-[#6D5DF6] hover:bg-slate-50 rounded-lg"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        if (window.confirm("Delete this group?")) {
                                          const newDetails = scope.influencerDetails.filter(d => d.id !== detail.id);
                                          handleUpdateScope(scope.id, 'influencerDetails', newDetails);
                                        }
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4 text-xs">
                                  <div>
                                    <div className="text-slate-400 mb-1">Influencers</div>
                                    <div className="font-semibold text-slate-700">{detail.numInfluencers || "-"}</div>
                                  </div>
                                  <div>
                                    <div className="text-slate-400 mb-1">Followers</div>
                                    <div className="font-semibold text-slate-700">
                                      {detail.followerReqFrom || detail.followerReqTo 
                                        ? `${detail.followerReqFrom ? Number(detail.followerReqFrom).toLocaleString() : "0"} - ${detail.followerReqTo ? Number(detail.followerReqTo).toLocaleString() : "Any"}` 
                                        : "-"}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-slate-400 mb-1">Demographic</div>
                                    <div className="font-semibold text-slate-700 truncate">{detail.persona?.demographic || "-"}</div>
                                  </div>
                                  <div>
                                    <div className="text-slate-400 mb-1">Location</div>
                                    <div className="font-semibold text-slate-700 truncate">{detail.persona?.location || "-"}</div>
                                  </div>
                                  <div>
                                    <div className="text-slate-400 mb-1">Occupation</div>
                                    <div className="font-semibold text-slate-700 truncate">{detail.persona?.occupation || "-"}</div>
                                  </div>
                                  <div>
                                    <div className="text-slate-400 mb-1">Persona</div>
                                    <div className="font-semibold text-slate-700 truncate">{detail.persona?.persona || "-"}</div>
                                  </div>
                                  <div>
                                    <div className="text-slate-400 mb-1">Content Category</div>
                                    <div className="font-semibold text-slate-700 truncate">{detail.persona?.contentCategory || "-"}</div>
                                  </div>
                                  <div>
                                    <div className="text-slate-400 mb-1">Story Telling</div>
                                    <div className="font-semibold text-slate-700 truncate">{detail.persona?.storyTelling || "-"}</div>
                                  </div>
                                </div>

                                {/* Reference Influencers Display in Group Card */}
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
                            ))
                          ) : (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-8 text-center">
                              <Users className="mx-auto h-6 w-6 text-slate-400 mb-2" />
                              <p className="text-sm text-slate-500">No influencer details added yet.</p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="md:col-span-2 border-t border-slate-200 pt-6 space-y-4">
                        <h5 className="text-sm font-semibold text-slate-900">Brand Support & On-Site</h5>
                        
                        <div className="grid gap-6 md:grid-cols-2 bg-slate-50 p-6 md:p-8 rounded-xl border border-slate-100">
                          <div className="md:col-span-2">
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Brand Support Type</label>
                            <div className="flex items-center gap-6 py-1">
                              {["No Sponsor", "Brand Sponsor"].map(opt => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                  <input 
                                    type="radio" 
                                    name={`brandSupportType-${scope.id}`} 
                                    value={opt} 
                                    checked={(scope.brandSupportType || "No Sponsor") === opt} 
                                    onChange={e => {
                                      handleUpdateScope(scope.id, 'brandSupportType', e.target.value);
                                      handleUpdateScope(scope.id, 'productReceiveMethod', "");
                                      handleUpdateScope(scope.id, 'reimbursement', "");
                                    }} 
                                    className="h-4 w-4 text-[#6D5DF6]" 
                                  />
                                  <span className="text-sm text-slate-700">{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>


                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">วิธีการรับสินค้า/บริการ</label>
                            <Select 
                              value={scope.productReceiveMethod || ""} 
                              onChange={val => {
                                handleUpdateScope(scope.id, 'productReceiveMethod', val);
                                if (val !== "Influencer ซื้อเอง") {
                                  handleUpdateScope(scope.id, 'reimbursement', "");
                                }
                              }} 
                              options={
                                (scope.brandSupportType || "No Sponsor") === "No Sponsor" ? ["Buddy Review ซื้อและจัดส่งให้ Influencer", "Influencer ซื้อเอง"] :
                                scope.brandSupportType === "Brand Sponsor" ? ["Sponsor สินค้า (Buddy Review จัดส่ง)", "Sponsor สินค้า (แบรนด์จัดส่ง)", "สินค้าเวียน/ยืม (Borrowed/Rotated)"] :
                                []
                              } 
                            />
                          </div>

                          {["Buddy Review ซื้อและจัดส่งให้ Influencer", "Sponsor สินค้า (Buddy Review จัดส่ง)"].includes(scope.productReceiveMethod) && (
                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-700">ค่าจัดส่งต่อ Influencer</label>
                              <div className="relative">
                                <input type="number" value={scope.logisticsPerInfluencer || ""} onChange={e => handleUpdateScope(scope.id, 'logisticsPerInfluencer', e.target.value)} placeholder="ระบุค่าจัดส่งต่อ Influencer" className="w-full rounded-lg border border-slate-200 bg-white pl-4 pr-12 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">THB</span>
                              </div>
                            </div>
                          )}

                          {scope.productReceiveMethod === "สินค้าเวียน/ยืม (Borrowed/Rotated)" && (
                            <>
                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Logistic Brand to Buddy</label>
                                <div className="relative">
                                  <input type="number" value={scope.logisticBrandToBuddy || ""} onChange={e => handleUpdateScope(scope.id, 'logisticBrandToBuddy', e.target.value)} placeholder="ระบุค่าจัดส่ง Brand to Buddy" className="w-full rounded-lg border border-slate-200 bg-white pl-4 pr-12 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">THB</span>
                                </div>
                              </div>
                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">ค่าจัดส่งต่อ Influencer</label>
                                <div className="relative">
                                  <input type="number" value={scope.logisticsPerInfluencer || ""} onChange={e => handleUpdateScope(scope.id, 'logisticsPerInfluencer', e.target.value)} placeholder="ระบุค่าจัดส่งต่อ Influencer" className="w-full rounded-lg border border-slate-200 bg-white pl-4 pr-12 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">THB</span>
                                </div>
                              </div>
                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Logistic Influencer to Buddy</label>
                                <div className="relative">
                                  <input type="number" value={scope.logisticInfluencerToBuddy || ""} onChange={e => handleUpdateScope(scope.id, 'logisticInfluencerToBuddy', e.target.value)} placeholder="ระบุค่าจัดส่ง Influencer to Buddy" className="w-full rounded-lg border border-slate-200 bg-white pl-4 pr-12 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">THB</span>
                                </div>
                              </div>
                            </>
                          )}

                          {(scope.brandSupportType || "No Sponsor") === "No Sponsor" && scope.productReceiveMethod === "Influencer ซื้อเอง" && (
                            <div className="md:col-span-2 pt-3">
                              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">การเบิกค่าใช้จ่าย</label>
                              <div className="flex flex-col gap-3">
                                {["กำหนดงบต่อคน", "เบิกตามจริง", "ไม่เบิก"].map(reimOpt => (
                                  <label key={reimOpt} className={`relative flex cursor-pointer rounded-xl border px-4 py-2.5 transition-colors ${scope.reimbursement === reimOpt ? "border-[#6D5DF6] bg-violet-50/30 ring-1 ring-[#6D5DF6]" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                                    <div className="flex items-center gap-3">
                                      <input type="radio" name={`reimbursement-${scope.id}`} value={reimOpt} checked={scope.reimbursement === reimOpt} onChange={() => handleUpdateScope(scope.id, 'reimbursement', reimOpt)} className="h-4 w-4 border-slate-300 text-[#6D5DF6] focus:ring-[#6D5DF6]" />
                                      <div>
                                        <div className="font-semibold text-slate-800 text-sm">{reimOpt}</div>
                                      </div>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {((scope.brandSupportType || "No Sponsor") === "No Sponsor" && (scope.productReceiveMethod === "Buddy Review ซื้อและจัดส่งให้ Influencer" || ["กำหนดงบต่อคน", "เบิกตามจริง"].includes(scope.reimbursement))) && (
                            <div className="md:col-span-2">
                              <label className="mb-2 block text-sm font-medium text-slate-700">มูลค่าสินค้า (บาท) <span className="text-xs font-normal text-[#6D5DF6] ml-1">*เพื่อสำรองงบประมาณล่วงหน้า</span></label>
                              <div className="relative">
                                <input type="number" value={scope.productValue || ""} onChange={e => handleUpdateScope(scope.id, 'productValue', e.target.value)} placeholder="ระบุมูลค่าสินค้าสูงสุดที่เบิกได้" className="w-full rounded-lg border border-slate-200 bg-white pl-4 pr-12 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
                                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">THB</span>
                              </div>
                            </div>
                          )}

                          <div className="md:col-span-2 border-t border-slate-200/60 pt-5 mt-2">
                            <label className="mb-2 block text-sm font-medium text-slate-700 font-semibold text-slate-800">ต้องมีการเดินทางไปถ่ายทำ / รับสินค้าหรือบริการ หรือไม่</label>
                            <Select 
                              value={scope.requireTravel || "ไม่ต้อง (Remote / ถ่ายทำที่ไหนก็ได้)"} 
                              onChange={val => handleUpdateScope(scope.id, 'requireTravel', val)} 
                              options={["ต้อง (มี On-site / Event / รับบริการ)", "ไม่ต้อง (Remote / ถ่ายทำที่ไหนก็ได้)"]} 
                            />
                          </div>

                          {scope.requireTravel === "ต้อง (มี On-site / Event / รับบริการ)" && (
                            <div className="md:col-span-2 grid gap-6 md:grid-cols-2 border-t border-slate-200/60 pt-5 mt-2">
                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">ประเภท On-Site</label>
                                <Select 
                                  value={scope.onSiteType || ""} 
                                  onChange={val => handleUpdateScope(scope.id, 'onSiteType', val)} 
                                  options={["ถ่ายทำที่สาขาที่ influencer สะดวก", "ถ่ายทำที่สถานที่ที่แบรนด์กำหนด", "เข้าร่วม Event", "รับสินค้า/บริการตามสถานที่ที่แบรนด์กำหนด"]} 
                                />
                              </div>

                              {scope.onSiteType === "เข้าร่วม Event" && (
                                  <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">ระยะเวลา Event (ชั่วโมง)</label>
                                    <input type="number" value={scope.eventDuration || ""} onChange={e => handleUpdateScope(scope.id, 'eventDuration', e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
                                  </div>
                              )}

                              {["ถ่ายทำที่สถานที่ที่แบรนด์กำหนด", "เข้าร่วม Event", "รับสินค้า/บริการตามสถานที่ที่แบรนด์กำหนด"].includes(scope.onSiteType) && (
                                <div className="md:col-span-2">
                                  <label className="mb-2 block text-sm font-medium text-slate-700">ค่าเดินทางต่อ Influencer</label>
                                  <Select 
                                    value={scope.reviewerTravelExpense || ""} 
                                    onChange={val => handleUpdateScope(scope.id, 'reviewerTravelExpense', val)} 
                                    options={[
                                      "BTS < 1 KM (500 บาท)",
                                      "BTS < 5 KM – 10 KM (1,000 บาท)",
                                      "BTS > 10 KM (1,500 บาท)",
                                      "กรณีนอกกรุงเทพ คิด Case by Case"
                                    ]} 
                                  />
                                </div>
                              )}

                              <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-slate-700">รายละเอียดสถานที่</label>
                                <textarea rows={2} value={scope.locationDetails || ""} onChange={e => handleUpdateScope(scope.id, 'locationDetails', e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#6D5DF6]"></textarea>
                              </div>

                              <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-slate-700">Buddy Review Support (มีทีมดูแลหน้างาน)</label>
                                <div className="flex items-center gap-6 py-1">
                                  {["Yes", "No"].map(opt => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                      <input type="radio" name={`buddySupport-${scope.id}`} value={opt} checked={(scope.buddyReviewSupport || "No") === opt} onChange={e => handleUpdateScope(scope.id, 'buddyReviewSupport', e.target.value)} className="h-4 w-4 text-[#6D5DF6]" />
                                      <span className="text-sm text-slate-700">{opt}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button type="button" onClick={() => handleDuplicateScope(scope)} className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">
                          <Copy className="h-3 w-3" /> Duplicate Scope
                        </button>
                      </div>

                    </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
              )}

              {/* Section 4 */}
              {currentStep === 3 && (
              <section>
                <h3 className="mb-4 text-base font-semibold text-[#6D5DF6] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs">3</span> 
                  Condition
                </h3>
                <div className="flex flex-col gap-6">
                  <div className="border-t border-slate-100 pt-6">
                    <label className="mb-2 block text-sm font-medium text-slate-700">Condition (Terms & Notes)</label>
                    <textarea 
                      rows={6} 
                      value={condition} 
                      onChange={e => setCondition(e.target.value)} 
                      className="w-full rounded-lg border border-slate-200 bg-white p-4 text-sm outline-none focus:border-[#6D5DF6] leading-relaxed"
                    ></textarea>
                  </div>
                </div>
              </section>
              )}

            </div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <div className="flex gap-3">
              {!initialData ? (
                <>
                  <Button 
                    variant="secondary" 
                    onClick={prevStep} 
                    disabled={currentStep === 1}
                  >
                    Back
                  </Button>
                  {currentStep < totalSteps ? (
                    <Button onClick={nextStep}>Next Step</Button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Button variant="secondary" onClick={() => handleSubmit("Draft")}>Save as Draft</Button>
                      <Button onClick={() => handleSubmit("Example List")} disabled={!campaignName || !brand}>Create Brief</Button>
                    </div>
                  )}
                </>
              ) : (
                <Button onClick={() => handleSubmit(initialData?.internalStatus)}>Save Changes</Button>
              )}
            </div>
          </div>
      </Modal>
    </>
  );
}

// --- Brief Listing Page Component ---
