import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import InfluencerDetails from "./shared/InfluencerDetails";

export default function InfluencerDetailModal({ open, onClose, onSave, initialData }) {
  const [data, setData] = useState({
    numInfluencers: "",
    followerReqFrom: "",
    followerReqTo: "",
    persona: { demographic: [], location: [], occupation: [], persona: [], contentCategory: [], storyTelling: [] },
    referenceInfluencers: []
  });

  useEffect(() => {
    if (open) {
      setData(initialData || {
        numInfluencers: "",
        followerReqFrom: "",
        followerReqTo: "",
        persona: { demographic: [], location: [], occupation: [], persona: [], contentCategory: [], storyTelling: [] },
        referenceInfluencers: []
      });
    }
  }, [open, initialData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-6xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 p-4 shrink-0 bg-white">
          <h2 className="text-lg font-bold text-slate-800">Influencer Details</h2>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="p-0 h-full">
             <InfluencerDetails 
               value={data} 
               onChange={setData} 
               editable={true} 
               showSuggestionSource={true} 
             />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 p-4 bg-white shrink-0">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
          <button type="button" onClick={() => { onSave(data); onClose(); }} className="rounded-lg bg-[#6D5DF6] px-5 py-2 text-sm font-semibold text-white hover:bg-[#5b4df0] shadow-sm">Save Details</button>
        </div>
      </div>
    </div>
  );
}
