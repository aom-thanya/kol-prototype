import React from "react";
import { ArrowLeft } from "lucide-react";

export default function BriefStepProgress({ activeTab, onTabChange, onBack, status, brief }) {
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

  const isStandardKpi = hasStandard && hasKpi;

  const steps = [
    { id: "brief", label: "Brief" }
  ];
  
  if (!hasStandard) {
    steps.push({ id: "exampleList", label: "Rate card list" });
  }
  
  steps.push({ id: "dealsheet", label: "Dealsheet" });
  
  if (!isStandardKpi) {
    steps.push({ id: "proposal", label: "Proposal" });
  }

  const activeIdx = steps.findIndex(s => s.id === activeTab);
  
  const getProgressIdx = () => {
    if (!status || status === "Draft") return 0; // Brief
    
    if (hasStandard) {
      return 2; // Unlock both Dealsheet (1) and Proposal (2)
    }

    let hasDone = false;
    if (brief.groupTrackers) {
      Object.values(brief.groupTrackers).forEach(t => {
        if (t.influencers && t.influencers.some(i => i.contactStatus === "Selected")) hasDone = true;
      });
    }
    if (!hasDone) return 1; // Rate card list
    return 3; // Unlock both Dealsheet (2) and Proposal (3)
  };
  
  const progressIdx = Math.min(getProgressIdx(), steps.length - 1);
  
  return (
    <div className="mb-12">
      <div className="mb-8 flex items-center justify-between">
        <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-[#6D5DF6] flex items-center gap-1 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Briefs
        </button>
      </div>
      
      <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto px-4">
        {/* Connecting Line Background */}
        <div className="absolute left-10 right-10 top-5 h-1 bg-slate-200 z-0 rounded-full" />
        
        {/* Connecting Line Progress */}
        <div 
          className="absolute left-10 top-5 h-1 bg-[#6D5DF6] z-0 rounded-full transition-all duration-500 ease-out"
          style={{ width: `calc(${(progressIdx / (steps.length - 1)) * 100}% - 2.5rem)` }}
        />
        
        {steps.map((step, index) => {
          const isCompleted = index <= progressIdx;
          const isViewing = index === activeIdx;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <button
                onClick={() => {
                  if (index <= progressIdx) {
                    onTabChange(step.id);
                  }
                }}
                disabled={index > progressIdx}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-4 border-[#FAFAFA] transition-all duration-300 shadow-sm
                  ${isCompleted 
                    ? 'bg-[#6D5DF6] text-white cursor-pointer hover:bg-[#5d4df0]' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                  }
                  ${isViewing ? 'ring-2 ring-offset-2 ring-[#6D5DF6]' : ''}`}
              >
                {index + 1}
              </button>
              <span className={`absolute top-12 text-sm font-medium whitespace-nowrap transition-colors duration-300
                ${isViewing ? 'text-[#6D5DF6]' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
