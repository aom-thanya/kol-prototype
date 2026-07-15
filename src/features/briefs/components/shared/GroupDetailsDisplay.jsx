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
          <span className="text-slate-400 block mb-1 text-xs uppercase font-semibold">KOL Qty</span>
          <span className="font-semibold text-slate-800">{group.numInfluencers || "-"}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1 text-xs uppercase font-semibold">Followers</span>
          <span className="font-semibold text-slate-800">
            {group.followerReqFrom || group.followerReqTo 
              ? `${group.followerReqFrom ? Number(group.followerReqFrom).toLocaleString() : "0"} - ${group.followerReqTo ? Number(group.followerReqTo).toLocaleString() : "Any"}` 
              : "-"}
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
    </div>
  );
}
