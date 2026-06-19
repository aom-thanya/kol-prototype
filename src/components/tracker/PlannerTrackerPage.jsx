import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Copy, Save, CheckCircle2 } from "lucide-react";
import Button from "../common/Button";
import TrackerTable from "./TrackerTable";
import GroupSelectionModal from "./GroupSelectionModal";
import InfluencerSelectModal from "./InfluencerSelectModal";

const DEFAULT_INFLUENCER_TEMPLATE = `สวัสดีครับ เบสจาก Buddy Review นะครับ 
ทางเรามีงานนำเสนอลูกค้า อยากขอทราบเรทราคาครับ

Product : 
Period Campaign : 

Scope of Work : 
Create VDO 1-3 Min  / Photo on (FB/IG/Tiktok/Youtube/X/Lemon8) 

>> ขอราคา VDO 1-3 Min on (ช่องทาง) = 

>> ขอราคา Photo Album on (ช่องทาง) = 
>> โพสต์ได้สูงสุดกี่ภาพ = 

>> ขอราคา Gen code 30 วัน = 
>> ขอราคา Add Advertiser 30 วัน = 
>> ขอราคา Boost Fee(เพจบูสต์เอง)  = 
>> ขอราคา Paid Partnership 30 วัน  = 
>> ขอราคา Branded Content 30 วัน  = 
>> ขอราคา Buy Asset 1 เดือน  = 

—--------------------------------------------------------------------------------------------------

เงื่อนไขอื่นๆเพิ่มเติม 
1. เรทที่แจ้งมาใช้ได้ถึงเมื่อไหร่ = 
2. แก้ไขงานได้กี่ครั้ง =
3. ระยะเวลาทำ Script/Idea กี่วัน = 
4. ระยะเวลาทำ Draft กี่วัน =
5. สามารถใส่ Text/Logo/AW ในภาพ/คลิปได้หรือไม่ =
6. สามารถใส่ # ได้กี่อัน =
7. ระยะเวลาลบโพสต์ = 
8. รับเงินในนามบุคคุล/บริษัท =
9. เครดิตเทอม 30 วันได้หรือไม่ = 

*สำคัญ : หากมีเงื่อนไขอื่นๆ ในการรับงานของทางเพจ รบกวนแจ้งกลับมาได้เลยนะคะ

*ช่องทางในการติดต่อกลับเพิ่มเติม
ชื่อ. : 
Tel. : 
Line ID :
Email :`;

const DEFAULT_CELEBRITY_TEMPLATE = `Client : 
Artist : 

Shooting : 
Post Date : 
SOW : 
ศิลปินทำคลิปวิดิโอไม่เกิน 1 นาที ลงช่องทาง Tiktok หรือ IG ของศิลปิน จำนวน 1 โพสต์
ศิลปินถ่ายภาพ จำนวน 1-5 ภาพ ลงช่องทาง IG ของศิลปิน จำนวน 1 โพสต์
ศิลปินถ่ายทำเอง / ทางแบรนด์มี Production ให้ 
ศิลปินรีวิวผลิตภัณฑ์ xx จำนวน 1 SKU โดยทำ xxxxxxxxxxx พร้อมสื่อสาร Key Message หรือ โปรโมชั่นของแบรนด์ 
เดินทางไปร่วมงาน Event จำนวน 2 ชั่วโมง (ไม่รวมเวลาแต่งหน้าทำผม) + แจ้งกิจกรรมที่ต้องทำในงาน Event (พูดคุยบนเวที / เล่นเกมส์ / ถ่ายภาพกับผู้บริหาร / ร้องเพลง 1-3 เพลง) 
ระยะเวลาโพสต์คลิป : 

ขอราคาแยกสำหรับ
Gen code
Buy out นำคลิปไปใช้ต่อในช่องทางของแบรนด์ (ระบุ : offline/online)`;

