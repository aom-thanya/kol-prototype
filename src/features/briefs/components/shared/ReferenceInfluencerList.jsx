import React from "react";
import { ExternalLink } from "lucide-react";

export default function ReferenceInfluencerList({ influencers }) {
  if (!influencers || influencers.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="text-slate-400 mb-3 text-xs font-semibold uppercase tracking-wider">Reference Influencers</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {influencers.map(ref => (
          <div key={ref.id} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <img src={ref.avatar} alt={ref.username} className="h-10 w-10 rounded-full object-cover border border-slate-200 mt-1" />
            <div className="flex-1 min-w-0 space-y-1">
              <div className="font-bold text-slate-800 text-sm truncate">{ref.username}</div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                  {ref.platform}
                </span>
                <span className="text-xs text-slate-500 font-semibold">{ref.followers}</span>
              </div>
            </div>
            {ref.link && (
              <a href={ref.link} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-[#6D5DF6] transition bg-white rounded-lg border border-slate-200 shadow-3xs shrink-0">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
