export function getBriefProgressStatus(brief) {
  const status = brief.internalStatus;
  if (!status || status === "Draft") return "Brief";

  const hasStandard = Array.isArray(brief.packageType) 
    ? brief.packageType.some(p => p.toLowerCase().includes("standard"))
    : (typeof brief.packageType === "string" && brief.packageType.toLowerCase().includes("standard"));
  
  const hasKpi = Array.isArray(brief.packageType) 
    ? brief.packageType.some(p => {
        if (typeof p !== "string") return false;
        if (p === "Others") {
          return brief.packageTypeOther && brief.packageTypeOther.toLowerCase().includes("kpi");
        }
        return p.toLowerCase().includes("kpi");
      })
    : (typeof brief.packageType === "string" && brief.packageType.toLowerCase().includes("kpi"));

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

  const activeTab = brief.activeTab || "brief";
  
  const getProgressIdx = () => {
    if (!status || status === "Draft") return 0;
    
    if (hasStandard) {
      if (activeTab === "proposal" && !isStandardKpi) return 2;
      return 1;
    }

    let hasDone = false;
    if (brief.groupTrackers) {
      Object.values(brief.groupTrackers).forEach(t => {
        if (t.influencers && t.influencers.some(i => i.contactStatus === "Selected")) hasDone = true;
      });
    }
    if (!hasDone) return 1;
    if (activeTab === "proposal") return 3;
    return 2;
  };

  const progressIdx = getProgressIdx();
  return steps[progressIdx]?.label || status;
}

export function getBriefDefaultTab(brief) {
  if (!brief) return "brief";
  const progressStatus = getBriefProgressStatus(brief);
  switch (progressStatus) {
    case "Rate card list":
      return "exampleList";
    case "Dealsheet":
      return "dealsheet";
    case "Proposal":
      return "proposal";
    case "Brief":
    default:
      return "brief";
  }
}
