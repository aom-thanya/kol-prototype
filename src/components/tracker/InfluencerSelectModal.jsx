import { useState } from "react";
import { motion } from "framer-motion";
import { X, Search } from "lucide-react";
import Button from "../common/Button";
import { influencerSeed } from "../../data/influencerSeed";

export default function InfluencerSelectModal({ open, onClose, onSelect }) {
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
