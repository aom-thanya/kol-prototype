 



export default function BriefExampleListView({ brief }) {
  const cn = (...classes) => classes.filter(Boolean).join(" ");
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Example List</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">Selected example creators for this campaign.</p>
      </div>

      {(brief.groups && brief.groups.length > 0 ? brief.groups : []).map((group, groupIndex) => (
        <div key={group.id || groupIndex} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-6">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
            <h4 className="text-sm font-bold text-slate-800">{group.name || `Group ${groupIndex + 1}`}</h4>
            {group?.pillar && typeof group.pillar === "string" && (
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide border border-indigo-100">
                {group.pillar}
              </span>
            )}
            {group?.pillars && Object.values(group.pillars).some(arr => arr && arr.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {Object.values(group.pillars).flat().filter(Boolean).map((val, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide border border-indigo-100">
                    {val}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-layout-fixed" style={{ minWidth: "800px" }}>
              <thead>
                <tr className="border-b border-slate-200 bg-white">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 bg-slate-50/50" style={{ width: "220px" }}>Detail</th>
                  {group.sows?.map((sow, idx) => (
                    <th key={sow.id || idx} className="p-4 text-xs font-bold text-slate-700 uppercase tracking-wider border-r border-slate-200 last:border-r-0 bg-white" style={{ width: "300px" }}>
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-900 font-bold text-xs">{sow.name || sow.contentType}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          {(sow.platforms || []).map((plat) => (
                            <span key={plat} className="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-[9px] font-bold text-[#6D5DF6] border border-violet-100">
                              {plat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </th>
                  ))}
                  {(!group.sows || group.sows.length === 0) && <th className="p-4 text-slate-400 italic bg-white">N/A</th>}
                </tr>
              </thead>
              <tbody>
                {/* Follower */}
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-bold bg-slate-50/50 text-slate-700 align-top border-r border-slate-200">Follower Requirement</td>
                  {group.sows?.map((sow, idx) => (
                    <td key={sow.id || idx} className="p-4 align-top border-r border-slate-200 last:border-r-0 text-sm text-slate-700 bg-white">
                      {sow.followerReqFrom && sow.followerReqTo ? `${Number(sow.followerReqFrom).toLocaleString()} - ${Number(sow.followerReqTo).toLocaleString()}` : (sow.followerReqFrom || sow.followerReqTo || sow.followerReq || "-")}
                    </td>
                  ))}
                  {(!group.sows || group.sows.length === 0) && <td className="p-4 text-slate-400 italic bg-white">N/A</td>}
                </tr>
                
                {/* Num Influencers */}
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-bold bg-slate-50/50 text-slate-700 align-top border-r border-slate-200">Number of Influencers</td>
                  {group.sows?.map((sow, idx) => (
                    <td key={sow.id || idx} className="p-4 align-top border-r border-slate-200 last:border-r-0 text-sm text-slate-700 bg-white">
                      {sow.numInfluencers || "-"}
                    </td>
                  ))}
                  {(!group.sows || group.sows.length === 0) && <td className="p-4 text-slate-400 italic bg-white">N/A</td>}
                </tr>

                {/* Example List row */}
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-bold bg-slate-50/50 text-slate-700 align-top border-r border-slate-200">Example list</td>
                  {group.sows?.map((sow, idx) => {
                    const selectedCreators = (sow.exampleCreators || []).filter(c => c.selected !== false);
                    return (
                      <td key={sow.id || idx} className="p-4 align-top border-r border-slate-200 last:border-r-0 space-y-3 bg-white">
                        <div className="flex flex-col gap-1.5">
                          {selectedCreators.map((creator) => (
                            <div key={creator.id} className="flex items-center justify-between border border-slate-200/60 rounded-lg p-1.5 pr-2 bg-white shadow-xs">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <img 
                                  src={creator.avatar || "https://i.pravatar.cc/160"} 
                                  alt={creator.name} 
                                  className="w-6 h-6 rounded-full object-cover bg-slate-100 flex-shrink-0" 
                                />
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[11px] font-semibold truncate leading-tight text-slate-800">
                                    {creator.name}
                                  </span>
                                  <span className="text-[9px] text-slate-450 leading-tight truncate">
                                    {creator.username}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                          {selectedCreators.length === 0 && (
                            <span className="text-slate-400 italic text-[10px]">ไม่มีรายชื่อที่เลือก</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  {(!group.sows || group.sows.length === 0) && <td className="p-4 text-slate-400 italic bg-white">N/A</td>}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

