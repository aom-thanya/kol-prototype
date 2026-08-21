import React, { useState } from "react";
import { CheckCircle2, Copy } from "lucide-react";
import { cn } from "../../utils/cn";

export default function GreetingTemplate() {
  const [activeTab, setActiveTab] = useState("influencer");
  const [copiedId, setCopiedId] = useState(null);

  const influencerText = `สวัสดีครับ เบสจาก Buddy Review นะครับ 
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

  const celebrityText = `Client : 
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

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentText = activeTab === "influencer" ? influencerText : celebrityText;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm p-6 lg:p-8 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Greeting Template</h2>
          <p className="text-sm text-slate-500 mt-1">Copy these templates to reach out to influencers or celebrities</p>
        </div>
        <button
          onClick={() => handleCopy(currentText, activeTab)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition"
        >
          {copiedId === activeTab ? (
            <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <span className="text-emerald-600">Copied!</span></>
          ) : (
            <><Copy className="w-4 h-4" /> Copy Text</>
          )}
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("influencer")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition",
            activeTab === "influencer" ? "bg-[#6D5DF6] text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          )}
        >
          For Influencer
        </button>
        <button
          onClick={() => setActiveTab("celebrity")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition",
            activeTab === "celebrity" ? "bg-[#6D5DF6] text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          )}
        >
          For Celebrity
        </button>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-x-auto">
        <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
          {currentText}
        </pre>
      </div>
    </div>
  );
}
