import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import TrackerTable from "./TrackerTable";
import ActivityTimeline from "../common/ActivityTimeline";
import GroupSelectionModal from "./GroupSelectionModal";
import InfluencerSelectModal from "./InfluencerSelectModal";

export default function PlannerTrackerPage({ brief, onUpdateBrief }) {
  const [groupTrackers, setGroupTrackers] = useState(brief.groupTrackers || {});
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [selectGroupModalOpen, setSelectGroupModalOpen] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [replacingInfInfo, setReplacingInfInfo] = useState(null);

  const activeGroups = Object.keys(groupTrackers);

  const handleConfirmGroups = (groups) => {
    const newTrackers = { ...groupTrackers };
    groups.forEach(g => {
      if (!newTrackers[g]) newTrackers[g] = { influencers: [] };
    });
    // Remove groups that were unselected
    Object.keys(newTrackers).forEach(g => {
      if (!groups.includes(g)) delete newTrackers[g];
    });
    
    setGroupTrackers(newTrackers);
    onUpdateBrief({ ...brief, groupTrackers: newTrackers });
    setSelectGroupModalOpen(false);
  };

  const handleConfirmPillar = () => {
    const log = {
      date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action: "Sales confirmed Pillar",
      details: "Pillar structure confirmed by Sales."
    };
    onUpdateBrief({
      ...brief,
      internalStatus: "Pillar Confirmed",
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
        contact: "",
        rawCost: inf?.rawCost ? inf.rawCost.replace(/[^0-9]/g, "") : "",
        creditTerm: "",
        paymentType: "",
        services: {},
        scopeOfWork: "",
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
        influencers: currentData.influencers.map(i => i.id === infId ? { ...i, contactStatus: "ถูกแทนที่" } : i).concat(newInfluencer)
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
      contact: "",
      rawCost: inf?.rawCost ? inf.rawCost.replace(/[^0-9]/g, "") : "",
      creditTerm: "",
      paymentType: "",
      services: {},
      scopeOfWork: "",
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
      influencers: [...(currentData.influencers || []), newInfluencer]
    };
    const newTrackers = {
      ...groupTrackers,
      [currentGroupId]: newData
    };
    setGroupTrackers(newTrackers);
    onUpdateBrief({ ...brief, groupTrackers: newTrackers });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4 space-y-6 min-w-0">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm p-6 lg:p-8">
            <div className="mb-6 border-b border-slate-100 pb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Rate card list</h1>
                <p className="text-slate-500 mt-1">{brief.campaignName} • {brief.id}</p>
              </div>
            </div>

            {activeGroups.length === 0 ? (
              <div className="text-center py-16 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                <p className="mb-4 text-slate-600">Please select groups to start assigning influencers.</p>
                <Button onClick={() => setSelectGroupModalOpen(true)}>Select Group</Button>
              </div>
            ) : (
              <div className="space-y-8">
                {activeGroups.map(grp => (
                  <TrackerTable 
                    key={grp}
                    groupName={grp}
                    brief={brief}
                    trackerData={groupTrackers[grp] || { influencers: [] }}
                    onUpdateTracker={(newData) => {
                      const newTrackers = { ...groupTrackers, [grp]: newData };
                      setGroupTrackers(newTrackers);
                      onUpdateBrief({ ...brief, groupTrackers: newTrackers });
                    }}
                    onAddClick={handleAddInfluencerClick}
                    onReplaceClick={handleReplaceInfluencerClick}
                    readOnly={true}
                    allowStatusEdit={true}
                    hideAddButton={true}
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
                {activeGroups.length === 0 ? (
                  <Button className="w-full" onClick={() => setSelectGroupModalOpen(true)}>Select Group</Button>
                ) : (
                  <>
                    {brief.internalStatus !== "Pillar Confirmed" && (
                      <Button className="w-full" onClick={handleConfirmPillar}>Confirm Pillar</Button>
                    )}
                    <Button variant="secondary" className="w-full" onClick={() => setSelectGroupModalOpen(true)}>Edit Groups</Button>
                  </>
                )}
              </div>
            </div>
            <ActivityTimeline logs={brief.activityLog || []} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectGroupModalOpen && (
          <GroupSelectionModal 
            open={selectGroupModalOpen} 
            onClose={() => setSelectGroupModalOpen(false)} 
            onConfirm={handleConfirmGroups} 
            initialSelected={activeGroups}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectModalOpen && (
          <InfluencerSelectModal 
            open={selectModalOpen} 
            onClose={() => setSelectModalOpen(false)} 
            onSelect={handleSelectInfluencer} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
