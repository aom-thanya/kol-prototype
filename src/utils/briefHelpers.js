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
    steps.push({ id: "exampleList", label: "Example list" });
    steps.push({ id: "rateCardList", label: "Rate card list" });
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

    let hasExampleSelected = false;
    if (brief.groups) {
      brief.groups.forEach(g => {
        if (g.sows) {
          g.sows.forEach(s => {
            if (s.exampleCreators && s.exampleCreators.some(c => c.selected !== false)) {
              hasExampleSelected = true;
            }
          });
        }
      });
    }

    let hasDone = false;
    if (brief.groupTrackers) {
      Object.values(brief.groupTrackers).forEach(t => {
        if (t.influencers && t.influencers.some(i => i.contactStatus === "Selected" || i.contactStatus === "Done" || i.lot || i.contactStatus === "Accept" || i.contactStatus === "Reject")) {
          hasDone = true;
        }
      });
    }

    if (!hasExampleSelected) return 1; // Example list
    if (!hasDone) return 2; // Rate card list
    if (activeTab === "proposal") return 4;
    return 3; // Dealsheet
  };

  const progressIdx = getProgressIdx();
  return steps[progressIdx]?.label || status;
}

export function getBriefDefaultTab(brief) {
  if (!brief) return "brief";
  const progressStatus = getBriefProgressStatus(brief);
  switch (progressStatus) {
    case "Example list":
      return "exampleList";
    case "Rate card list":
      return "rateCardList";
    case "Dealsheet":
      return "dealsheet";
    case "Proposal":
      return "proposal";
    case "Brief":
    default:
      return "brief";
  }
}

export function generateScopeName(platforms = [], contentTypes = [], serviceScope = {}) {
  const platformArr = Array.isArray(platforms) ? platforms : (platforms ? [platforms] : []);
  const platformStr = platformArr.join(" + ");
  const contentStr = (Array.isArray(contentTypes) ? contentTypes : (contentTypes ? [contentTypes] : [])).join(" + ");
  
  const baseNameParts = [];
  if (contentStr) baseNameParts.push(`Create ${contentStr}`);
  if (platformStr) baseNameParts.push(contentStr ? `on ${platformStr}` : platformStr);
  
  let name = baseNameParts.join(" ");
  
  if (serviceScope?.selectedVias && serviceScope.selectedVias.length > 0) {
    const viaStr = serviceScope.selectedVias.join(" + ");
    name = name ? `${name} via ${viaStr}` : `via ${viaStr}`;
  }
  
  return name || "Unnamed Scope";
}

export function transformBriefSowsToRecapGroups(briefSows = []) {
  const groupedMap = new Map();
  const getArray = (val) => Array.isArray(val) ? val : (val ? [val] : []);

  briefSows.forEach((sow, idx) => {
    // If the SOW has influencerDetails (groups), iterate over them.
    // Otherwise, create a fallback group so the SOW is not lost.
    const groupsInSow = sow.influencerDetails && sow.influencerDetails.length > 0 
      ? sow.influencerDetails 
      : [{ 
          groupId: `group_default_${idx}`, 
          groupName: sow.name || `Default Group ${idx + 1}`, 
          persona: sow.persona,
          referenceInfluencers: []
        }];
    
    groupsInSow.forEach((grp, gIdx) => {
      // Use the stable groupId to deduplicate
      const gId = grp.groupId || `group_${Date.now()}_${idx}_${gIdx}`;
      
      if (!groupedMap.has(gId)) {
        groupedMap.set(gId, {
          id: gId,
          name: grp.groupName || `Group ${gId}`,
          numInfluencers: grp.numInfluencers || sow.numInfluencers,
          followerReqFrom: grp.followerReqFrom || sow.followerReqFrom,
          followerReqTo: grp.followerReqTo || sow.followerReqTo,
          pillars: {
            demographic: getArray(grp.persona?.demographic || sow.persona?.demographic),
            location: getArray(grp.persona?.location || sow.persona?.location),
            occupation: getArray(grp.persona?.occupation || sow.persona?.occupation),
            persona: getArray(grp.persona?.persona || sow.persona?.persona),
            contentCategory: getArray(grp.persona?.contentCategory || sow.persona?.contentCategory),
            storyTelling: getArray(grp.persona?.storyTelling || sow.persona?.storyTelling)
          },
          referenceInfluencers: grp.referenceInfluencers || [],
          sows: []
        });
      }
      
      const groupEntry = groupedMap.get(gId);
      
      // We push the SOW into this group's sows array.
      // We don't need to copy the influencerDetails array into the SOW here to avoid circular/redundant data, 
      // but we will keep the rest of the SOW data intact as requested.
      const { influencerDetails, ...sowDataWithoutInfluencerDetails } = sow;
      groupEntry.sows.push({
        ...sowDataWithoutInfluencerDetails,
        id: sow.id || `sow_${Date.now()}_${idx}_${gIdx}`
      });
    });
  });
  
  return Array.from(groupedMap.values());
}
