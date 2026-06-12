import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download } from "lucide-react";
import Button from "../common/Button";
import TrackerTable from "../tracker/TrackerTable";
import CampaignCalculationsView from "./CampaignCalculationsView";
import ActivityTimeline from "../common/ActivityTimeline";
import { getCampaignCalculations } from "../../utils/campaignCalculations";

export default function DealsheetPage({ brief, onUpdateBrief, showToast }) {
  const [activeOptId, setActiveOptId] = useState(() => {
    if (brief.budgetOptions && brief.budgetOptions.length > 0) return brief.budgetOptions[0].id;
    return "legacy";
  });

  const activeGroups = Object.keys(brief.groupTrackers || {});
  
  const filteredTrackers = {};
  let totalDoneCount = 0;
  
  activeGroups.forEach(grp => {
    const tracker = brief.groupTrackers[grp];
    const doneInfluencers = tracker.influencers.filter(inf => inf.contactStatus === "Selected");
    if (doneInfluencers.length > 0) {
      filteredTrackers[grp] = { ...tracker, influencers: doneInfluencers };
      totalDoneCount += doneInfluencers.length;
    }
  });

  const filteredGroups = Object.keys(filteredTrackers);

  const hasStandard = brief && (
    Array.isArray(brief.packageType) 
      ? brief.packageType.some(p => p.toLowerCase().includes("standard"))
      : (typeof brief.packageType === "string" && brief.packageType.toLowerCase().includes("standard"))
  );

  const budgetOptions = brief.budgetOptions && brief.budgetOptions.length > 0 
    ? brief.budgetOptions 
    : [{
        id: "legacy",
        name: "Option A",
        budgetSpending: brief.budgetSpending,
        vat: brief.vat,
        budgetCondition: brief.budgetCondition,
        estimatedBrandSpending: brief.estimatedBrandSpending,
        budgetPerInfluencer: brief.budgetPerInfluencer,
        expectedNumInfluencers: brief.expectedNumInfluencers,
        expectedReach: brief.expectedReach,
        scopeOfWorks: brief.scopeOfWorks || []
      }];

  const calculatedOptions = budgetOptions.map(opt => getCampaignCalculations(brief, opt.id));

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4 space-y-6 min-w-0">
          {hasStandard ? (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm p-6 lg:p-8">
                <div className="mb-6 border-b border-slate-100 pb-6">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">KPI</h2>
                </div>
                <div className="w-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                  <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/4">Option</th>
                        {calculatedOptions.map((opt, idx) => (
                          <th key={opt.activeOpt.id} className="px-6 py-4 text-sm font-extrabold text-slate-800 text-center">
                            {opt.activeOpt.name || `Option ${String.fromCharCode(65 + idx)}`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      <tr>
                        <td className="px-6 py-4 font-semibold text-slate-600 bg-slate-50/50">
                          Budget <br />
                          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-tight">[ Exclude Vat 7% ]</span>
                        </td>
                        {calculatedOptions.map((opt) => (
                          <td key={opt.activeOpt.id} className="px-6 py-4 text-[#6D5DF6] font-bold text-base text-center">
                            {opt.totalBudget.toLocaleString()} Baht
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-slate-600 bg-slate-50/50">Total Influencer</td>
                        {calculatedOptions.map((opt) => (
                          <td key={opt.activeOpt.id} className="px-6 py-4 text-slate-900 text-center">
                            <div className="font-bold text-[#6D5DF6]">{opt.sumInfluencers} Pax // {opt.sumInfluencers} Posts</div>
                            <div className="text-[11px] text-slate-400 mt-1">โดยแบ่งตาม SOW ดังนี้</div>
                            <div className="text-[11px] text-slate-550 mt-1 space-y-0.5 inline-block text-left">
                              {opt.channelBreakdown.map((chan, cIdx) => (
                                <div key={cIdx}>
                                  • {chan.platform} ({chan.followerReq}) = {chan.numInfs} Pax // {chan.numInfs} Posts
                                </div>
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-slate-600 bg-slate-50/50">Scope of Work</td>
                        {calculatedOptions.map((opt) => {
                          const platforms = [...new Set(opt.channelBreakdown.map(c => c.platform.toLowerCase()))];
                          return (
                            <td key={opt.activeOpt.id} className="px-6 py-5">
                              <div className="space-y-4 text-left">
                                {platforms.includes("tiktok") && (
                                  <div>
                                    <div className="font-bold text-slate-800 border-b border-slate-100 pb-1 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                                      สำหรับช่องทาง TikTok
                                    </div>
                                    <div className="text-slate-600 text-xs mt-1.5 leading-relaxed">
                                      Influencer เดินทางไปที่ Lotus's สาขาใกล้บ้าน รีวิว Mechanic กิจกรรม + How to อธิบายวิธีร่วมกิจกรรม
                                    </div>
                                  </div>
                                )}
                                {(platforms.includes("x") || platforms.includes("twitter") || platforms.includes("instagram") || platforms.includes("facebook") || platforms.includes("ig")) && (
                                  <div>
                                    <div className="font-bold text-slate-800 border-b border-slate-100 pb-1 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                                      สำหรับช่องทาง X / Instagram / Facebook
                                    </div>
                                    <div className="text-slate-600 text-xs mt-1.5 leading-relaxed">
                                      Influencer Capture MV มาโพสต์ลงโซเชียลมีเดีย และใส่แคปชั่นพูดถึงเพลงดังกล่าว
                                    </div>
                                  </div>
                                )}
                                <div className="text-rose-600 font-bold text-xs pt-1 text-center border-t border-slate-100 mt-2">
                                  ** ซื้อสินค้าเองในราคา {(brief.productValue || 200).toLocaleString()} บาท // Scope นี้ ทางแบรนด์จัดเตรียม Material ให้ **
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-slate-600 bg-slate-50/50">Combined Follower</td>
                        {calculatedOptions.map((opt) => (
                          <td key={opt.activeOpt.id} className="px-6 py-4 text-slate-900 text-center font-medium">
                            Est. ~{opt.combinedFollower.toLocaleString()}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-slate-600 bg-slate-50/50">Reach</td>
                        {calculatedOptions.map((opt) => (
                          <td key={opt.activeOpt.id} className="px-6 py-4 text-slate-900 text-center">
                            <span className="text-slate-500">Est. ~{opt.estimatedReach.toLocaleString()}</span>
                            <span className="text-slate-400 mx-1.5">//</span>
                            <span className="font-semibold text-slate-800">Commit {opt.committedReach.toLocaleString()}</span>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-slate-600 bg-slate-50/50">Engagement</td>
                        {calculatedOptions.map((opt) => (
                          <td key={opt.activeOpt.id} className="px-6 py-4 text-slate-900 text-center font-medium">
                            Est. ~{opt.estimatedEngagement.toLocaleString()}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-slate-600 bg-slate-50/50">Influencers Type</td>
                        {calculatedOptions.map((opt) => (
                          <td key={opt.activeOpt.id} className="px-6 py-4 text-slate-700">
                            <div className="text-xs font-medium space-y-1.5 leading-relaxed">
                              <div>● <strong className="text-slate-950">Gender:</strong> {brief.gender || 'All Gender'}</div>
                              <div>● <strong className="text-slate-950">Age:</strong> {brief.ageRange || '25 Years Old+'}</div>
                              <div>● <strong className="text-slate-950">Lifestyle:</strong> {brief.lifestyle || 'Lifestyle'}</div>
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-slate-600 bg-slate-50/50">Conditions</td>
                        {calculatedOptions.map((opt) => (
                          <td key={opt.activeOpt.id} className="px-6 py-4 text-slate-700">
                            <div className="space-y-1.5 text-xs leading-relaxed">
                              <div>● สามารถเลือก Influencer และตรวจ Draft ได้ 1 ครั้ง (สงวนสิทธิ์แก้ไขเฉพาะการตัดต่อและแคปชั่นเท่านั้น)</div>
                              <div>● ราคาข้างต้น ไม่รวม Vat 7%, Boost Post, Boost Fee, Buy Out Asset</div>
                              <div>● สงวนสิทธิ์ให้ Influencer เลือกสาขาที่จะเข้าไปถ่ายคอนเทนต์ด้วยตนเอง</div>
                              <div>● เก็บโพสต์ขั้นต่ำ 30 วันเท่านั้น</div>
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <CampaignCalculationsView brief={brief} activeOptId={activeOptId} setActiveOptId={setActiveOptId} />
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm p-6 lg:p-8">
              <div className="mb-6 border-b border-slate-100 pb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dealsheet Preview</h1>
                  <p className="text-slate-500 mt-1">{brief.campaignName} • {brief.id}</p>
                </div>
              </div>

              {totalDoneCount === 0 ? (
                <div className="text-center py-16 text-slate-550 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mb-4 border border-slate-200">
                    <CheckCircle2 className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">No Influencers Ready</h3>
                  <p className="mb-4 text-sm text-slate-500 mt-1">Change influencer status to "Selected" in Rate card list to view them here.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredGroups.map(grp => (
                    <TrackerTable 
                      key={grp}
                      groupName={grp}
                      brief={brief}
                      trackerData={filteredTrackers[grp]}
                      onUpdateTracker={(updatedTracker) => {
                        const newTrackers = { ...brief.groupTrackers };
                        const originalInfluencers = newTrackers[grp].influencers;
                        const updatedMap = {};
                        updatedTracker.influencers.forEach(inf => {
                          updatedMap[inf.id] = inf;
                        });
                        const mergedInfluencers = originalInfluencers.map(inf => {
                          return updatedMap[inf.id] ? updatedMap[inf.id] : inf;
                        });
                        newTrackers[grp] = { ...newTrackers[grp], influencers: mergedInfluencers };
                        onUpdateBrief({ ...brief, groupTrackers: newTrackers });
                      }}
                      onAddClick={() => {}}
                      hideAddButton={true}
                      readOnly={true}
                      isDealsheetView={true}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/4 shrink-0">
          <div className="sticky top-6 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Actions</h3>
              <div className="flex flex-col gap-3">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    if (hasStandard) {
                      window.open("https://docs.google.com/spreadsheets/d/18ns-87lEe4Ct2qzfQ0nsEYrb4WdpJlmqoRSnP2J_UF0/edit?usp=sharing", "_blank");
                    } else {
                      showToast && showToast("download dealsheet soon");
                    }
                  }}
                >
                  <Download className="mr-2 h-4 w-4" /> Export Dealsheet
                </Button>
              </div>
            </div>
            <ActivityTimeline logs={brief.activityLog || []} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
