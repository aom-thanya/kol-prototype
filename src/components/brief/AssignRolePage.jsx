import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Select from "../common/Select";

export default function AssignRolePage({ brief, onUpdateBrief, onNext }) {
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
