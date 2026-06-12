import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ArrowLeft, ClipboardList, Folder, Eye } from "lucide-react";
import Button from "./components/common/Button";
import DealsheetPage from "./components/brief/DealsheetPage";

export default function FinalDealsheetFlow({ briefs, setBriefs, showToast }) {
  const [selectedBriefId, setSelectedBriefId] = useState(null);
  const [search, setSearch] = useState("");

  const selectedBrief = useMemo(() => {
    if (!selectedBriefId) return null;
    return briefs.find((b) => b.id === selectedBriefId);
  }, [briefs, selectedBriefId]);

  const handleUpdateBrief = (updated) => {
    setBriefs((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const filtered = useMemo(() => {
    return briefs.filter((b) => {
      return (
        b.id.toLowerCase().includes(search.toLowerCase()) ||
        b.campaignName.toLowerCase().includes(search.toLowerCase()) ||
        b.brand.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [briefs, search]);

  const getSelectedKOLCount = (brief) => {
    if (!brief.groupTrackers) return 0;
    let count = 0;
    Object.values(brief.groupTrackers).forEach((tracker) => {
      if (tracker.influencers) {
        count += tracker.influencers.filter((i) => i.contactStatus === "Selected").length;
      }
    });
    return count;
  };

  if (selectedBrief) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedBriefId(null)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#6D5DF6] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dealsheets List
        </button>
        
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Final Dealsheet</span>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">{selectedBrief.campaignName}</h1>
              <p className="text-sm text-slate-500 mt-0.5">Brand: {selectedBrief.brand} • Brief ID: {selectedBrief.id}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xs text-center min-w-[140px]">
              <div className="text-xs font-medium text-slate-400">Selected KOLs</div>
              <div className="text-2xl font-bold text-[#6D5DF6] mt-0.5">{getSelectedKOLCount(selectedBrief)}</div>
            </div>
          </div>
        </div>

        <DealsheetPage brief={selectedBrief} onUpdateBrief={handleUpdateBrief} showToast={showToast} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-7xl space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">Final Dealsheets</h1>
          <p className="text-sm text-slate-500 mt-1">Access, export, and review the finalized dealsheets across all campaigns.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by brief ID, campaign or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-[#6D5DF6] transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase bg-slate-50/20">
                <th className="py-4 px-6">Brief ID</th>
                <th className="py-4 px-6">Campaign Info</th>
                <th className="py-4 px-6">Sales Owner</th>
                <th className="py-4 px-6">Selected KOLs</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((brief) => {
                  const kolCount = getSelectedKOLCount(brief);
                  return (
                    <tr
                      key={brief.id}
                      className="hover:bg-slate-50/40 cursor-pointer transition-colors"
                      onClick={() => setSelectedBriefId(brief.id)}
                    >
                      <td className="py-4 px-6 font-semibold text-[#6D5DF6]">
                        {brief.id}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900">
                          {brief.campaignName}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {brief.brand} • {Array.isArray(brief.packageType) ? brief.packageType.join(", ") : brief.packageType}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {brief.salesOwner || "-"}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${kolCount > 0 ? 'bg-violet-50 text-[#6D5DF6]' : 'bg-slate-100 text-slate-500'}`}>
                          {kolCount} KOLs Selected
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="secondary"
                          onClick={() => setSelectedBriefId(brief.id)}
                          className="h-9"
                        >
                          <Eye className="h-4 w-4" /> View Dealsheet
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-550 bg-slate-50/10">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Folder className="h-8 w-8 text-slate-300" />
                      <div className="font-medium text-slate-600">No campaigns found</div>
                    </div>
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
