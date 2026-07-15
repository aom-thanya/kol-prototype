import { useState } from "react";
import { Plus, X } from "lucide-react";
import SowDetailsDisplay from "./shared/SowDetailsDisplay";
import AddExampleCreatorModal from "../../example-list/components/AddExampleCreatorModal";

export default function BriefExampleListView({ brief, onUpdateBrief }) {
  const cn = (...classes) => classes.filter(Boolean).join(" ");
  const [activeModalSow, setActiveModalSow] = useState(null);

  const handleAddQuestion = (groupIndex) => {
    if (!onUpdateBrief) return;
    const newGroups = [...brief.groups];
    if (!newGroups[groupIndex].questions) newGroups[groupIndex].questions = [];
    newGroups[groupIndex].questions.push({ id: `q_${groupIndex}_${newGroups[groupIndex].questions.length}`, text: "" });
    onUpdateBrief({ ...brief, groups: newGroups });
  };

  const handleUpdateQuestion = (groupIndex, qIndex, text) => {
    if (!onUpdateBrief) return;
    const newGroups = [...brief.groups];
    newGroups[groupIndex].questions[qIndex].text = text;
    onUpdateBrief({ ...brief, groups: newGroups });
  };

  const handleRemoveQuestion = (groupIndex, qIndex) => {
    if (!onUpdateBrief) return;
    const newGroups = [...brief.groups];
    newGroups[groupIndex].questions.splice(qIndex, 1);
    onUpdateBrief({ ...brief, groups: newGroups });
  };

  const handleSaveCreators = (creators) => {
    if (!activeModalSow || !onUpdateBrief) return;
    const { groupIndex, sowIndex } = activeModalSow;
    const newGroups = [...brief.groups];
    
    if (!newGroups[groupIndex].sows[sowIndex].exampleCreators) {
      newGroups[groupIndex].sows[sowIndex].exampleCreators = [];
    }
    
    // Merge new creators avoiding duplicates
    const existingIds = newGroups[groupIndex].sows[sowIndex].exampleCreators.map(c => c.id);
    const newUniqueCreators = creators.filter(c => !existingIds.includes(c.id));
    
    newGroups[groupIndex].sows[sowIndex].exampleCreators.push(...newUniqueCreators);
    onUpdateBrief({ ...brief, groups: newGroups });
    setActiveModalSow(null);
  };

  const handleRemoveExampleCreator = (groupIndex, sowIndex, creatorId) => {
    if (!onUpdateBrief) return;
    const newGroups = [...brief.groups];
    newGroups[groupIndex].sows[sowIndex].exampleCreators = newGroups[groupIndex].sows[sowIndex].exampleCreators.filter(c => c.id !== creatorId);
    onUpdateBrief({ ...brief, groups: newGroups });
  };

  const renderTags = (value, fallbackValue) => {
    const rawVal = value || fallbackValue;
    if (!rawVal) return <span className="text-slate-400">-</span>;
    
    const tags = Array.isArray(rawVal) ? rawVal : (typeof rawVal === 'string' ? rawVal.split(',').map(s => s.trim()) : [rawVal]);
    const validTags = tags.filter(Boolean);
    
    if (validTags.length === 0) return <span className="text-slate-400">-</span>;

    return (
      <div className="flex flex-wrap gap-2">
        {validTags.map((tag, i) => (
          <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-50/80 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs">
            {tag}
          </span>
        ))}
      </div>
    );
  };

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
                  <td colSpan={Math.max(1, group.sows?.length || 1)} className="p-4 align-top text-sm text-slate-700 bg-white">
                    {group.followerReqFrom && group.followerReqTo ? `${Number(group.followerReqFrom).toLocaleString()} - ${Number(group.followerReqTo).toLocaleString()}` : 
                     (group.sows?.[0]?.followerReqFrom && group.sows?.[0]?.followerReqTo ? `${Number(group.sows[0].followerReqFrom).toLocaleString()} - ${Number(group.sows[0].followerReqTo).toLocaleString()}` : (group.followerReqFrom || group.followerReqTo || group.sows?.[0]?.followerReqFrom || "-"))}
                  </td>
                </tr>
                
                {/* Num Influencers */}
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-bold bg-slate-50/50 text-slate-700 align-top border-r border-slate-200">Number of Influencers</td>
                  <td colSpan={Math.max(1, group.sows?.length || 1)} className="p-4 align-top text-sm text-slate-700 bg-white">
                    {group.numInfluencers || group.sows?.[0]?.numInfluencers || "-"}
                  </td>
                </tr>

                {/* Demographic */}
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-bold bg-slate-50/50 text-slate-700 align-top border-r border-slate-200">Demographic</td>
                  <td colSpan={Math.max(1, group.sows?.length || 1)} className="p-4 align-top text-sm text-slate-700 bg-white">
                    {renderTags(group.persona?.demographic, group.sows?.[0]?.persona?.demographic)}
                  </td>
                </tr>

                {/* Location */}
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-bold bg-slate-50/50 text-slate-700 align-top border-r border-slate-200">Location</td>
                  <td colSpan={Math.max(1, group.sows?.length || 1)} className="p-4 align-top text-sm text-slate-700 bg-white">
                    {renderTags(group.persona?.location, group.sows?.[0]?.persona?.location)}
                  </td>
                </tr>

                {/* Occupation */}
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-bold bg-slate-50/50 text-slate-700 align-top border-r border-slate-200">Occupation</td>
                  <td colSpan={Math.max(1, group.sows?.length || 1)} className="p-4 align-top text-sm text-slate-700 bg-white">
                    {renderTags(group.persona?.occupation, group.sows?.[0]?.persona?.occupation)}
                  </td>
                </tr>

                {/* Persona */}
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-bold bg-slate-50/50 text-slate-700 align-top border-r border-slate-200">Tone / Persona</td>
                  <td colSpan={Math.max(1, group.sows?.length || 1)} className="p-4 align-top text-sm text-slate-700 bg-white">
                    {renderTags(group.persona?.persona, group.sows?.[0]?.persona?.persona)}
                  </td>
                </tr>

                {/* Content Category */}
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-bold bg-slate-50/50 text-slate-700 align-top border-r border-slate-200">Content Category</td>
                  <td colSpan={Math.max(1, group.sows?.length || 1)} className="p-4 align-top text-sm text-slate-700 bg-white">
                    {renderTags(group.persona?.contentCategory, group.sows?.[0]?.persona?.contentCategory)}
                  </td>
                </tr>

                {/* Storytelling */}
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-bold bg-slate-50/50 text-slate-700 align-top border-r border-slate-200">Storytelling</td>
                  <td colSpan={Math.max(1, group.sows?.length || 1)} className="p-4 align-top text-sm text-slate-700 bg-white">
                    {renderTags(group.persona?.storyTelling, group.sows?.[0]?.persona?.storyTelling)}
                  </td>
                </tr>

                {/* Reference Influencers */}
                {(group.referenceInfluencers && group.referenceInfluencers.length > 0) && (
                  <tr className="border-b border-slate-100">
                    <td className="p-4 font-bold bg-slate-50/50 text-slate-700 align-top border-r border-slate-200">Reference Influencers</td>
                    <td colSpan={Math.max(1, group.sows?.length || 1)} className="p-4 align-top text-sm text-slate-700 bg-white">
                      <div className="flex flex-wrap gap-2">
                        {group.referenceInfluencers.map(ref => (
                          <div key={ref.id} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md">
                            <img src={ref.avatar} alt={ref.username} className="w-5 h-5 rounded-full object-cover" />
                            <span className="text-xs font-semibold text-slate-700">{ref.username}</span>
                          </div>
                        ))}
                        <span className="text-xs text-slate-400 self-center ml-2">{group.referenceInfluencers.length} References Selected</span>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Scope of Work Details */}
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-bold bg-slate-50/50 text-slate-700 align-top border-r border-slate-200">Scope of Work Details</td>
                  {group.sows?.map((sow, idx) => (
                    <td key={sow.id || idx} className="p-4 align-top border-r border-slate-200 last:border-r-0 bg-white">
                      <SowDetailsDisplay sow={sow} index={idx} initialCollapsed={true} />
                    </td>
                  ))}
                  {(!group.sows || group.sows.length === 0) && <td className="p-4 text-slate-400 italic bg-white">N/A</td>}
                </tr>

                {/* Questions */}
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-bold bg-slate-50/50 text-slate-700 align-top border-r border-slate-200">Questions</td>
                  <td colSpan={Math.max(1, group.sows?.length || 1)} className="p-4 align-top text-sm text-slate-700 bg-white">
                    <div className="flex flex-col gap-3">
                      {(group.questions || []).map((q, qIndex) => (
                        <div key={q.id} className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-slate-400 w-4 text-right shrink-0">{qIndex + 1}.</span>
                          {onUpdateBrief ? (
                            <div className="flex-1 flex items-center gap-2">
                              <input 
                                type="text" 
                                className="flex-1 text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-shadow"
                                placeholder="Enter question..."
                                value={q.text}
                                onChange={(e) => handleUpdateQuestion(groupIndex, qIndex, e.target.value)}
                              />
                              <button onClick={() => handleRemoveQuestion(groupIndex, qIndex)} className="text-slate-400 hover:text-rose-500 transition-colors p-1 shrink-0">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex-1 text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700">
                              {q.text || "Untitled Question"}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {onUpdateBrief && (
                        <div className="flex items-center gap-3 mt-1">
                          <div className="w-4 shrink-0"></div>
                          <button 
                            onClick={() => handleAddQuestion(groupIndex)}
                            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 border border-dashed border-indigo-300 rounded-lg px-3 py-2 hover:bg-indigo-50 hover:border-indigo-400 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Question
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>

                {/* Example List row */}
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-bold bg-slate-50/50 text-slate-700 align-top border-r border-slate-200">Example list</td>
                  {group.sows?.map((sow, idx) => {
                    const selectedCreators = (sow.exampleCreators || []).filter(c => c.selected !== false);
                    return (
                      <td key={sow.id || idx} className="p-4 align-top border-r border-slate-200 last:border-r-0 space-y-3 bg-white">
                        <div className="flex flex-col gap-1.5">
                          {/* Selected Creators (Original functionality) */}
                          {selectedCreators.map((creator) => (
                            <div key={creator.id} className="flex items-center justify-between border border-slate-200/60 rounded-lg p-1.5 pr-2 bg-white shadow-xs">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <img 
                                  src={creator.avatar || "https://i.pravatar.cc/160"} 
                                  alt={creator.name || creator.username} 
                                  className="w-6 h-6 rounded-full object-cover bg-slate-100 flex-shrink-0" 
                                />
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[11px] font-semibold truncate leading-tight text-slate-800">
                                    {creator.name || creator.username}
                                  </span>
                                  {creator.name && creator.username && (
                                    <span className="text-[9px] text-slate-450 leading-tight truncate">
                                      {creator.username}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {onUpdateBrief && (
                                <button onClick={() => handleRemoveExampleCreator(groupIndex, idx, creator.id)} className="text-slate-300 hover:text-rose-500 flex-shrink-0 ml-1 p-0.5">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                          {selectedCreators.length === 0 && (
                            <span className="text-slate-400 italic text-[10px]">No creators selected</span>
                          )}

                          {onUpdateBrief && (
                            <button 
                              onClick={() => setActiveModalSow({ groupIndex, sowIndex: idx, pillar: group.pillar, group, initialCreators: selectedCreators })}
                              className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 py-1.5 rounded-lg transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                              Add Example List
                            </button>
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
      
      {activeModalSow && (
        <AddExampleCreatorModal
          open={true}
          onClose={() => setActiveModalSow(null)}
          pillar={activeModalSow.pillar}
          group={activeModalSow.group}
          initialCreators={activeModalSow.initialCreators}
          onSave={handleSaveCreators}
        />
      )}
    </div>
  );
}

