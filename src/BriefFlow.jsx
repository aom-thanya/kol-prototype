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
  ArrowUpDown,
  Check,
  ArrowLeft,
  Download
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
const briefsSeed = [
  {
    id: "NRP202501020",
    internalStatus: "Submitted to Buyer",
    version: 1,
    activityLog: [{
      date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action: "Sales submitted Brief V1",
      details: "Initial submission to buyer."
    }],
    campaignName: "XXX",
    brand: "XXX",
    product: "เป็น Skincare ใหม่ ภายใต้แบรนด์ XXX ค่ะ โดยจะ launch สินค้าในช่วง April 2025 ค่ะ มีสินค้าทั้งหมด 5 SKU : Cleanser / ครีมกันแดด / serum ผลัดเซลล์ผิว / serum booster เพิ่มความกระจ่างใส / Moisturizer สินค้าราคาขายเริ่มที่ 390++",
    clientStatus: "New",
    customerType: "Non Key Account",
    salesOwner: "พี่ bankie",
    packageType: "Rate Card (2 D)",
    objective: ["Awareness (Reach)", "Interest (Engagement)"],
    objectiveNote: "เป้าหมายหลัก ต้องการให้เกิดยอดขาย เป้าหมายรอง brand awareness",
    gender: ["Female"],
    country: "Thailand",
    province: "Bangkok",
    ageRange: "25 ++ ขึ้นไป",
    lifestyle: "General, Lifestyle",
    persona: "วัยทำงาน / นักศึกษาที่มีกำลังทรัพย์",
    occupation: "พนักงานบริษัท รองลงมา นักศึกษา",
    campaignStartDate: "2025-04-01",
    campaignEndDate: "2025-04-30",
    platform: ["Instagram", "Tiktok", "Facebook"],
    otherPlatform: "",
    
    // Budget
    standardBudget: "300,000",
    includeVAT: "Excl. VAT",
    boostPostBudget: "รวมในแพคเกจ",
    addAdsBudget: "",
    pickUpFee: "",
    buyingValue: "",
    
    // SOW
    scopeOfWorks: [
      {
        id: "1",
        contentType: "VDO content (Short Clip)",
        followerReq: "5K or above (10 คน), 10K or above (5 คน)",
        numInfluencers: "15",
        platforms: ["Tiktok"],
        name: "Tiktok Review",
        details: "ครีเอทคอนเท้น ในรูปแบบ Video Short Clip รีวิว สินค้าคนละ 1 SKU (สินค้ามี 5 SKU ลูกค้าต้องการแบ่งรีวิว) ให้เข้ากับไลฟ์สไตล์ของอินฟู และอยากให้อินฟลูเล่าถึงผลลัพธ์หลังการใช้งาน และชูจุดเด่นของสินค้า เช่น ส่วนผสมหลัก + ติดตะกร้า + Affiliate"
      },
      {
        id: "2",
        contentType: "VDO content (Short Clip)",
        followerReq: "5K or above (7 คน), 10K or above (3 คน)",
        numInfluencers: "10",
        platforms: ["Instagram"],
        name: "IG Reel Review",
        details: "ครีเอทคอนเท้น ในรูปแบบ Video Short Clip รีวิว สินค้าคนละ 1 SKU (สินค้ามี 5 SKU ลูกค้าต้องการแบ่งรีวิว) ให้เข้ากับไลฟ์สไตล์ของอินฟู และอยากให้อินฟลูเล่าถึงผลลัพธ์หลังการใช้งาน และชูจุดเด่นของสินค้า เช่น ส่วนผสมหลัก + Affiliate"
      },
      {
        id: "3",
        contentType: "Photo Album",
        followerReq: "5K or above (5 คน)",
        numInfluencers: "5",
        platforms: ["Facebook"],
        name: "Facebook Album Review",
        details: "ครีเอทคอนเท้น ในรูปแบบ Photo Album รีวิว สินค้าคนละ 1 SKU (สินค้ามี 5 SKU ลูกค้าต้องการแบ่งรีวิว) ให้เข้ากับไลฟ์สไตล์ของอินฟู และอยากให้อินฟลูเล่าถึงผลลัพธ์หลังการใช้งาน และชูจุดเด่นของสินค้า เช่น ส่วนผสมหลัก + Affiliate"
      }
    ],

    // Service Scope
    buyoutRequired: true,
    buyoutDuration: ["6 เดือน", "12 เดือน", "ถาวร"],
    boostRequired: true,
    boostDuration: ["30 days"],
    addAdsRequired: false,
    addAdsDuration: [],
    paidPartnershipRequired: false,
    paidPartnershipDuration: [],
    genCodeRequired: true,
    genCodeDuration: ["30 days"],
    tiktokShopRequired: false,
    tiktokShopDuration: [],
    crossPostingRequired: false,
    crossPostingDuration: [],

    // Brand Support & Condition
    brandSupport: ["Sponsor สินค้า"],
    influencerBuyValue: "",
    influencerPickupLocation: "",
    condition: `แบรนด์ สามารถเลือก Influencer ได้ 1 ครั้ง
แบรนด์ เป็นผู้ตรวจ Draft Content  โดยสามารถตรวจได้ 2 ครั้ง
แบรนด์ ต้อง Sponsor Product
Buddy Review เป็นผู้ประสานงานกับ Influencer
รบกวนเช็ค รายละเอียด Condition ของ KOL รวมถึงราคา Boost Post / Boost fee
แปะ Link ของ Platform ที่นำเสนอทุกช่องทาง`,
    
    createdAt: "2025-01-09",
  },
  {
    id: "NRP202501021",
    internalStatus: "Draft",
    version: 1,
    campaignName: "Launch Food Festival",
    brand: "TasteBite",
    product: "ขนมขบเคี้ยวรสใหม่",
    clientStatus: "New",
    customerType: "Key Account",
    salesOwner: "พี่ bankie",
    packageType: ["Custom (1 D)"],
    objective: ["Awareness (Reach)"],
    objectiveNote: "เน้นสร้าง awareness ให้คนรู้จักรสชาติใหม่",
    gender: ["Male", "Female"],
    country: "Thailand",
    province: "Bangkok",
    ageRange: "18 - 35 ปี",
    lifestyle: "Foodie, Cafe Hopper",
    persona: "วัยรุ่นชอบลองของใหม่",
    occupation: "นักศึกษา, พนักงานบริษัท",
    campaignStartDate: "2025-05-01",
    campaignEndDate: "2025-05-15",
    platform: ["Tiktok", "Facebook"],
    otherPlatform: "",
    
    // Budget
    budgetSpending: "150,000",
    budgetBoostSpending: "50,000",
    vat: "Incl. VAT",
    budgetCondition: "Net",
    estimatedBrandSpending: "200,000",
    budgetPerInfluencer: "10,000",
    expectedNumInfluencers: "10",
    expectedReach: "1M",
    
    // SOW
    scopeOfWorks: [
      {
        id: "1",
        contentType: "VDO content (Short Clip)",
        followerReq: "100K or above",
        numInfluencers: "5",
        platforms: ["Tiktok"],
        name: "Tiktok Challenge",
        details: "ทำคลิปสั้นเต้นประกอบเพลง พร้อมกินขนมโชว์"
      }
    ],

    // Service Scope
    buyoutRequired: false,
    buyoutDuration: [],
    boostRequired: true,
    boostDuration: ["15 days"],
    addAdsRequired: false,
    addAdsDuration: [],
    paidPartnershipRequired: false,
    paidPartnershipDuration: [],
    genCodeRequired: false,
    genCodeDuration: [],
    tiktokShopRequired: true,
    tiktokShopDuration: ["30 days"],
    crossPostingRequired: false,
    crossPostingDuration: [],

    // Brand Support & Condition
    brandSupport: ["Sponsor สินค้า"],
    influencerBuyValue: "",
    influencerPickupLocation: "จัดส่งให้ถึงบ้าน",
    condition: `ต้องแปะตะกร้า Tiktok Shop
แบรนด์ตรวจคลิปได้ 1 ครั้ง`,
    
    createdAt: "2025-01-10",
  }
];

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
function BriefFormModal({ open, onClose, onSubmit, initialData = null, initialStep = 1 }) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  useEffect(() => { if (open) setCurrentStep(initialStep); }, [open, initialStep]);
  const totalSteps = 5;

  // Step 1: Client & Project Details
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [clientStatus, setClientStatus] = useState(initialData?.clientStatus || "New");
  const [customerType, setCustomerType] = useState(initialData?.customerType || "Key Account");
  const [salesOwner, setSalesOwner] = useState(initialData?.salesOwner || "planner.beauty@buddyreview.co");
  
  const [campaignName, setCampaignName] = useState(initialData?.campaignName || "");
  const [packageType, setPackageType] = useState(initialData?.packageType ? (Array.isArray(initialData.packageType) ? initialData.packageType : [initialData.packageType]) : []);
  const [packageTypeOther, setPackageTypeOther] = useState(initialData?.packageTypeOther || "");
  const [product, setProduct] = useState(initialData?.product || "");
  
  const [objective, setObjective] = useState(initialData?.objective || []);
  const [objectiveNote, setObjectiveNote] = useState(initialData?.objectiveNote || "");
  
  const [gender, setGender] = useState(initialData?.gender || []);
  const [ageRange, setAgeRange] = useState(initialData?.ageRange || []);
  const [lifestyle, setLifestyle] = useState(initialData?.lifestyle || "");
  const [persona, setPersona] = useState(initialData?.persona || "");
  const [occupation, setOccupation] = useState(initialData?.occupation || "");
  const [country, setCountry] = useState(initialData?.country || "");
  const [province, setProvince] = useState(initialData?.province || "");
  
  const [campaignStartDate, setCampaignStartDate] = useState(initialData?.campaignStartDate || "");
  const [campaignEndDate, setCampaignEndDate] = useState(initialData?.campaignEndDate || "");
  
  const [platform, setPlatform] = useState(initialData?.platform || []);
  const [platformOther, setPlatformOther] = useState("");
  
  const [previousCampaign, setPreviousCampaign] = useState(initialData?.previousCampaign || "");
  const [competitor, setCompetitor] = useState(initialData?.competitor || "");
  const [additionalInfo, setAdditionalInfo] = useState(initialData?.additionalInfo || "");

  // Step 2: Budget
  const [budgetSpending, setBudgetSpending] = useState(initialData?.budgetSpending || "");
  const [budgetBoostSpending, setBudgetBoostSpending] = useState(initialData?.budgetBoostSpending || "");
  const [vat, setVat] = useState(initialData?.vat || "Incl. VAT");
  const [budgetCondition, setBudgetCondition] = useState(initialData?.budgetCondition || "");
  const [estimatedBrandSpending, setEstimatedBrandSpending] = useState(initialData?.estimatedBrandSpending || "");
  const [budgetPerInfluencer, setBudgetPerInfluencer] = useState(initialData?.budgetPerInfluencer || "");
  const [expectedNumInfluencers, setExpectedNumInfluencers] = useState(initialData?.expectedNumInfluencers || "");
  const [expectedReach, setExpectedReach] = useState(initialData?.expectedReach || "");

  // Step 3: SOW
  const [scopeOfWorks, setScopeOfWorks] = useState(initialData?.scopeOfWorks || [{ id: Date.now(), name: "", details: "", contentType: "", platforms: [], followerReq: "", numInfluencers: "" }]);
  const handleAddScope = () => setScopeOfWorks(prev => [...prev, { id: Date.now(), name: "", details: "", contentType: "", platforms: [], followerReq: "", numInfluencers: "" }]);
  const handleRemoveScope = (id) => setScopeOfWorks(prev => prev.filter(s => s.id !== id));
  const handleUpdateScope = (id, field, value) => setScopeOfWorks(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

  // Step 4: Service Scope
  const [buyoutRequired, setBuyoutRequired] = useState(initialData?.buyoutRequired || false);
  const [buyoutDuration, setBuyoutDuration] = useState(initialData?.buyoutDuration || []);
  const [boostRequired, setBoostRequired] = useState(initialData?.boostRequired || false);
  const [boostDuration, setBoostDuration] = useState(initialData?.boostDuration || []);
  const [addAdsRequired, setAddAdsRequired] = useState(initialData?.addAdsRequired || false);
  const [addAdsDuration, setAddAdsDuration] = useState(initialData?.addAdsDuration || []);
  const [paidPartnershipRequired, setPaidPartnershipRequired] = useState(initialData?.paidPartnershipRequired || false);
  const [paidPartnershipDuration, setPaidPartnershipDuration] = useState(initialData?.paidPartnershipDuration || []);
  const [genCodeRequired, setGenCodeRequired] = useState(initialData?.genCodeRequired || false);
  const [genCodeDuration, setGenCodeDuration] = useState(initialData?.genCodeDuration || []);
  const [tiktokShopRequired, setTiktokShopRequired] = useState(initialData?.tiktokShopRequired || false);
  const [tiktokShopDuration, setTiktokShopDuration] = useState(initialData?.tiktokShopDuration || []);
  const [crossPostingRequired, setCrossPostingRequired] = useState(initialData?.crossPostingRequired || false);
  const [crossPostingDuration, setCrossPostingDuration] = useState(initialData?.crossPostingDuration || []);

  // Step 5: Brand Support & Condition
  const [brandSupport, setBrandSupport] = useState(initialData?.brandSupport || []);
  const [influencerBuyValue, setInfluencerBuyValue] = useState(initialData?.influencerBuyValue || "");
  const [influencerPickupLocation, setInfluencerPickupLocation] = useState(initialData?.influencerPickupLocation || "");
  
  const defaultCondition = `แบรนด์ สามารถเลือก Influencer ได้ ... ครั้ง
แบรนด์ เป็นผู้ตรวจ Draft Content โดยสามารถตรวจได้ ... ครั้ง
แบรนด์ ต้อง Sponsor Product
Buddy Review เป็นผู้ประสานงานกับ Influencer
รบกวนเช็ค รายละเอียด Condition ของ KOL รวมถึงราคา Boost Post / Boost fee
แปะ Link ของ Platform ที่นำเสนอทุกช่องทาง`;
  const [condition, setCondition] = useState(initialData?.condition || defaultCondition);

  const handleSubmit = () => {
    onSubmit({
      // Step 1
      brand, clientStatus, customerType, salesOwner, 
      campaignName, packageType, packageTypeOther, product, objective, objectiveNote, 
      gender, country, province, ageRange, lifestyle, persona, occupation, 
      campaignStartDate, campaignEndDate, platform, platformOther,
      previousCampaign, competitor, additionalInfo,
      // Step 2
      budgetSpending, budgetBoostSpending, vat, budgetCondition, estimatedBrandSpending, budgetPerInfluencer, expectedNumInfluencers, expectedReach,
      // Step 3
      scopeOfWorks,
      // Step 4
      buyoutRequired, buyoutDuration, boostRequired, boostDuration, addAdsRequired, addAdsDuration, 
      paidPartnershipRequired, paidPartnershipDuration, genCodeRequired, genCodeDuration, 
      tiktokShopRequired, tiktokShopDuration, crossPostingRequired, crossPostingDuration,
      // Step 5
      brandSupport, influencerBuyValue, influencerPickupLocation, condition
    });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (!open) return null;

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
                    <label className="mb-1 block text-sm font-medium text-slate-700">Brand / Company Name *</label>
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
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Sales Owner *</label>
                    <input type="text" value={salesOwner} onChange={e => setSalesOwner(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
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
                          {["Awareness (Reach)", "Trust (Post)", "Drive Sale"].map(obj => (
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
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Age</label>
                            <div className="flex flex-wrap items-center gap-3">
                              {["13-17", "18-24", "25-34", "35-44", "45-64"].map(a => (
                                <label key={a} className="flex items-center gap-1.5 cursor-pointer">
                                  <input type="checkbox" checked={ageRange.includes(a)} onChange={e => {
                                    if (e.target.checked) setAgeRange([...ageRange, a]);
                                    else setAgeRange(ageRange.filter(i => i !== a));
                                  }} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6] focus:ring-[#6D5DF6]" />
                                  <span className="text-sm text-slate-700">{a}</span>
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
                            "Instagram", "Tiktok", "Facebook", "Facebook Page",
                            "Twitter/X", "Youtube", "Buddy Boost", "Lemon8"
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
              <section>
                <h3 className="mb-4 text-base font-semibold text-[#6D5DF6] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs">2</span> 
                  Budget
                </h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Budget Spending</label>
                    <input type="text" value={budgetSpending} onChange={e => setBudgetSpending(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Budget Boost Spending</label>
                    <input type="text" value={budgetBoostSpending} onChange={e => setBudgetBoostSpending(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">VAT</label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="vat" value="Incl. VAT" checked={vat === "Incl. VAT"} onChange={e => setVat(e.target.value)} className="h-4 w-4 text-[#6D5DF6]" />
                        <span className="text-sm text-slate-700">Incl. VAT</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="vat" value="Excl. VAT" checked={vat === "Excl. VAT"} onChange={e => setVat(e.target.value)} className="h-4 w-4 text-[#6D5DF6]" />
                        <span className="text-sm text-slate-700">Excl. VAT</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Condition</label>
                    <input type="text" value={budgetCondition} onChange={e => setBudgetCondition(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Estimated Brand Spending</label>
                    <input type="text" value={estimatedBrandSpending} onChange={e => setEstimatedBrandSpending(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Budget per Influencer (If any)</label>
                    <input type="text" value={budgetPerInfluencer} onChange={e => setBudgetPerInfluencer(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Expected Number of Influencers (If any)</label>
                    <input type="number" value={expectedNumInfluencers} onChange={e => setExpectedNumInfluencers(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Expected Reach</label>
                    <input type="text" value={expectedReach} onChange={e => setExpectedReach(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                  </div>
                </div>
              </section>
              )}

              {/* Section 3 */}
              {currentStep === 3 && (
              <section>
                <h3 className="mb-4 text-base font-semibold text-[#6D5DF6] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs">3</span> 
                  Scope of Work (SOW)
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700">Scope of Work Items</label>
                    <Button variant="ghost" onClick={handleAddScope} className="h-8 px-2 text-xs">
                      <Plus className="h-4 w-4" /> Add Scope
                    </Button>
                  </div>
                  {scopeOfWorks.map((scope, index) => (
                    <div key={scope.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 relative mb-4">
                      {scopeOfWorks.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveScope(scope.id)}
                          className="absolute top-3 right-3 text-slate-400 hover:text-rose-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      <h4 className="mb-4 text-sm font-semibold text-slate-900">Scope {index + 1}</h4>
                      <div className="grid gap-4 md:grid-cols-2 mb-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Content Type</label>
                          <input 
                            type="text" 
                            value={scope.contentType} 
                            onChange={e => handleUpdateScope(scope.id, 'contentType', e.target.value)} 
                            placeholder="e.g. Photo, Video 1 min"
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Follower Requirement</label>
                          <input 
                            type="text" 
                            value={scope.followerReq} 
                            onChange={e => handleUpdateScope(scope.id, 'followerReq', e.target.value)} 
                            placeholder="e.g. 5K or above"
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Number of Influencers</label>
                          <input 
                            type="number" 
                            value={scope.numInfluencers} 
                            onChange={e => handleUpdateScope(scope.id, 'numInfluencers', e.target.value)} 
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-2 block text-sm font-medium text-slate-700">Platform</label>
                          <div className="grid grid-cols-2 gap-3 mb-2">
                            {[
                              "Instagram", "Tiktok", "Facebook", "Facebook Page",
                              "Twitter/X", "Youtube", "Buddy Boost", "Lemon8", "Others"
                            ].map(plat => (
                              <label key={plat} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={scope.platforms.includes(plat)} onChange={e => {
                                  let newPlats = [...scope.platforms];
                                  if (e.target.checked) newPlats.push(plat);
                                  else newPlats = newPlats.filter(p => p !== plat);
                                  handleUpdateScope(scope.id, 'platforms', newPlats);
                                }} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6] focus:ring-[#6D5DF6]" />
                                <span className="text-sm text-slate-700">{plat}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-medium text-slate-700">Scope Name / Description</label>
                          <input 
                            type="text" 
                            value={scope.name} 
                            onChange={e => handleUpdateScope(scope.id, 'name', e.target.value)} 
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6] mb-3" 
                          />
                          <label className="mb-1 block text-sm font-medium text-slate-700">Details</label>
                          <SimpleHtmlEditor 
                            value={scope.details} 
                            onChange={val => handleUpdateScope(scope.id, 'details', val)} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              )}

              {/* Section 4 */}
              {currentStep === 4 && (
              <section>
                <h3 className="mb-4 text-base font-semibold text-[#6D5DF6] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs">4</span> 
                  Service Scope
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={buyoutRequired} onChange={e => setBuyoutRequired(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                      <span className="text-sm font-medium text-slate-700">Buyout</span>
                    </label>
                    {buyoutRequired && (
                      <div className="pl-7 mt-2">
                        <MultiSelect value={buyoutDuration} onChange={setBuyoutDuration} options={["7 days", "30 days", "60 days", "90 days", "1 month", "3 months", "6 months", "1 year", "Permanent"]} placeholder="Duration" />
                      </div>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer pt-2">
                      <input type="checkbox" checked={boostRequired} onChange={e => setBoostRequired(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                      <span className="text-sm font-medium text-slate-700">Boost Post</span>
                    </label>
                    {boostRequired && (
                      <div className="pl-7 mt-2">
                        <MultiSelect value={boostDuration} onChange={setBoostDuration} options={["1 week", "2 weeks", "1 month", "3 months"]} placeholder="Duration" />
                      </div>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer pt-2">
                      <input type="checkbox" checked={addAdsRequired} onChange={e => setAddAdsRequired(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                      <span className="text-sm font-medium text-slate-700">Add Ads</span>
                    </label>
                    {addAdsRequired && (
                      <div className="pl-7 mt-2">
                        <MultiSelect value={addAdsDuration} onChange={setAddAdsDuration} options={["1 week", "1 month", "3 months"]} placeholder="Duration" />
                      </div>
                    )}
                    
                    <label className="flex items-center gap-3 cursor-pointer pt-2">
                      <input type="checkbox" checked={paidPartnershipRequired} onChange={e => setPaidPartnershipRequired(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                      <span className="text-sm font-medium text-slate-700">Paid Partnership</span>
                    </label>
                    {paidPartnershipRequired && (
                      <div className="pl-7 mt-2">
                        <MultiSelect value={paidPartnershipDuration} onChange={setPaidPartnershipDuration} options={["1 week", "1 month", "3 months"]} placeholder="Duration" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={genCodeRequired} onChange={e => setGenCodeRequired(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                      <span className="text-sm font-medium text-slate-700">Gen Code</span>
                    </label>
                    {genCodeRequired && (
                      <div className="pl-7 mt-2">
                        <MultiSelect value={genCodeDuration} onChange={setGenCodeDuration} options={["1 month", "3 months", "6 months"]} placeholder="Duration" />
                      </div>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer pt-2">
                      <input type="checkbox" checked={tiktokShopRequired} onChange={e => setTiktokShopRequired(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                      <span className="text-sm font-medium text-slate-700">TikTok Shop</span>
                    </label>
                    {tiktokShopRequired && (
                      <div className="pl-7 mt-2">
                        <MultiSelect value={tiktokShopDuration} onChange={setTiktokShopDuration} options={["1 month", "3 months", "6 months"]} placeholder="Duration" />
                      </div>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer pt-2">
                      <input type="checkbox" checked={crossPostingRequired} onChange={e => setCrossPostingRequired(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                      <span className="text-sm font-medium text-slate-700">Cross Posting</span>
                    </label>
                    {crossPostingRequired && (
                      <div className="pl-7 mt-2">
                        <MultiSelect value={crossPostingDuration} onChange={setCrossPostingDuration} options={["1 month", "3 months", "Permanent"]} placeholder="Duration" />
                      </div>
                    )}
                  </div>
                </div>
              </section>
              )}

              {/* Section 5 */}
              {currentStep === 5 && (
              <section>
                <h3 className="mb-4 text-base font-semibold text-[#6D5DF6] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs">5</span> 
                  Brand Support & Condition
                </h3>
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-700">Brand Support</label>
                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        "Sponsor สินค้า",
                        "No sponsor",
                        "On Site",
                        "Buddy Review ไปซื้อสินค้าเอง",
                        "Influencer ไปออก event",
                        "มีทีมงาน Buddy Review ไปดูแลที่สถานที่"
                      ].map(support => (
                        <label key={support} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={brandSupport.includes(support)} onChange={e => {
                            if (e.target.checked) setBrandSupport([...brandSupport, support]);
                            else setBrandSupport(brandSupport.filter(s => s !== support));
                          }} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                          <span className="text-sm text-slate-700">{support}</span>
                        </label>
                      ))}
                      
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-3 cursor-pointer whitespace-nowrap">
                          <input type="checkbox" checked={brandSupport.includes("Influencer ไปซื้อสินค้าเอง")} onChange={e => {
                            if (e.target.checked) setBrandSupport([...brandSupport, "Influencer ไปซื้อสินค้าเอง"]);
                            else setBrandSupport(brandSupport.filter(s => s !== "Influencer ไปซื้อสินค้าเอง"));
                          }} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                          <span className="text-sm text-slate-700">Influencer ไปซื้อสินค้าเอง ระบุมูลค่า(ต่อชิ้น)</span>
                        </label>
                        {brandSupport.includes("Influencer ไปซื้อสินค้าเอง") && (
                          <div className="flex items-center gap-2 flex-1">
                            <input type="text" value={influencerBuyValue} onChange={e => setInfluencerBuyValue(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-[#6D5DF6]" />
                            <span className="text-sm text-slate-600">บาท</span>
                          </div>
                        )}
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={brandSupport.includes("Influencer เดินทางไป สาขาที่สะดวก")} onChange={e => {
                          if (e.target.checked) setBrandSupport([...brandSupport, "Influencer เดินทางไป สาขาที่สะดวก"]);
                          else setBrandSupport(brandSupport.filter(s => s !== "Influencer เดินทางไป สาขาที่สะดวก"));
                        }} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                        <span className="text-sm text-slate-700">Influencer เดินทางไป สาขาที่สะดวก</span>
                      </label>

                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-3 cursor-pointer whitespace-nowrap">
                          <input type="checkbox" checked={brandSupport.includes("Influencer ต้องเดินทางไปรับของ หรือใช้บริการ ที่")} onChange={e => {
                            if (e.target.checked) setBrandSupport([...brandSupport, "Influencer ต้องเดินทางไปรับของ หรือใช้บริการ ที่"]);
                            else setBrandSupport(brandSupport.filter(s => s !== "Influencer ต้องเดินทางไปรับของ หรือใช้บริการ ที่"));
                          }} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                          <span className="text-sm text-slate-700">Influencer ต้องเดินทางไปรับของ หรือใช้บริการ ที่</span>
                        </label>
                        {brandSupport.includes("Influencer ต้องเดินทางไปรับของ หรือใช้บริการ ที่") && (
                          <input type="text" value={influencerPickupLocation} onChange={e => setInfluencerPickupLocation(e.target.value)} className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-[#6D5DF6]" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <label className="mb-2 block text-sm font-medium text-slate-700">Condition (If any)</label>
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
                    <Button onClick={handleSubmit} disabled={!campaignName || !brand}>Create Brief</Button>
                  )}
                </>
              ) : (
                <Button onClick={handleSubmit}>Save Changes</Button>
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
                {["Brief No", "Campaign Name", "Brand", "Client Status", "Created Date", "Management"].map((head) => (
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
                    <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{b.clientStatus || "New"}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{b.createdAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {!listOnly && (
                        <button
                          onClick={() => onView(b)}
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-[#6D5DF6] transition hover:bg-violet-50 hover:border-violet-200"
                        >
                          <Eye className="h-4 w-4" /> View Details
                        </button>
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

// --- Step Progress Nav ---
function BriefStepProgress({ activeTab, onTabChange, onBack }) {
  const steps = [
    { id: "brief", label: "Brief" },
    { id: "exampleList", label: "Example List" },
    { id: "dealsheet", label: "Dealsheet & Proposal" }
  ];
  const activeIdx = steps.findIndex(s => s.id === activeTab);
  
  return (
    <div className="mb-12">
      <div className="mb-8">
        <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-[#6D5DF6] flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Briefs
        </button>
      </div>
      
      <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto px-4">
        {/* Connecting Line Background */}
        <div className="absolute left-10 right-10 top-5 h-1 bg-slate-200 z-0 rounded-full" />
        
        {/* Connecting Line Progress */}
        <div 
          className="absolute left-10 top-5 h-1 bg-[#6D5DF6] z-0 rounded-full transition-all duration-500 ease-out"
          style={{ width: `calc(${(activeIdx / (steps.length - 1)) * 100}% - 2.5rem)` }}
        />
        
        {steps.map((step, index) => {
          const isActive = index === activeIdx;
          const isPassed = index < activeIdx;
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <button
                onClick={() => onTabChange(step.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-4 border-[#FAFAFA] transition-all duration-300 shadow-sm
                  ${isActive || isPassed ? 'bg-[#6D5DF6] text-white' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'}`}
              >
                {index + 1}
              </button>
              <span className={`absolute top-12 text-sm font-medium whitespace-nowrap transition-colors duration-300
                ${isActive ? 'text-[#6D5DF6]' : isPassed ? 'text-slate-800' : 'text-slate-400'}`}>
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
function DealsheetPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Dealsheet & Proposal</h2>
        <p className="text-slate-500 text-sm">This page is under construction.</p>
      </div>
    </motion.div>
  );
}

// --- Brief Detail Page Component ---
function BriefDetailPage({ brief, onBack, onUpdateBrief }) {
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditStep, setCurrentEditStep] = useState(1);
  
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
      budgetBoostSpending: "งบประมาณ Boost Post", vat: "ภาษี (VAT)", budgetCondition: "เงื่อนไขงบประมาณ",
      estimatedBrandSpending: "ประเมินค่าใช้จ่ายแบรนด์", budgetPerInfluencer: "งบประมาณต่อ Influencer",
      expectedNumInfluencers: "จำนวน Influencer ที่คาดหวัง", expectedReach: "Reach ที่คาดหวัง",
      buyoutRequired: "ต้องการ Buyout", buyoutDuration: "ระยะเวลา Buyout", boostRequired: "ต้องการ Boost",
      boostDuration: "ระยะเวลา Boost", addAdsRequired: "ต้องการ Add Ads", addAdsDuration: "ระยะเวลา Add Ads",
      paidPartnershipRequired: "ต้องการ Paid Partnership", paidPartnershipDuration: "ระยะเวลา Paid Partnership",
      genCodeRequired: "ต้องการ Gen Code", genCodeDuration: "ระยะเวลา Gen Code", tiktokShopRequired: "ต้องการ Tiktok Shop",
      tiktokShopDuration: "ระยะเวลา Tiktok Shop", crossPostingRequired: "ต้องการ Cross Posting",
      crossPostingDuration: "ระยะเวลา Cross Posting", brandSupport: "การสนับสนุนจากแบรนด์",
      influencerBuyValue: "มูลค่าที่ Influencer ซื้อได้", influencerPickupLocation: "สถานที่รับสินค้า",
      condition: "เงื่อนไข (Condition)"
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

  const handleSubmitToBuyer = () => {
    const log = {
      date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action: "Sales submitted Brief V1",
      details: "Initial submission to buyer."
    };
    onUpdateBrief({
      ...brief,
      version: 1,
      internalStatus: "Submitted to Buyer",
      submittedSows: selectedSows,
      viewingTracker: true,
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

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm p-6 lg:p-8">
        <div className="mb-8 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-[#6D5DF6] ring-1 ring-violet-100">
              {brief.id} • {brief.clientStatus || "New"}
            </div>
            {(!brief.internalStatus || brief.internalStatus === "Draft") ? (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">Draft</span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">Submitted to Buyer</span>
            )}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 lg:text-3xl">{brief.campaignName}</h1>
          <p className="text-slate-500 mt-1">{brief.brand} • Created: {brief.createdAt}</p>
        </div>
        
        <div className="grid gap-8">
          
          {/* Section 1 */}
          <div className="rounded-xl bg-slate-50 p-5 border border-slate-100">
            <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2"><h3 className="text-sm font-semibold text-slate-900 text-[#6D5DF6]">1. Client & Project Details</h3><button onClick={() => handleEditSection(1)} className="text-xs font-semibold text-slate-500 hover:text-[#6D5DF6]">Edit</button></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><dt className="text-slate-500 mb-1">Customer Type</dt><dd className="font-medium text-slate-900">{brief.customerType || "-"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Sales Owner</dt><dd className="font-medium text-slate-900">{brief.salesOwner || "-"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Package Type</dt><dd className="font-medium text-slate-900">{brief.packageType || "-"}</dd></div>
              <div className="md:col-span-2"><dt className="text-slate-500 mb-1">Product Details</dt><dd className="font-medium text-slate-800 bg-slate-50 p-3 rounded text-sm mt-1" dangerouslySetInnerHTML={{ __html: brief.product || "-" }}></dd></div>
              <div className="md:col-span-2"><dt className="text-slate-500 mb-1">Objective</dt><dd className="font-medium text-slate-900">{renderList(brief.objective)}</dd></div>
              <div className="md:col-span-2"><dt className="text-slate-500 mb-1">Objective Note</dt><dd className="font-medium text-slate-900">{brief.objectiveNote || "-"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Target Gender</dt><dd className="font-medium text-slate-900">{renderList(brief.gender)}</dd></div>
              <div><dt className="text-slate-500 mb-1">Target Age</dt><dd className="font-medium text-slate-900">{brief.ageRange || "-"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Target Country</dt><dd className="font-medium text-slate-900">{brief.country || "-"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Target Province</dt><dd className="font-medium text-slate-900">{brief.province || "-"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Lifestyle</dt><dd className="font-medium text-slate-900">{brief.lifestyle || "-"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Persona</dt><dd className="font-medium text-slate-900">{brief.persona || "-"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Occupation</dt><dd className="font-medium text-slate-900">{brief.occupation || "-"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Campaign Date</dt><dd className="font-medium text-slate-900">{brief.campaignStartDate ? `${brief.campaignStartDate} to ${brief.campaignEndDate}` : "-"}</dd></div>
              <div className="md:col-span-2"><dt className="text-slate-500 mb-1">Platform</dt><dd className="font-medium text-slate-900">{renderList(brief.platform)} {brief.otherPlatform ? `(${brief.otherPlatform})` : ""}</dd></div>
              <div className="md:col-span-2 pt-2 border-t border-slate-100"><dt className="text-slate-500 mb-1">Previous Campaign / Work Ref</dt><dd className="font-medium text-slate-800 bg-slate-50 p-3 rounded text-sm mt-1" dangerouslySetInnerHTML={{ __html: brief.previousCampaign || "-" }}></dd></div>
              <div className="md:col-span-2 pt-2 border-t border-slate-100"><dt className="text-slate-500 mb-1">Competitor Info</dt><dd className="font-medium text-slate-800 bg-slate-50 p-3 rounded text-sm mt-1" dangerouslySetInnerHTML={{ __html: brief.competitor || "-" }}></dd></div>
              <div className="md:col-span-2 pt-2 border-t border-slate-100"><dt className="text-slate-500 mb-1">Additional Info</dt><dd className="font-medium text-slate-800 bg-slate-50 p-3 rounded text-sm mt-1" dangerouslySetInnerHTML={{ __html: brief.additionalInfo || "-" }}></dd></div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="rounded-xl bg-slate-50 p-5 border border-slate-100">
            <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2"><h3 className="text-sm font-semibold text-slate-900 text-[#6D5DF6]">2. Budget Details</h3><button onClick={() => handleEditSection(2)} className="text-xs font-semibold text-slate-500 hover:text-[#6D5DF6]">Edit</button></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><dt className="text-slate-500 mb-1">Budget Spending (THB)</dt><dd className="font-medium text-slate-900">{brief.budgetSpending || "-"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Budget Boost Spending</dt><dd className="font-medium text-slate-900">{brief.budgetBoostSpending || "-"}</dd></div>
              <div><dt className="text-slate-500 mb-1">VAT</dt><dd className="font-medium text-slate-900">{brief.vat || "-"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Budget Condition</dt><dd className="font-medium text-slate-900">{brief.budgetCondition || "-"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Estimated Brand Spending</dt><dd className="font-medium text-slate-900">{brief.estimatedBrandSpending || "-"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Budget Per Influencer</dt><dd className="font-medium text-slate-900">{brief.budgetPerInfluencer || "-"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Expected No. of Influencers</dt><dd className="font-medium text-slate-900">{brief.expectedNumInfluencers || "-"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Expected Reach/Impression</dt><dd className="font-medium text-slate-900">{brief.expectedReach || "-"}</dd></div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="rounded-xl bg-slate-50 p-5 border border-slate-100">
            <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2"><h3 className="text-sm font-semibold text-slate-900 text-[#6D5DF6]">3. Scope of Work (SOW)</h3><button onClick={() => handleEditSection(3)} className="text-xs font-semibold text-slate-500 hover:text-[#6D5DF6]">Edit</button></div>
            <div className="space-y-4">
              {brief.scopeOfWorks && brief.scopeOfWorks.length > 0 ? (
                brief.scopeOfWorks.map((sow, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 text-sm">
                    <div className="font-semibold text-slate-800 mb-3">Scope {idx + 1}: {sow.name || "Unnamed"}</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div><dt className="text-slate-500 mb-1">Content Type</dt><dd className="font-medium text-slate-900">{sow.contentType || "-"}</dd></div>
                      <div><dt className="text-slate-500 mb-1">Follower Req.</dt><dd className="font-medium text-slate-900">{sow.followerReq || "-"}</dd></div>
                      <div><dt className="text-slate-500 mb-1">Influencer Qty.</dt><dd className="font-medium text-slate-900">{sow.numInfluencers || "-"}</dd></div>
                      <div><dt className="text-slate-500 mb-1">Platforms</dt><dd className="font-medium text-slate-900">{renderList(sow.platforms)}</dd></div>
                    </div>
                    <div><dt className="text-slate-500 mb-1">Details</dt>
                      <dd className="font-medium text-slate-800 bg-slate-50 p-3 rounded text-xs" dangerouslySetInnerHTML={{ __html: sow.details || "-" }} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">No scope of work defined.</div>
              )}
            </div>
          </div>

          {/* Section 4 */}
          <div className="rounded-xl bg-slate-50 p-5 border border-slate-100">
            <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2"><h3 className="text-sm font-semibold text-slate-900 text-[#6D5DF6]">4. Service Scope</h3><button onClick={() => handleEditSection(4)} className="text-xs font-semibold text-slate-500 hover:text-[#6D5DF6]">Edit</button></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><dt className="text-slate-500 mb-1">Buyout</dt><dd className="font-medium text-slate-900">{brief.buyoutRequired ? `Yes (${renderList(brief.buyoutDuration)})` : "No"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Boost Post</dt><dd className="font-medium text-slate-900">{brief.boostRequired ? `Yes (${renderList(brief.boostDuration)})` : "No"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Add Ads</dt><dd className="font-medium text-slate-900">{brief.addAdsRequired ? `Yes (${renderList(brief.addAdsDuration)})` : "No"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Paid Partnership</dt><dd className="font-medium text-slate-900">{brief.paidPartnershipRequired ? `Yes (${renderList(brief.paidPartnershipDuration)})` : "No"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Gen Code</dt><dd className="font-medium text-slate-900">{brief.genCodeRequired ? `Yes (${renderList(brief.genCodeDuration)})` : "No"}</dd></div>
              <div><dt className="text-slate-500 mb-1">TikTok Shop</dt><dd className="font-medium text-slate-900">{brief.tiktokShopRequired ? `Yes (${renderList(brief.tiktokShopDuration)})` : "No"}</dd></div>
              <div><dt className="text-slate-500 mb-1">Cross Posting</dt><dd className="font-medium text-slate-900">{brief.crossPostingRequired ? `Yes (${renderList(brief.crossPostingDuration)})` : "No"}</dd></div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="rounded-xl bg-slate-50 p-5 border border-slate-100">
            <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2"><h3 className="text-sm font-semibold text-slate-900 text-[#6D5DF6]">5. Brand Support & Condition</h3><button onClick={() => handleEditSection(5)} className="text-xs font-semibold text-slate-500 hover:text-[#6D5DF6]">Edit</button></div>
            <div className="space-y-4 text-sm">
              <div><dt className="text-slate-500 mb-1">Brand Support Selected</dt><dd className="font-medium text-slate-900">{renderList(brief.brandSupport)}</dd></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><dt className="text-slate-500 mb-1">Influencer Buy Value</dt><dd className="font-medium text-slate-900">{brief.influencerBuyValue || "-"}</dd></div>
                <div className="md:col-span-2"><dt className="text-slate-500 mb-1">Pickup Location</dt><dd className="font-medium text-slate-900">{brief.influencerPickupLocation || "-"}</dd></div>
              </div>
              <div><dt className="text-slate-500 mb-1">Conditions</dt>
                <dd className="font-medium text-slate-800 bg-white border border-slate-200 p-3 rounded whitespace-pre-wrap mt-1">
                  {brief.condition || "-"}
                </dd>
              </div>
            </div>
          </div>

          </div>

        </div>

      </div>

      {/* Right Column (Actions & Timeline) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Actions</h3>
              <div className="flex flex-col gap-3">
                {(!brief.internalStatus || brief.internalStatus === "Draft") && (
                  <Button className="w-full" onClick={() => setSubmitModalOpen(true)}>Submit to Buyer</Button>
                )}
                <Button variant="secondary" className="w-full"><Copy className="mr-2 h-4 w-4" /> Duplicate</Button>
              </div>
            </div>

            <ActivityTimeline logs={brief.activityLog || []} />
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      <AnimatePresence>
        {submitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Submit to Buyer</h2>
                <p className="text-sm text-slate-500 mb-6">Select the Scope of Work (SOW) you want to include in this submission.</p>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {brief.scopeOfWorks && brief.scopeOfWorks.length > 0 ? (
                    brief.scopeOfWorks.map((sow, idx) => (
                      <label key={idx} className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition ${selectedSows.includes(sow.id) ? 'border-[#6D5DF6] bg-violet-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="mt-1 flex h-4 w-4 items-center justify-center rounded border border-slate-300 bg-white">
                          <input 
                            type="checkbox" 
                            className="h-full w-full opacity-0 cursor-pointer"
                            checked={selectedSows.includes(sow.id)}
                            onChange={() => toggleSowSelection(sow.id)}
                          />
                          {selectedSows.includes(sow.id) && <Check className="absolute h-3 w-3 text-[#6D5DF6]" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-slate-900">Scope {idx + 1}: {sow.name || sow.contentType || "Unnamed SOW"}</div>
                          <div className="text-xs text-slate-500 mt-1">{renderList(sow.platforms)} • {sow.numInfluencers} Influencers</div>
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500 text-center py-4">No Scope of Work available in this brief.</div>
                  )}
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <Button variant="secondary" onClick={() => setSubmitModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleSubmitToBuyer} disabled={!brief.scopeOfWorks || brief.scopeOfWorks.length === 0}>Submit Brief</Button>
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
}

// --- Sub-components for Tracker ---
function TrackerTable({ sow, brief, trackerData, onUpdateTracker, onAddClick }) {
  const influencers = trackerData.influencers || [];

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
  requiredServices.push({ key: "Affiliate", label: "Affiliate" });
  
  const brandSupports = Array.isArray(brief.brandSupport) ? brief.brandSupport : [];
  const hasCompetitor = brief.competitor && brief.competitor.length > 0 && brief.competitor != "<p><br></p>";

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 p-6 lg:px-8 bg-slate-50/50 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{sow.name}</h2>
          <p className="text-sm text-slate-500 mt-1">{sow.details || "No details provided"}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Group:</label>
            <select 
              value={trackerData.group || ""} 
              onChange={e => onUpdateTracker({ ...trackerData, group: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#6D5DF6]"
            >
              <option value="">Select Group</option>
              <option value="Beauty">Beauty</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Food">Food</option>
              <option value="Fashion">Fashion</option>
              <option value="Tech">Tech</option>
              <option value="MC">MC</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <Button onClick={() => onAddClick(sow.id)}><Plus className="h-4 w-4" /> Add Influencer</Button>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
            <thead className="bg-slate-50">
              <tr>
                <th colSpan="2" className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-violet-50 sticky left-0 z-20 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]">Influencer Detail</th>
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
                  <tr key={inf.id} className="group hover:bg-slate-50 transition">
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-500 text-center sticky left-0 z-10 bg-white group-hover:bg-slate-50 w-[50px] min-w-[50px]">{idx + 1}</td>
                    <td className="px-5 py-3 border-r border-slate-100 min-w-[280px] w-[280px] sticky left-[50px] z-10 bg-white group-hover:bg-slate-50 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                      <div className="flex gap-3 text-left w-full">
                        <img src={inf.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(inf.accountName || "New")}&background=random`} alt="" className="h-11 w-11 rounded-full object-cover shrink-0" />
                        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                          <input type="text" value={inf.accountName} onChange={e => updateInf(inf.id, "accountName", e.target.value)} placeholder="Account Name (@handle)" className="w-full font-semibold text-slate-900 hover:text-[#6D5DF6] text-[13px] bg-transparent outline-none placeholder:text-slate-300" />
                          <div className="flex items-center gap-2 w-full">
                             <input type="text" value={inf.follower} onChange={e => updateInf(inf.id, "follower", e.target.value)} placeholder="Followers" className="w-20 text-xs text-slate-500 bg-transparent outline-none border-b border-dashed border-slate-300 placeholder:text-slate-300" />
                             <select value={inf.channel} onChange={e => updateInf(inf.id, "channel", e.target.value)} className="text-[10px] font-medium text-slate-600 bg-slate-100 rounded-md px-1.5 py-0.5 outline-none cursor-pointer">
                               <option value="">Platform</option>
                               <option value="Instagram">IG</option>
                               <option value="TikTok">TT</option>
                               <option value="Facebook">FB</option>
                               <option value="YouTube">YT</option>
                               <option value="X">X</option>
                               <option value="Other">Other</option>
                             </select>
                          </div>
                          <input type="text" value={inf.accountLink} onChange={e => updateInf(inf.id, "accountLink", e.target.value)} placeholder="Link URL" className="w-full text-[10px] text-blue-500 bg-transparent outline-none border-b border-dashed border-slate-300 placeholder:text-slate-300" />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100"><input type="text" value={inf.contact} onChange={e => updateInf(inf.id, "contact", e.target.value)} className="w-32 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6]" placeholder="Email, Line, Tel" /></td>
                    <td className="px-3 py-2 border-r border-slate-100"><input type="text" value={inf.rawCost} onChange={e => updateInf(inf.id, "rawCost", e.target.value)} className="w-24 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6]" /></td>
                    <td className="px-3 py-2 border-r border-slate-100">
                      <input type="text" value={inf.creditTerm} onChange={e => updateInf(inf.id, "creditTerm", e.target.value)} className="w-20 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6]" placeholder="วัน" />
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100">
                      <select value={inf.paymentType || ""} onChange={e => updateInf(inf.id, "paymentType", e.target.value)} className="w-24 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] bg-white">
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
                              <input type="text" value={srvData.price || ""} onChange={e => updateInfServiceField(inf.id, srv.key, "price", e.target.value)} className="w-full rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] text-xs" placeholder="ราคา" />
                            )}
                            <textarea rows={1} value={srvData.note || ""} onChange={e => updateInfServiceField(inf.id, srv.key, "note", e.target.value)} className="w-full rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] resize-y text-[10px]" placeholder="Note..."></textarea>
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 border-r border-slate-100"><textarea rows={3} value={inf.scopeOfWork || ""} onChange={e => updateInf(inf.id, "scopeOfWork", e.target.value)} className="w-full min-w-[180px] rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] resize-y text-xs"></textarea></td>
                    <td className="px-3 py-2 border-r border-slate-100"><textarea rows={6} value={inf.condition || ""} onChange={e => updateInf(inf.id, "condition", e.target.value)} className="w-full min-w-[220px] rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] resize-y text-xs"></textarea></td>
                    {brandSupports.map(bs => (
                      <td key={bs} className="px-3 py-2 border-r border-slate-100"><input type="text" value={inf.brandSupports?.[bs] || ""} onChange={e => updateInfBrandSupport(inf.id, bs, e.target.value)} className="w-24 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6]" /></td>
                    ))}
                    {hasCompetitor && (
                      <td className="px-3 py-2 border-r border-slate-100"><textarea rows={3} value={inf.competitorNote} onChange={e => updateInf(inf.id, "competitorNote", e.target.value)} className="w-full min-w-[150px] rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] resize-y text-xs"></textarea></td>
                    )}
                    <td className="px-3 py-2 border-r border-slate-100"><textarea rows={3} value={inf.detail || ""} onChange={e => updateInf(inf.id, "detail", e.target.value)} className="w-full min-w-[180px] rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] resize-y text-xs"></textarea></td>
                    <td className="px-3 py-2 border-slate-100"><textarea rows={3} value={inf.note} onChange={e => updateInf(inf.id, "note", e.target.value)} className="w-full min-w-[180px] rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] resize-y text-xs"></textarea></td>
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
  const [sowTrackers, setSowTrackers] = useState(brief.sowTrackers || {});
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [currentSowId, setCurrentSowId] = useState(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedSows, setSelectedSows] = useState([]);

  const handleSubmitToBuyer = () => {
    const log = {
      date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action: "Sales submitted Brief V1",
      details: "Initial submission to buyer."
    };
    onUpdateBrief({
      ...brief,
      version: 1,
      internalStatus: "Submitted to Buyer",
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

  const activeSows = brief.internalStatus === "Submitted to Buyer" && brief.submittedSows 
    ? (brief.scopeOfWorks || []).filter(s => brief.submittedSows.includes(s.id))
    : (brief.scopeOfWorks || []);

  const handleAddInfluencerClick = (sowId) => {
    setCurrentSowId(sowId);
    setSelectModalOpen(true);
  };

  const handleSelectInfluencer = (inf) => {
    setSelectModalOpen(false);
    if (!currentSowId) return;

    const currentData = sowTrackers[currentSowId] || { group: "", influencers: [] };
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
    setSowTrackers({
      ...sowTrackers,
      [currentSowId]: newData
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm p-6 lg:p-8">
            <div className="mb-6 border-b border-slate-100 pb-6">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Example List</h1>
              <p className="text-slate-500 mt-1">{brief.campaignName} • {brief.id}</p>
            </div>

            {activeSows.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
                No Scope of Work was submitted to the Buyer.
              </div>
            ) : (
              <div className="space-y-8">
                {activeSows.map(sow => (
                  <TrackerTable 
                    key={sow.id}
                    sow={sow}
                    brief={brief}
                    trackerData={sowTrackers[sow.id] || { group: "", influencers: [] }}
                    onUpdateTracker={(newData) => setSowTrackers({ ...sowTrackers, [sow.id]: newData })}
                    onAddClick={handleAddInfluencerClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <ActivityTimeline logs={brief.activityLog || []} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {submitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="bg-[#6D5DF6] px-6 py-4 text-white flex justify-between items-center">
                <h2 className="text-lg font-semibold">Submit Brief to Buyer</h2>
                <button onClick={() => setSubmitModalOpen(false)} className="text-white/80 hover:text-white"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-6 text-sm text-slate-600">
                <p className="mb-4">Select the Scope of Works you want to include in this submission:</p>
                
                <div className="space-y-2 border border-slate-200 rounded-lg p-1">
                  {brief.scopeOfWorks?.map(sow => (
                    <label key={sow.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-md cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedSows.includes(sow.id)}
                        onChange={() => toggleSowSelection(sow.id)}
                        className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6] focus:ring-[#6D5DF6]"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{sow.platform}</p>
                        <p className="text-xs text-slate-500">Tier: {sow.influencerTier}, Format: {sow.format}</p>
                      </div>
                    </label>
                  ))}
                  {(!brief.scopeOfWorks || brief.scopeOfWorks.length === 0) && (
                    <div className="p-4 text-center text-slate-500">No Scope of Works available to submit.</div>
                  )}
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <Button variant="secondary" onClick={() => setSubmitModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleSubmitToBuyer} disabled={!brief.scopeOfWorks || brief.scopeOfWorks.length === 0}>Submit Brief</Button>
                </div>
              </div>
            </motion.div>
          </div>
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
export default function BriefFlow({ showToast, listOnly = false }) {
  const [briefs, setBriefs] = useState(briefsSeed);
  const [currentBrief, setCurrentBrief] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCreate = (data) => {
    const newBrief = {
      id: `BRF-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString().split('T')[0],
      internalStatus: "Draft",
      version: 1,
      activityLog: [{
        date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        action: "Brief Created",
        details: "Draft initiated by Sales."
      }],
      ...data,
    };
    setBriefs([newBrief, ...briefs]);
    setCreateModalOpen(false);
    if (showToast) showToast("Brief created successfully!");
  };

  const handleUpdateBrief = (updatedBrief) => {
    setBriefs(briefs.map(b => b.id === updatedBrief.id ? updatedBrief : b));
    setCurrentBrief(updatedBrief);
    if (showToast) showToast("Brief updated successfully!");
  };

  return (
    <>
      <BriefFormModal 
        open={createModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        onSubmit={handleCreate} 
      />
      
      {!currentBrief || listOnly ? (
        <BriefListingPage 
          briefs={briefs} 
          onView={(b) => listOnly ? null : setCurrentBrief({ ...b, activeTab: "brief" })} 
          onCreate={() => setCreateModalOpen(true)}
          listOnly={listOnly}
        />
      ) : (
        <div className="w-full max-w-7xl mx-auto">
          <BriefStepProgress 
            activeTab={currentBrief.activeTab || "brief"} 
            onTabChange={(tab) => handleUpdateBrief({ ...currentBrief, activeTab: tab })} 
            onBack={() => setCurrentBrief(null)}
          />
          {currentBrief.activeTab === "exampleList" || currentBrief.viewingTracker ? (
            <PlannerTrackerPage
              brief={currentBrief}
              onBack={() => setCurrentBrief(null)}
              onUpdateBrief={handleUpdateBrief}
            />
          ) : currentBrief.activeTab === "dealsheet" ? (
            <DealsheetPage onBack={() => setCurrentBrief(null)} />
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
