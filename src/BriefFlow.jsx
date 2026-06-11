import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Copy,
  Eye,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Check,
  ArrowLeft,
  Download,
  ExternalLink,
  Edit,
  Calendar,
  Users,
  MapPin,
  Coins,
  TrendingUp,
  Clock,
  Compass,
  FileText,
  History,
  Sparkles,
  Truck,
  Briefcase,
  Folder
} from "lucide-react";

// Helper utilities
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "bg-[#6D5DF6] text-white shadow-sm shadow-violet-200 hover:bg-[#5d4df0]",
    secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-rose-50 text-rose-600 hover:bg-rose-100",
  };
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

function Select({ value, onChange, options, label, className }) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-full w-full appearance-none bg-transparent px-4 pr-10 text-sm font-normal text-slate-700 outline-none cursor-pointer",
          !className?.includes("border-none") && "rounded-lg border border-slate-200 py-2.5 bg-white"
        )}
      >
        <option value="" disabled>{label || "Select..."}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function MultiSelect({ value = [], onChange, options, placeholder }) {
  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-2 min-h-[42px] cursor-text">
        {value.map(val => (
          <span key={val} className="inline-flex items-center gap-1 rounded bg-violet-50 px-2 py-0.5 text-xs font-medium text-[#6D5DF6]">
            {val}
            <X className="h-3 w-3 cursor-pointer" onClick={() => onChange(value.filter(v => v !== val))} />
          </span>
        ))}
        <select 
          className="flex-1 outline-none text-sm text-slate-700 bg-transparent min-w-[120px]"
          onChange={(e) => {
            if (e.target.value && !value.includes(e.target.value)) {
              onChange([...value, e.target.value]);
            }
            e.target.value = "";
          }}
          defaultValue=""
        >
          <option value="" disabled>{value.length ? "" : placeholder}</option>
          {options.filter(o => !value.includes(o)).map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function SimpleHtmlEditor({ value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    onChange(editorRef.current.innerHTML);
  };

  const exec = (cmd, arg = null) => {
    document.execCommand(cmd, false, arg);
    editorRef.current.focus();
  };

  const addLink = () => {
    const url = prompt("Enter the link URL:");
    if (url) exec("createLink", url);
  };

  const addImage = () => {
    const url = prompt("Enter the image URL:");
    if (url) exec("insertImage", url);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
        <button type="button" onClick={() => exec('bold')} className="rounded p-1 text-slate-600 hover:bg-slate-200 font-bold w-7 h-7 flex items-center justify-center">B</button>
        <button type="button" onClick={() => exec('italic')} className="rounded p-1 text-slate-600 hover:bg-slate-200 italic w-7 h-7 flex items-center justify-center">I</button>
        <button type="button" onClick={() => exec('underline')} className="rounded p-1 text-slate-600 hover:bg-slate-200 underline w-7 h-7 flex items-center justify-center">U</button>
        <div className="w-px h-4 bg-slate-300 mx-1"></div>
        <button type="button" onClick={() => exec('insertUnorderedList')} className="rounded px-2 py-1 text-slate-600 hover:bg-slate-200 text-xs font-medium">Bullet List</button>
        <div className="w-px h-4 bg-slate-300 mx-1"></div>
        <button type="button" onClick={addLink} className="rounded px-2 py-1 text-slate-600 hover:bg-slate-200 text-xs font-medium">Link</button>
        <button type="button" onClick={addImage} className="rounded px-2 py-1 text-slate-600 hover:bg-slate-200 text-xs font-medium">Image</button>
      </div>
      <div 
        ref={editorRef}
        contentEditable 
        onInput={handleInput}
        className="min-h-[120px] max-h-[300px] overflow-y-auto p-4 text-sm outline-none"
      />
    </div>
  );
}

// Mock seed data

// --- Mock Influencer Data for Selection ---
const influencerSeed = [
  {
    id: "inf_001",
    username: "@mindglow",
    name: "Mind Glow",
    platform: "Instagram",
    followers: 184500,
    character: "Skincare educator",
    avatar: "https://i.pravatar.cc/160?img=5",
    rawCost: "฿400,000",
  },
  {
    id: "inf_002",
    username: "@beaureview.bow",
    name: "Bow Beauty Review",
    platform: "TikTok",
    followers: 322000,
    character: "Honest review / demo",
    avatar: "https://i.pravatar.cc/160?img=10",
  },
  {
    id: "inf_003",
    username: "@dailywithpim",
    name: "Pim Daily",
    platform: "Instagram",
    followers: 96500,
    character: "Lifestyle soft-sell",
    avatar: "https://i.pravatar.cc/160?img=32",
    rawCost: "฿350,000",
  },
  {
    id: "inf_004",
    username: "@hostmark",
    name: "Mark Host",
    platform: "Facebook",
    followers: 128000,
    character: "MC / Presenter",
    avatar: "https://i.pravatar.cc/160?img=12",
  },
];

function GroupSelectionModal({ open, onClose, onConfirm, initialSelected = [] }) {
  const predefinedGroups = ["Hero", "Hub", "Help", "Macro", "Micro", "Nano"];
  const [selectedGroups, setSelectedGroups] = useState(initialSelected);
  const [customGroup, setCustomGroup] = useState("");

  useEffect(() => {
    if (open) setSelectedGroups(initialSelected);
  }, [open, initialSelected]);

  const toggleGroup = (grp) => {
    if (selectedGroups.includes(grp)) {
      setSelectedGroups(selectedGroups.filter(g => g !== grp));
    } else {
      setSelectedGroups([...selectedGroups, grp]);
    }
  };

  const handleAddCustom = () => {
    if (customGroup.trim() && !selectedGroups.includes(customGroup.trim())) {
      setSelectedGroups([...selectedGroups, customGroup.trim()]);
    }
    setCustomGroup("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Select Groups</h2>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            {predefinedGroups.map(grp => (
              <button 
                key={grp}
                onClick={() => toggleGroup(grp)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${selectedGroups.includes(grp) ? 'border-[#6D5DF6] bg-[#6D5DF6] text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
              >
                {grp}
              </button>
            ))}
            {selectedGroups.filter(g => !predefinedGroups.includes(g)).map(grp => (
              <button 
                key={grp}
                onClick={() => toggleGroup(grp)}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition border border-[#6D5DF6] bg-[#6D5DF6] text-white flex items-center gap-1"
              >
                {grp} <X className="h-3 w-3" />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={customGroup}
              onChange={e => setCustomGroup(e.target.value)}
              placeholder="Custom group name..."
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#6D5DF6]"
              onKeyDown={e => { if (e.key === 'Enter') handleAddCustom(); }}
            />
            <Button variant="secondary" onClick={handleAddCustom}>Add</Button>
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onConfirm(selectedGroups)} disabled={selectedGroups.length === 0}>Confirm Groups</Button>
        </div>
      </motion.div>
    </div>
  );
}

function InfluencerSelectModal({ open, onClose, onSelect }) {
  const [search, setSearch] = useState("");

  if (!open) return null;

  const filtered = influencerSeed.filter(inf => 
    inf.name.toLowerCase().includes(search.toLowerCase()) || 
    inf.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col max-h-[80vh]"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Select Influencer</h2>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or handle..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#6D5DF6]"
            />
          </div>
        </div>
        <div className="overflow-y-auto p-4 flex-1">
          {filtered.length > 0 ? (
            <div className="grid gap-3">
              {filtered.map(inf => (
                <div key={inf.id} onClick={() => onSelect(inf)} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl cursor-pointer hover:border-[#6D5DF6] hover:bg-violet-50/30 transition">
                  <div className="flex items-center gap-3">
                    <img src={inf.avatar} alt={inf.name} className="w-10 h-10 rounded-full object-cover bg-slate-100" />
                    <div>
                      <div className="font-semibold text-sm text-slate-900">{inf.name} <span className="text-slate-500 font-normal">{inf.username}</span></div>
                      <div className="text-xs text-slate-500 mt-0.5">{inf.platform} • {inf.followers.toLocaleString()} Followers</div>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={(e) => { e.stopPropagation(); onSelect(inf); }}>Select</Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">No influencers found.</div>
          )}
        </div>
        <div className="p-4 border-t border-slate-100 flex justify-end">
          <Button variant="secondary" onClick={() => onSelect(null)}>Add Blank Row Instead</Button>
        </div>
      </motion.div>
    </div>
  );
}

// --- Form Modal Component ---
function BriefFormModal({ open, onClose, onSubmit, initialData = null, initialStep = 1, customers = [] }) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  useEffect(() => { if (open) setCurrentStep(initialStep); }, [open, initialStep]);
  const totalSteps = 3;

  // Step 1: Client & Project Details
  const [customerId, setCustomerId] = useState(initialData?.customerId || "");
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [clientStatus, setClientStatus] = useState(initialData?.clientStatus || "New");
  const [customerType, setCustomerType] = useState(initialData?.customerType || "Key Account");
  const [salesOwner, setSalesOwner] = useState(initialData?.salesOwner || "พี่ bankie");
  const [campaignName, setCampaignName] = useState(initialData?.campaignName || "");
  const [packageType, setPackageType] = useState(initialData?.packageType ? (Array.isArray(initialData.packageType) ? initialData.packageType : [initialData.packageType]) : []);
  const [packageTypeOther, setPackageTypeOther] = useState(initialData?.packageTypeOther || "");
  const [product, setProduct] = useState(initialData?.product || "");
  
  const [objective, setObjective] = useState(initialData?.objective || []);
  const [objectiveNote, setObjectiveNote] = useState(initialData?.objectiveNote || "");
  
  const [gender, setGender] = useState(initialData?.gender || []);
  const [ageRange, setAgeRange] = useState(initialData?.ageRange || []);
  const [country, setCountry] = useState(initialData?.country || "");
  const [province, setProvince] = useState(initialData?.province || "");
  
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
    details: "",
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
      whitelistingRequired: false, whitelistingDuration: []
    }
  };

  const [budgetOptions, setBudgetOptions] = useState(() => {
    if (initialData?.budgetOptions && initialData.budgetOptions.length > 0) {
      return initialData.budgetOptions;
    }
    // Fallback/Legacy import: convert single budget and SOW into Option 1
    return [{
      id: Date.now(),
      name: "Option A",
      budgetSpending: initialData?.budgetSpending || "",
      vat: initialData?.vat || "Incl. VAT",
      budgetCondition: initialData?.budgetCondition || "",
      estimatedBrandSpending: initialData?.estimatedBrandSpending || "",
      budgetPerInfluencer: initialData?.budgetPerInfluencer || "",
      expectedNumInfluencers: initialData?.expectedNumInfluencers || "",
      expectedReach: initialData?.expectedReach || "",
      scopeOfWorks: initialData?.scopeOfWorks || [{ ...defaultSOW, id: Date.now() }]
    }];
  });

  const [activeOptionId, setActiveOptionId] = useState(() => budgetOptions[0]?.id);

  const updateActiveOption = (field, value) => {
    setBudgetOptions(prev => prev.map(opt => opt.id === activeOptionId ? { ...opt, [field]: value } : opt));
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
          scopeOfWorks: (opt.scopeOfWorks || []).map(s => s.id === sowId ? { ...s, [field]: value } : s)
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
          scopeOfWorks: (opt.scopeOfWorks || []).map(s => s.id === sowId ? { ...s, serviceScope: { ...s.serviceScope, [field]: value } } : s)
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
      campaignName, packageType, packageTypeOther, product, objective, objectiveNote, 
      gender, country, province, ageRange,
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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
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
            <div className="h-1 w-full bg-slate-100">
              <motion.div 
                className="h-full bg-[#6D5DF6]"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-10">
              
              {/* Section 1 */}
              {currentStep === 1 && (
              <section>
                <h3 className="mb-4 text-base font-semibold text-[#6D5DF6] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs">1</span> 
                  Client & Project Details
                </h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Select Customer *</label>
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
                    <label className="mb-1 block text-sm font-medium text-slate-700">Brand / Product Name *</label>
                    <input type="text" value={brand} onChange={e => setBrand(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Client Status *</label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="clientStatus" value="New" checked={clientStatus === "New"} onChange={e => setClientStatus(e.target.value)} className="h-4 w-4 text-[#6D5DF6]" />
                        <span className="text-sm text-slate-700">New</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="clientStatus" value="Existing" checked={clientStatus === "Existing"} onChange={e => setClientStatus(e.target.value)} className="h-4 w-4 text-[#6D5DF6]" />
                        <span className="text-sm text-slate-700">Existing</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Customer Type</label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="customerType" value="Key Account" checked={customerType === "Key Account"} onChange={e => setCustomerType(e.target.value)} className="h-4 w-4 text-[#6D5DF6]" />
                        <span className="text-sm text-slate-700">Key Account</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="customerType" value="Non-Key Account" checked={customerType === "Non-Key Account"} onChange={e => setCustomerType(e.target.value)} className="h-4 w-4 text-[#6D5DF6]" />
                        <span className="text-sm text-slate-700">Non-Key Account</span>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Sales Owner *</label>
                      <input type="text" value={salesOwner} onChange={e => setSalesOwner(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-100 pt-6 mt-2">
                    <h4 className="mb-4 font-semibold text-slate-900">Project Details</h4>
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Project Name *</label>
                        <input type="text" value={campaignName} onChange={e => setCampaignName(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Package Type</label>
                        <div className="grid grid-cols-2 gap-3 mb-2">
                          {[
                            "Standard (1 D)", "Standard KPI (0.5 D)", 
                            "Rate Card (2 D)", "Rate Card KPI (1.5 D)", 
                            "Combine (3 D)", "Combine KPI (2 D)", 
                            "Strategy (4 D)", "Strategy KPI (3 D)"
                          ].map(pkg => (
                            <label key={pkg} className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={packageType.includes(pkg)} onChange={e => {
                                if (e.target.checked) setPackageType([...packageType, pkg]);
                                else setPackageType(packageType.filter(p => p !== pkg));
                              }} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6] focus:ring-[#6D5DF6]" />
                              <span className="text-sm text-slate-700">{pkg}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                            <input type="checkbox" checked={packageType.includes("Others")} onChange={e => {
                              if (e.target.checked) setPackageType([...packageType, "Others"]);
                              else setPackageType(packageType.filter(p => p !== "Others"));
                            }} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6] focus:ring-[#6D5DF6]" />
                            <span className="text-sm text-slate-700">Others :</span>
                          </label>
                          {packageType.includes("Others") && (
                            <input type="text" value={packageTypeOther} onChange={e => setPackageTypeOther(e.target.value)} className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#6D5DF6]" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">*Remark : 11:00 = Half Day / 16:00 = Next Day</p>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Product Name & Detail *</label>
                        <SimpleHtmlEditor value={product} onChange={setProduct} />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Objective</label>
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
                        <label className="mb-1 block text-sm font-medium text-slate-700">Objective Note</label>
                        <textarea rows={2} value={objectiveNote} onChange={e => setObjectiveNote(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]"></textarea>
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
                            <label className="mb-1 block text-sm font-medium text-slate-700">Country</label>
                            <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Province</label>
                            <input type="text" value={province} onChange={e => setProvince(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Campaign Period *</label>
                        <div className="flex items-center gap-2">
                          <input type="date" value={campaignStartDate} onChange={e => setCampaignStartDate(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                          <span className="text-slate-400">-</span>
                          <input type="date" value={campaignEndDate} onChange={e => setCampaignEndDate(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Platform</label>
                        <div className="grid grid-cols-2 gap-3 mb-2">
                          {[
                            "TikTok", "Instagram", "YouTube", "Facebook", "Facebook Page", "X", "Lemon8"
                          ].map(plat => (
                            <label key={plat} className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={platform.includes(plat)} onChange={e => {
                                if (e.target.checked) setPlatform([...platform, plat]);
                                else setPlatform(platform.filter(p => p !== plat));
                              }} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6] focus:ring-[#6D5DF6]" />
                              <span className="text-sm text-slate-700">{plat}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                            <input type="checkbox" checked={platform.includes("Others")} onChange={e => {
                              if (e.target.checked) setPlatform([...platform, "Others"]);
                              else setPlatform(platform.filter(p => p !== "Others"));
                            }} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6] focus:ring-[#6D5DF6]" />
                            <span className="text-sm text-slate-700">Others :</span>
                          </label>
                          {platform.includes("Others") && (
                            <input type="text" value={platformOther} onChange={e => setPlatformOther(e.target.value)} className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#6D5DF6]" />
                          )}
                        </div>
                        
                        <div className="rounded-xl bg-[#6D5DF6]/5 p-4 border border-[#6D5DF6]/10 mt-4">
                          <label className="mb-2 block text-sm font-medium text-slate-700">Buddy Boost Required?</label>
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
                                <label className="mb-1 block text-sm font-medium text-slate-700">Budget Boost Spending</label>
                                <input type="text" value={budgetBoostSpending} onChange={e => setBudgetBoostSpending(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                              </div>
                              <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Detail</label>
                                <textarea rows={2} value={buddyBoostDetail} onChange={e => setBuddyBoostDetail(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      

                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Previous Campaign / Work Reference</label>
                        <SimpleHtmlEditor value={previousCampaign} onChange={setPreviousCampaign} />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Competitor Info</label>
                        <SimpleHtmlEditor value={competitor} onChange={setCompetitor} />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Additional Info</label>
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
                        <label className="mb-1 block text-sm font-medium text-slate-700 font-semibold text-[#6D5DF6]">Option Name</label>
                        <input
                          type="text"
                          value={activeOpt.name}
                          onChange={e => updateActiveOption("name", e.target.value)}
                          placeholder="e.g. Option A: 300K Budget"
                          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#6D5DF6]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Budget Spending</label>
                        <input type="text" value={activeOpt.budgetSpending} onChange={e => updateActiveOption("budgetSpending", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
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
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Condition</label>
                        <input type="text" value={activeOpt.budgetCondition} onChange={e => updateActiveOption("budgetCondition", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Estimated Brand Spending</label>
                        <input type="text" value={activeOpt.estimatedBrandSpending} onChange={e => updateActiveOption("estimatedBrandSpending", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Budget per Influencer (If any)</label>
                        <input type="text" value={activeOpt.budgetPerInfluencer} onChange={e => updateActiveOption("budgetPerInfluencer", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Expected Number of Influencers (If any)</label>
                        <input type="number" value={activeOpt.expectedNumInfluencers} onChange={e => updateActiveOption("expectedNumInfluencers", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-slate-700">Expected Reach</label>
                        <input type="text" value={activeOpt.expectedReach} onChange={e => updateActiveOption("expectedReach", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
                      </div>
                    </div>
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
                        if (p === "TikTok") { allTypes.add("Video (TikTok)"); allTypes.add("Photo Carousel"); }
                        else if (p === "Instagram") { allTypes.add("Photo"); allTypes.add("Reel"); allTypes.add("Story"); allTypes.add("Carousel"); }
                        else if (p === "YouTube") { allTypes.add("Long Video"); allTypes.add("Short"); }
                        else if (p === "Facebook" || p === "Facebook Page") { allTypes.add("Photo"); allTypes.add("Video"); allTypes.add("Link"); allTypes.add("Album"); }
                        else if (p === "X") { allTypes.add("Text"); allTypes.add("Photo"); allTypes.add("Video"); }
                        else if (p === "Lemon8") { allTypes.add("Photo"); allTypes.add("Carousel"); }
                      });
                      if (plats.includes("Others")) allTypes.add("Custom");
                      return Array.from(allTypes);
                    };
                    const availableContentTypes = getAvailableContentTypes(scope.platforms || []);

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
                          <label className="mb-1 block text-sm font-medium text-slate-700">Scope Name</label>
                          <input 
                            type="text" 
                            value={scope.name} 
                            onChange={e => handleUpdateScope(scope.id, 'name', e.target.value)} 
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-2 block text-sm font-medium text-slate-700">Platform</label>
                          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                            {platform.length > 0 ? platform.map(plat => (
                              <label key={plat} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={(scope.platforms || []).includes(plat)} onChange={e => {
                                  let newPlats = [...(scope.platforms || [])];
                                  if (e.target.checked) newPlats.push(plat);
                                  else newPlats = newPlats.filter(p => p !== plat);
                                  handleUpdateScope(scope.id, 'platforms', newPlats);
                                }} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6] focus:ring-[#6D5DF6]" />
                                <span className="text-sm text-slate-700">{plat === "Others" && platformOther ? `Others (${platformOther})` : plat}</span>
                              </label>
                            )) : (
                              <span className="text-sm text-slate-500 italic col-span-2">Please select platforms in Step 1 first</span>
                            )}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-medium text-slate-700">Content Type</label>
                          <MultiSelect 
                            value={scope.contentType || []} 
                            onChange={val => handleUpdateScope(scope.id, 'contentType', val)} 
                            options={availableContentTypes.length ? availableContentTypes : ["Photo", "Video", "Reel"]} 
                            placeholder={availableContentTypes.length ? "Select content types" : "Select platform first"}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
                          <textarea rows={2} value={scope.notes || ""} onChange={e => handleUpdateScope(scope.id, 'notes', e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]"></textarea>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Influencer Allocation (%)</label>
                          <input type="number" value={scope.allocation || ""} onChange={e => handleUpdateScope(scope.id, 'allocation', e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" placeholder="e.g. 100" />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Number of Influencers</label>
                          <input type="number" value={scope.numInfluencers} onChange={e => handleUpdateScope(scope.id, 'numInfluencers', e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Follower Requirement</label>
                          <input type="text" value={scope.followerReq} onChange={e => handleUpdateScope(scope.id, 'followerReq', e.target.value)} placeholder="e.g. 5K or above" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-medium text-slate-700">Details</label>
                          <SimpleHtmlEditor value={scope.details} onChange={val => handleUpdateScope(scope.id, 'details', val)} />
                        </div>
                      </div>

                      {/* Persona under SOW */}
                      <h5 className="mb-4 text-sm font-semibold text-slate-900 border-t border-slate-200 pt-6">Influencer Persona</h5>
                      <div className="grid gap-4 md:grid-cols-2 mb-8">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Demographic</label>
                          <Select value={scope.persona?.demographic} onChange={val => handleUpdatePersona(scope.id, 'demographic', val)} options={["Lifestyle", "Foodie", "Beauty", "Tech"]} />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
                          <Select value={scope.persona?.location} onChange={val => handleUpdatePersona(scope.id, 'location', val)} options={["Bangkok", "Chiang Mai", "Phuket", "Other"]} />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Occupation</label>
                          <Select value={scope.persona?.occupation} onChange={val => handleUpdatePersona(scope.id, 'occupation', val)} options={["พนักงานออฟฟิศ", "นักศึกษา", "ฟรีแลนซ์"]} />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Persona</label>
                          <Select value={scope.persona?.persona} onChange={val => handleUpdatePersona(scope.id, 'persona', val)} options={["สนุกสนาน", "เป็นกันเอง", "ทางการ"]} />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Content Category</label>
                          <Select value={scope.persona?.contentCategory} onChange={val => handleUpdatePersona(scope.id, 'contentCategory', val)} options={["Vlog", "Review", "Educational"]} />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Story Telling</label>
                          <Select value={scope.persona?.storyTelling} onChange={val => handleUpdatePersona(scope.id, 'storyTelling', val)} options={["Soft-sell", "Hard-sell", "Inspirational"]} />
                        </div>
                      </div>

                      {/* Service Scope under SOW */}
                      <h5 className="mb-4 text-sm font-semibold text-slate-900 border-t border-slate-200 pt-6">Service Scope</h5>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={scope.serviceScope?.buyoutRequired} onChange={e => handleUpdateServiceScope(scope.id, 'buyoutRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                            <span className="text-sm font-medium text-slate-700">Buyout</span>
                          </label>
                          {scope.serviceScope?.buyoutRequired && (
                            <div className="pl-7 mt-2">
                              <MultiSelect value={scope.serviceScope?.buyoutDuration || []} onChange={val => handleUpdateServiceScope(scope.id, 'buyoutDuration', val)} options={["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                            </div>
                          )}

                          {scope.platforms?.some(p => ["Facebook", "Facebook Page", "Instagram", "TikTok"].includes(p)) && (
                            <>
                              <label className="flex items-center gap-3 cursor-pointer pt-2">
                                <input type="checkbox" checked={scope.serviceScope?.boostPostRequired} onChange={e => handleUpdateServiceScope(scope.id, 'boostPostRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                <span className="text-sm font-medium text-slate-700">Boost Post</span>
                              </label>
                              {scope.serviceScope?.boostPostRequired && (
                                <div className="pl-7 mt-2">
                                  <MultiSelect value={scope.serviceScope?.boostPostDuration || []} onChange={val => handleUpdateServiceScope(scope.id, 'boostPostDuration', val)} options={["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                </div>
                              )}
                            </>
                          )}

                          {scope.platforms?.some(p => ["Facebook", "Facebook Page", "Instagram", "TikTok", "YouTube", "X"].includes(p)) && (
                            <>
                              <label className="flex items-center gap-3 cursor-pointer pt-2">
                                <input type="checkbox" checked={scope.serviceScope?.addAdsRequired} onChange={e => handleUpdateServiceScope(scope.id, 'addAdsRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                <span className="text-sm font-medium text-slate-700">Add Ads</span>
                              </label>
                              {scope.serviceScope?.addAdsRequired && (
                                <div className="pl-7 mt-2">
                                  <MultiSelect value={scope.serviceScope?.addAdsDuration || []} onChange={val => handleUpdateServiceScope(scope.id, 'addAdsDuration', val)} options={["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                </div>
                              )}
                            </>
                          )}

                          {scope.platforms?.some(p => ["Facebook", "Facebook Page", "Instagram", "TikTok"].includes(p)) && (
                            <>
                              <label className="flex items-center gap-3 cursor-pointer pt-2">
                                <input type="checkbox" checked={scope.serviceScope?.paidPartnershipRequired} onChange={e => handleUpdateServiceScope(scope.id, 'paidPartnershipRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                <span className="text-sm font-medium text-slate-700">Paid Partnership</span>
                              </label>
                              {scope.serviceScope?.paidPartnershipRequired && (
                                <div className="pl-7 mt-2">
                                  <MultiSelect value={scope.serviceScope?.paidPartnershipDuration || []} onChange={val => handleUpdateServiceScope(scope.id, 'paidPartnershipDuration', val)} options={["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                </div>
                              )}
                            </>
                          )}

                          {scope.platforms?.includes("YouTube") && (
                            <>
                              <label className="flex items-center gap-3 cursor-pointer pt-2">
                                <input type="checkbox" checked={scope.serviceScope?.discoveryRequired} onChange={e => handleUpdateServiceScope(scope.id, 'discoveryRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                <span className="text-sm font-medium text-slate-700">Youtube Discovery</span>
                              </label>
                              {scope.serviceScope?.discoveryRequired && (
                                <div className="pl-7 mt-2">
                                  <MultiSelect value={scope.serviceScope?.discoveryDuration || []} onChange={val => handleUpdateServiceScope(scope.id, 'discoveryDuration', val)} options={["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          {scope.platforms?.includes("TikTok") && (
                            <>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={scope.serviceScope?.genCodeRequired} onChange={e => handleUpdateServiceScope(scope.id, 'genCodeRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                <span className="text-sm font-medium text-slate-700">Gen Code</span>
                              </label>
                              {scope.serviceScope?.genCodeRequired && (
                                <div className="pl-7 mt-2">
                                  <MultiSelect value={scope.serviceScope?.genCodeDuration || []} onChange={val => handleUpdateServiceScope(scope.id, 'genCodeDuration', val)} options={["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                </div>
                              )}

                              <label className="flex items-center gap-3 cursor-pointer pt-2">
                                <input type="checkbox" checked={scope.serviceScope?.tiktokShopRequired} onChange={e => handleUpdateServiceScope(scope.id, 'tiktokShopRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                <span className="text-sm font-medium text-slate-700">TikTok Shop</span>
                              </label>
                              {scope.serviceScope?.tiktokShopRequired && (
                                <div className="pl-7 mt-2">
                                  <MultiSelect value={scope.serviceScope?.tiktokShopDuration || []} onChange={val => handleUpdateServiceScope(scope.id, 'tiktokShopDuration', val)} options={["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                </div>
                              )}
                            </>
                          )}

                          {scope.platforms?.some(p => ["Facebook", "Facebook Page"].includes(p)) && (
                            <>
                              <label className="flex items-center gap-3 cursor-pointer pt-2">
                                <input type="checkbox" checked={scope.serviceScope?.brandedContentRequired} onChange={e => handleUpdateServiceScope(scope.id, 'brandedContentRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                <span className="text-sm font-medium text-slate-700">FB Branded Content</span>
                              </label>
                              {scope.serviceScope?.brandedContentRequired && (
                                <div className="pl-7 mt-2">
                                  <MultiSelect value={scope.serviceScope?.brandedContentDuration || []} onChange={val => handleUpdateServiceScope(scope.id, 'brandedContentDuration', val)} options={["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                </div>
                              )}
                            </>
                          )}

                          {scope.platforms?.includes("X") && (
                            <>
                              <label className="flex items-center gap-3 cursor-pointer pt-2">
                                <input type="checkbox" checked={scope.serviceScope?.whitelistingRequired} onChange={e => handleUpdateServiceScope(scope.id, 'whitelistingRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                <span className="text-sm font-medium text-slate-700">X/Twitter Whitelisting</span>
                              </label>
                              {scope.serviceScope?.whitelistingRequired && (
                                <div className="pl-7 mt-2">
                                  <MultiSelect value={scope.serviceScope?.whitelistingDuration || []} onChange={val => handleUpdateServiceScope(scope.id, 'whitelistingDuration', val)} options={["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                </div>
                              )}
                            </>
                          )}
                        </div>
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
                  Brand Support & Condition
                </h3>
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-700">Brand Support Type</label>
                    <div className="flex items-center gap-6 mb-6">
                      {["No Sponsor", "Brand Sponsor", "Other"].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="brandSupportType" value={opt} checked={brandSupportType === opt} onChange={e => setBrandSupportType(e.target.value)} className="h-4 w-4 text-[#6D5DF6]" />
                          <span className="text-sm text-slate-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                    {brandSupportType === "Other" && (
                      <div className="mb-6">
                        <textarea 
                          value={brandSupportTypeOther} 
                          onChange={e => setBrandSupportTypeOther(e.target.value)} 
                          placeholder="โปรดระบุรายละเอียด..." 
                          rows={2} 
                          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#6D5DF6]" 
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">วิธีการรับสินค้า/บริการ</label>
                        <Select 
                          value={productReceiveMethod} 
                          onChange={setProductReceiveMethod} 
                          options={
                            brandSupportType === "No Sponsor" ? ["Buddy Review ซื้อและจัดส่งให้ Influencer", "Influencer ซื้อเอง"] :
                            brandSupportType === "Brand Sponsor" ? ["Sponsor สินค้า (Buddy Review จัดส่ง)", "Sponsor สินค้า (แบรนด์จัดส่ง)"] :
                            ["อื่นๆ (โปรดระบุ)"]
                          } 
                        />
                      </div>

                      {["Buddy Review ซื้อและจัดส่งให้ Influencer", "Sponsor สินค้า (Buddy Review จัดส่ง)"].includes(productReceiveMethod) && (
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">ค่าจัดส่งต่อ Influencer</label>
                          <input type="number" value={logisticsPerInfluencer} onChange={e => setLogisticsPerInfluencer(e.target.value)} placeholder="ระบุค่าจัดส่งต่อ Influencer" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
                        </div>
                      )}

                      {brandSupportType === "No Sponsor" && productReceiveMethod === "Influencer ซื้อเอง" && (
                        <div className="pt-2">
                          <label className="mb-4 block text-base font-bold text-slate-900">การเบิกค่าใช้จ่าย</label>
                          <div className="flex flex-col gap-4">
                            <label className={`relative flex cursor-pointer rounded-2xl border p-4 transition-colors ${reimbursement === "กำหนดงบต่อคน" ? "border-[#6D5DF6] bg-violet-50/30 ring-1 ring-[#6D5DF6]" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                              <div className="flex items-start gap-4">
                                <div className="flex h-5 items-center mt-0.5">
                                  <input type="radio" name="reimbursement" value="กำหนดงบต่อคน" checked={reimbursement === "กำหนดงบต่อคน"} onChange={() => setReimbursement("กำหนดงบต่อคน")} className="h-5 w-5 border-slate-300 text-[#6D5DF6] focus:ring-[#6D5DF6]" />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 text-base">กำหนดงบต่อคน</div>
                                  <div className="text-sm text-slate-500 mt-1">ระบุจำนวนเงินที่แน่นอนเพื่อจำกัดงบประมาณต่อคน</div>
                                </div>
                              </div>
                            </label>

                            <label className={`relative flex cursor-pointer rounded-2xl border p-4 transition-colors ${reimbursement === "เบิกตามจริง" ? "border-[#6D5DF6] bg-violet-50/30 ring-1 ring-[#6D5DF6]" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                              <div className="flex items-start gap-4">
                                <div className="flex h-5 items-center mt-0.5">
                                  <input type="radio" name="reimbursement" value="เบิกตามจริง" checked={reimbursement === "เบิกตามจริง"} onChange={() => setReimbursement("เบิกตามจริง")} className="h-5 w-5 border-slate-300 text-[#6D5DF6] focus:ring-[#6D5DF6]" />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 text-base">เบิกตามจริง</div>
                                  <div className="text-sm text-slate-500 mt-1">Influencer นำใบเสร็จมาเบิก (Buddy Review จะต้องกันเงินไว้)</div>
                                </div>
                              </div>
                            </label>

                            <label className={`relative flex cursor-pointer rounded-2xl border p-4 transition-colors ${reimbursement === "ไม่เบิก" ? "border-pink-500 bg-pink-50/30 ring-1 ring-pink-500" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                              <div className="flex items-start gap-4">
                                <div className="flex h-5 items-center mt-0.5">
                                  <input type="radio" name="reimbursement" value="ไม่เบิก" checked={reimbursement === "ไม่เบิก"} onChange={() => setReimbursement("ไม่เบิก")} className="h-5 w-5 border-slate-300 text-pink-500 focus:ring-pink-500" />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 text-base">ไม่เบิก</div>
                                  <div className="text-sm text-slate-500 mt-1">ไม่มีการกันงบเบิกคืน</div>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {brandSupportType === "No Sponsor" && (productReceiveMethod === "Buddy Review ซื้อและจัดส่งให้ Influencer" || ["กำหนดงบต่อคน", "เบิกตามจริง"].includes(reimbursement)) && (
                        <div className="mt-2 bg-violet-50 border border-[#6D5DF6]/20 p-4 rounded-xl">
                          <label className="mb-2 block text-sm font-medium text-slate-700">มูลค่าสินค้า (บาท) <span className="text-xs font-normal text-[#6D5DF6] ml-2">*กรอกเพื่อสำรองงบประมาณล่วงหน้า</span></label>
                          <input type="number" value={productValue} onChange={e => setProductValue(e.target.value)} placeholder="ระบุมูลค่าสินค้าสูงสุดที่เบิกได้" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">ต้องมีการเดินทางไปถ่ายทำ / รับสินค้าหรือบริการ หรือไม่</label>
                        <Select 
                          value={requireTravel} 
                          onChange={setRequireTravel} 
                          options={["ต้อง (มี On-site / Event / รับบริการ)", "ไม่ต้อง (Remote / ถ่ายทำที่ไหนก็ได้)"]} 
                        />
                      </div>

                      {requireTravel === "ต้อง (มี On-site / Event / รับบริการ)" && (
                        <>
                          <div className="border-t border-slate-200 pt-6 mt-2">
                            <h4 className="mb-4 font-semibold text-slate-900 text-sm">รายละเอียด On-Site</h4>
                            <div className="grid gap-6 md:grid-cols-2">
                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">ประเภท On-Site</label>
                                <Select 
                                  value={onSiteType} 
                                  onChange={setOnSiteType} 
                                  options={["ถ่ายทำที่สาขาที่ influencer สะดวก", "ถ่ายทำที่สถานที่ที่แบรนด์กำหนด", "เข้าร่วม Event", "รับสินค้า/บริการตามสถานที่ที่แบรนด์กำหนด"]} 
                                />
                              </div>

                              {onSiteType === "เข้าร่วม Event" && (
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-slate-700">ระยะเวลา Event (ชั่วโมง)</label>
                                  <input type="number" value={eventDuration} onChange={e => setEventDuration(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#6D5DF6]" />
                                </div>
                              )}

                              {["ถ่ายทำที่สถานที่ที่แบรนด์กำหนด", "เข้าร่วม Event", "รับสินค้า/บริการตามสถานที่ที่แบรนด์กำหนด"].includes(onSiteType) && (
                                <div className="md:col-span-2">
                                  <label className="mb-2 block text-sm font-medium text-slate-700">ค่าเดินทางต่อ Influencer</label>
                                  <Select 
                                    value={reviewerTravelExpense} 
                                    onChange={setReviewerTravelExpense} 
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
                                <textarea rows={2} value={locationDetails} onChange={e => setLocationDetails(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#6D5DF6]"></textarea>
                              </div>

                              <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-slate-700">Buddy Review Support (มีทีมดูแลหน้างาน)</label>
                                <div className="flex items-center gap-6">
                                  {["Yes", "No"].map(opt => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                      <input type="radio" name="buddySupport" value={opt} checked={buddyReviewSupport === opt} onChange={e => setBuddyReviewSupport(e.target.value)} className="h-4 w-4 text-[#6D5DF6]" />
                                      <span className="text-sm text-slate-700">{opt}</span>
                                    </label>
                                  ))}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">ใช้สำหรับเคส Event หรือ On-Site ที่ต้องมีทีม Support</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

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
                      <Button onClick={() => handleSubmit("Assign Planner/Buyer")} disabled={!campaignName || !brand}>Create Brief</Button>
                    </div>
                  )}
                </>
              ) : (
                <Button onClick={() => handleSubmit(initialData?.internalStatus)}>Save Changes</Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// --- Brief Listing Page Component ---
function ActivityTimeline({ logs }) {
  if (!logs || logs.length === 0) return null;
  const sortedLogs = [...logs].reverse();
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-800 mb-4">Brief Activity Log</h3>
      <div className="space-y-4">
        {sortedLogs.map((log, index) => (
          <div key={index} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex mt-0.5 items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-500 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-slate-800">{log.action}</span>
                <span className="text-xs text-slate-500">{log.date}</span>
              </div>
              {typeof log.details === 'string' ? (
                <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap">{log.details}</p>
              ) : log.details && Array.isArray(log.details) ? (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-slate-700 font-medium mb-1">รายการที่ถูกแก้ไข:</p>
                  {log.details.map((change, idx) => (
                    <div key={idx} className="text-xs text-slate-600">
                      - เปลี่ยน {change.field} จาก <span className="text-[#6D5DF6] font-semibold">{change.oldVal}</span> เป็น <span className="text-[#6D5DF6] font-semibold">{change.newVal}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddRequestModal({ open, onClose, onSubmit }) {
  const [requestText, setRequestText] = useState("");
  
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Add Change Request</h3>
        <p className="text-sm text-slate-500 mb-4">This will notify the Buyer that there is a new requirement impacting the current candidates.</p>
        <textarea rows={3} value={requestText} onChange={e => setRequestText(e.target.value)} className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-[#6D5DF6]" placeholder="e.g., เพิ่ม Service Buyout Asset 6 เดือน" />
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSubmit(requestText)} disabled={!requestText}>Submit Request</Button>
        </div>
      </motion.div>
    </div>
  );
}

function ReviewChangeModal({ open, pendingChanges, onApply, onLater }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Review Change Request</h3>
        <p className="text-sm text-slate-500 mb-4">Sales has added new requirements. Applying these updates will generate Tracker V{(pendingChanges?.targetVersion || 2)}.</p>
        <div className="rounded-lg bg-amber-50 p-4 border border-amber-200 mb-6">
          <h4 className="text-xs font-semibold text-amber-800 uppercase mb-2">New Requirements</h4>
          <p className="text-sm text-amber-900">{pendingChanges?.text || "No details provided"}</p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onLater}>Later</Button>
          <Button onClick={onApply}>Apply Update (Create V{(pendingChanges?.targetVersion || 2)})</Button>
        </div>
      </motion.div>
    </div>
  );
}

function BriefListingPage({ briefs, onView, onCreate, listOnly }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return briefs.filter((b) => {
      return `${b.id} ${b.campaignName} ${b.brand}`.toLowerCase().includes(search.toLowerCase());
    });
  }, [briefs, search]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-[28px]">Brief Management</h1>
          <p className="mt-1 text-sm text-slate-500">Manage all campaign briefs and requirements.</p>
        </div>
        <button
          onClick={onCreate}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#6D5DF6] px-4 text-sm font-medium text-white transition hover:bg-[#5a4add]"
        >
          <Plus className="h-4 w-4" /> Create New Brief
        </button>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, Campaign, or Brand"
            className="h-10 w-full bg-transparent pl-10 pr-4 text-sm outline-none text-slate-700"
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-white text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                {["Brief No", "Campaign Name", "Brand", "Package Type", "Client Status", "Status", "Created Date", "Management"].map((head) => (
                  <th key={head} className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 cursor-pointer hover:text-slate-700 transition">
                      {head}
                      {head !== "Management" && <ArrowUpDown className="h-3.5 w-3.5" />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((b) => (
                <tr key={b.id} className="transition hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-semibold text-[#6D5DF6] text-sm">{b.id}</td>
                  <td className="px-6 py-4 font-normal text-slate-800 text-sm">{b.campaignName}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{b.brand}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {Array.isArray(b.packageType) ? b.packageType.join(", ") : b.packageType || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{b.clientStatus || "New"}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                        b.internalStatus === "Draft" ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-600"
                    )}>
                      {b.internalStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{b.createdAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {!listOnly && (
                        <>
                          <button
                            onClick={() => onView(b)}
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-[#6D5DF6] transition hover:bg-violet-50 hover:border-violet-200"
                          >
                            <Eye className="h-4 w-4" /> View Details
                          </button>
                          <button
                            onClick={() => {
                              const url = `${window.location.origin}${window.location.pathname}?briefId=${b.id}`;
                              navigator.clipboard.writeText(url);
                              alert("คัดลอกลิงก์สำเร็จ!");
                              if (window.showToast) window.showToast("Copied Brief Link!");
                            }}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                            title="Copy link to this brief"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500 text-sm">
                    No briefs found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
// --- Assign Role Page ---
function AssignRolePage({ brief, onUpdateBrief, onNext }) {
  const [planner, setPlanner] = useState(brief.planner || "");
  const [buyer, setBuyer] = useState(brief.buyer || "");
  const [mockEmailOpen, setMockEmailOpen] = useState(false);

  const hasStandard = Array.isArray(brief.packageType) 
    ? brief.packageType.some(p => p.toLowerCase().includes("standard"))
    : (typeof brief.packageType === "string" && brief.packageType.toLowerCase().includes("standard"));
    
  const showBuyer = !hasStandard;

  const handleAssign = () => {
    onUpdateBrief({ ...brief, planner, buyer });
    setMockEmailOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pb-20 max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm p-6 lg:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-6">Assign Planner / Buyer</h2>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8">
          <p className="text-sm text-slate-600 mb-1">Brief ID: <span className="font-semibold text-slate-900">{brief.id}</span></p>
          <p className="text-sm text-slate-600 mb-1">Campaign: <span className="font-semibold text-slate-900">{brief.campaignName}</span></p>
          <p className="text-sm text-slate-600">Package Type: <span className="font-semibold text-slate-900">{Array.isArray(brief.packageType) ? brief.packageType.join(", ") : brief.packageType}</span></p>
        </div>

        <div className="space-y-6 max-w-lg">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Assign Planner</label>
            <Select 
              value={planner} 
              onChange={setPlanner} 
              options={["planner.beauty@buddyreview.co", "planner.mc@buddyreview.co", "senior.planner@buddyreview.co"]} 
              label="Select Planner" 
            />
          </div>
          
          {showBuyer && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Assign Buyer</label>
              <Select 
                value={buyer} 
                onChange={setBuyer} 
                options={["buyer.team@buddyreview.co", "buyer.lead@buddyreview.co", "beauty.buyer@buddyreview.co"]} 
                label="Select Buyer" 
              />
            </div>
          )}

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleAssign}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#6D5DF6] px-8 text-sm font-medium text-white transition hover:bg-[#5a4add]"
            >
              Assign & Notify
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mockEmailOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-2xl bg-white overflow-hidden shadow-xl"
            >
              <div className="bg-slate-100 border-b border-slate-200 px-6 py-4">
                <div className="flex gap-2 items-center text-sm text-slate-500 mb-2">
                  <span className="w-12">New Message</span>
                </div>
                <div className="flex gap-2 items-center text-sm mb-2">
                  <span className="w-12 text-slate-500 text-right">To:</span>
                  <span className="font-medium text-slate-900">{planner}{showBuyer && buyer ? `, ${buyer}` : ""}</span>
                </div>
                <div className="flex gap-2 items-center text-sm mb-2">
                  <span className="w-12 text-slate-500 text-right">Subject:</span>
                  <span className="font-medium text-slate-900">New Assignment: {brief.campaignName} ({brief.id})</span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-700 mb-4 whitespace-pre-line">
                  {`Hello,
                  
                  You have been assigned to a new brief:
                  
                  Brief ID: ${brief.id}
                  Campaign: ${brief.campaignName}
                  Package Type: ${Array.isArray(brief.packageType) ? brief.packageType.join(", ") : brief.packageType}
                  
                  Please review the details and start working on the Example List.
                  
                  Best,
                  Traffic Team`}
                </p>
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => {
                      setMockEmailOpen(false);
                      onNext();
                    }}
                    className="rounded-lg bg-[#6D5DF6] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#5a4add]"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Step Progress Nav ---
function BriefStepProgress({ activeTab, onTabChange, onBack, status, brief }) {
  const hasStandard = brief && (
    Array.isArray(brief.packageType) 
      ? brief.packageType.some(p => p.toLowerCase().includes("standard"))
      : (typeof brief.packageType === "string" && brief.packageType.toLowerCase().includes("standard"))
  );
  
  const steps = [
    { id: "brief", label: "Brief" }
  ];
  
  if (!hasStandard) {
    steps.push({ id: "assign", label: "Assign Planner/Buyer" });
    steps.push({ id: "exampleList", label: "Example List" });
  }
  
  steps.push({ id: "dealsheet", label: "Dealsheet & Proposal" });

  const activeIdx = steps.findIndex(s => s.id === activeTab);
  
  const getProgressIdx = () => {
    if (!status || status === "Draft") return 0; // Brief
    
    if (hasStandard) {
      // If Standard, we skip Assign Planner/Buyer and Example List
      // So if it's not Draft, we are at Dealsheet
      return 1; 
    }

    // If planner is assigned, we're at least past step 1 (Assign)
    if (brief.planner || brief.buyer) {
      // Rate card - Check if influencers are ready for dealsheet
      let hasDone = false;
      if (brief.groupTrackers) {
        Object.values(brief.groupTrackers).forEach(t => {
          if (t.influencers && t.influencers.some(i => i.contactStatus === "Done")) hasDone = true;
        });
      }
      return hasDone ? 3 : 2; // Dealsheet : Example List
    }
    
    return 1; // Assign Planner/Buyer
  };
  
  const progressIdx = getProgressIdx();
  
  return (
    <div className="mb-12">
      <div className="mb-8 flex items-center justify-between">
        <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-[#6D5DF6] flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Briefs
        </button>
        {status && (
          <div className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">
            <span className="mr-1.5 flex h-2 w-2 rounded-full bg-indigo-500"></span>
            Status: {status}
          </div>
        )}
      </div>
      
      <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto px-4">
        {/* Connecting Line Background */}
        <div className="absolute left-10 right-10 top-5 h-1 bg-slate-200 z-0 rounded-full" />
        
        {/* Connecting Line Progress */}
        <div 
          className="absolute left-10 top-5 h-1 bg-[#6D5DF6] z-0 rounded-full transition-all duration-500 ease-out"
          style={{ width: `calc(${(progressIdx / (steps.length - 1)) * 100}% - 2.5rem)` }}
        />
        
        {steps.map((step, index) => {
          const isCompleted = index <= progressIdx;
          const isViewing = index === activeIdx;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <button
                onClick={() => onTabChange(step.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-4 border-[#FAFAFA] transition-all duration-300 shadow-sm
                  ${isCompleted ? 'bg-[#6D5DF6] text-white' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'}
                  ${isViewing ? 'ring-2 ring-offset-2 ring-[#6D5DF6]' : ''}`}
              >
                {index + 1}
              </button>
              <span className={`absolute top-12 text-sm font-medium whitespace-nowrap transition-colors duration-300
                ${isViewing ? 'text-[#6D5DF6]' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Dealsheet & Proposal Page Component ---
function DealsheetPage({ brief, onUpdateBrief, showToast }) {
  const activeGroups = Object.keys(brief.groupTrackers || {});
  
  // Create a filtered version of groupTrackers containing only "Done" influencers
  const filteredTrackers = {};
  let totalDoneCount = 0;
  
  activeGroups.forEach(grp => {
    const tracker = brief.groupTrackers[grp];
    const doneInfluencers = tracker.influencers.filter(inf => inf.contactStatus === "Done");
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

  const hasKpi = brief && (
    Array.isArray(brief.packageType) 
      ? brief.packageType.some(p => {
          if (typeof p !== "string") return false;
          if (p === "Others") {
            return brief.packageTypeOther && brief.packageTypeOther.toLowerCase().includes("kpi");
          }
          return p.toLowerCase().includes("kpi");
        })
      : (typeof brief.packageType === "string" && brief.packageType.toLowerCase().includes("kpi"))
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4 space-y-6 min-w-0">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm p-6 lg:p-8">
            <div className="mb-6 border-b border-slate-100 pb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dealsheet & Proposal</h1>
                <p className="text-slate-500 mt-1">{brief.campaignName} • {brief.id}</p>
              </div>
            </div>

            {hasStandard ? (
              <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm p-10 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 rounded-full bg-[#6D5DF6]/10 flex items-center justify-center mb-4">
                  <ExternalLink className="h-8 w-8 text-[#6D5DF6]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Standard Dealsheet is Ready</h3>
                <p className="text-slate-500 max-w-md mb-8">
                  Your standard Dealsheet & Proposal is hosted on Canva. Click the button below to view it in a new tab.
                </p>
                <a 
                  href="https://bubblely-standard-dealsheet.my.canva.site/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-[#6D5DF6] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5a4add]"
                >
                  Open Dealsheet in Canva
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            ) : totalDoneCount === 0 ? (
              <div className="text-center py-16 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mb-4 border border-slate-200">
                  <CheckCircle2 className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">No Influencers Ready</h3>
                <p className="mb-4 text-sm text-slate-500 mt-1">Change influencer status to "Done" in Example List to view them here.</p>
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
                      // We need to merge the updated "Done" influencers back into the full list
                      const newTrackers = { ...brief.groupTrackers };
                      const originalInfluencers = newTrackers[grp].influencers;
                      
                      // Map the updated influencers by ID
                      const updatedMap = {};
                      updatedTracker.influencers.forEach(inf => {
                        updatedMap[inf.id] = inf;
                      });
                      
                      // Replace the original ones with updated ones if they exist
                      const mergedInfluencers = originalInfluencers.map(inf => {
                        return updatedMap[inf.id] ? updatedMap[inf.id] : inf;
                      });
                      
                      newTrackers[grp] = { ...newTrackers[grp], influencers: mergedInfluencers };
                      onUpdateBrief({ ...brief, groupTrackers: newTrackers });
                    }}
                    onAddClick={() => {}} // Disabled adding in dealsheet view
                    hideAddButton={true} // We'll add this prop to TrackerTable to hide the add button
                    readOnly={true} // Prevent editing any data in this view
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/4 shrink-0">
          <div className="sticky top-6 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Actions</h3>
              <div className="flex flex-col gap-3">
                <Button className="w-full" onClick={() => showToast && showToast("download dealsheet soon")}><Download className="mr-2 h-4 w-4" /> Export Dealsheet</Button>
                <Button 
                  variant="secondary" 
                  className="w-full" 
                  onClick={() => showToast && showToast("download proposal soon")}
                  disabled={!hasKpi}
                  title={!hasKpi ? "Only package types containing 'KPI' can export proposal" : ""}
                >
                  <Download className="mr-2 h-4 w-4" /> Export Proposal
                </Button>
              </div>
            </div>
            <ActivityTimeline logs={brief.activityLog || []} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Brief Detail Page Component ---
function BriefDetailPage({ brief, onBack, onUpdateBrief }) {
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
      budgetBoostSpending: "งบประมาณ Boost Post", isBuddyBoostRequired: "ต้องการ Buddy Boost", 
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
      internalStatus: hasStandard ? "Draft Dealsheet" : "Assign Planner/Buyer",
      activeTab: hasStandard ? "dealsheet" : "assign",
      submittedSows: selectedSows,
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
    { id: "logistics", label: "Support & Logistics", icon: Truck },
    { id: "activity", label: "Activity Log", icon: History, count: brief.activityLog?.length }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
      
      {/* Top Breadcrumb & Back Row */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onBack} 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-650 hover:text-[#6D5DF6] transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Briefs</span>
        </button>
        <div className="text-xs text-slate-400">
          Brief ID: <span className="font-semibold text-slate-600">{brief.id}</span>
        </div>
      </div>

      {/* Modern Gradient Header Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 p-6 lg:p-8 shadow-2xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-[#6D5DF6] ring-1 ring-violet-100/50">
                {brief.brand || "Client Name"}
              </span>
              <span className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border",
                brief.clientStatus === "New" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-blue-50 text-blue-700 border-blue-100"
              )}>
                {brief.clientStatus || "New Client"}
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200">
                {brief.customerType || "Key Account"}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
              {brief.campaignName || "Unnamed Campaign"}
            </h1>
            
            {/* Timeline Progress Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3.5">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="font-semibold text-slate-700">Period:</span>
                <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-800 font-bold">{brief.campaignStartDate || "-"}</span>
                <span className="text-slate-400">to</span>
                <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-800 font-bold">{brief.campaignEndDate || "-"}</span>
              </div>
              <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="font-semibold text-slate-700">Internal Status:</span>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full font-bold border text-[10px] uppercase",
                  brief.internalStatus === "Submitted to Traffic" || brief.internalStatus === "Assign Planner/Buyer"
                    ? "bg-violet-50 text-[#6D5DF6] border-violet-100"
                    : brief.internalStatus === "Draft Dealsheet"
                    ? "bg-blue-50 text-blue-700 border-blue-100"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                )}>
                  {brief.internalStatus || "Draft"}
                </span>
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
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              title="Copy link to this brief"
            >
              <Copy className="h-4 w-4" />
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
                    "flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer relative",
                    isActive 
                      ? "border-[#6D5DF6] text-[#6D5DF6] font-bold" 
                      : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-[#6D5DF6]" : "text-slate-400")} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={cn(
                      "ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
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
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Project & Client Information</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Key parameters, target brand specs, and targeted audiences.</p>
                  </div>
                  <button 
                    onClick={() => handleEditSection(1)} 
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Client Profile Box */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
                      <Briefcase className="h-4 w-4 text-[#6D5DF6]" />
                      Client Profile & Lead
                    </h4>
                    <div className="space-y-3 text-sm">
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
                      <div className="flex justify-between items-start border-t border-slate-200/50 pt-3">
                        <span className="text-slate-500 mt-0.5">Package Type:</span>
                        <div className="flex flex-wrap gap-1 justify-end max-w-[65%]">
                          {(Array.isArray(brief.packageType) ? brief.packageType : [brief.packageType || "Standard"]).map(pkg => (
                            <span key={pkg} className="bg-violet-50 text-[#6D5DF6] border border-violet-100 px-2 py-0.5 rounded-md text-xs font-semibold">
                              {pkg === "Others" && brief.packageTypeOther ? `Others (${brief.packageTypeOther})` : pkg}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Channel & Platforms Box */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
                      <Compass className="h-4 w-4 text-[#6D5DF6]" />
                      Campaign Channels
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-slate-500 text-xs block mb-1.5">Target Platforms:</span>
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
                      <div className="border-t border-slate-200/50 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-xs">Buddy Boost Required:</span>
                          <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full border", brief.isBuddyBoostRequired ? "bg-violet-100 text-[#6D5DF6] border-violet-200" : "bg-slate-200 text-slate-700 border-slate-350")}>
                            {brief.isBuddyBoostRequired ? "Yes" : "No"}
                          </span>
                        </div>
                        {brief.isBuddyBoostRequired && (
                          <div className="mt-2 p-2.5 rounded-lg bg-white border border-slate-200 text-xs space-y-1.5 shadow-3xs">
                            <div className="flex justify-between"><span className="text-slate-400">Target Boost:</span> <span className="font-semibold text-slate-800">{renderList(brief.targetBoost)}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Boost Budget:</span> <span className="font-semibold text-[#6D5DF6]">{brief.budgetBoostSpending || "-"}</span></div>
                            {brief.buddyBoostDetail && <div className="border-t border-slate-100 pt-1 mt-1 text-slate-500 italic">{brief.buddyBoostDetail}</div>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Target Audience Profile */}
                  <div className="md:col-span-2 p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
                      <Users className="h-4 w-4 text-[#6D5DF6]" />
                      Target Audience Demographics
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-3xs">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Gender</span>
                        <span className="font-bold text-slate-800 text-sm mt-0.5 block">{renderList(brief.gender)}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-3xs">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Age Range</span>
                        <span className="font-bold text-slate-800 text-sm mt-0.5 block">{renderList(brief.ageRange) || "-"}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-3xs">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Country</span>
                        <span className="font-bold text-slate-800 text-sm mt-0.5 block">{brief.country || "-"}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-3xs">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Province</span>
                        <span className="font-bold text-slate-800 text-sm mt-0.5 block">{brief.province || "-"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Campaign Objectives */}
                  <div className="md:col-span-2 p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
                      <Sparkles className="h-4 w-4 text-[#6D5DF6]" />
                      Campaign Objectives & Goals
                    </h4>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {["Awareness (Reach)", "Interest (Engagement)", "Trust (Post)"].map(obj => {
                          const isSelected = brief.objective && brief.objective.includes(obj);
                          return (
                            <span key={obj} className={cn(
                              "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition",
                              isSelected 
                                ? "bg-violet-50 text-[#6D5DF6] border-violet-200 shadow-3xs" 
                                : "bg-white text-slate-300 border-slate-200 opacity-50 line-through"
                            )}>
                              {isSelected && <Check className="h-3.5 w-3.5 text-[#6D5DF6] stroke-[3]" />}
                              {obj}
                            </span>
                          );
                        })}
                      </div>
                      {brief.objectiveNote && (
                        <div className="text-xs text-slate-650 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed shadow-3xs mt-2.5">
                          <span className="font-bold text-slate-700 block mb-1">Objective Note:</span>
                          {brief.objectiveNote}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Collapsible Reference Sheets (Product Info, Competitors etc.) */}
                  <div className="md:col-span-2 space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-slate-450" />
                      Brand Specifications & Reference Sheets
                    </h4>

                    {/* Product Details Document */}
                    {brief.product && (
                      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs bg-white">
                        <button 
                          onClick={() => toggleDoc("product")}
                          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition text-left cursor-pointer"
                        >
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Product Name & Specifications</span>
                          {expandedDocs.product ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        </button>
                        {expandedDocs.product && (
                          <div className="p-4 border-t border-slate-200 text-xs text-slate-750 leading-relaxed max-h-[300px] overflow-y-auto">
                            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: brief.product }} />
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
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Previous Campaign References</span>
                          {expandedDocs.previous ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        </button>
                        {expandedDocs.previous && (
                          <div className="p-4 border-t border-slate-200 text-xs text-slate-750 leading-relaxed max-h-[250px] overflow-y-auto">
                            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: brief.previousCampaign }} />
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
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Competitor Analysis & Notes</span>
                          {expandedDocs.competitor ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        </button>
                        {expandedDocs.competitor && (
                          <div className="p-4 border-t border-slate-200 text-xs text-slate-750 leading-relaxed max-h-[250px] overflow-y-auto">
                            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: brief.competitor }} />
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
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Additional Campaign Guidelines</span>
                          {expandedDocs.additional ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        </button>
                        {expandedDocs.additional && (
                          <div className="p-4 border-t border-slate-200 text-xs text-slate-750 leading-relaxed max-h-[200px] overflow-y-auto">
                            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: brief.additionalInfo }} />
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
                    <h3 className="text-base font-bold text-slate-800">Budget Packages & Scopes of Work</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Option variations, budget details, and scope guidelines.</p>
                  </div>
                  <button 
                    onClick={() => handleEditSection(2)} 
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit Options
                  </button>
                </div>

                {/* Option Tabs Navigation (within this tab) */}
                {budgetOptions.length > 1 && (
                  <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200/50">
                    {budgetOptions.map((opt, oIdx) => {
                      const isActive = opt.id === activeOptId;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setActiveOptId(opt.id)}
                          className={cn(
                            "px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer",
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
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Budget Spending</span>
                      <span className="text-xl font-bold text-[#6D5DF6] block mt-1">
                        {formatCurrency(activeOpt.budgetSpending)}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 mt-2 block">
                      Tax Status: {activeOpt.vat || "-"}
                    </span>
                  </div>

                  {/* Estimated Brand Spending */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Est. Brand Spend</span>
                      <span className="text-xl font-bold text-slate-800 block mt-1">
                        {formatCurrency(activeOpt.estimatedBrandSpending)}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 mt-2 block">
                      Evaluation estimate
                    </span>
                  </div>

                  {/* Budget / KOL */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Budget Per Influencer</span>
                      <span className="text-xl font-bold text-slate-800 block mt-1">
                        {formatCurrency(activeOpt.budgetPerInfluencer)}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 mt-2 block">
                      Target budget average
                    </span>
                  </div>

                  {/* Target Deliverables */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Expected KOLs & Reach</span>
                      <span className="text-base font-bold text-slate-800 block mt-1">
                        KOLs: {activeOpt.expectedNumInfluencers || "-"}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                      Reach: {activeOpt.expectedReach || "-"}
                    </span>
                  </div>

                </div>

                {/* Option Level Condition */}
                {activeOpt.budgetCondition && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">Option Condition / Note:</span>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{activeOpt.budgetCondition}</p>
                  </div>
                )}

                {/* SOW Scope list */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Scope of Work List ({activeOpt.scopeOfWorks?.length || 0})</span>
                  </h4>
                  
                  {activeOpt.scopeOfWorks && activeOpt.scopeOfWorks.length > 0 ? (
                    activeOpt.scopeOfWorks.map((sow, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 text-sm shadow-3xs space-y-4 hover:shadow-2xs transition">
                        
                        {/* Scope Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <span className="font-bold text-slate-900 text-sm">
                            Scope {idx + 1}: {sow.name || "Unnamed Scope"}
                          </span>
                          <div className="flex gap-1.5">
                            {(sow.platforms || []).map(plat => (
                              <span key={plat} className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-full border",
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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-slate-400 font-bold block mb-0.5">Content Type</span>
                            <span className="font-semibold text-slate-800 text-sm">{renderList(sow.contentType)}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-slate-400 font-bold block mb-0.5">Followers Required</span>
                            <span className="font-semibold text-slate-800 text-sm">{sow.followerReq || "-"}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-slate-400 font-bold block mb-0.5">KOL Qty</span>
                            <span className="font-semibold text-slate-800 text-sm">{sow.numInfluencers || "-"}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-slate-400 font-bold block mb-0.5">Budget Allocation</span>
                            <span className="font-semibold text-slate-800 text-sm">
                              {sow.allocationPercent ? `${sow.allocationPercent}%` : sow.allocation ? `${sow.allocation}%` : "-"}
                            </span>
                          </div>
                        </div>

                        {/* SOW Details Content */}
                        {sow.details && (
                          <div className="text-xs p-3 rounded-xl border border-slate-150 bg-slate-50/30">
                            <h5 className="font-bold text-slate-400 mb-1">Details & Guidelines</h5>
                            <div className="font-medium text-slate-600 leading-relaxed prose prose-sm max-w-none max-h-[150px] overflow-y-auto" dangerouslySetInnerHTML={{ __html: sow.details }} />
                          </div>
                        )}

                        {/* Columns split for Persona and Active services */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Influencer Persona */}
                          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                            <h5 className="font-bold text-slate-750 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/50 pb-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#6D5DF6]" /> Influencer Persona
                            </h5>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                              <div><span className="text-slate-400">Demographic:</span> <span className="font-semibold text-slate-800">{sow.persona?.demographic || sow.persona?.infDemographic || "-"}</span></div>
                              <div><span className="text-slate-400">Location:</span> <span className="font-semibold text-slate-800">{sow.persona?.location || sow.persona?.infLocation || "-"}</span></div>
                              <div><span className="text-slate-400">Occupation:</span> <span className="font-semibold text-slate-800">{sow.persona?.occupation || sow.persona?.infOccupation || "-"}</span></div>
                              <div><span className="text-slate-400">Tone:</span> <span className="font-semibold text-slate-800">{sow.persona?.persona || sow.persona?.infPersona || "-"}</span></div>
                              <div className="col-span-2"><span className="text-slate-400">Content Category:</span> <span className="font-semibold text-slate-800">{sow.persona?.contentCategory || sow.persona?.infContent || "-"}</span></div>
                              <div className="col-span-2"><span className="text-slate-400">Storytelling:</span> <span className="font-semibold text-slate-800">{sow.persona?.storyTelling || sow.persona?.infStoryTelling || "-"}</span></div>
                            </div>
                            {sow.persona?.infPreference && (
                              <div className="mt-2 pt-2 border-t border-slate-200/50 text-slate-650">
                                <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Influencer Preferences</span>
                                <div className="bg-white p-2 rounded-lg border border-slate-250 max-h-[100px] overflow-y-auto" dangerouslySetInnerHTML={{ __html: sow.persona?.infPreference }} />
                              </div>
                            )}
                          </div>

                          {/* Active Services */}
                          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                            <h5 className="font-bold text-slate-750 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/50 pb-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Special Services Requested
                            </h5>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {sow.serviceScope?.buyoutRequired && (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-md font-semibold text-[10px]">
                                  buyout: {renderList(sow.serviceScope?.buyoutDuration)}
                                </span>
                              )}
                              {(sow.serviceScope?.boostPostRequired || sow.serviceScope?.boostRequired) && (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-md font-semibold text-[10px]">
                                  boost: {renderList(sow.serviceScope?.boostPostDuration || sow.serviceScope?.boostDuration)}
                                </span>
                              )}
                              {sow.serviceScope?.addAdsRequired && (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-md font-semibold text-[10px]">
                                  add ads: {renderList(sow.serviceScope?.addAdsDuration)}
                                </span>
                              )}
                              {sow.serviceScope?.paidPartnershipRequired && (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-md font-semibold text-[10px]">
                                  partnership: {renderList(sow.serviceScope?.paidPartnershipDuration)}
                                </span>
                              )}
                              {sow.serviceScope?.genCodeRequired && (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-md font-semibold text-[10px]">
                                  gen code: {renderList(sow.serviceScope?.genCodeDuration)}
                                </span>
                              )}
                              {sow.serviceScope?.tiktokShopRequired && (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-md font-semibold text-[10px]">
                                  shop: {renderList(sow.serviceScope?.tiktokShopDuration)}
                                </span>
                              )}
                              {(sow.serviceScope?.brandedContentRequired || sow.serviceScope?.fbBrandedContentRequired) && (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-md font-semibold text-[10px]">
                                  branded: {renderList(sow.serviceScope?.brandedContentDuration || sow.serviceScope?.fbBrandedContentDuration)}
                                </span>
                              )}
                              {(sow.serviceScope?.discoveryRequired || sow.serviceScope?.youtubeDiscoveryRequired) && (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-md font-semibold text-[10px]">
                                  discovery: {renderList(sow.serviceScope?.discoveryDuration || sow.serviceScope?.youtubeDiscoveryDuration)}
                                </span>
                              )}
                              {(sow.serviceScope?.whitelistingRequired || sow.serviceScope?.xWhitelistingRequired) && (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-md font-semibold text-[10px]">
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
                                <span className="text-slate-400 italic font-medium">No special rights or whitelisting requested.</span>
                              )}
                            </div>
                          </div>

                        </div>

                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 italic text-center py-8 bg-slate-50 border border-slate-200 rounded-xl">
                      No scope of work items configured.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 3: SUPPORT & LOGISTICS */}
            {activeSubTab === "logistics" && (
              <div className="space-y-6">
                
                {/* Header Row */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Support, Travel & On-Site Logistics</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Product sponsorships, logistics and reviewer travel terms.</p>
                  </div>
                  <button 
                    onClick={() => handleEditSection(3)} 
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-650 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit Support
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Delivery & Logistics */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
                      <Coins className="h-4 w-4 text-[#6D5DF6]" />
                      Brand Support & Delivery
                    </h4>
                    
                    <div className="space-y-3.5 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Support Type:</span>
                        <span className="font-bold text-slate-800">
                          {brief.brandSupportType || "No Sponsor"}
                          {brief.brandSupportType === "Other" && brief.brandSupportTypeOther && ` (${brief.brandSupportTypeOther})`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Receive Method:</span>
                        <span className="font-semibold text-slate-850">{brief.productReceiveMethod || "-"}</span>
                      </div>
                      
                      {["Buddy Review ซื้อและจัดส่งให้ Influencer", "Sponsor สินค้า (Buddy Review จัดส่ง)"].includes(brief.productReceiveMethod) && (
                        <div className="flex justify-between items-center border-t border-slate-200/50 pt-2.5">
                          <span className="text-slate-500">Logistics Cost / KOL:</span>
                          <span className="font-bold text-[#6D5DF6]">
                            {brief.logisticsPerInfluencer ? formatCurrency(brief.logisticsPerInfluencer) : "-"}
                          </span>
                        </div>
                      )}

                      {brief.brandSupportType === "No Sponsor" && brief.productReceiveMethod === "Influencer ซื้อเอง" && (
                        <div className="flex justify-between items-center border-t border-slate-200/50 pt-2.5">
                          <span className="text-slate-500">Reimbursement Type:</span>
                          <span className="font-semibold text-slate-800">{brief.reimbursement || "-"}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center border-t border-slate-200/50 pt-2.5">
                        <span className="text-slate-500">Product Value:</span>
                        <span className="font-bold text-[#6D5DF6]">
                          {brief.productValue ? formatCurrency(brief.productValue) : "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Travel & On-Site */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
                      <MapPin className="h-4 w-4 text-[#6D5DF6]" />
                      On-Site & Travel Details
                    </h4>

                    <div className="space-y-3.5 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Travel Required:</span>
                        <span className={cn(
                          "text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                          brief.requireTravel && brief.requireTravel.includes("ต้อง") ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-650 border-slate-200"
                        )}>
                          {brief.requireTravel || "ไม่ต้อง"}
                        </span>
                      </div>
                      
                      {brief.requireTravel && brief.requireTravel.includes("ต้อง") && (
                        <>
                          <div className="flex justify-between items-center border-t border-slate-200/50 pt-2">
                            <span className="text-slate-500">On-Site Type:</span>
                            <span className="font-semibold text-slate-800">{brief.onSiteType || "-"}</span>
                          </div>
                          {brief.onSiteType === "เข้าร่วม Event" && (
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Event Duration:</span>
                              <span className="font-semibold text-slate-800">{brief.eventDuration ? `${brief.eventDuration} Hours` : "-"}</span>
                            </div>
                          )}
                          {["ถ่ายทำที่สถานที่ที่แบรนด์กำหนด", "เข้าร่วม Event", "รับสินค้า/บริการตามสถานที่ที่แบรนด์กำหนด"].includes(brief.onSiteType) && (
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Travel Expense Reimbursement:</span>
                              <span className="font-bold text-[#6D5DF6]">
                                {brief.reviewerTravelExpense ? formatCurrency(brief.reviewerTravelExpense) : "-"}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Buddy Frontline Support:</span>
                            <span className="font-semibold text-slate-800">{brief.buddyReviewSupport || "No"}</span>
                          </div>
                          
                          {brief.locationDetails && (
                            <div className="border-t border-slate-200/50 pt-2 text-xs">
                              <span className="text-slate-400 font-bold block mb-1">On-site Location Details</span>
                              <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed whitespace-pre-wrap">{brief.locationDetails}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* General Campaign Conditions */}
                  {brief.condition && (
                    <div className="md:col-span-2 p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign Conditions & Remarks</h4>
                      <div className="text-slate-700 bg-white border border-slate-200 p-4 rounded-xl whitespace-pre-wrap leading-relaxed text-xs shadow-3xs">
                        {brief.condition}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* TAB 4: ACTIVITY LOG */}
            {activeSubTab === "activity" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-800">Brief Version & Audit Log</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Audit log history of all field changes and timeline events.</p>
                </div>
                <ActivityTimeline logs={brief.activityLog || []} />
              </div>
            )}

          </div>

        </div>

        {/* Right Column (Actions Sidebar) */}
        <div className="w-full lg:w-1/4 shrink-0">
          <div className="sticky top-6 space-y-6">
            
            {/* Actions Panel */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-3xs p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Brief Status & Actions</h3>
              
              {/* Internal Status Badge */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Current Phase</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {brief.internalStatus || "Draft"}
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {(!brief.internalStatus || brief.internalStatus === "Draft") && (
                  <Button className="w-full py-2.5 font-bold" onClick={() => setSubmitModalOpen(true)}>
                    {hasStandard ? "Create Dealsheet" : "Submit to Traffic"}
                  </Button>
                )}
                <Button variant="secondary" className="w-full py-2.5 font-bold cursor-pointer">
                  <Copy className="mr-2 h-4 w-4" /> Duplicate Brief
                </Button>
              </div>
            </div>

            {/* General Info Card */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-3xs p-5 space-y-3.5 text-xs">
              <h3 className="font-bold text-slate-400 uppercase tracking-wider">System Metadata</h3>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">ID:</span>
                <span className="font-semibold text-slate-850">{brief.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Created At:</span>
                <span className="font-semibold text-slate-850">{brief.createdAt || "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Last Active Tab:</span>
                <span className="font-semibold text-slate-850 capitalize">{brief.activeTab || "Brief"}</span>
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
function TrackerTable({ groupName, brief, trackerData, onUpdateTracker, onAddClick, hideAddButton = false, readOnly = false }) {
  const influencers = trackerData.influencers || [];
  const allSOWs = brief.budgetOptions && brief.budgetOptions.length > 0 
    ? brief.budgetOptions.flatMap(opt => opt.scopeOfWorks || []) 
    : (brief.scopeOfWorks || []);
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

  const STATUS_OPTIONS = [
    { value: "", label: "Status...", bg: "bg-slate-100", text: "text-slate-500" },
    { value: "ทักแล้ว", label: "ทักแล้ว", bg: "bg-[#FDE68A]", text: "text-[#92400E]" },
    { value: "โทรแล้ว", label: "โทรแล้ว", bg: "bg-[#FFDCC8]", text: "text-[#8C3A10]" },
    { value: "ตอบแล้ว", label: "ตอบแล้ว", bg: "bg-[#D1FAE5]", text: "text-[#065F46]" },
    { value: "Done", label: "Done", bg: "bg-[#047857]", text: "text-white" },
    { value: "ข้อมูลไม่ครบ", label: "ข้อมูลไม่ครบ", bg: "bg-[#DBEAFE]", text: "text-[#1E3A8A]" },
    { value: "ไม่รับงาน", label: "ไม่รับงาน", bg: "bg-[#4B5563]", text: "text-white" },
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
    if (brief[reqKey]) {
      const durations = Array.isArray(brief[durationKey]) ? brief[durationKey] : (brief[durationKey] ? [brief[durationKey]] : []);
      if (durations.length > 0) {
        durations.forEach(d => {
          requiredServices.push({ key: `${reqKey}_${d}`, label: `${labelPrefix} (${d})` });
        });
      } else {
        requiredServices.push({ key: reqKey, label: labelPrefix });
      }
    }
  };

  addServiceColumns("buyoutRequired", "buyoutDuration", "Buyout");
  addServiceColumns("boostRequired", "boostDuration", "Boost Post");
  addServiceColumns("genCodeRequired", "genCodeDuration", "Gen Code");
  addServiceColumns("crossPostingRequired", "crossPostingDuration", "Cross Posting");
  addServiceColumns("paidPartnershipRequired", "paidPartnershipDuration", "Paid Partnership");
  addServiceColumns("addAdsRequired", "addAdsDuration", "Add Ads");
  addServiceColumns("youtubeDiscoveryRequired", "youtubeDiscoveryDuration", "Youtube Discovery");
  addServiceColumns("fbBrandedContentRequired", "fbBrandedContentDuration", "FB Branded Content");
  addServiceColumns("xWhitelistingRequired", "xWhitelistingDuration", "X/Twitter Whitelisting");
  requiredServices.push({ key: "Affiliate", label: "Affiliate" });
  
  const brandSupports = Array.isArray(brief.brandSupport) ? brief.brandSupport : [];
  const hasCompetitor = brief.competitor && brief.competitor.length > 0 && brief.competitor != "<p><br></p>";

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
                {requiredServices.length > 0 && <th colSpan={requiredServices.length} className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-amber-50/50">Service (Price or "ไม่รับ")</th>}
                <th colSpan="2" className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-indigo-50/50">SOW & Condition</th>
                {brandSupports.length > 0 && <th colSpan={brandSupports.length} className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-rose-50/50">Brand Support</th>}
                {hasCompetitor && <th className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-orange-50/50">Competitor</th>}
                <th colSpan="2" className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-slate-100/50">Note</th>
              </tr>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-3 py-2 border-r border-slate-200 w-[50px] min-w-[50px] sticky left-0 z-20 bg-slate-50">No.</th>
                <th className="px-5 py-4 border-r border-slate-200 w-[280px] min-w-[280px] sticky left-[50px] z-20 bg-slate-50 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]">Influencer</th>
                <th className="px-3 py-2 border-r border-slate-200 min-w-[120px]">Status</th>
                <th className="px-3 py-2 border-r border-slate-200">Contact</th>
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
                  <tr key={inf.id} className={`group transition ${inf.contactStatus === "Done" ? "bg-[#ECFDF5] hover:bg-[#D1FAE5]" : "hover:bg-slate-50"}`}>
                    <td className={`px-3 py-2 border-r border-slate-100 text-slate-500 text-center sticky left-0 z-10 w-[50px] min-w-[50px] transition ${inf.contactStatus === "Done" ? "bg-[#ECFDF5] group-hover:bg-[#D1FAE5]" : "bg-white group-hover:bg-slate-50"}`}>{idx + 1}</td>
                    <td className={`px-5 py-3 border-r border-slate-100 min-w-[280px] w-[280px] sticky left-[50px] z-10 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)] transition ${inf.contactStatus === "Done" ? "bg-[#ECFDF5] group-hover:bg-[#D1FAE5]" : "bg-white group-hover:bg-slate-50"}`}>
                      <div className="flex gap-3 text-left w-full">
                        <img src={inf.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(inf.accountName || "New")}&background=random`} alt="" className="h-11 w-11 rounded-full object-cover shrink-0" />
                        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                          <input type="text" value={inf.accountName} disabled={readOnly} onChange={e => updateInf(inf.id, "accountName", e.target.value)} placeholder="Account Name (@handle)" className="w-full font-semibold text-slate-900 hover:text-[#6D5DF6] text-[13px] bg-white px-1.5 py-1 rounded outline-none border border-transparent hover:border-slate-200 focus:border-[#6D5DF6] placeholder:text-slate-300" />
                          <div className="flex items-center gap-2 w-full">
                             <input type="text" value={inf.follower} disabled={readOnly} onChange={e => updateInf(inf.id, "follower", e.target.value)} placeholder="Followers" className="w-20 text-xs text-slate-500 bg-white px-1.5 py-1 rounded outline-none border border-slate-200 focus:border-[#6D5DF6] placeholder:text-slate-300" />
                             <select value={inf.channel} disabled={readOnly} onChange={e => updateInf(inf.id, "channel", e.target.value)} className="text-[10px] font-medium text-slate-600 bg-white border border-slate-200 rounded px-1.5 py-1 outline-none cursor-pointer focus:border-[#6D5DF6]">
                               <option value="">Platform</option>
                               <option value="Instagram">IG</option>
                               <option value="TikTok">TT</option>
                               <option value="Facebook">FB</option>
                               <option value="YouTube">YT</option>
                               <option value="X">X</option>
                               <option value="Other">Other</option>
                             </select>
                          </div>
                          <input type="text" value={inf.accountLink} disabled={readOnly} onChange={e => updateInf(inf.id, "accountLink", e.target.value)} placeholder="Link URL" className="w-full text-[10px] text-blue-500 bg-white px-1.5 py-1 rounded outline-none border border-slate-200 focus:border-[#6D5DF6] placeholder:text-slate-300" />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-center align-middle">
                      <select 
                        value={inf.contactStatus || ""} 
                        disabled={readOnly} onChange={e => updateInf(inf.id, "contactStatus", e.target.value)}
                        className={`w-full rounded-full border px-2 py-1 outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#6D5DF6]/50 text-[11px] text-center cursor-pointer appearance-none ${getStatusColor(inf.contactStatus)}`}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value} className="bg-white text-slate-900 font-normal">{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100"><input type="text" value={inf.contact} disabled={readOnly} onChange={e => updateInf(inf.id, "contact", e.target.value)} className="w-32 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] bg-white" placeholder="Email, Line, Tel" /></td>
                    <td className="px-3 py-2 border-r border-slate-100"><input type="text" value={inf.rawCost} disabled={readOnly} onChange={e => updateInf(inf.id, "rawCost", e.target.value)} className="w-24 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] bg-white" /></td>
                    <td className="px-3 py-2 border-r border-slate-100">
                      <input type="text" value={inf.creditTerm} disabled={readOnly} onChange={e => updateInf(inf.id, "creditTerm", e.target.value)} className="w-20 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] bg-white" placeholder="วัน" />
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100">
                      <select value={inf.paymentType || ""} disabled={readOnly} onChange={e => updateInf(inf.id, "paymentType", e.target.value)} className="w-24 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] bg-white">
                        <option value="">Select...</option>
                        <option value="บุคคล">บุคคล</option>
                        <option value="บริษัท">บริษัท</option>
                      </select>
                    </td>
                    {requiredServices.map(srv => {
                      let srvData = inf.services?.[srv.key];
                      if (typeof srvData === 'string' || !srvData) {
                        srvData = { 
                          status: srvData === "ไม่รับ" ? "ไม่รับ" : (srvData ? "รับ" : ""), 
                          price: srvData && srvData !== "ไม่รับ" ? srvData : "", 
                          note: "" 
                        };
                      }
                      return (
                        <td key={srv.key} className="px-3 py-2 border-r border-slate-100 min-w-[150px] align-top">
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
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 border-r border-slate-100">
                      <select value={inf.scopeOfWork || ""} disabled={readOnly} onChange={e => updateInf(inf.id, "scopeOfWork", e.target.value)} className="w-full min-w-[180px] rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] text-xs bg-white">
                        <option value="">Select SOW</option>
                        {submittedSows.map(sow => (
                          <option key={sow.id} value={sow.id}>Scope {submittedSows.indexOf(sow) + 1}: {sow.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100"><textarea rows={6} value={inf.condition || ""} disabled={readOnly} onChange={e => updateInf(inf.id, "condition", e.target.value)} className="w-full min-w-[220px] rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] resize-y text-xs bg-white"></textarea></td>
                    {brandSupports.map(bs => (
                      <td key={bs} className="px-3 py-2 border-r border-slate-100"><input type="text" value={inf.brandSupports?.[bs] || ""} onChange={e => updateInfBrandSupport(inf.id, bs, e.target.value)} className="w-24 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] bg-white" /></td>
                    ))}
                    {hasCompetitor && (
                      <td className="px-3 py-2 border-r border-slate-100"><textarea rows={3} value={inf.competitorNote} disabled={readOnly} onChange={e => updateInf(inf.id, "competitorNote", e.target.value)} className="w-full min-w-[150px] rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] resize-y text-xs bg-white"></textarea></td>
                    )}
                    <td className="px-3 py-2 border-r border-slate-100"><textarea rows={3} value={inf.detail || ""} disabled={readOnly} onChange={e => updateInf(inf.id, "detail", e.target.value)} className="w-full min-w-[180px] rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] resize-y text-xs bg-white"></textarea></td>
                    <td className="px-3 py-2 border-slate-100"><textarea rows={3} value={inf.note} disabled={readOnly} onChange={e => updateInf(inf.id, "note", e.target.value)} className="w-full min-w-[180px] rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] resize-y text-xs bg-white"></textarea></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
      </div>
    </div>
  );
}

// --- Planner Tracker Page Component ---
function PlannerTrackerPage({ brief, onUpdateBrief }) {
  const [groupTrackers, setGroupTrackers] = useState(brief.groupTrackers || {});
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [selectGroupModalOpen, setSelectGroupModalOpen] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);

  const activeGroups = Object.keys(groupTrackers);

  const handleConfirmGroups = (groups) => {
    const newTrackers = { ...groupTrackers };
    groups.forEach(g => {
      if (!newTrackers[g]) newTrackers[g] = { influencers: [] };
    });
    // Remove groups that were unselected
    Object.keys(newTrackers).forEach(g => {
      if (!groups.includes(g)) delete newTrackers[g];
    });
    
    setGroupTrackers(newTrackers);
    onUpdateBrief({ ...brief, groupTrackers: newTrackers });
    setSelectGroupModalOpen(false);
  };

  const handleConfirmPillar = () => {
    const log = {
      date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action: "Sales confirmed Pillar",
      details: "Pillar structure confirmed by Sales."
    };
    onUpdateBrief({
      ...brief,
      internalStatus: "Pillar Confirmed",
      activityLog: [...(brief.activityLog || []), log]
    });
  };

  const handleAddInfluencerClick = (groupId) => {
    setCurrentGroupId(groupId);
    setSelectModalOpen(true);
  };

  const handleSelectInfluencer = (inf) => {
    setSelectModalOpen(false);
    if (!currentGroupId) return;

    const currentData = groupTrackers[currentGroupId] || { influencers: [] };
    const newInfluencer = {
      id: Date.now() + Math.random(),
      accountName: inf ? inf.username : "",
      accountLink: inf ? `https://${inf.platform.toLowerCase()}.com/${inf.username.replace("@", "")}` : "",
      follower: inf ? inf.followers.toString() : "",
      channel: inf ? inf.platform : "Other",
      contact: "",
      rawCost: inf?.rawCost ? inf.rawCost.replace(/[^0-9]/g, "") : "",
      creditTerm: "",
      paymentType: "",
      services: {},
      scopeOfWork: "",
      detail: "",
      condition: "1. แก้ไขดราฟได้สูงสุดกี่ครั้ง =\n2. ใส่ # สูงสุดได้กี่อัน =\n3. ใส่ Text/AW/Logo ในชิ้นงานได้หรือไม่ =\n4. ระยะเวลาทำ Script/Idea  =\n5. ระยะเวลาทำ Draft = \n6. ลบโพสต์หรือไม่ = ",
      brandSupports: {},
      competitorNote: "",
      note: "",
      internalStatus: "Pitching",
      postingStatus: "Pending",
      clientStatus: "Pending"
    };

    const newData = {
      ...currentData,
      influencers: [...(currentData.influencers || []), newInfluencer]
    };
    const newTrackers = {
      ...groupTrackers,
      [currentGroupId]: newData
    };
    setGroupTrackers(newTrackers);
    onUpdateBrief({ ...brief, groupTrackers: newTrackers });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4 space-y-6 min-w-0">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm p-6 lg:p-8">
            <div className="mb-6 border-b border-slate-100 pb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Example List</h1>
                <p className="text-slate-500 mt-1">{brief.campaignName} • {brief.id}</p>
              </div>
            </div>

            {activeGroups.length === 0 ? (
              <div className="text-center py-16 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                <p className="mb-4 text-slate-600">Please select groups to start assigning influencers.</p>
                <Button onClick={() => setSelectGroupModalOpen(true)}>Select Group</Button>
              </div>
            ) : (
              <div className="space-y-8">
                {activeGroups.map(grp => (
                  <TrackerTable 
                    key={grp}
                    groupName={grp}
                    brief={brief}
                    trackerData={groupTrackers[grp] || { influencers: [] }}
                    onUpdateTracker={(newData) => {
                      const newTrackers = { ...groupTrackers, [grp]: newData };
                      setGroupTrackers(newTrackers);
                      onUpdateBrief({ ...brief, groupTrackers: newTrackers });
                    }}
                    onAddClick={handleAddInfluencerClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/4 shrink-0">
          <div className="sticky top-6 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Actions</h3>
              <div className="flex flex-col gap-3">
                {activeGroups.length === 0 ? (
                  <Button className="w-full" onClick={() => setSelectGroupModalOpen(true)}>Select Group</Button>
                ) : (
                  <>
                    {brief.internalStatus !== "Pillar Confirmed" && (
                      <Button className="w-full" onClick={handleConfirmPillar}>Confirm Pillar</Button>
                    )}
                    <Button variant="secondary" className="w-full" onClick={() => setSelectGroupModalOpen(true)}>Edit Groups</Button>
                  </>
                )}
              </div>
            </div>
            <ActivityTimeline logs={brief.activityLog || []} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectGroupModalOpen && (
          <GroupSelectionModal 
            open={selectGroupModalOpen} 
            onClose={() => setSelectGroupModalOpen(false)} 
            onConfirm={handleConfirmGroups} 
            initialSelected={activeGroups}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectModalOpen && (
          <InfluencerSelectModal 
            open={selectModalOpen} 
            onClose={() => setSelectModalOpen(false)} 
            onSelect={handleSelectInfluencer} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Main Container ---
export default function BriefFlow({ showToast, customers = [], briefs = [], setBriefs, listOnly = false, forceOpenBrief = null }) {
  const [currentBrief, setCurrentBrief] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [pendingBriefData, setPendingBriefData] = useState(null);
  const [createdBrief, setCreatedBrief] = useState(null);

  useEffect(() => {
    if (forceOpenBrief) {
      setCurrentBrief({ ...forceOpenBrief, activeTab: "brief" });
    }
  }, [forceOpenBrief]);

  const handleCreateClick = (data, status) => {
    const briefData = { ...data, internalStatus: status || "Assign Planner/Buyer" };
    if (status === "Draft") {
      executeCreate(briefData);
    } else {
      setPendingBriefData(briefData);
      setConfirmSubmitOpen(true);
    }
  };

  const executeCreate = (data) => {
    const isDraft = data.internalStatus === "Draft";
    const newBrief = {
      id: `BRF-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString().split('T')[0],
      version: 1,
      activityLog: [{
        date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        action: isDraft ? "Brief Saved" : "Brief Submitted",
        details: isDraft ? "Saved as Draft." : "Brief created and submitted to Traffic."
      }],
      ...data,
    };
    if (setBriefs) {
      setBriefs([newBrief, ...briefs]);
    }
    setCreatedBrief(newBrief);
    setCreateModalOpen(false);

    if (isDraft) {
      if (showToast) showToast("Draft saved successfully!");
    } else {
      setSuccessModalOpen(true);
    }
  };

  const handleConfirmCreate = () => {
    executeCreate(pendingBriefData);
    setConfirmSubmitOpen(false);
  };

  const handleUpdateBrief = (updatedBrief) => {
    if (setBriefs) {
      setBriefs(briefs.map(b => b.id === updatedBrief.id ? updatedBrief : b));
    }
    setCurrentBrief(updatedBrief);
    if (showToast) showToast("Brief updated successfully!");
  };

  return (
    <>
      <BriefFormModal 
        open={createModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        onSubmit={handleCreateClick}
        customers={customers}
      />

      <AnimatePresence>
        {confirmSubmitOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">Confirm Submission</h3>
              <p className="mb-6 text-sm text-slate-500">
                Are you sure you want to create this Brief? You can edit details later if needed.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmSubmitOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCreate}
                  className="rounded-lg bg-[#6D5DF6] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#5a4add]"
                >
                  Yes, Create Brief
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl flex flex-col items-center"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">Brief Created Successfully!</h3>
              <p className="mb-6 text-slate-500">
                Your brief has been saved as <span className="font-semibold text-slate-700">{createdBrief?.id}</span>.
              </p>
              <button
                onClick={() => {
                  setSuccessModalOpen(false);
                  setCurrentBrief({ ...createdBrief, activeTab: "assign" });
                }}
                className="w-full rounded-xl bg-[#6D5DF6] py-3 text-sm font-bold text-white transition hover:bg-[#5a4add]"
              >
                Proceed to Assign Role
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {!currentBrief || listOnly ? (
        <BriefListingPage 
          briefs={briefs} 
          onView={(b) => listOnly ? null : setCurrentBrief({ ...b, activeTab: "brief" })} 
          onCreate={() => setCreateModalOpen(true)}
          listOnly={listOnly}
        />
      ) : (
        <div className="w-full">
          <BriefStepProgress 
            activeTab={currentBrief.activeTab || "brief"} 
            onTabChange={(tab) => handleUpdateBrief({ ...currentBrief, activeTab: tab })} 
            onBack={() => setCurrentBrief(null)}
            status={currentBrief.internalStatus}
            brief={currentBrief}
          />
          {currentBrief.activeTab === "assign" ? (
            <AssignRolePage
              brief={currentBrief}
              onUpdateBrief={handleUpdateBrief}
              onNext={() => {
                const hasStandard = Array.isArray(currentBrief.packageType) 
                  ? currentBrief.packageType.some(p => p.toLowerCase().includes("standard"))
                  : (typeof currentBrief.packageType === "string" && currentBrief.packageType.toLowerCase().includes("standard"));
                handleUpdateBrief({ ...currentBrief, activeTab: hasStandard ? "dealsheet" : "exampleList" });
              }}
            />
          ) : currentBrief.activeTab === "exampleList" || currentBrief.viewingTracker ? (
            <PlannerTrackerPage
              brief={currentBrief}
              onBack={() => setCurrentBrief(null)}
              onUpdateBrief={handleUpdateBrief}
            />
          ) : currentBrief.activeTab === "dealsheet" ? (
            <DealsheetPage brief={currentBrief} onUpdateBrief={handleUpdateBrief} showToast={showToast} onBack={() => setCurrentBrief(null)} />
          ) : (
            <BriefDetailPage 
              brief={currentBrief} 
              onBack={() => setCurrentBrief(null)} 
              onUpdateBrief={handleUpdateBrief}
            />
          )}
        </div>
      )}
    </>
  );
}
