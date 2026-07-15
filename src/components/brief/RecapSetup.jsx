import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import Button from "../common/Button";
import { transformBriefSowsToRecapGroups } from "../../utils/briefHelpers";
import GroupFormFields from "../../features/briefs/components/shared/forms/GroupFormFields";
import SowFormFields from "../../features/briefs/components/shared/forms/SowFormFields";
import ServiceScopeFormFields from "../../features/briefs/components/shared/forms/ServiceScopeFormFields";
import BrandSupportFormFields from "../../features/briefs/components/shared/forms/BrandSupportFormFields";
import TravelDetailsFormFields from "../../features/briefs/components/shared/forms/TravelDetailsFormFields";

export default function RecapSetup({ brief, onUpdateBrief, onNext }) {
  const [groups, setGroups] = useState(() => {
    if (brief.groups && brief.groups.length > 0) return brief.groups;
    
    // Auto-transform Brief's SOW -> Group into Recap's Group -> SOW hierarchy
    const sows = brief.budgetOptions?.[0]?.scopeOfWorks || [];
    return transformBriefSowsToRecapGroups(sows);
  });

  const [editingGroupId, setEditingGroupId] = useState(null);
  const packageType = brief.packageType ? (Array.isArray(brief.packageType) ? brief.packageType[0] : brief.packageType) : "";

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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Recap & Group Setup</h3>
          <p className="text-sm text-slate-500 mt-1">Review and modify groups, pillars, and scopes of work.</p>
        </div>
      </div>

      <div className="space-y-6">
        {groups.map((group, gIndex) => (
          <div key={group.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                {editingGroupId === group.id ? (
                  <input
                    type="text"
                    value={group.name}
                    onChange={(e) => handleUpdateGroup(group.id, { name: e.target.value })}
                    onBlur={() => setEditingGroupId(null)}
                    autoFocus
                    className="border border-[#6D5DF6] rounded px-2 py-1 text-sm outline-none font-bold"
                  />
                ) : (
                  <h4 className="text-md font-bold text-slate-800 flex items-center gap-2">
                    {group.name}
                    <button onClick={() => setEditingGroupId(group.id)} className="text-slate-400 hover:text-[#6D5DF6]">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </h4>
                )}
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Group Pillars */}
              <div>
                <h5 className="text-sm font-bold text-slate-700 mb-3 border-l-4 border-[#6D5DF6] pl-2 uppercase">Group Pillars & Details</h5>
                <GroupFormFields 
                  pillars={group.pillars} 
                  onChange={(field, val) => handleUpdatePillars(group.id, field, val)} 
                />
              </div>

              {/* Scope of Works under Group */}
              <div>
                <h5 className="text-sm font-bold text-slate-700 border-l-4 border-emerald-500 pl-2 mb-3">Scope of Work Details</h5>
                <div className="space-y-6">
                  {group.sows && group.sows.map((sow, index) => (
                    <div key={sow.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-slate-50 p-6 relative">
                      <h4 className="mb-6 text-base font-semibold text-slate-900 border-b border-slate-200 pb-2">Scope {index + 1}</h4>
                      
                      <SowFormFields 
                        scope={sow} 
                        onChange={(field, val) => handleUpdateSow(group.id, sow.id, field, val)} 
                        onUpdateServiceScope={(field, val) => handleUpdateServiceScope(group.id, sow.id, field, val)} 
                      />

                      <ServiceScopeFormFields 
                        scope={sow} 
                        packageType={packageType} 
                        onChange={(field, val) => handleUpdateServiceScope(group.id, sow.id, field, val)} 
                      />

                      <BrandSupportFormFields 
                        scope={sow} 
                        onChange={(field, val) => handleUpdateSow(group.id, sow.id, field, val)} 
                      />

                      <TravelDetailsFormFields 
                        scope={sow} 
                        packageType={packageType} 
                        onChange={(field, val) => handleUpdateSow(group.id, sow.id, field, val)} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100 mt-8">
        <Button 
          onClick={onNext} 
          disabled={isNextDisabled()} 
          className={isNextDisabled() ? "bg-slate-300 text-slate-500 cursor-not-allowed px-8" : "bg-[#6D5DF6] hover:bg-[#5b4dcc] text-white px-8"}
        >
          {isNextDisabled() ? "Please fill required duration fields" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
