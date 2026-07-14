

import { motion } from "framer-motion";

import Button from "../../../components/common/Button";

export default function ReviewChangeModal({ open, pendingChanges, onApply, onLater }) {
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


// --- Dealsheet & Proposal Page Component ---

// Helper for formatting currency safely
