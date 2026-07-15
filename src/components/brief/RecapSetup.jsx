import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp } from "lucide-react";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { transformBriefSowsToRecapGroups } from "../../utils/briefHelpers";
import InfluencerDetails from "../../features/briefs/components/shared/InfluencerDetails";
import InfluencerDetailModal from "../../features/briefs/components/InfluencerDetailModal";
import SowDetails from "../../features/briefs/components/shared/SowDetails";

export default function RecapSetup({ brief, onUpdateBrief, onNext }) {
  const [groups, setGroups] = useState(() => {
    const getArray = (val) => Array.isArray(val) ? val : (val ? [val] : []);

    if (brief.groups && brief.groups.length > 0) {
      return brief.groups.map(g => {
        const defaultDemo = [];
        if (brief.gender?.length) defaultDemo.push(...brief.gender);
        if (brief.ageRange?.length) defaultDemo.push(...brief.ageRange);
        if (!defaultDemo.length && brief.demographic) defaultDemo.push(...getArray(brief.demographic));

        return {
          ...g,
          totalInfluencers: g.totalInfluencers || brief.totalInfluencers || "",
          followerRequirement: g.followerRequirement || brief.followerRequirement || "",
          persona: {
            demographic: getArray(g.persona?.demographic?.length ? g.persona.demographic : defaultDemo),
            location: getArray(g.persona?.location?.length ? g.persona.location : (brief.province ? [brief.province] : brief.location)),
            occupation: getArray(g.persona?.occupation?.length ? g.persona.occupation : (brief.infOccupation ? [brief.infOccupation] : brief.occupation)),
            persona: getArray(g.persona?.persona?.length ? g.persona.persona : (brief.infPersona ? [brief.infPersona] : brief.persona)),
            contentCategory: getArray(g.persona?.contentCategory?.length ? g.persona.contentCategory : (brief.infContent ? [brief.infContent] : brief.contentCategory)),
            storyTelling: getArray(g.persona?.storyTelling?.length ? g.persona.storyTelling : brief.storyTelling)
          }
        };
      });
    }
    
    // Auto-transform Brief's SOW -> Group into Recap's Group -> SOW hierarchy
    const sows = brief.budgetOptions?.[0]?.scopeOfWorks || [];
    return transformBriefSowsToRecapGroups(sows);
  });

  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editingGroupDetailsId, setEditingGroupDetailsId] = useState(null);
  const [editingSow, setEditingSow] = useState(null);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const packageType = brief.packageType ? (Array.isArray(brief.packageType) ? brief.packageType[0] : brief.packageType) : "";

  const toggleGroup = (groupId) => {
    setCollapsedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  useEffect(() => {
    if (!brief.groups || brief.groups.length === 0) {
      onUpdateBrief({ ...brief, groups });
    }
  }, [groups, brief, onUpdateBrief]);

  const handleUpdateGroup = (groupId, updates) => {
    const updatedGroups = groups.map(g => g.id === groupId ? { ...g, ...updates } : g);
    setGroups(updatedGroups);
    onUpdateBrief({ ...brief, groups: updatedGroups });
  };

  const handleUpdatePillars = (groupId, field, value) => {
    const updatedGroups = groups.map(g => {
      if (g.id === groupId) {
        return { ...g, pillars: { ...g.pillars, [field]: value } };
      }
      return g;
    });
    setGroups(updatedGroups);
    onUpdateBrief({ ...brief, groups: updatedGroups });
  };

  const handleUpdateSow = (groupId, sowId, field, value) => {
    const updatedGroups = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          sows: g.sows.map(s => s.id === sowId ? { ...s, [field]: value } : s)
        };
      }
      return g;
    });
    setGroups(updatedGroups);
    onUpdateBrief({ ...brief, groups: updatedGroups });
  };

  const handleUpdateServiceScope = (groupId, sowId, field, value) => {
    const updatedGroups = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          sows: g.sows.map(s => s.id === sowId ? { 
            ...s, 
            serviceScope: { ...(s.serviceScope || {}), [field]: value } 
          } : s)
        };
      }
      return g;
    });
    setGroups(updatedGroups);
    onUpdateBrief({ ...brief, groups: updatedGroups });
  };

  const handleAddGroup = () => {
    const newGroup = {
      id: `group_${Date.now()}`,
      name: `New Group ${groups.length + 1}`,
      sows: [],
      persona: {
        demographic: [],
        location: [],
        occupation: [],
        persona: [],
        contentCategory: [],
        storyTelling: []
      }
    };
    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    onUpdateBrief({ ...brief, groups: updatedGroups });
    setEditingGroupDetailsId(newGroup.id);
  };

  const handleAddSow = (groupId) => {
    const newSow = {
      id: `sow_${Date.now()}`,
      name: `New Scope`,
      contentType: [],
      platforms: [],
      serviceScope: {}
    };
    const updatedGroups = groups.map(g => {
      if (g.id === groupId) {
        return { ...g, sows: [...(g.sows || []), newSow] };
      }
      return g;
    });
    setGroups(updatedGroups);
    onUpdateBrief({ ...brief, groups: updatedGroups });
    setEditingSow({ groupId, sowId: newSow.id });
  };

  const isNextDisabled = () => {
    if (!groups || groups.length === 0) return true;
    for (const group of groups) {
      if (!group.sows || group.sows.length === 0) continue;
      for (const sow of group.sows) {
        const sc = sow.serviceScope;
        if (!sc) continue;
        
        if (sc.buyoutRequired && (!sc.buyoutDuration || sc.buyoutDuration.length === 0)) return true;
        if (sc.boostPostRequired && (!sc.boostPostDuration || sc.boostPostDuration.length === 0)) return true;
        if (sc.addAdsRequired && (!sc.addAdsDuration || sc.addAdsDuration.length === 0)) return true;
        if (sc.paidPartnershipRequired && (!sc.paidPartnershipDuration || sc.paidPartnershipDuration.length === 0)) return true;
        if (sc.discoveryRequired && (!sc.discoveryDuration || sc.discoveryDuration.length === 0)) return true;
        if (sc.genCodeRequired && (!sc.genCodeDuration || sc.genCodeDuration.length === 0)) return true;
        if (sc.brandedContentRequired && (!sc.brandedContentDuration || sc.brandedContentDuration.length === 0)) return true;
        if (sc.whitelistingRequired && (!sc.whitelistingDuration || sc.whitelistingDuration.length === 0)) return true;
      }
    }
    return false;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 relative items-start">
      <div className="w-full lg:w-3/4 min-w-0 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4 mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Recap & Group Setup</h3>
            <p className="text-sm text-slate-500 mt-1">Review and modify groups, pillars, and scopes of work.</p>
          </div>
        </div>

        <div className="space-y-6">
        {groups.map((group, gIndex) => {
          const isCollapsed = collapsedGroups[group.id];
          return (
          <div key={group.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-200">
            <div 
              className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => toggleGroup(group.id)}
            >
              <div className="flex items-center gap-3">
                {editingGroupId === group.id ? (
                  <input
                    type="text"
                    value={group.name}
                    onChange={(e) => handleUpdateGroup(group.id, { name: e.target.value })}
                    onBlur={() => setEditingGroupId(null)}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                    className="border border-[#6D5DF6] rounded px-2 py-1 text-sm outline-none font-bold"
                  />
                ) : (
                  <h4 className="text-md font-bold text-slate-800 flex items-center gap-2">
                    {group.name}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingGroupId(group.id); }} 
                      className="text-slate-400 hover:text-[#6D5DF6]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </h4>
                )}
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
              </button>
            </div>

            {!isCollapsed && (
              <div className="p-6 space-y-8 animate-in slide-in-from-top-2 fade-in duration-200">
              {/* Group Influencer Details */}
              <div>
                <h5 className="text-sm font-bold text-slate-700 mb-3 border-l-4 border-[#6D5DF6] pl-2 uppercase flex justify-between items-center">
                  <span>Influencer Details</span>
                  <button onClick={() => setEditingGroupDetailsId(group.id)} className="text-slate-400 hover:text-[#6D5DF6]">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </h5>
                <InfluencerDetails 
                  value={group} 
                  onChange={() => {}} 
                  editable={false} 
                  showSuggestionSource={true} 
                />
              </div>

              {/* Scope of Works under Group */}
              <div>
                <h5 className="text-sm font-bold text-slate-700 border-l-4 border-emerald-500 pl-2 mb-3">Scope of Work Details</h5>
                <div className="space-y-6">
                  {group.sows && group.sows.map((sow, index) => (
                    <div key={sow.id}>
                      <SowDetails 
                        sow={sow}
                        index={index}
                        packageType={packageType}
                        editable={false}
                        onChange={() => {}}
                        onEdit={() => setEditingSow({ groupId: group.id, sowId: sow.id })}
                        initialCollapsed={true}
                      />
                    </div>
                  ))}
                  <div className="mt-4 flex justify-center">
                    <Button 
                      variant="outline" 
                      className="text-sm font-medium border-dashed border-slate-300 text-slate-500 hover:text-[#6D5DF6] hover:border-[#6D5DF6] hover:bg-[#6D5DF6]/5 py-2 px-4"
                      onClick={() => handleAddSow(group.id)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Scope of Work
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        )})}
        <div className="mt-6 flex justify-center">
          <Button 
            variant="outline" 
            className="w-full py-4 text-sm font-bold border-dashed border-2 border-slate-300 text-slate-500 hover:text-[#6D5DF6] hover:border-[#6D5DF6] hover:bg-[#6D5DF6]/5"
            onClick={handleAddGroup}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Group
          </Button>
        </div>
        </div>
      </div>

      {/* Right Column (Actions Sidebar) */}
      <div className="w-full lg:w-1/4 shrink-0 text-sm">
        <div className="sticky top-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-3xs p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Brief Status & Actions</h3>
            <div className="flex flex-col gap-3">
              {isNextDisabled() && (
                <span className="text-xs font-medium text-rose-500 text-center bg-rose-50 px-2 py-1.5 rounded-lg border border-rose-100">
                  * Please fill required duration fields
                </span>
              )}
              <Button 
                onClick={onNext} 
                className="w-full py-3 text-base font-bold bg-[#6D5DF6] hover:bg-[#5b4dcc] text-white"
              >
                Start Example List
              </Button>
            </div>
          </div>
        </div>
      </div>


      {/* Edit Group Influencer Details Modal */}
      {editingGroupDetailsId && (
        <InfluencerDetailModal 
          open={true}
          onClose={() => setEditingGroupDetailsId(null)}
          initialData={groups.find(g => g.id === editingGroupDetailsId)}
          onSave={(data) => {
            handleUpdateGroup(editingGroupDetailsId, data);
            setEditingGroupDetailsId(null);
          }}
        />
      )}

      {/* Edit SOW Details Modal */}
      {editingSow && (
        <Modal 
          isOpen={true} 
          onClose={() => setEditingSow(null)}
          title="Edit Scope of Work"
          maxWidth="max-w-4xl"
        >
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
            {(() => {
              const activeGroup = groups.find(g => g.id === editingSow.groupId);
              const activeSow = activeGroup?.sows?.find(s => s.id === editingSow.sowId);
              if (!activeSow) return null;
              
              return (
                <SowDetails 
                  sow={activeSow}
                  packageType={packageType}
                  editable={true}
                  onChange={(category, field, val) => {
                    if (category === "sow") handleUpdateSow(editingSow.groupId, editingSow.sowId, field, val);
                    else if (category === "serviceScope") handleUpdateServiceScope(editingSow.groupId, editingSow.sowId, field, val);
                  }}
                />
              );
            })()}
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-100 p-4 bg-white shrink-0">
            <button type="button" onClick={() => setEditingSow(null)} className="rounded-lg bg-[#6D5DF6] px-5 py-2 text-sm font-semibold text-white hover:bg-[#5b4df0] shadow-sm">Done</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
