import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, ChevronRight, ChevronLeft,
  X, CheckCircle2, History, Save
} from "lucide-react";

// Initial Seed Data (if localStorage is empty)
const PLATFORMS = ["Instagram", "Facebook", "X/Twitter", "Application", "E-Commerce App", "TikTok", "Lemon8"];

const standardTiers = ["1K - 5K", "5K - 10K", "10K - 50K", "50K - 100K", "100K+"];
const tiktokTiers = [
  "1K-5K (Review)", "1K-5K (Dance)", 
  "5K-10K (Review)", "5K-10K (Dance)", 
  "10K-50K (Review)", "10K-50K (Dance)", 
  "50K-100K (Review)", "50K-100K (Dance)", 
  "100K+ (Review)", "100K+ (Dance)"
];

const igFbCategories = [
  {
    category: "Social Cost",
    items: [
      { id: "sc1", topic: "IG/Twitter", rates: ["100", "200", "450", "2,000", "3,000"] },
      { id: "sc2", topic: "Facebook", rates: ["50", "100", "150", "400", "RateCard"] }
    ]
  },
  {
    category: "Special Cost",
    items: [
      { id: "spc1", topic: "premium ดูดี ดูแพง (Multi photo)", rates: ["500", "500", "700", "1,500", "-"] },
      { id: "spc2", topic: "อายุ 30+ (Multi photo)", rates: ["500", "500", "1,000", "1,000", "-"] },
      { id: "spc3", topic: "แม่และเด็ก (ลูกอ่อน)", rates: ["1,600", "1,600", "2,400", "Rate Card", "Rate Card"] },
      { id: "spc4", topic: "Healthy", rates: ["500", "1,000", "1,200", "-", "-"] },
      { id: "spc5", topic: "Before-after ผลิตภัณฑ์เดียว", rates: ["300", "300", "500", "700", "1,000"] },
      { id: "spc6", topic: "นำรูปไปใช้ต่อ 3 เดือน", rates: ["300", "500", "500", "500", "-"] },
      { id: "spc7", topic: "cover dance", rates: ["500", "500", "500", "-", "-"] },
      { id: "spc8", topic: "gamer (FB)", rates: ["-", "1,000", "-", "-", "-"] },
      { id: "spc9", topic: "คนท้องถิ่น ผญ", rates: ["500", "500", "700", "-", "-"] },
      { id: "spc10", topic: "สาย Y นิยาย (Twitter)", rates: ["300", "500", "1,000", "-", "-"] },
      { id: "spc11", topic: "2SKU Photo", rates: ["300", "-", "500", "-", "-"] },
      { id: "spc12", topic: "2SKU VDO", rates: ["500", "-", "700", "-", "-"] },
      { id: "spc13", topic: "คนท้องถิ่นผู้ชาย", rates: ["500", "500", "700", "1,000", "-"] },
      { id: "spc14", topic: "Foodie", rates: ["500", "1,000", "1,700", "3,000", "-"] },
      { id: "spc15", topic: "แฟนคลับ (X Twitter)", rates: ["200", "500", "700", "-", "-"] }
    ]
  },
  {
    category: "Support Cost",
    items: [
      { id: "sup1", topic: "Photos", rates: ["400", "650", "900", "1,200", "1,500"] },
      { id: "sup2", topic: "VDO", rates: ["900", "1,200", "1,500", "2,000", "3,000"] },
      { id: "sup3", topic: "Only story", rates: ["300", "500", "700", "1,000", "1,500"] },
      { id: "sup4", topic: "Artwork", rates: ["300", "500", "700", "1,000", "1,500"] },
      { id: "sup5", topic: "Share post", rates: ["100", "200", "300", "500", "1,000"] },
      { id: "sup6", topic: "Trend / Seeding comment", rates: ["50", "100", "150", "200", "300"] },
      { id: "sup7", topic: "Trend / Seeding comment + photo", rates: ["100", "200", "300", "400", "500"] },
      { id: "sup8", topic: "Seeding Download App/ Rating App /Comment", rates: ["200\n*Not Commit Follower*", "-", "-", "-", "-"] },
      { id: "sup9", topic: "Seeding Photo E-COMMERCE APP", rates: ["300\n*Not Commit Follower*", "-", "-", "-", "-"] },
      { id: "sup10", topic: "Content Blog / Group ตั้งโพสต์", rates: ["1,000", "1,500", "2,000", "RateCard", "RateCard"] }
    ]
  },
  {
    category: "Via Cost",
    items: [
      { id: "via1", topic: "Story", rates: ["200", "200", "300", "500", "1,000"] },
      { id: "via2", topic: "Via", rates: ["200", "200", "200", "300", "1,000"] }
    ]
  },
  {
    category: "Other Cost",
    items: [
      { id: "oc1", topic: "Gencode/Add Ads (% จากค่าตัว)", rates: ["50%", "50%", "30%", "25%", "20%"] },
      { id: "oc2", topic: "Buy Out (30 days) (% จากค่าตัว)", rates: ["50%", "50%", "50%", "50%", "30%"] },
      { id: "oc3", topic: "SKU ชิ้นต่อไป", rates: ["500", "-", "700", "-", "Rate Card"] },
      { id: "oc4", topic: "ค่า OT OP", rates: ["ครึ่งวัน\nอิงตาม จำนวนอินฟูล\n1-15 คน : กัน OT 1,500 บาท\n15-30 คน : กัน OT 3,000 บาท\n\nเต็มวัน\nจำนวนอินฟูล\n1-15 คน : กัน OT 2,500 บาท\n15-30 คน : กัน OT 5,000 บาท\n\nNote: กรณีเป็น งาน Shopping List Rate Card ที่มีการออกนอกสถานที่ หรือ ต้องมีค่า OT ให้ OP ให้ใส่ค่า OT ในช่อง other cost (โดยระบุเป็นค่า OT OP ไปเลย) สูตรคือ 1% จาก rawcost  ไม่ต่ำกว่า 500 บาท (ไม่ต้องคิด fee20%)\n>> ให้ต่ำสุดที่ 500 บาท / สูงสุดไม่เกิน 2,500 บาท <<", "-", "-", "-", "-"] }
    ]
  },
  {
    category: "Travel Expenses",
    items: [
      { id: "te1", topic: "BTS < 1 KM", rates: ["500", "-", "-", "-", "-"] },
      { id: "te2", topic: "BTS < 5 KM - 10 KM", rates: ["1,000", "-", "-", "-", "-"] },
      { id: "te3", topic: "BTS > 10 KM", rates: ["1,500", "-", "-", "-", "-"] },
      { id: "te4", topic: "กรณีนอกกรุงเทพ คิด Case by Case", rates: ["Case by Case", "-", "-", "-", "-"] }
    ]
  }
];

