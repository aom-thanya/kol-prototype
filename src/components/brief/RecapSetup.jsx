import React, { useState } from "react";
import { Plus, X, Trash2, Edit2, ChevronDown, Check, Copy } from "lucide-react";
import { formatCurrency } from "../../utils/formatHelpers";
import MultiSelect from "../common/MultiSelect";
import SimpleHtmlEditor from "../common/SimpleHtmlEditor";
import { generateScopeName } from "../../utils/briefHelpers";

export default function RecapSetup({ brief, onUpdateBrief, onNext }) {
  const [groups, setGroups] = useState(brief.groups || []);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");

  const defaultPillars = ["Travel", "Fashion", "Daily Life", "Restaurant", "Cooking", "Cafe", "Beauty", "Tech", "Lifestyle"];
  const platformOptions = ["TikTok", "Instagram", "Facebook", "YouTube"];

  const handleAddGroup = () => {
    const newGroup = {
      id: `group_${Date.now()}`,
      name: newGroupName || `Group ${groups.length + 1}`,
      pillars: {
        demographic: [],
        location: [],
        occupation: [],
        persona: [],
        contentCategory: [],
        storyTelling: []
      },
      sows: []
    };
    const updated = [...groups, newGroup];
    setGroups(updated);
    onUpdateBrief({ ...brief, groups: updated });
    setNewGroupName("");
  };

  const handleDeleteGroup = (id) => {
    const updated = groups.filter(g => g.id !== id);
    setGroups(updated);
    onUpdateBrief({ ...brief, groups: updated });
  };

  const handleUpdateGroup = (id, updates) => {
    const updated = groups.map(g => g.id === id ? { ...g, ...updates } : g);
    setGroups(updated);
    onUpdateBrief({ ...brief, groups: updated });
  };

  const handleUpdatePillars = (groupId, key, value) => {
    const updated = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          pillars: { ...(g.pillars || {}), [key]: value }
        };
      }
      return g;
    });
    setGroups(updated);
    onUpdateBrief({ ...brief, groups: updated });
  };

  const handleAddSow = (groupId) => {
    const updated = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          sows: [...g.sows, {
            id: `sow_${Date.now()}`,
            name: "",
            platforms: [],
            contentType: [],
            notes: "",
            allocation: "",
            numInfluencers: "",
            followerReqFrom: "",
            followerReqTo: "",
            details: "",
            serviceScope: {}
          }]
        };
      }
      return g;
    });
    setGroups(updated);
    onUpdateBrief({ ...brief, groups: updated });
  };

  const handleUpdateSow = (groupId, sowId, updates) => {
    const updated = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          sows: g.sows.map(s => {
            if (s.id === sowId) {
              const updatedSow = { ...s, ...updates };
              if ('name' in updates) updatedSow.isCustomName = true;
              
              if (!updatedSow.isCustomName) {
                updatedSow.name = generateScopeName(updatedSow.platforms || [], updatedSow.contentType || [], updatedSow.serviceScope || {});
              }
              return updatedSow;
            }
            return s;
          })
        };
      }
      return g;
    });
    setGroups(updated);
    onUpdateBrief({ ...brief, groups: updated });
  };

  const handleUpdateServiceScope = (groupId, sowId, key, value) => {
    const updated = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          sows: g.sows.map(s => {
            if (s.id === sowId) {
              const updatedServiceScope = { ...(s.serviceScope || {}), [key]: value };
              const updatedSow = { ...s, serviceScope: updatedServiceScope };
              if (!updatedSow.isCustomName) {
                updatedSow.name = generateScopeName(updatedSow.platforms || [], updatedSow.contentType || [], updatedSow.serviceScope || {});
              }
              return updatedSow;
            }
            return s;
          })
        };
      }
      return g;
    });
    setGroups(updated);
    onUpdateBrief({ ...brief, groups: updated });
  };
  const handleDuplicateSow = (groupId, sow) => {
    const updated = groups.map(g => {
      if (g.id === groupId) {
        const duplicatedSow = { 
          ...sow, 
          id: `sow-${Date.now()}` 
        };
        return {
          ...g,
          sows: [...g.sows, duplicatedSow]
        };
      }
      return g;
    });
    setGroups(updated);
    onUpdateBrief({ ...brief, groups: updated });
  };

  const handleDeleteSow = (groupId, sowId) => {
    const updated = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          sows: g.sows.filter(s => s.id !== sowId)
        };
      }
      return g;
    });
    setGroups(updated);
    onUpdateBrief({ ...brief, groups: updated });
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
          <p className="text-sm text-slate-500 mt-1">Create groups, assign pillars, define requirements, and add scopes of work.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <input
            type="text"
            placeholder="Enter group name (e.g., Lifestyle)"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#6D5DF6]"
          />
          <button
            onClick={handleAddGroup}
            className="flex items-center gap-2 bg-[#6D5DF6] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#5a4add]"
          >
            <Plus className="w-4 h-4" /> Add Group
          </button>
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
                <button onClick={() => handleDeleteGroup(group.id)} className="text-rose-500 hover:text-rose-700 p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                <div>
                  <h5 className="text-sm font-bold text-slate-700 mb-3 border-l-4 border-[#6D5DF6] pl-2 uppercase">Step 2.2: 6 Pillars</h5>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500">Demographic</label>
                      <MultiSelect 
                        value={group.pillars?.demographic || []} 
                        onChange={val => handleUpdatePillars(group.id, 'demographic', val)} 
                        options={["Male", "Female", "LGBTQ+", "Gen Z", "Millennials", "Gen X"]} 
                        placeholder="เลือก" 
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500">Location</label>
                      <MultiSelect 
                        value={group.pillars?.location || []} 
                        onChange={val => handleUpdatePillars(group.id, 'location', val)} 
                        options={["Bangkok", "Upcountry", "Urban", "Rural", "Chiang Mai", "Phuket"]} 
                        placeholder="เลือก" 
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500">Occupation</label>
                      <MultiSelect 
                        value={group.pillars?.occupation || []} 
                        onChange={val => handleUpdatePillars(group.id, 'occupation', val)} 
                        options={["Student", "First Jobber", "Office Worker", "Freelance", "Business Owner", "Housewife"]} 
                        placeholder="เลือก" 
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500">Persona</label>
                      <MultiSelect 
                        value={group.pillars?.persona || []} 
                        onChange={val => handleUpdatePillars(group.id, 'persona', val)} 
                        options={["Fashionista", "Foodie", "Traveler", "Tech Geek", "Fitness Enthusiast", "Beauty Guru"]} 
                        placeholder="เลือก" 
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500">Content Category</label>
                      <MultiSelect 
                        value={group.pillars?.contentCategory || []} 
                        onChange={val => handleUpdatePillars(group.id, 'contentCategory', val)} 
                        options={["Lifestyle", "Fashion", "Beauty", "Food", "Travel", "Technology", "Gaming"]} 
                        placeholder="เลือก" 
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500">Story Telling</label>
                      <MultiSelect 
                        value={group.pillars?.storyTelling || []} 
                        onChange={val => handleUpdatePillars(group.id, 'storyTelling', val)} 
                        options={["Soft-sell", "Hard-sell", "Review", "Daily Vlog", "Tutorial", "Unboxing"]} 
                        placeholder="เลือก" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-sm font-bold text-slate-700 border-l-4 border-emerald-500 pl-2">Step 2.3: Scopes of Work (SOW)</h5>
                    <button
                      onClick={() => handleAddSow(group.id)}
                      className="text-xs font-bold text-[#6D5DF6] hover:bg-violet-50 px-3 py-1.5 rounded-lg border border-[#6D5DF6] flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add SOW
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {group.sows.map((sow, sIndex) => (
                      <div key={sow.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">SOW {sIndex + 1}</span>
                          <button onClick={() => handleDeleteSow(group.id, sow.id)} className="text-rose-400 hover:text-rose-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-4 space-y-6 bg-white">
                          <div className="grid gap-6 md:grid-cols-2 mb-8">
                            <div className="md:col-span-2">
                              <label className="mb-2 block text-sm font-medium text-slate-700">Platform</label>
                              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-4">
                                {["TikTok", "Instagram", "Facebook", "Facebook Page", "YouTube", "X"].map(plat => (
                                  <label key={plat} className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                      type="radio" 
                                      name={`platform-${group.id}-${sow.id}`}
                                      checked={Array.isArray(sow.platforms) && sow.platforms.includes(plat)} 
                                      onChange={() => {
                                        handleUpdateSow(group.id, sow.id, { platforms: [plat] });
                                      }} 
                                      className="h-4 w-4 border-slate-300 text-[#6D5DF6] focus:ring-[#6D5DF6]" 
                                    />
                                    <span className="text-sm text-slate-700">{plat}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className="mb-1 block text-sm font-medium text-slate-700">Content Type</label>
                              <MultiSelect 
                                value={sow.contentType || []} 
                                onChange={val => handleUpdateSow(group.id, sow.id, { contentType: val })} 
                                options={["Video", "Photo", "Reel", "Shorts", "Album", "Live", "Stories", "Photo Set", "Link", "Text/Thread", "Carousel", "Post"]} 
                                placeholder="Select content types"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <h5 className="mb-3 text-sm font-semibold text-slate-900 pt-2 border-t border-slate-200">Service Scope</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="md:col-span-2 lg:col-span-3 mb-2">
                                  <label className="mb-1 block text-sm font-medium text-slate-700">Via</label>
                                  <MultiSelect 
                                    value={sow.via || []} 
                                    onChange={val => handleUpdateSow(group.id, sow.id, { via: val })} 
                                    options={["TikTok", "Instagram", "Facebook", "Facebook Page", "YouTube", "X"]} 
                                    placeholder="Select Platforms"
                                  />
                                </div>
                                <div>
                                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                                    <input type="checkbox" checked={sow.serviceScope?.buyoutRequired || false} onChange={e => handleUpdateServiceScope(group.id, sow.id, 'buyoutRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                    <span className="text-sm font-medium text-slate-700">Buyout</span>
                                  </label>
                                  {sow.serviceScope?.buyoutRequired && (
                                    <div className="pl-6">
                                      <MultiSelect value={sow.serviceScope?.buyoutDuration || []} onChange={val => handleUpdateServiceScope(group.id, sow.id, 'buyoutDuration', val)} options={["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                    </div>
                                  )}
                                </div>
                                {(Array.isArray(sow.platforms) ? sow.platforms : (sow.platforms ? [sow.platforms] : [])).some(p => ["Facebook", "Facebook Page", "Instagram", "TikTok"].includes(p)) && (
                                  <div>
                                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                                      <input type="checkbox" checked={sow.serviceScope?.boostPostRequired || false} onChange={e => handleUpdateServiceScope(group.id, sow.id, 'boostPostRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                      <span className="text-sm font-medium text-slate-700">Boost by Page</span>
                                    </label>
                                    {sow.serviceScope?.boostPostRequired && (
                                      <div className="pl-6">
                                        <MultiSelect value={sow.serviceScope?.boostPostDuration || []} onChange={val => handleUpdateServiceScope(group.id, sow.id, 'boostPostDuration', val)} options={["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                      </div>
                                    )}
                                  </div>
                                )}
                                {(Array.isArray(sow.platforms) ? sow.platforms : (sow.platforms ? [sow.platforms] : [])).some(p => ["Facebook", "Facebook Page", "Instagram", "TikTok", "YouTube", "X"].includes(p)) && (
                                  <div>
                                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                                      <input type="checkbox" checked={sow.serviceScope?.addAdsRequired || false} onChange={e => handleUpdateServiceScope(group.id, sow.id, 'addAdsRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                      <span className="text-sm font-medium text-slate-700">Add Ads</span>
                                    </label>
                                    {sow.serviceScope?.addAdsRequired && (
                                      <div className="pl-6">
                                        <MultiSelect value={sow.serviceScope?.addAdsDuration || []} onChange={val => handleUpdateServiceScope(group.id, sow.id, 'addAdsDuration', val)} options={["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                      </div>
                                    )}
                                  </div>
                                )}
                                {(Array.isArray(sow.platforms) ? sow.platforms : (sow.platforms ? [sow.platforms] : [])).some(p => ["Facebook", "Facebook Page", "Instagram", "TikTok"].includes(p)) && (
                                  <div>
                                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                                      <input type="checkbox" checked={sow.serviceScope?.paidPartnershipRequired || false} onChange={e => handleUpdateServiceScope(group.id, sow.id, 'paidPartnershipRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                      <span className="text-sm font-medium text-slate-700">Paid Partnership</span>
                                    </label>
                                    {sow.serviceScope?.paidPartnershipRequired && (
                                      <div className="pl-6">
                                        <MultiSelect value={sow.serviceScope?.paidPartnershipDuration || []} onChange={val => handleUpdateServiceScope(group.id, sow.id, 'paidPartnershipDuration', val)} options={["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                      </div>
                                    )}
                                  </div>
                                )}
                                {(Array.isArray(sow.platforms) ? sow.platforms : (sow.platforms ? [sow.platforms] : [])).includes("YouTube") && (
                                  <div>
                                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                                      <input type="checkbox" checked={sow.serviceScope?.discoveryRequired || false} onChange={e => handleUpdateServiceScope(group.id, sow.id, 'discoveryRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                      <span className="text-sm font-medium text-slate-700">Youtube Discovery</span>
                                    </label>
                                    {sow.serviceScope?.discoveryRequired && (
                                      <div className="pl-6">
                                        <MultiSelect value={sow.serviceScope?.discoveryDuration || []} onChange={val => handleUpdateServiceScope(group.id, sow.id, 'discoveryDuration', val)} options={["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                      </div>
                                    )}
                                  </div>
                                )}
                                {(Array.isArray(sow.platforms) ? sow.platforms : (sow.platforms ? [sow.platforms] : [])).includes("TikTok") && (
                                  <>
                                    <div>
                                      <label className="flex items-center gap-2 cursor-pointer mb-2">
                                        <input type="checkbox" checked={sow.serviceScope?.genCodeRequired || false} onChange={e => handleUpdateServiceScope(group.id, sow.id, 'genCodeRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                        <span className="text-sm font-medium text-slate-700">Gen Code</span>
                                      </label>
                                      {sow.serviceScope?.genCodeRequired && (
                                        <div className="pl-6">
                                          <MultiSelect value={sow.serviceScope?.genCodeDuration || []} onChange={val => handleUpdateServiceScope(group.id, sow.id, 'genCodeDuration', val)} options={["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={sow.serviceScope?.tiktokShopRequired || false} onChange={e => handleUpdateServiceScope(group.id, sow.id, 'tiktokShopRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                        <span className="text-sm font-medium text-slate-700">TikTok Shop</span>
                                      </label>
                                    </div>
                                  </>
                                )}
                                {(Array.isArray(sow.platforms) ? sow.platforms : (sow.platforms ? [sow.platforms] : [])).some(p => ["Facebook", "Facebook Page"].includes(p)) && (
                                  <div>
                                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                                      <input type="checkbox" checked={sow.serviceScope?.brandedContentRequired || false} onChange={e => handleUpdateServiceScope(group.id, sow.id, 'brandedContentRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                      <span className="text-sm font-medium text-slate-700">FB Branded Content</span>
                                    </label>
                                    {sow.serviceScope?.brandedContentRequired && (
                                      <div className="pl-6">
                                        <MultiSelect value={sow.serviceScope?.brandedContentDuration || []} onChange={val => handleUpdateServiceScope(group.id, sow.id, 'brandedContentDuration', val)} options={["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                      </div>
                                    )}
                                  </div>
                                )}
                                {(Array.isArray(sow.platforms) ? sow.platforms : (sow.platforms ? [sow.platforms] : [])).includes("X") && (
                                  <div>
                                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                                      <input type="checkbox" checked={sow.serviceScope?.whitelistingRequired || false} onChange={e => handleUpdateServiceScope(group.id, sow.id, 'whitelistingRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                                      <span className="text-sm font-medium text-slate-700">X Whitelisting</span>
                                    </label>
                                    {sow.serviceScope?.whitelistingRequired && (
                                      <div className="pl-6">
                                        <MultiSelect value={sow.serviceScope?.whitelistingDuration || []} onChange={val => handleUpdateServiceScope(group.id, sow.id, 'whitelistingDuration', val)} options={["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"]} placeholder="Duration" />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="md:col-span-2 pt-2">
                              <label className="mb-1 block text-sm font-medium text-slate-700">Scope Name</label>
                              <input 
                                type="text" 
                                value={sow.name || ""} 
                                onChange={e => handleUpdateSow(group.id, sow.id, { name: e.target.value })} 
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
                                placeholder="e.g. TikTok Video (Boost by Page 30 วัน)"
                              />
                            </div>
                            {sow.influencerDetails && sow.influencerDetails.length > 0 ? (
                              <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-slate-700">Influencer Details (Read Only)</label>
                                <div className="space-y-2">
                                  {sow.influencerDetails.map((detail, idx) => (
                                    <div key={idx} className="flex gap-4 p-3 bg-slate-50 rounded-lg text-sm border border-slate-100">
                                      <div><span className="text-slate-500 mr-1">Group {idx + 1}:</span></div>
                                      <div><span className="text-slate-400 mr-1">Influencers:</span><span className="font-medium">{detail.numInfluencers || "-"}</span></div>
                                      <div><span className="text-slate-400 mr-1">Followers:</span><span className="font-medium">{detail.followerReqFrom ? Number(detail.followerReqFrom).toLocaleString() : "0"} - {detail.followerReqTo ? Number(detail.followerReqTo).toLocaleString() : "Any"}</span></div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <>
                                <div>
                                  <label className="mb-1 block text-sm font-medium text-slate-700">Number of Influencers</label>
                                  <input type="number" value={sow.numInfluencers || ""} onChange={e => handleUpdateSow(group.id, sow.id, { numInfluencers: e.target.value })} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" />
                                </div>
                                <div>
                                  <label className="mb-1 block text-sm font-medium text-slate-700">Follower Requirement</label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <input 
                                      type="number" 
                                      value={sow.followerReqFrom || ""} 
                                      onChange={e => handleUpdateSow(group.id, sow.id, { followerReqFrom: e.target.value })} 
                                      placeholder="From" 
                                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
                                    />
                                    <input 
                                      type="number" 
                                      value={sow.followerReqTo || ""} 
                                      onChange={e => handleUpdateSow(group.id, sow.id, { followerReqTo: e.target.value })} 
                                      placeholder="To" 
                                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                            <div className="md:col-span-2">
                              <label className="mb-1 block text-sm font-medium text-slate-700">Details</label>
                              <SimpleHtmlEditor value={sow.details || ""} onChange={val => handleUpdateSow(group.id, sow.id, { details: val })} />
                            </div>
                          </div>
                          
                          <div className="flex justify-end pt-2 border-t border-slate-100">
                            <button type="button" onClick={() => handleDuplicateSow(group.id, sow)} className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">
                              <Copy className="h-3 w-3" /> Duplicate SOW
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {group.sows.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No SOWs added to this group yet.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
          {groups.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
              <p className="text-slate-400 font-semibold">No groups created yet. Add a group to get started.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
