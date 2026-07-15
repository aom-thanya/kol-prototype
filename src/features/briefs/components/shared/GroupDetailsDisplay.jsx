import React from "react";
import { cn } from "../../../../utils/helpers";

const renderList = (arr) => {
  if (!arr || arr.length === 0) return "-";
  return arr.join(", ");
};

export default function GroupDetailsDisplay({ group, index }) {
  if (!group) return null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 text-base shadow-3xs space-y-4.5 hover:shadow-2xs transition">
      <h6 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">
        {group.name || `Group ${index !== undefined ? index + 1 : ""}`}
      </h6>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div>
          <span className="text-slate-400 block mb-1 text-xs uppercase font-semibold">Number of Influencers</span>
          <span className="font-semibold text-slate-800">{group.numInfluencers || group.totalInfluencers || "-"}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1 text-xs uppercase font-semibold">Follower Requirement</span>
          <span className="font-semibold text-slate-800">
            {group.followerReqFrom || group.followerReqTo 
              ? `${group.followerReqFrom ? Number(group.followerReqFrom).toLocaleString() : "0"} - ${group.followerReqTo ? Number(group.followerReqTo).toLocaleString() : "Any"}` 
              : (group.followerRequirement || "-")}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1 text-xs uppercase font-semibold">Demographic</span>
          <span className="font-semibold text-slate-800">{renderList(group.pillars?.demographic || group.persona?.demographic)}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1 text-xs uppercase font-semibold">Location</span>
          <span className="font-semibold text-slate-800">{renderList(group.pillars?.location || group.persona?.location)}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1 text-xs uppercase font-semibold">Occupation</span>
          <span className="font-semibold text-slate-800">{renderList(group.pillars?.occupation || group.persona?.occupation)}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1 text-xs uppercase font-semibold">Tone</span>
          <span className="font-semibold text-slate-800">{renderList(group.pillars?.persona || group.persona?.persona)}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1 text-xs uppercase font-semibold">Content Category</span>
          <span className="font-semibold text-slate-800">{renderList(group.pillars?.contentCategory || group.persona?.contentCategory)}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1 text-xs uppercase font-semibold">Storytelling</span>
          <span className="font-semibold text-slate-800">{renderList(group.pillars?.storyTelling || group.persona?.storyTelling)}</span>
        </div>
      </div>
      
      {group.referenceInfluencers && group.referenceInfluencers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <span className="text-slate-400 block mb-3 text-xs uppercase font-semibold">Reference Influencers</span>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {group.referenceInfluencers.map(ref => (
              <a 
                key={ref.id} 
                href={ref.profileUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 hover:bg-slate-100 transition whitespace-nowrap shrink-0"
              >
                {ref.avatar && <img src={ref.avatar} alt={ref.username} className="w-5 h-5 rounded-full object-cover" />}
                <span className="font-bold text-slate-700 text-sm">{ref.username}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