const tiktokCategories = [
  {
    category: "Social Cost",
    items: [
      { id: "tk_sc1", topic: "TikTok", rates: ["50", "50", "125", "125", "325", "325", "625", "625", "1,250", "1,250"] }
    ]
  },
  {
    category: "Special Cost",
    items: [
      { id: "tk_spc1", topic: "หมอ,เภสัช", rates: ["-", "-", "-", "-", "6,000", "-", "-", "-", "-", "-"] },
      { id: "tk_spc2", topic: "แม่และเด็ก (ลูกอ่อน)", rates: ["-", "-", "3,000", "-", "5,000", "-", "-", "-", "-", "-"] },
      { id: "tk_spc3", topic: "Healthy", rates: ["-", "-", "2,500", "-", "2,500", "-", "2,000", "-", "3,000", "-"] },
      { id: "tk_spc4", topic: "ถ่ายคู่แมว (พันธ์นอก)", rates: ["-", "-", "-", "-", "2,700", "-", "5,500", "-", "-", "-"] },
      { id: "tk_spc5", topic: "นักรีวิวหนัง", rates: ["-", "-", "-", "-", "1,500", "-", "2,000", "-", "-", "-"] },
      { id: "tk_spc6", topic: "เล่นกีฬา/fitness", rates: ["-", "-", "1,500", "-", "2,000", "-", "3,000", "-", "4,000", "-"] },
      { id: "tk_spc7", topic: "นำรูปไปใช้ต่อ 3 เดือน", rates: ["500", "-", "1,000", "-", "-", "-", "-", "-", "Rate Card", "-"] },
      { id: "tk_spc8", topic: "Tiktok คนเลี้ยงหมา", rates: ["-", "-", "-", "-", "2,000", "-", "-", "-", "-", "-"] },
      { id: "tk_spc9", topic: "สาย Y นิยาย", rates: ["500", "-", "-", "-", "1,000", "-", "-", "-", "-", "-"] },
      { id: "tk_spc10", topic: "คนท้องถิ่นผู้ชาย", rates: ["-", "-", "-", "-", "1,000", "-", "2,000", "-", "-", "-"] },
      { id: "tk_spc11", topic: "Foodie", rates: ["-", "-", "-", "-", "1,000", "-", "1,700", "-", "-", "-"] },
      { id: "tk_spc12", topic: "affliate link/ติดตระกร้า", rates: ["500", "-", "500", "-", "1,000", "-", "1,500", "-", "-", "-"] },
      { id: "tk_spc13", topic: "home decoration", rates: ["1,000", "-", "1,500", "-", "2,000", "-", "4,000", "-", "-", "-"] },
      { id: "tk_spc14", topic: "Cooking", rates: ["700", "-", "1,000", "-", "1,500", "-", "2,000", "-", "-", "-"] },
      { id: "tk_spc15", topic: "IT Gadget", rates: ["500", "-", "1,000", "-", "1,500", "-", "2,000", "-", "-", "-"] },
      { id: "tk_spc16", topic: "คนทึ่มีรถยนต์ /รถจักรยานยนต์", rates: ["500", "-", "1,000", "-", "1,500", "-", "2,000", "-", "-", "-"] },
      { id: "tk_spc17", topic: "นักเรียน นักศึกษา", rates: ["500", "-", "700", "-", "1,000", "-", "1,500", "-", "-", "-"] },
      { id: "tk_spc18", topic: "แฟนคลับ", rates: ["500", "-", "700", "-", "1,000", "-", "1,500", "-", "-", "-"] },
      { id: "tk_spc19", topic: "Travel", rates: ["1,000", "-", "1,500", "-", "2,000", "-", "4,000", "-", "-", "-"] },
      { id: "tk_spc20", topic: "คู่รัก", rates: ["1,000", "-", "1,500", "-", "2,000", "-", "3,000", "-", "-", "-"] },
      { id: "tk_spc21", topic: "คนอายุ 50+ คนสูงวัย", rates: ["2,000", "-", "3,500", "-", "4,500", "-", "6,000", "-", "-", "-"] },
      { id: "tk_spc22", topic: "Plus Size", rates: ["500", "-", "800", "-", "1,200", "-", "2,000", "-", "-", "-"] }
    ]
  },
  {
    category: "Support Cost",
    items: [
      { id: "tk_sup1", topic: "Photos", rates: ["750", "870", "1,005", "1,125", "1,125", "1,305", "1,125", "1,425", "1,950", "2,250"] },
      { id: "tk_sup2", topic: "VDO", rates: ["1,250", "1,450", "1,675", "1,875", "1,875", "2,175", "1,875", "2,375", "3,250", "4,250"] }
    ]
  },
  {
    category: "Via Cost",
    items: [
      { id: "tk_via1", topic: "Via", rates: ["200", "200", "300", "300", "500", "500", "500", "500", "1,000", "1,000"] }
    ]
  },
  {
    category: "Other Cost",
    items: [
      { id: "tk_oc1", topic: "Gencode/Add Ads (% จากค่าตัว)", rates: ["50%", "50%", "50%", "50%", "30%", "30%", "25%", "25%", "20%", "20%"] },
      { id: "tk_oc2", topic: "Buy Out (30 days) (% จากค่าตัว)", rates: ["50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "30%", "30%"] },
      { id: "tk_oc3", topic: "TikTok Shop /SKU", rates: ["500", "-", "-", "-", "1,000", "-", "1,500", "-", "Rate Card", "-"] },
      { id: "tk_oc4", topic: "SKU ชิ้นต่อไป", rates: ["500", "-", "-", "-", "700", "-", "-", "-", "Rate Card", "-"] }
    ]
  }
];

const lemon8Categories = [
  {
    category: "Support Cost",
    items: [
      { id: "lm_sup1", topic: "Photos", rates: ["1,000", "1,500", "2,000", "Rate card", "Rate card"] },
      { id: "lm_sup2", topic: "VDO", rates: ["1,500", "2,000", "2,250", "Rate card", "Rate card"] }
    ]
  },
  {
    category: "Via Cost",
    items: [
      { id: "lm_via1", topic: "Via", rates: ["200", "300", "500", "-", "-"] }
    ]
  },
  {
    category: "Other Cost",
    items: [
      { id: "lm_oc1", topic: "Buy Out (30 days) (% จากค่าตัว)", rates: ["50%", "50%", "50%", "-", "-"] },
      { id: "lm_oc2", topic: "SKU ชิ้นต่อไป", rates: ["500", "700", "-", "-", "-"] }
    ]
  }
];

export function generateSeedData() {
  const records = [];
  let idCounter = 1001;

  const igFbPlatforms = ["Instagram", "Facebook", "X/Twitter", "Application", "E-Commerce App"];

  igFbPlatforms.forEach(plat => {
    records.push({
      id: `SP-${idCounter++}`,
      name: `Standard ${plat} Pricing`,
      platform: plat,
      followerTiers: [...standardTiers],
      costTypes: JSON.parse(JSON.stringify(igFbCategories)),
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString()
    });
  });

  records.push({
    id: `SP-${idCounter++}`,
    name: `Standard TikTok Pricing`,
    platform: "TikTok",
    followerTiers: [...tiktokTiers],
    costTypes: JSON.parse(JSON.stringify(tiktokCategories)),
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  });

  records.push({
    id: `SP-${idCounter++}`,
    name: `Standard Lemon8 Pricing`,
    platform: "Lemon8",
    followerTiers: [...standardTiers],
    costTypes: JSON.parse(JSON.stringify(lemon8Categories)),
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  });

  return records;
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function StandardPricingFlow() {
  const [records, setRecords] = useState([]);
  const [logs, setLogs] = useState([]);
  const [role, setRole] = useState("Dev"); // Dev (Admin) or Viewer
  const [currentUser] = useState("planner.beauty@buddyreview.co");
  const [isLoaded, setIsLoaded] = useState(false);

  // View State
  const [currentView, setCurrentView] = useState("overview"); // "overview" | "detail"
  const [activeRecord, setActiveRecord] = useState(null);

  // UI State
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Load from localStorage
    const savedRecords = localStorage.getItem("kol_standard_pricing_v4");
    const savedLogs = localStorage.getItem("kol_standard_pricing_logs_v4");
    
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    } else {
      setRecords(generateSeedData());
    }

    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("kol_standard_pricing_v4", JSON.stringify(records));
      localStorage.setItem("kol_standard_pricing_logs_v4", JSON.stringify(logs));
    }
  }, [records, logs, isLoaded]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const addLog = (action, platform, recordId, oldVal = null, newVal = null) => {
    const newLog = {
      id: `LOG-${Date.now()}`,
      action,
      user: currentUser,
      timestamp: new Date().toLocaleString(),
      platform,
      recordId,
      oldValue: oldVal ? JSON.stringify(oldVal) : null,
      newValue: newVal ? JSON.stringify(newVal) : null,
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleCreateNew = (platform) => {
    const newId = `SP-${Date.now().toString().slice(-4)}`;
    const newRecord = {
      id: newId,
      name: `New ${platform} Pricing`,
      platform: platform,
      followerTiers: [...defaultTiers],
      costTypes: JSON.parse(JSON.stringify(defaultCategories)),
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString()
    };
    setRecords(prev => [...prev, newRecord]);
    addLog("Create", platform, newId, null, newRecord);
    showToast("New pricing configuration created.");
  };

  const handleDuplicate = (record) => {
    const newId = `SP-${Date.now().toString().slice(-4)}`;
    const duplicated = {
      ...JSON.parse(JSON.stringify(record)),
      id: newId,
      name: `${record.name} (Copy)`,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString()
    };
    setRecords(prev => [...prev, duplicated]);
    addLog("Duplicate", record.platform, newId, null, duplicated);
    showToast("Pricing configuration duplicated.");
  };

  const handleDelete = (record) => {
    if(window.confirm(`Are you sure you want to delete ${record.name}?`)) {
      setRecords(prev => prev.filter(r => r.id !== record.id));
      if (activeRecord?.id === record.id) {
        setCurrentView("overview");
        setActiveRecord(null);
      }
      addLog("Delete", record.platform, record.id, record, null);
      showToast("Pricing configuration deleted.");
    }
  };

  const handleSaveDetail = (updatedRecord, changesMsg) => {
    updatedRecord.updatedAt = new Date().toLocaleDateString();
    setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    setActiveRecord(updatedRecord);
    addLog("Update", updatedRecord.platform, updatedRecord.id, "Previous State", changesMsg);
    showToast("Changes saved successfully.");
  };

  const openDetail = (record) => {
    setActiveRecord(record);
    setCurrentView("detail");
  };

  if (!isLoaded) return null;

  const canEdit = role === "Dev";

  return (
    <div className="mx-auto max-w-7xl pb-12">
      <Toast message={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 lg:text-3xl">
            {currentView === "overview" ? "Standard Pricing" : activeRecord?.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {currentView === "overview" 
              ? "Manage standard pricing configurations across all platforms."
              : `Managing pricing matrix for ${activeRecord?.platform}`
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1">
            <span className="pl-2 text-xs font-medium text-slate-500">Role:</span>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="bg-transparent text-sm font-semibold outline-none text-[#6D5DF6]"
            >
              <option value="Dev">Dev (Admin)</option>
              <option value="Viewer">Viewer (Read Only)</option>
            </select>
          </div>
        </div>
      </div>

      {currentView === "overview" ? (
        <OverviewPage 
          records={records} 
          canEdit={canEdit}
          onOpenDetail={openDetail}
          onCreateNew={handleCreateNew}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      ) : (
        <DetailPage 
          record={activeRecord}
          canEdit={canEdit}
          onBack={() => { setCurrentView("overview"); setActiveRecord(null); }}
          onSave={handleSaveDetail}
          onOpenLog={() => setIsLogOpen(true)}
        />
      )}

      {/* Audit Log Drawer */}
      <AuditLogDrawer 
        isOpen={isLogOpen} 
        onClose={() => setIsLogOpen(false)} 
        logs={activeRecord ? logs.filter(l => l.recordId === activeRecord.id) : logs} 
        platform={activeRecord?.platform}
      />
    </div>
  );
}

// ----------------------------------------------------------------------
// OVERVIEW PAGE
// ----------------------------------------------------------------------
function OverviewPage({ records, canEdit, onOpenDetail }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {PLATFORMS.map(platform => {
        // Find the single configuration for this platform
        const record = records.find(r => r.platform === platform);
        
        if (!record) return null; // Should never happen with our seed data

        return (
          <motion.div 
            key={platform}
            whileHover={{ y: -4 }}
            onClick={() => onOpenDetail(record)}
            className="group cursor-pointer rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md overflow-hidden flex flex-col"
          >
            <div className="p-6 pb-4 flex-1">
              <div className="mb-4">
                <PlatformBadge platform={platform} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">{platform} Pricing</h3>
              <div className="mt-4 text-xs text-slate-500 space-y-1">
                <div>Last Updated: <span className="font-medium text-slate-700">{record.updatedAt}</span></div>
                <div>Tiers: <span className="font-medium text-slate-700">{record.followerTiers.length}</span></div>
                <div>Categories: <span className="font-medium text-slate-700">{record.costTypes.length}</span></div>
              </div>
            </div>
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
              <span className="text-sm font-medium text-[#6D5DF6]">Edit Matrix</span>
              <ChevronRight className="h-5 w-5 text-[#6D5DF6] transition-transform group-hover:translate-x-1" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ----------------------------------------------------------------------
// DETAIL PAGE (MATRIX UI)
// ----------------------------------------------------------------------
function DetailPage({ record, canEdit, onBack, onSave, onOpenLog }) {
  // Local state for the editable matrix
  const [data, setData] = useState(JSON.parse(JSON.stringify(record)));
  const [hasChanges, setHasChanges] = useState(false);

  // Edit cell state
  const [editingCell, setEditingCell] = useState(null); // { catIdx, itemIdx, rateIdx }
  const [editValue, setEditValue] = useState("");

  const handleCellClick = (catIdx, itemIdx, rateIdx, currentValue) => {
    if (!canEdit) return;
    setEditingCell({ catIdx, itemIdx, rateIdx });
    setEditValue(currentValue);
  };

  const handleCellBlur = () => {
    if (!editingCell) return;
    const { catIdx, itemIdx, rateIdx } = editingCell;
    const newData = { ...data };
    const currentVal = newData.costTypes[catIdx].items[itemIdx].rates[rateIdx];
    
    if (currentVal !== editValue) {
      newData.costTypes[catIdx].items[itemIdx].rates[rateIdx] = editValue;
      setData(newData);
      setHasChanges(true);
    }
    setEditingCell(null);
  };

  const handleCellKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCellBlur();
    } else if (e.key === "Escape") {
      setEditingCell(null);
    }
  };

  const addTier = () => {
    const tierName = prompt("Enter new Follower Tier name (e.g., '1M+'):");
    if (!tierName) return;
    
    const newData = { ...data };
    newData.followerTiers.push(tierName);
    
    // Add empty cell for each existing item
    newData.costTypes.forEach(cat => {
      cat.items.forEach(item => {
        item.rates.push("-");
      });
    });
    
    setData(newData);
    setHasChanges(true);
  };

  const addCategory = () => {
    const catName = prompt("Enter new Cost Category name:");
    if (!catName) return;
    
    const newData = { ...data };
    newData.costTypes.push({
      category: catName,
      items: []
    });
    
    setData(newData);
    setHasChanges(true);
  };

  const addItem = (catIdx) => {
    const topicName = prompt("Enter new Topic name:");
    if (!topicName) return;
    
    const newData = { ...data };
    const rates = new Array(newData.followerTiers.length).fill("-");
    newData.costTypes[catIdx].items.push({
      id: `item_${Date.now()}`,
      topic: topicName,
      rates: rates,
      spanAll: false
    });
    
    setData(newData);
    setHasChanges(true);
  };

  const removeItem = (catIdx, itemIdx) => {
    if (!window.confirm("Delete this topic row?")) return;
    const newData = { ...data };
    newData.costTypes[catIdx].items.splice(itemIdx, 1);
    setData(newData);
    setHasChanges(true);
  };

  const saveChanges = () => {
    onSave(data, "Matrix values updated.");
    setHasChanges(false);
  };

  const getCategoryColor = (category) => {
    if (category.includes("Social")) return "bg-cyan-50 border-cyan-200 text-cyan-800";
    if (category.includes("Support")) return "bg-emerald-50 border-emerald-200 text-emerald-800";
    if (category.includes("Via")) return "bg-amber-50 border-amber-200 text-amber-800";
    if (category.includes("Other")) return "bg-yellow-50 border-yellow-200 text-yellow-800";
    if (category.includes("Travel")) return "bg-slate-50 border-slate-200 text-slate-800";
    return "bg-slate-50 border-slate-200 text-slate-800";
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-12">
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#6D5DF6] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Overview
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenLog}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <History className="h-4 w-4" /> Audit Log
          </button>

          {canEdit && (
            <button 
              onClick={saveChanges}
              disabled={!hasChanges}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium transition shadow-sm",
                hasChanges ? "bg-[#6D5DF6] text-white hover:bg-[#5a4add]" : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              <Save className="h-4 w-4" /> Save Changes
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-900 border-r border-slate-200 bg-white min-w-[140px] sticky left-0 z-20">Cost Type</th>
                <th className="px-4 py-3 font-semibold text-slate-900 border-r border-slate-200 bg-white min-w-[200px] sticky left-[140px] z-20">Topic/Follower</th>
                {data.followerTiers.map((tier, idx) => (
                  <th key={idx} className="px-4 py-3 font-semibold text-slate-900 text-center border-r border-slate-200 min-w-[120px]">
                    {tier}
                  </th>
                ))}
                {canEdit && (
                  <th className="px-3 py-3 text-center border-slate-200 w-[60px]">
                    <button onClick={addTier} className="p-1 rounded bg-slate-200 text-slate-600 hover:bg-slate-300 transition" title="Add Follower Tier">
                      <Plus className="h-4 w-4" />
                    </button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.costTypes.map((costSection, catIdx) => (
                <React.Fragment key={catIdx}>
                  {costSection.items.length === 0 && (
                    <tr>
                      <td className={`px-4 py-3 font-semibold border-r border-slate-200 sticky left-0 z-10 ${getCategoryColor(costSection.category)}`}>
                        {costSection.category}
                      </td>
                      <td colSpan={data.followerTiers.length + 2} className="px-4 py-3 text-sm text-slate-400 italic bg-white">
                        No topics defined.
                      </td>
                    </tr>
                  )}
                  {costSection.items.map((item, itemIdx) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      {itemIdx === 0 && (
                        <td 
                          rowSpan={costSection.items.length} 
                          className={`px-4 py-3 font-semibold align-top border-r border-slate-200 sticky left-0 z-10 ${getCategoryColor(costSection.category)}`}
                        >
                          <div className="sticky top-4">
                            {costSection.category}
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-3 font-medium text-slate-800 border-r border-slate-200 bg-white sticky left-[140px] z-10 relative group-hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <span>{item.topic}</span>
                          {canEdit && (
                            <button onClick={() => removeItem(catIdx, itemIdx)} className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 p-1">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                      
                      {item.rates.map((rate, rateIdx) => {
                        const isEditing = editingCell?.catIdx === catIdx && editingCell?.itemIdx === itemIdx && editingCell?.rateIdx === rateIdx;
                        const isSpecial = rate.toLowerCase().includes("rate") || rate.includes("%") || rate === "-" || rate.toLowerCase().includes("case");
                        
                        return (
                          <td 
                            key={rateIdx} 
                            onClick={() => handleCellClick(catIdx, itemIdx, rateIdx, rate)}
                            className={cn(
                              "px-2 py-2 text-center border-r border-slate-200 relative transition-colors",
                              canEdit ? "cursor-text hover:bg-violet-50" : "",
                              isSpecial && !isEditing ? "text-slate-500 italic" : "text-slate-900 font-medium"
                            )}
                          >
                            {isEditing ? (
                              <input 
                                autoFocus
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleCellBlur}
                                onKeyDown={handleCellKeyDown}
                                className="w-full text-center border border-[#6D5DF6] rounded px-1 py-1 outline-none shadow-sm ring-2 ring-[#6D5DF6]/20 bg-white"
                              />
                            ) : (
                              <span>{rate}</span>
                            )}
                          </td>
                        );
                      })}
                      {canEdit && <td className="bg-slate-50"></td>}
                    </tr>
                  ))}
                  {canEdit && (
                    <tr>
                      {costSection.items.length === 0 && (
                        <td className="hidden"></td> // Handled above
                      )}
                      <td colSpan={data.followerTiers.length + (costSection.items.length > 0 ? 2 : 1)} className="px-4 py-2 bg-white border-r border-slate-200">
                        <button 
                          onClick={() => addItem(catIdx)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6D5DF6] hover:text-[#5a4add]"
                        >
                          <Plus className="h-3 w-3" /> Add Topic to {costSection.category}
                        </button>
                      </td>
                      <td className="bg-white"></td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {canEdit && (
          <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
            <button 
              onClick={addCategory}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              <Plus className="h-4 w-4" /> Add Cost Category
            </button>
          </div>
        )}
      </div>
      
      {canEdit && (
        <div className="mt-4 rounded-xl bg-violet-50 p-4 border border-violet-100 text-sm text-[#6D5DF6]">
          <span className="font-semibold">Pro Tip:</span> Click on any price cell in the matrix to edit it directly. Press Enter or click away to save. Don't forget to click "Save Changes" at the top when you're done!
        </div>
      )}
    </motion.div>
  );
}


// ----------------------------------------------------------------------
// HELPERS & COMPONENTS
// ----------------------------------------------------------------------
function PlatformBadge({ platform }) {
  let color = "bg-slate-100 text-slate-700";
  if (platform.includes("IG") || platform.includes("Instagram")) color = "bg-fuchsia-100 text-fuchsia-700";
  else if (platform.includes("TikTok")) color = "bg-stone-800 text-stone-100";
  else if (platform.includes("Facebook")) color = "bg-blue-100 text-blue-700";
  else if (platform.includes("X") || platform.includes("Twitter")) color = "bg-slate-200 text-slate-800";
  else if (platform.includes("Lemon8")) color = "bg-yellow-100 text-yellow-800";

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide", color)}>
      {platform}
    </span>
  );
}

function Toast({ message, onClose }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          className="fixed left-1/2 top-6 z-[100] flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 shadow-xl"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="text-sm font-medium text-slate-800">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AuditLogDrawer({ isOpen, onClose, logs, platform }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-lg flex-col bg-slate-50 shadow-2xl border-l border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-slate-500" />
                <h2 className="text-lg font-semibold text-slate-900">Audit Log {platform ? `- ${platform}` : ''}</h2>
              </div>
              <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100 text-slate-500"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {logs.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-slate-400">
                  <History className="mb-2 h-8 w-8 opacity-20" />
                  <p className="text-sm">No activity recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wider",
                          log.action === "Create" ? "bg-emerald-100 text-emerald-700" :
                          log.action === "Update" ? "bg-amber-100 text-amber-700" :
                          log.action === "Delete" ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {log.action}
                        </span>
                        <span className="text-xs text-slate-400">{log.timestamp}</span>
                      </div>
                      <div className="mb-1 text-sm font-medium text-slate-900">
                        {log.platform} <span className="font-normal text-slate-500">({log.recordId})</span>
                      </div>
                      <div className="text-xs text-slate-500 mb-3">By: {log.user}</div>
                      
                      {(log.oldValue || log.newValue) && (
                        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs font-mono overflow-x-auto text-slate-600 border border-slate-100">
                          {log.oldValue && <div className="mb-1 text-rose-500 whitespace-pre-wrap truncate max-w-[400px]">- {log.oldValue}</div>}
                          {log.newValue && <div className="text-emerald-500 whitespace-pre-wrap truncate max-w-[400px]">+ {log.newValue}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
