import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download } from "lucide-react";
import Button from "../common/Button";
import TrackerTable from "../tracker/TrackerTable";
import ActivityTimeline from "../common/ActivityTimeline";
import { getCampaignCalculations } from "../../utils/campaignCalculations";

export default function ProposalPage({ brief, onUpdateBrief, showToast }) {
  const activeGroups = Object.keys(brief.groupTrackers || {});
  
  const filteredTrackers = {};
  let totalDoneCount = 0;
  
  activeGroups.forEach(grp => {
    const tracker = brief.groupTrackers[grp];
    const doneInfluencers = tracker.influencers.filter(inf => 
      inf.contactStatus === "Selected" || inf.contactStatus === "Done" || inf.lot
    );
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
            <div className="mb-6 border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Proposal Preview</h1>
                <p className="text-slate-500 mt-1">{brief.campaignName} • {brief.id}</p>
              </div>
            </div>

            {hasStandard ? (
              <div className="text-center py-16 text-slate-555 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mb-4 border border-slate-200">
                  <CheckCircle2 className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Dealsheet Table Moved</h3>
                <p className="mb-4 text-sm text-slate-500 mt-1">The KPI table has been moved to the Dealsheet page.</p>
              </div>
            ) : totalDoneCount === 0 ? (
              <div className="text-center py-16 text-slate-555 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mb-4 border border-slate-200">
                  <CheckCircle2 className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">No Influencers Ready</h3>
                <p className="mb-4 text-sm text-slate-500 mt-1">Change influencer status to "Selected" in Rate card list to view them here.</p>
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
                      const newTrackers = { ...brief.groupTrackers };
                      const originalInfluencers = newTrackers[grp].influencers;
                      const updatedMap = {};
                      updatedTracker.influencers.forEach(inf => {
                        updatedMap[inf.id] = inf;
                      });
                      const mergedInfluencers = originalInfluencers.map(inf => {
                        return updatedMap[inf.id] ? updatedMap[inf.id] : inf;
                      });
                      newTrackers[grp] = { ...newTrackers[grp], influencers: mergedInfluencers };
                      onUpdateBrief({ ...brief, groupTrackers: newTrackers });
                    }}
                    onAddClick={() => {}}
                    hideAddButton={true}
                    readOnly={true}
                    isDealsheetView={true}
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
                <Button 
                  className="w-full" 
                  onClick={() => {
                    const url = hasStandard 
                      ? "https://docs.google.com/presentation/d/11CnO6DySSr7OQvtVEJZcAI0LJKBp7n2RCuLH5lQSfMc/edit?usp=sharing"
                      : "https://docs.google.com/presentation/d/1toI8ovvmuFr-bH7LdqSo4h-9-wFcSzen/edit?slide=id.p1#slide=id.p1";
                    window.open(url, "_blank");
                  }}
                  disabled={hasKpi}
                  title={hasKpi ? "Cannot export proposal for package types containing 'KPI'" : ""}
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
