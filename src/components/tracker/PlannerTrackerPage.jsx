import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Save, CheckCircle2 } from "lucide-react";
import Button from "../common/Button";
import TrackerTable from "./TrackerTable";
import InfluencerSelectModal from "./InfluencerSelectModal";
export default function PlannerTrackerPage({ brief, onUpdateBrief, setHeaderActions, readOnly = false, isBriefManagement = false }) {
  // Initialize trackers for each group if they don't exist yet
  const initializeTrackers = () => {
    const trackers = { ...(brief.groupTrackers || {}) };
    let didUpdate = false;

    if (brief.groups) {
      brief.groups.forEach(g => {
        if (!trackers[g.id]) {
          trackers[g.id] = { influencers: [] };
          didUpdate = true;
        }
        
        // Auto-import example creators if they aren't already imported
        if (g.sows) {
          g.sows.forEach(sow => {
            if (sow.exampleCreators && sow.exampleCreators.length > 0) {
              sow.exampleCreators.forEach(creator => {
                const exists = trackers[g.id].influencers.some(inf => 
                  inf.originalCreatorId === creator.id && inf.scopeOfWork === sow.id
                );
                if (!exists) {
                  trackers[g.id].influencers.push({
                    id: Date.now() + Math.random(),
                    originalCreatorId: creator.id,
                    avatar: creator.avatar,
                    accountName: creator.username || creator.name || "",
                    accountLink: creator.username ? `https://${(creator.platform || "Instagram").toLowerCase()}.com/${creator.username.replace("@", "")}` : "",
                    follower: creator.followers ? creator.followers.toString() : "",
                    channel: creator.platform || "Other",
                    contact: creator.contacts ? creator.contacts.map(x => `${x.type === "Tel" ? "เบอร์" : x.type}: ${x.value}${x.name ? ` (${x.name})` : ""}`).join(", ") : "",
                    contacts: creator.contacts ? [...creator.contacts] : [],
                    rawCost: creator.rawCost ? creator.rawCost.replace(/[^0-9]/g, "") : "",
                    creditTerm: "",
                    paymentType: "",
                    paymentTerm: { main: "", sub1: "", sub2: "" },
                    services: {},
                    scopeOfWork: sow.id,
                    detail: "",
                    condition: "1. แก้ไขดราฟได้สูงสุดกี่ครั้ง =\n2. ใส่ # สูงสุดได้กี่อัน =\n3. ใส่ Text/AW/Logo ในชิ้นงานได้หรือไม่ =\n4. ระยะเวลาทำ Script/Idea  =\n5. ระยะเวลาทำ Draft = \n6. ลบโพสต์หรือไม่ = ",
                    brandSupports: {},
                    competitorNote: "",
                    note: "",
                    internalStatus: "Pitching",
                    postingStatus: "Pending",
                    clientStatus: "Pending"
                  });
                  didUpdate = true;
                }
              });
            }
          });
        }

        // Sort the group's influencers by username
        trackers[g.id].influencers.sort((a, b) => {
          const nameA = (a.accountName || "").toLowerCase();
          const nameB = (b.accountName || "").toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
      });
    }
    return { trackers, didUpdate };
  };

  const initData = initializeTrackers();
  const [groupTrackers, setGroupTrackers] = useState(initData.trackers);

  React.useEffect(() => {
    if (initData.didUpdate) {
      onUpdateBrief({ ...brief, groupTrackers: initData.trackers });
    }
  }, []);
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [replacingInfInfo, setReplacingInfInfo] = useState(null);

  const activeGroups = brief.groups || [];

  const [isSubmitLotModalOpen, setIsSubmitLotModalOpen] = useState(false);

  // Compute eligible influencers for Lot
  const eligibleForLot = [];
  let maxLot = 0;
  let allDoneOrRejected = true;
  let hasAnyInfluencer = false;

  Object.values(groupTrackers).forEach(tracker => {
    if (tracker.influencers && tracker.influencers.length > 0) {
      hasAnyInfluencer = true;
      tracker.influencers.forEach(inf => {
        if (inf.contactStatus === "Done" && !inf.lot) {
          eligibleForLot.push(inf);
        }
        if (inf.lot) {
          const match = inf.lot.match(/Lot (\d+)/i);
          if (match) maxLot = Math.max(maxLot, parseInt(match[1]));
        }
        if (inf.contactStatus !== "Done" && inf.contactStatus !== "ไม่รับงาน") {
          allDoneOrRejected = false;
        }
      });
    }
  });

  const nextLotNumber = maxLot + 1;
  const isFinishWorkEnabled = hasAnyInfluencer && allDoneOrRejected;

  const handleSubmitLot = () => {
    const newGroupTrackers = { ...groupTrackers };
    Object.keys(newGroupTrackers).forEach(groupId => {
      const tracker = newGroupTrackers[groupId];
      if (tracker.influencers) {
        newGroupTrackers[groupId] = {
          ...tracker,
          influencers: tracker.influencers.map(inf => {
            if (inf.contactStatus === "Done" && !inf.lot) {
              return { ...inf, lot: `Lot ${nextLotNumber}` };
            }
            return inf;
          })
        };
      }
    });
    setGroupTrackers(newGroupTrackers);
    onUpdateBrief({ ...brief, groupTrackers: newGroupTrackers });
    setIsSubmitLotModalOpen(false);
  };

  const handleConfirmRateCardList = () => {
    const log = {
      date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action: "Sales confirmed Rate Card List",
      details: "Rate Card List confirmed by Sales."
    };
    onUpdateBrief({
      ...brief,
      internalStatus: "Rate Card List Confirmed",
      activityLog: [...(brief.activityLog || []), log]
    });
  };

  const handleAddInfluencerClick = (groupId) => {
    setCurrentGroupId(groupId);
    setReplacingInfInfo(null);
    setSelectModalOpen(true);
  };

  const handleReplaceInfluencerClick = (groupId, infId, infName) => {
    setReplacingInfInfo({ groupId, infId, infName });
    setSelectModalOpen(true);
  };

  const applyStandardPricing = (inf) => {
    const defaultCost = inf?.rawCost ? inf.rawCost.replace(/[^0-9]/g, "") : "";
    if (!inf) return defaultCost;
    
    try {
      const records = JSON.parse(localStorage.getItem("kol_standard_pricing_v4"));
      if (!records) return defaultCost;

      let platKey = inf.platform;
      if (platKey === "X" || platKey === "Twitter") platKey = "X/Twitter";
      
      const record = records.find(r => r.platform.toLowerCase() === platKey.toLowerCase());
      if (!record) return defaultCost;

      const fw = parseInt(inf.followers) || 0;
      let tierIdx = 4; // default 100K+
      if (platKey === "TikTok") {
        const isDance = (inf.character || "").toLowerCase().includes("dance");
        if (fw < 5000) tierIdx = isDance ? 1 : 0;
        else if (fw < 10000) tierIdx = isDance ? 3 : 2;
        else if (fw < 50000) tierIdx = isDance ? 5 : 4;
        else if (fw < 100000) tierIdx = isDance ? 7 : 6;
        else tierIdx = isDance ? 9 : 8;
      } else {
        if (fw < 5000) tierIdx = 0;
        else if (fw < 10000) tierIdx = 1;
        else if (fw < 50000) tierIdx = 2;
        else if (fw < 100000) tierIdx = 3;
        else tierIdx = 4;
      }

      const socialCostCat = record.costTypes.find(c => c.category === "Social Cost");
      if (socialCostCat && socialCostCat.items.length > 0) {
        let item = socialCostCat.items.find(i => i.topic.toLowerCase().includes(platKey.toLowerCase()) || i.topic.toLowerCase().includes(inf.platform.toLowerCase())) || socialCostCat.items[0];
        if (item && item.rates[tierIdx] && item.rates[tierIdx] !== "-") {
          const rate = item.rates[tierIdx].replace(/[^0-9]/g, "");
          if (rate) return rate;
        }
      }
    } catch(e) {}
    return defaultCost;
  };

  const handleSelectInfluencer = (inf) => {
    setSelectModalOpen(false);

    if (replacingInfInfo) {
      const { groupId, infId, infName } = replacingInfInfo;
      const currentData = groupTrackers[groupId] || { influencers: [] };
      
      const newInfluencer = {
        id: Date.now() + Math.random(),
        accountName: inf ? inf.username : "",
        accountLink: inf ? `https://${inf.platform.toLowerCase()}.com/${inf.username.replace("@", "")}` : "",
        follower: inf ? inf.followers.toString() : "",
        channel: inf ? inf.platform : "Other",
        contact: inf?.contacts ? inf.contacts.map(x => `${x.type === "Tel" ? "เบอร์" : x.type}: ${x.value}${x.name ? ` (${x.name})` : ""}`).join(", ") : "",
        contacts: inf?.contacts ? [...inf.contacts] : [],
        rawCost: applyStandardPricing(inf),
        creditTerm: "",
        paymentType: "",
        paymentTerm: { main: "", sub1: "", sub2: "" },
        services: {},
        scopeOfWork: currentData.influencers.find(i => i.id === infId)?.scopeOfWork || "",
        detail: "",
        condition: "1. แก้ไขดราฟได้สูงสุดกี่ครั้ง =\n2. ใส่ # สูงสุดได้กี่อัน =\n3. ใส่ Text/AW/Logo ในชิ้นงานได้หรือไม่ =\n4. ระยะเวลาทำ Script/Idea  =\n5. ระยะเวลาทำ Draft = \n6. ลบโพสต์หรือไม่ = ",
        brandSupports: {},
        competitorNote: "",
        note: "",
        replacedFor: infName,
        internalStatus: "Pitching",
        postingStatus: "Pending",
        clientStatus: "Pending"
      };

      const newData = {
        ...currentData,
        influencers: currentData.influencers.map(i => i.id === infId ? { ...i, contactStatus: "ถูกแทนที่" } : i).concat(newInfluencer).sort((a, b) => {
          const nameA = (a.accountName || "").toLowerCase();
          const nameB = (b.accountName || "").toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        })
      };

      const newTrackers = {
        ...groupTrackers,
        [groupId]: newData
      };
      setGroupTrackers(newTrackers);
      onUpdateBrief({ ...brief, groupTrackers: newTrackers });
      setReplacingInfInfo(null);
      return;
    }

    if (!currentGroupId) return;

    const currentData = groupTrackers[currentGroupId] || { influencers: [] };
    const newInfluencer = {
      id: Date.now() + Math.random(),
      accountName: inf ? inf.username : "",
      accountLink: inf ? `https://${inf.platform.toLowerCase()}.com/${inf.username.replace("@", "")}` : "",
      follower: inf ? inf.followers.toString() : "",
      channel: inf ? inf.platform : "Other",
      contact: inf?.contacts ? inf.contacts.map(x => `${x.type === "Tel" ? "เบอร์" : x.type}: ${x.value}${x.name ? ` (${x.name})` : ""}`).join(", ") : "",
      contacts: inf?.contacts ? [...inf.contacts] : [],
      rawCost: applyStandardPricing(inf),
      creditTerm: "",
      paymentType: "",
      paymentTerm: { main: "", sub1: "", sub2: "" },
      services: {},
      scopeOfWork: brief.groups?.find(g => g.id === currentGroupId)?.sows?.[0]?.id || "",
      detail: "",
      condition: "1. แก้ไขดราฟได้สูงสุดกี่ครั้ง =\n2. ใส่ # สูงสุดได้กี่อัน =\n3. ใส่ Text/AW/Logo ในชิ้นงานได้หรือไม่ =\n4. ระยะเวลาทำ Script/Idea  =\n5. ระยะเวลาทำ Draft = \n6. ลบโพสต์หรือไม่ = ",
      brandSupports: {},
      competitorNote: "",
      note: "",
      internalStatus: "Pitching",
      postingStatus: "Pending",
      clientStatus: "Pending"
    };

    const newData = {
      ...currentData,
      influencers: [...currentData.influencers, newInfluencer].sort((a, b) => {
        const nameA = (a.accountName || "").toLowerCase();
        const nameB = (b.accountName || "").toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      })
    };
    const newTrackers = {
      ...groupTrackers,
      [currentGroupId]: newData
    };
    setGroupTrackers(newTrackers);
    onUpdateBrief({ ...brief, groupTrackers: newTrackers });
  };

  React.useEffect(() => {
    if (setHeaderActions) {
      if (readOnly) {
        setHeaderActions(null);
        return;
      }
      setHeaderActions(
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            disabled={eligibleForLot.length === 0}
            onClick={() => setIsSubmitLotModalOpen(true)}
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
          >
            Submit Lot to Planner {eligibleForLot.length > 0 && `(${eligibleForLot.length})`}
          </Button>
          {activeGroups.length > 0 && brief.internalStatus !== "Rate Card List Confirmed" && (
            <Button 
              onClick={handleConfirmRateCardList}
              disabled={!isFinishWorkEnabled}
            >
              Finish work
            </Button>
          )}
        </div>
      );
      
      return () => setHeaderActions(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eligibleForLot.length, activeGroups.length, brief.internalStatus, isFinishWorkEnabled, setHeaderActions, readOnly]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
      <div className="flex flex-col gap-6">
        <div className="w-full space-y-6 min-w-0">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm p-6 lg:p-8">
            <div className="mb-6 border-b border-slate-100 pb-6 flex flex-wrap gap-4 items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Rate card list</h1>
                <p className="text-slate-500 mt-1">{brief.campaignName} • {brief.id}</p>
              </div>

              {!setHeaderActions && !readOnly && (
                <div className="flex flex-wrap items-center gap-3">
                  <Button 
                    variant="outline" 
                    disabled={eligibleForLot.length === 0}
                    onClick={() => setIsSubmitLotModalOpen(true)}
                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                  >
                    Submit Lot to Planner {eligibleForLot.length > 0 && `(${eligibleForLot.length})`}
                  </Button>
                  {activeGroups.length > 0 && brief.internalStatus !== "Rate Card List Confirmed" && (
                    <Button 
                      onClick={handleConfirmRateCardList}
                      disabled={!isFinishWorkEnabled}
                    >
                      Finish work
                    </Button>
                  )}
                </div>
              )}

              {!setHeaderActions && readOnly && (
                <div className="flex flex-wrap items-center gap-3">
                  <Button 
                    onClick={() => onUpdateBrief({ ...brief, activeTab: "dealsheet" })}
                  >
                    เริ่มสร้าง Dealsheet
                  </Button>
                </div>
              )}
            </div>

            {activeGroups.length === 0 ? (
              <div className="text-center py-16 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                <p className="text-slate-600">Please go back to "Recap & Group Setup" to create groups.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {activeGroups.map(grp => {
                  const grpData = groupTrackers[grp.id] || { influencers: [] };
                  const displayInfluencers = readOnly 
                    ? grpData.influencers.filter(inf => inf.lot)
                    : grpData.influencers;
                  const displayTrackerData = { ...grpData, influencers: displayInfluencers };

                  return (
                    <TrackerTable 
                      key={grp.id}
                      group={grp}
                      groupName={grp.name}
                      brief={brief}
                      trackerData={displayTrackerData}
                      onUpdateTracker={(newData) => {
                        let updatedInfluencers = newData.influencers;
                        if (readOnly) {
                          const hiddenInfluencers = grpData.influencers.filter(inf => !inf.lot);
                          updatedInfluencers = [...updatedInfluencers, ...hiddenInfluencers];
                        }
                        const newTrackers = { ...groupTrackers, [grp.id]: { ...newData, influencers: updatedInfluencers } };
                        setGroupTrackers(newTrackers);
                        onUpdateBrief({ ...brief, groupTrackers: newTrackers });
                      }}
                      onAddClick={(groupId) => handleAddInfluencerClick(grp.id)}
                      onReplaceClick={(groupName, infId, infName) => handleReplaceInfluencerClick(grp.id, infId, infName)}
                      readOnly={readOnly}
                      allowStatusEdit={isBriefManagement ? true : !readOnly}
                      hideAddButton={readOnly}
                      allowReorder={!readOnly}
                      isBriefManagement={isBriefManagement}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectModalOpen && (
          <InfluencerSelectModal 
            open={selectModalOpen} 
            onClose={() => setSelectModalOpen(false)} 
            onSelect={handleSelectInfluencer} 
          />
        )}
      </AnimatePresence>

      {isSubmitLotModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Confirm Submit Lot to Planner</h3>
              <p className="text-sm text-slate-500 mt-1">You are about to assign <span className="font-bold text-indigo-600">Lot {nextLotNumber}</span> to {eligibleForLot.length} influencer{eligibleForLot.length > 1 && 's'} across all groups.</p>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-3">
                {eligibleForLot.map((inf, idx) => (
                  <div key={inf.id || idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <img src={inf.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(inf.accountName || "New")}&background=random`} alt="" className="h-10 w-10 rounded-full object-cover shadow-sm border border-slate-200" />
                    <div className="font-semibold text-sm text-slate-900">{inf.accountName || "New Influencer"}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
              <button 
                onClick={() => setIsSubmitLotModalOpen(false)}
                className="px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <Button onClick={handleSubmitLot}>
                Confirm Submit Lot {nextLotNumber}
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
