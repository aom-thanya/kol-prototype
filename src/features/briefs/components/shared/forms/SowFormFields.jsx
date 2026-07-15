import React from "react";
import MultiSelect from "../../../../../components/common/MultiSelect";
import SimpleHtmlEditor from "../../../../../components/common/SimpleHtmlEditor";
import { cn } from "../../../../../utils/helpers";

const PLATFORMS = ["Facebook", "Facebook Page", "Instagram", "TikTok", "YouTube", "Threads", "X", "Lemon8", "Application", "E-COMMERCE App", "Others"];

const getAvailableContentTypes = (plats) => {
  const allTypes = new Set();
  plats.forEach(p => {
    if (p === "Facebook" || p === "Facebook Page") {
      ["Text Post", "Photos", "Reels", "Story", "Live", "Event", "Share", "Like", "Seeding Comment", "Seeding Comment Photo"].forEach(t => allTypes.add(t));
    } else if (p === "Instagram") {
      ["Photos", "Reels", "Story", "Live", "Note", "Repost", "Like", "Save", "Share", "Seeding Comment", "Seeding Comment Photo"].forEach(t => allTypes.add(t));
    } else if (p === "TikTok") {
      ["Video", "Photos", "Text Post", "Story", "Live", "Repost", "Like", "Save", "Share", "Seeding Comment", "Seeding Comment Photo"].forEach(t => allTypes.add(t));
    } else if (p === "YouTube") {
      ["Video", "Shorts", "Live", "Like", "Share", "Save", "Seeding Comment", "Seeding Comment Photo", "Podcast", "Text Community Post", "Photos Community Post", "Poll", "Quiz"].forEach(t => allTypes.add(t));
    } else if (p === "Threads") {
      ["Text Post", "Photos", "Video", "Reply", "Repost", "Quote", "Like"].forEach(t => allTypes.add(t));
    } else if (p === "X") {
      ["Text Post", "Photos", "Video", "Repost", "Reply", "Quote", "Like", "Poll"].forEach(t => allTypes.add(t));
    } else if (p === "Application") {
      ["Download App", "Rating App", "Seeding Comment", "Seeding Comment Photo"].forEach(t => allTypes.add(t));
    } else if (p === "E-COMMERCE App") {
      ["Download App", "Rating App", "Photos", "Seeding Comment", "Seeding Comment Photo"].forEach(t => allTypes.add(t));
    } else if (p === "Lemon8") {
      allTypes.add("Photo"); allTypes.add("Carousel");
    }
  });
  if (plats.includes("Others")) allTypes.add("Custom");
  return Array.from(allTypes);
};

const getAvailableViaOptions = (plats) => {
  const allPlatforms = ["Facebook", "Facebook Page", "Instagram", "TikTok", "YouTube", "Threads", "X", "Lemon8", "Application", "E-COMMERCE App"];
  const currentPlat = plats?.[0] || "";
  return allPlatforms.filter(p => p !== currentPlat);
};

export default function SowFormFields({ scope, onChange, onUpdateServiceScope }) {
  const scopePlats = Array.isArray(scope.platforms) ? scope.platforms : (scope.platforms ? [scope.platforms] : []);
  const availableContentTypes = getAvailableContentTypes(scopePlats);
  const availableViaOptions = getAvailableViaOptions(scopePlats);

  return (
    <div className="grid gap-6 md:grid-cols-2 mb-8">
      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-700">Platform *</label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
          {PLATFORMS.map(plat => (
            <label key={plat} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name={`sow-platform-${scope.id}`}
                checked={scopePlats.includes(plat)} 
                onChange={e => {
                  if (e.target.checked) onChange('platforms', [plat]);
                }} 
                className="h-4 w-4 text-[#6D5DF6] focus:ring-[#6D5DF6]" 
              />
              <span className="text-sm text-slate-700">{plat}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-700">Via</label>
        <div className="flex flex-wrap gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-3xs">
          {availableViaOptions.map(viaOpt => {
            const selectedVias = scope.serviceScope?.selectedVias || [];
            const isViaChecked = selectedVias.includes(viaOpt);
            return (
              <label key={viaOpt} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isViaChecked} 
                  onChange={e => {
                    let updatedVias = [...selectedVias];
                    if (e.target.checked) updatedVias.push(viaOpt);
                    else updatedVias = updatedVias.filter(v => v !== viaOpt);
                    if (onUpdateServiceScope) onUpdateServiceScope('selectedVias', updatedVias);
                  }} 
                  className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" 
                />
                <span className="text-sm text-slate-700">{viaOpt}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-700">Content Type</label>
        <MultiSelect 
          value={scope.contentType || []} 
          onChange={val => onChange('contentType', val)} 
          options={availableContentTypes.length ? availableContentTypes : ["Photo", "Video", "Reel"]} 
          placeholder={availableContentTypes.length ? "Select content types" : "Select platform first"}
        />
      </div>

      <div className="md:col-span-2 pt-2">
        <label className="mb-2 block text-sm font-medium text-slate-700">Scope Name</label>
        <input 
          type="text" 
          value={scope.name || ""} 
          onChange={e => onChange('name', e.target.value)} 
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
          placeholder="e.g. TikTok Video (Boost by Page 30 วัน)"
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-700">Details</label>
        <SimpleHtmlEditor value={scope.details} onChange={val => onChange('details', val)} />
      </div>
    </div>
  );
}
