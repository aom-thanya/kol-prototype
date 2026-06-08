import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, ChevronRight, ArrowLeft } from "lucide-react";

const standardCostData = [
  {
    id: "ig-fb-x",
    title: "IG / Facebook / X Twitter / Application / E-COMMERCE App",
    platforms: ["Instagram", "Facebook", "X (Twitter)", "Application", "E-Commerce App"],
    followers: ["1K - 5K", "5K - 10K", "10K - 50K", "50K - 100K", "100K+"],
    costs: [
      {
        category: "Social Cost",
        items: [
          { topic: "IG/Twitter", rates: ["100", "200", "450", "2,000", "3,000"] },
          { topic: "Facebook", rates: ["50", "100", "150", "400", "RateCard"] },
        ]
      },
      {
        category: "Support Cost",
        items: [
          { topic: "Photos", rates: ["400", "650", "900", "1,200", "1,500"] },
          { topic: "VDO", rates: ["900", "1,200", "1,500", "2,000", "3,000"] },
          { topic: "Only story", rates: ["300", "500", "700", "1,000", "1,500"] },
          { topic: "Artwork", rates: ["300", "500", "700", "1,000", "1,500"] },
          { topic: "Share post", rates: ["100", "200", "300", "500", "1,000"] },
          { topic: "Trend / Seeding comment", rates: ["50", "100", "150", "200", "300"] },
          { topic: "Trend / Seeding comment + photo", rates: ["100", "200", "300", "400", "500"] },
          { topic: "Seeding Download App/ Rating App /Comment", rates: ["200\n*Not Commit Follower*"], spanAll: true },
          { topic: "Seeding Photo E-COMMERCE APP", rates: ["300\n*Not Commit Follower*"], spanAll: true },
          { topic: "Content Blog / Group ตั้งโพสต์", rates: ["1,000", "1,500", "2,000", "RateCard", "RateCard"] }
        ]
      },
      {
        category: "Via Cost",
        items: [
          { topic: "Story", rates: ["200", "200", "300", "500", "1,000"] },
          { topic: "Via", rates: ["200", "200", "200", "300", "1,000"] },
        ]
      },
      {
        category: "Other Cost",
        items: [
          { topic: "Gencode/Add Ads (% จากค่าตัว)", rates: ["50%", "50%", "30%", "25%", "20%"] },
          { topic: "Buy Out (30 days) (% จากค่าตัว)", rates: ["50%", "50%", "50%", "50%", "30%"] },
          { topic: "ค่า OT OP\n* เฉพาะเสาร์-อาทิตย์ และหยุดนักขัตฤกษ์", rates: ["ครึ่งวัน\nอิงตาม จำนวนอินฟลูฯ\n1-15 คน : เก็บ OT 1,500 บาท\n15-30 คน : เก็บ OT 3,000 บาท\n\nเต็มวัน\nจำนวนอินฟลูฯ\n1-15 คน : เก็บ OT 2,500 บาท\n15-30 คน : เก็บ OT 5,000 บาท\n\nNote: กรณีเป็น งาน Shopping List Rate Card ที่มีการออกนอกสถานที่ หรือ ต้องมีค่า OT ให้ OP ให้ใส่ค่า OT ในช่อง other cost (โดยระบุเป็นค่า OT OP ไปเลย) สูตรคือ 1% จาก rawcost ไม่ต่ำกว่า 500 บาท (ไม่ต้องคิด ร้อย20%)\n>> ให้ต่ำสุดที่ 500 บาท / สูงสุดไม่เกิน 2,500 บาท <<"], spanAll: true }
        ]
      },
      {
        category: "Travel Expenses",
        items: [
          { topic: "BTS < 1 KM", rates: ["500"], spanAll: true },
          { topic: "BTS < 5 KM - 10 KM", rates: ["1,000"], spanAll: true },
          { topic: "BTS > 10 KM", rates: ["1,500"], spanAll: true },
          { topic: "กรณีนอกกรุงเทพ คิด Case by Case", rates: ["Case by Case"], spanAll: true }
        ]
      }
    ]
  },
  {
    id: "tiktok",
    title: "TikTok",
    platforms: ["TikTok"],
    followers: ["1K - 5K", "5K - 10K", "10K - 50K", "50K - 100K", "100K+"],
    subFollowers: ["Review", "Dance"],
    costs: [
      {
        category: "Social Cost",
        items: [
          { topic: "TikTok", rates: ["50", "50", "125", "125", "325", "325", "625", "625", "1,250", "1,250"] }
        ]
      },
      {
        category: "Support Cost",
        items: [
          { topic: "Photos", rates: ["750", "870", "1,005", "1,125", "1,125", "1,305", "1,125", "1,425", "1,950", "2,250"] },
          { topic: "VDO", rates: ["1,250", "1,450", "1,675", "1,875", "1,875", "2,175", "1,875", "2,375", "3,250", "4,250"] }
        ]
      },
      {
        category: "Via Cost",
        items: [
          { topic: "Via", rates: ["200", "200", "300", "300", "500", "500", "500", "500", "1,000", "1,000"] }
        ]
      },
      {
        category: "Other Cost",
        items: [
          { topic: "Gencode/Add Ads (% จากค่าตัว)", rates: ["50%", "50%", "50%", "50%", "30%", "30%", "25%", "25%", "20%", "20%"] },
          { topic: "Buy Out (30 days) (% จากค่าตัว)", rates: ["50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "30%", "30%"] },
          { topic: "TikTok Shop / SKU", rates: ["500", "500", "500", "500", "1,000", "1,000", "1,500", "1,500", "Rate Card", "Rate Card"] },
          { topic: "SKU ชิ้นต่อไป", rates: ["500", "500", "500", "500", "700", "700", "700", "700", "Rate Card", "Rate Card"] },
        ]
      }
    ]
  },
  {
    id: "lemon8",
    title: "Lemon8",
    platforms: ["Lemon8"],
    followers: ["1K - 5K", "5K - 10K", "10K - 50K", "50K - 100K", "100K+"],
    costs: [
      {
        category: "Support Cost",
        items: [
          { topic: "Photos", rates: ["1,000", "1,500", "2,000", "Rate card", "Rate card"] },
          { topic: "VDO", rates: ["1,500", "2,000", "2,250", "Rate card", "Rate card"] },
        ]
      },
      {
        category: "Via Cost",
        items: [
          { topic: "Via", rates: ["200", "300", "500", "-", "-"] }
        ]
      },
      {
        category: "Other Cost",
        items: [
          { topic: "Buy Out (30 days) (% จากค่าตัว)", rates: ["50%", "50%", "50%", "-", "-"] },
          { topic: "SKU ชิ้นต่อไป", rates: ["500", "700", "-", "-", "-"] },
        ]
      }
    ]
  }
];

export default function StandardCostFlow() {
  const [selectedGroup, setSelectedGroup] = useState(null);

  if (selectedGroup) {
    return <StandardCostDetail group={selectedGroup} onBack={() => setSelectedGroup(null)} />;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 lg:text-3xl">Standard Cost</h1>
          <p className="mt-2 text-sm text-slate-500">Select a social media group to view standard rate cards and costs.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {standardCostData.map(group => (
          <motion.div 
            key={group.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="group cursor-pointer rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md overflow-hidden flex flex-col"
            onClick={() => setSelectedGroup(group)}
          >
            <div className="p-6 pb-4 flex-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-[#6D5DF6]">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900 line-clamp-2">{group.title}</h3>
              <div className="flex flex-wrap gap-2 mt-4">
                {group.platforms.map(p => (
                  <span key={p} className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
              <span className="text-sm font-medium text-[#6D5DF6]">View Standard Cost</span>
              <ChevronRight className="h-5 w-5 text-[#6D5DF6] transition-transform group-hover:translate-x-1" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StandardCostDetail({ group, onBack }) {
  const getCategoryColor = (category) => {
    switch (category) {
      case "Social Cost": return "bg-cyan-100 border-cyan-200 text-cyan-800";
      case "Support Cost": return "bg-emerald-100 border-emerald-200 text-emerald-800";
      case "Via Cost": return "bg-amber-100 border-amber-200 text-amber-800";
      case "Other Cost": return "bg-yellow-100 border-yellow-200 text-yellow-800";
      case "Travel Expenses": return "bg-slate-100 border-slate-200 text-slate-800";
      default: return "bg-slate-100 border-slate-200 text-slate-800";
    }
  };

  return (
    <div className="mx-auto max-w-7xl pb-20">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#6D5DF6] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Overview
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 lg:text-3xl">{group.title}</h1>
            <p className="mt-2 text-sm text-slate-500">Standard rate card grouped by cost type and follower count.</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-4 font-semibold text-slate-900 border-r border-slate-200 bg-white min-w-[120px] sticky left-0 z-20">Cost Type</th>
                <th className="px-4 py-4 font-semibold text-slate-900 border-r border-slate-200 bg-white min-w-[200px] sticky left-[120px] z-20">Topic/Follower</th>
                {group.followers.map((follower, idx) => (
                  <th 
                    key={follower} 
                    colSpan={group.subFollowers ? group.subFollowers.length : 1}
                    className="px-4 py-4 font-semibold text-slate-900 text-center border-r border-slate-200 min-w-[100px]"
                  >
                    {follower}
                  </th>
                ))}
              </tr>
              {group.subFollowers && (
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-0 border-r border-slate-200 bg-white sticky left-0 z-20"></th>
                  <th className="p-0 border-r border-slate-200 bg-white sticky left-[120px] z-20"></th>
                  {group.followers.map((_, i) => (
                    <React.Fragment key={i}>
                      {group.subFollowers.map((sub, j) => (
                        <th key={j} className="px-4 py-2 font-medium text-slate-600 text-center border-r border-slate-200 text-xs bg-slate-50">
                          {sub}
                        </th>
                      ))}
                    </React.Fragment>
                  ))}
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-200">
              {group.costs.map((costSection, sectionIdx) => (
                <React.Fragment key={costSection.category}>
                  {costSection.items.map((item, itemIdx) => (
                    <tr key={`${costSection.category}-${itemIdx}`} className="hover:bg-slate-50/50 transition-colors">
                      {itemIdx === 0 && (
                        <td 
                          rowSpan={costSection.items.length} 
                          className={`px-4 py-3 font-semibold align-middle border-r border-slate-200 sticky left-0 z-10 whitespace-pre-wrap ${getCategoryColor(costSection.category)}`}
                        >
                          {costSection.category}
                        </td>
                      )}
                      <td className="px-4 py-3 font-medium text-slate-800 border-r border-slate-200 bg-white sticky left-[120px] z-10 whitespace-pre-wrap leading-relaxed">
                        {item.topic}
                      </td>
                      {item.spanAll ? (
                        <td 
                          colSpan={group.followers.length * (group.subFollowers ? group.subFollowers.length : 1)} 
                          className="px-6 py-4 text-center text-slate-700 font-medium whitespace-pre-wrap bg-slate-50 text-[13px] leading-relaxed border-r border-slate-200"
                        >
                          {item.rates[0]}
                        </td>
                      ) : (
                        item.rates.map((rate, rIdx) => {
                          const isRateCard = rate.toLowerCase().includes("rate");
                          const isSpecial = rate.includes("%") || rate === "-";
                          return (
                            <td 
                              key={rIdx} 
                              className={`px-4 py-3 text-center border-r border-slate-200 font-medium ${isRateCard ? 'text-red-500' : isSpecial ? 'text-slate-600' : 'text-slate-900'}`}
                            >
                              {rate}
                            </td>
                          );
                        })
                      )}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