export default function PlannerTrackerPage({ brief, onUpdateBrief }) {
  // Initialize trackers for each group if they don't exist yet
  const initializeTrackers = () => {
    const trackers = { ...(brief.groupTrackers || {}) };
    let didUpdate = false;

    if (brief.groups) {
      brief.groups.forEach(g => {
        if (!trackers[g.id]) {
          trackers[g.id] = { influencers: [] };
          didUpdate = true;
        }
        
        // Auto-import example creators if they aren't already imported
        if (g.sows) {
          g.sows.forEach(sow => {
            if (sow.exampleCreators && sow.exampleCreators.length > 0) {
              sow.exampleCreators.forEach(creator => {
                const exists = trackers[g.id].influencers.some(inf => 
                  inf.originalCreatorId === creator.id && inf.scopeOfWork === sow.id
                );
                if (!exists) {
                  trackers[g.id].influencers.push({
                    id: Date.now() + Math.random(),
                    originalCreatorId: creator.id,
                    avatar: creator.avatar,
                    accountName: creator.username || creator.name || "",
                    accountLink: creator.username ? `https://${(creator.platform || "Instagram").toLowerCase()}.com/${creator.username.replace("@", "")}` : "",
                    follower: creator.followers ? creator.followers.toString() : "",
                    channel: creator.platform || "Other",
                    contact: creator.contacts ? creator.contacts.map(x => `${x.type === "Tel" ? "เบอร์" : x.type}: ${x.value}${x.name ? ` (${x.name})` : ""}`).join(", ") : "",
                    contacts: creator.contacts ? [...creator.contacts] : [],
                    rawCost: creator.rawCost ? creator.rawCost.replace(/[^0-9]/g, "") : "",
                    creditTerm: "",
                    paymentType: "",
                    services: {},
                    scopeOfWork: sow.id,
                    detail: "",
                    condition: "1. แก้ไขดราฟได้สูงสุดกี่ครั้ง =\n2. ใส่ # สูงสุดได้กี่อัน =\n3. ใส่ Text/AW/Logo ในชิ้นงานได้หรือไม่ =\n4. ระยะเวลาทำ Script/Idea  =\n5. ระยะเวลาทำ Draft = \n6. ลบโพสต์หรือไม่ = ",
                    brandSupports: {},
                    competitorNote: "",
                    note: "",
                    internalStatus: "Pitching",
                    postingStatus: "Pending",
                    clientStatus: "Pending"
                  });
                  didUpdate = true;
                }
              });
            }
          });
        }

        // Sort the group's influencers by username
        trackers[g.id].influencers.sort((a, b) => {
          const nameA = (a.accountName || "").toLowerCase();
          const nameB = (b.accountName || "").toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
      });
    }
    return { trackers, didUpdate };
  };

  const initData = initializeTrackers();
  const [groupTrackers, setGroupTrackers] = useState(initData.trackers);

  React.useEffect(() => {
    if (initData.didUpdate) {
      onUpdateBrief({ ...brief, groupTrackers: initData.trackers });
    }
  }, []);
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [replacingInfInfo, setReplacingInfInfo] = useState(null);

  const activeGroups = brief.groups || [];

  const [activeTemplateTab, setActiveTemplateTab] = useState("Influencer");
  const [templateText, setTemplateText] = useState({
    Influencer: brief.questionTemplates?.Influencer || DEFAULT_INFLUENCER_TEMPLATE,
    Celebrity: brief.questionTemplates?.Celebrity || DEFAULT_CELEBRITY_TEMPLATE
  });
  const [copiedTab, setCopiedTab] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);


  const handleConfirmRateCardList = () => {
    const log = {
      date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action: "Sales confirmed Rate Card List",
      details: "Rate Card List confirmed by Sales."
    };
    onUpdateBrief({
      ...brief,
      internalStatus: "Rate Card List Confirmed",
      activityLog: [...(brief.activityLog || []), log]
    });
  };

  const handleAddInfluencerClick = (groupId) => {
    setCurrentGroupId(groupId);
    setReplacingInfInfo(null);
    setSelectModalOpen(true);
  };

  const handleReplaceInfluencerClick = (groupId, infId, infName) => {
    setReplacingInfInfo({ groupId, infId, infName });
    setSelectModalOpen(true);
  };

  const handleSelectInfluencer = (inf) => {
    setSelectModalOpen(false);

    if (replacingInfInfo) {
      const { groupId, infId, infName } = replacingInfInfo;
      const currentData = groupTrackers[groupId] || { influencers: [] };
      
      const newInfluencer = {
        id: Date.now() + Math.random(),
        accountName: inf ? inf.username : "",
        accountLink: inf ? `https://${inf.platform.toLowerCase()}.com/${inf.username.replace("@", "")}` : "",
        follower: inf ? inf.followers.toString() : "",
        channel: inf ? inf.platform : "Other",
        contact: inf?.contacts ? inf.contacts.map(x => `${x.type === "Tel" ? "เบอร์" : x.type}: ${x.value}${x.name ? ` (${x.name})` : ""}`).join(", ") : "",
        contacts: inf?.contacts ? [...inf.contacts] : [],
        rawCost: inf?.rawCost ? inf.rawCost.replace(/[^0-9]/g, "") : "",
        creditTerm: "",
        paymentType: "",
        services: {},
        scopeOfWork: currentData.influencers.find(i => i.id === infId)?.scopeOfWork || "",
        detail: "",
        condition: "1. แก้ไขดราฟได้สูงสุดกี่ครั้ง =\n2. ใส่ # สูงสุดได้กี่อัน =\n3. ใส่ Text/AW/Logo ในชิ้นงานได้หรือไม่ =\n4. ระยะเวลาทำ Script/Idea  =\n5. ระยะเวลาทำ Draft = \n6. ลบโพสต์หรือไม่ = ",
        brandSupports: {},
        competitorNote: "",
        note: "",
        replacedFor: infName,
        internalStatus: "Pitching",
        postingStatus: "Pending",
        clientStatus: "Pending"
      };

      const newData = {
        ...currentData,
        influencers: currentData.influencers.map(i => i.id === infId ? { ...i, contactStatus: "ถูกแทนที่" } : i).concat(newInfluencer).sort((a, b) => {
          const nameA = (a.accountName || "").toLowerCase();
          const nameB = (b.accountName || "").toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        })
      };

      const newTrackers = {
        ...groupTrackers,
        [groupId]: newData
      };
      setGroupTrackers(newTrackers);
      onUpdateBrief({ ...brief, groupTrackers: newTrackers });
      setReplacingInfInfo(null);
      return;
    }

    if (!currentGroupId) return;

    const currentData = groupTrackers[currentGroupId] || { influencers: [] };
    const newInfluencer = {
      id: Date.now() + Math.random(),
      accountName: inf ? inf.username : "",
      accountLink: inf ? `https://${inf.platform.toLowerCase()}.com/${inf.username.replace("@", "")}` : "",
      follower: inf ? inf.followers.toString() : "",
      channel: inf ? inf.platform : "Other",
      contact: inf?.contacts ? inf.contacts.map(x => `${x.type === "Tel" ? "เบอร์" : x.type}: ${x.value}${x.name ? ` (${x.name})` : ""}`).join(", ") : "",
      contacts: inf?.contacts ? [...inf.contacts] : [],
      rawCost: inf?.rawCost ? inf.rawCost.replace(/[^0-9]/g, "") : "",
      creditTerm: "",
      paymentType: "",
      services: {},
      scopeOfWork: "",
      detail: "",
      condition: "1. แก้ไขดราฟได้สูงสุดกี่ครั้ง =\n2. ใส่ # สูงสุดได้กี่อัน =\n3. ใส่ Text/AW/Logo ในชิ้นงานได้หรือไม่ =\n4. ระยะเวลาทำ Script/Idea  =\n5. ระยะเวลาทำ Draft = \n6. ลบโพสต์หรือไม่ = ",
      brandSupports: {},
      competitorNote: "",
      note: "",
      internalStatus: "Pitching",
      postingStatus: "Pending",
      clientStatus: "Pending"
    };

    const newData = {
      ...currentData,
      influencers: [...currentData.influencers, newInfluencer].sort((a, b) => {
        const nameA = (a.accountName || "").toLowerCase();
        const nameB = (b.accountName || "").toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      })
    };
    const newTrackers = {
      ...groupTrackers,
      [currentGroupId]: newData
    };
    setGroupTrackers(newTrackers);
    onUpdateBrief({ ...brief, groupTrackers: newTrackers });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4 space-y-6 min-w-0">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm p-6 lg:p-8">
            <div className="mb-6 border-b border-slate-100 pb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Rate card list</h1>
                <p className="text-slate-500 mt-1">{brief.campaignName} • {brief.id}</p>
              </div>
            </div>

            {activeGroups.length === 0 ? (
              <div className="text-center py-16 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                <p className="text-slate-600">Please go back to "Recap & Group Setup" to create groups.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {activeGroups.map(grp => (
                  <TrackerTable 
                    key={grp.id}
                    group={grp}
                    groupName={grp.name}
                    brief={brief}
                    trackerData={groupTrackers[grp.id] || { influencers: [] }}
                    onUpdateTracker={(newData) => {
                      const newTrackers = { ...groupTrackers, [grp.id]: newData };
                      setGroupTrackers(newTrackers);
                      onUpdateBrief({ ...brief, groupTrackers: newTrackers });
                    }}
                    onAddClick={(groupId) => handleAddInfluencerClick(grp.id)}
                    onReplaceClick={(groupName, infId, infName) => handleReplaceInfluencerClick(grp.id, infId, infName)}
                    readOnly={false}
                    allowStatusEdit={true}
                    hideAddButton={true}
                    allowReorder={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/4 shrink-0">
          <div className="sticky top-6 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Actions</h3>
              <div className="flex flex-col gap-3">
                {activeGroups.length > 0 && brief.internalStatus !== "Rate Card List Confirmed" && (
                  <Button className="w-full" onClick={handleConfirmRateCardList}>Confirm Rate Card List</Button>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-200px)]">
              <div className="p-5 border-b border-slate-100 shrink-0">
                <h3 className="text-sm font-semibold text-slate-800">ชุดคำถาม</h3>
                <p className="text-xs text-slate-500 mt-1">สามารถแก้ไขและบันทึกเพื่อใช้คัดลอกได้</p>
                <div className="flex gap-2 mt-4 bg-slate-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setActiveTemplateTab("Influencer")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${activeTemplateTab === "Influencer" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Influencer
                  </button>
                  <button 
                    onClick={() => setActiveTemplateTab("Celebrity")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${activeTemplateTab === "Celebrity" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Celebrity
                  </button>
                </div>
              </div>
              <div className="p-5 overflow-y-auto flex-1 min-h-[300px]">
                <textarea 
                  value={templateText[activeTemplateTab]}
                  onChange={(e) => setTemplateText(prev => ({ ...prev, [activeTemplateTab]: e.target.value }))}
                  className="w-full h-full min-h-[300px] text-xs leading-relaxed text-slate-700 p-3 bg-slate-50 border border-slate-200 rounded outline-none focus:border-[#6D5DF6] resize-none"
                />
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0">
                <Button 
                  variant="outline" 
                  className="flex-1 text-xs py-1.5"
                  onClick={() => {
                    navigator.clipboard.writeText(templateText[activeTemplateTab]);
                    setCopiedTab(activeTemplateTab);
                    setTimeout(() => setCopiedTab(null), 2000);
                  }}
                >
                  {copiedTab === activeTemplateTab ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Copied</> : <><Copy className="w-3.5 h-3.5 mr-1" /> Copy</>}
                </Button>
                <Button 
                  className="flex-1 text-xs py-1.5"
                  onClick={() => {
                    onUpdateBrief({ 
                      ...brief, 
                      questionTemplates: {
                        ...brief.questionTemplates,
                        [activeTemplateTab]: templateText[activeTemplateTab]
                      }
                    });
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2000);
                  }}
                >
                  {saveSuccess ? "Saved!" : <><Save className="w-3.5 h-3.5 mr-1" /> Save</>}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectModalOpen && (
          <InfluencerSelectModal 
            open={selectModalOpen} 
            onClose={() => setSelectModalOpen(false)} 
            onSelect={handleSelectInfluencer} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
