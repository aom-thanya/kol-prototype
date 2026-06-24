import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Edit2, Copy, Trash2, Search, ChevronRight, ChevronLeft,
  X, CheckCircle2, History, AlertCircle, Save
} from "lucide-react";

// Initial Seed Data (if localStorage is empty)
const defaultTiers = ["1K - 5K", "5K - 10K", "10K - 50K", "50K - 100K", "100K+"];
const PLATFORMS = ["Instagram", "Facebook", "X/Twitter", "Application", "E-Commerce App"];

const defaultCategories = [
  {
    category: "Social Cost",
    items: [{ id: "sc1", topic: "Photo Post", rates: ["100", "200", "450", "2000", "3000"], spanAll: false }]
  },
  {
    category: "Support Cost",
    items: [{ id: "sp1", topic: "Story", rates: ["300", "500", "700", "1000", "1500"], spanAll: false }]
  }
];

function generateSeedData() {
  return PLATFORMS.map((plat, idx) => ({
    id: `SP-${1000 + idx}`,
    name: `Standard ${plat} Pricing`,
    platform: plat,
    followerTiers: [...defaultTiers],
    costTypes: JSON.parse(JSON.stringify(defaultCategories)),
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  }));
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function StandardPricingFlow() {
  const [records, setRecords] = useState([]);
  const [logs, setLogs] = useState([]);
  const [role, setRole] = useState("Planner"); // Planner (Admin) or Viewer
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
    const savedRecords = localStorage.getItem("kol_standard_pricing");
    const savedLogs = localStorage.getItem("kol_standard_pricing_logs");
    
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
      localStorage.setItem("kol_standard_pricing", JSON.stringify(records));
      localStorage.setItem("kol_standard_pricing_logs", JSON.stringify(logs));
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

  const canEdit = role === "Planner";

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
              <option value="Planner">Planner (Admin)</option>
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
