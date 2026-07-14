import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Button from "../common/Button";

export default function GroupSelectionModal({ open, onClose, onConfirm, initialSelected = [] }) {
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
