import React from "react";
import Select from "../../../../../components/common/Select";

export default function TravelDetailsFormFields({ scope, packageType, onChange }) {
  return (
    <div className="md:col-span-2 pt-6">
      <div className="grid gap-6 md:grid-cols-2 bg-slate-50 p-6 md:p-8 rounded-xl border border-slate-100">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">On-Site & Travel</label>
          <div className="flex items-center gap-6 py-2 border-b border-slate-200 pb-4 mb-4">
            {["ไม่ต้อง (Remote / ถ่ายทำที่ไหนก็ได้)", "ต้อง On-site (เดินทางไปสถานที่ที่กำหนด)"].map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name={`requireTravel-${scope.id}`} 
                  value={opt} 
                  checked={(scope.requireTravel || "ไม่ต้อง (Remote / ถ่ายทำที่ไหนก็ได้)") === opt} 
                  onChange={e => onChange('requireTravel', e.target.value)} 
                  className="h-4 w-4 text-[#6D5DF6]" 
                />
                <span className="text-sm text-slate-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {scope.requireTravel === "ต้อง On-site (เดินทางไปสถานที่ที่กำหนด)" && (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">รูปแบบการไปสถานที่</label>
              <Select 
                value={scope.onSiteType || ""} 
                onChange={val => onChange('onSiteType', val)} 
                options={["ไปร่วม Event (กำหนดวัน-เวลา)", "ไปถ่ายทำ (Flexible Date)"]} 
              />
            </div>

            {scope.onSiteType === "ไปร่วม Event (กำหนดวัน-เวลา)" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">ระยะเวลาเข้าร่วม Event</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={scope.eventDuration || ""} 
                    onChange={e => onChange('eventDuration', e.target.value)} 
                    placeholder="เช่น 2, 4" 
                    className="w-full rounded-lg border border-slate-200 bg-white pl-4 pr-16 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">ชั่วโมง</span>
                </div>
              </div>
            )}

            {!packageType?.startsWith("Standard") && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">ค่าใช้จ่ายเพิ่มเติม (Reviewer Travel Expense)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={scope.reviewerTravelExpense || ""} 
                    onChange={e => onChange('reviewerTravelExpense', e.target.value)} 
                    placeholder="ระบุค่าเดินทาง/ที่พัก" 
                    className="w-full rounded-lg border border-slate-200 bg-white pl-4 pr-12 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">THB</span>
                </div>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">รายละเอียดสถานที่ (Location Details)</label>
              <textarea 
                value={scope.locationDetails || ""} 
                onChange={e => onChange('locationDetails', e.target.value)} 
                rows={2} 
                placeholder="เช่น ชื่อร้าน, จังหวัด, หรือรายละเอียดเพิ่มเติม" 
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#6D5DF6] resize-none" 
              />
            </div>
            
            <div className="md:col-span-2 pt-2 border-t border-slate-200 mt-2">
              <label className="flex items-center gap-3 cursor-pointer p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-[#6D5DF6] transition-colors">
                <input 
                  type="checkbox" 
                  checked={scope.buddyReviewSupport === "Yes"} 
                  onChange={e => onChange('buddyReviewSupport', e.target.checked ? "Yes" : "No")} 
                  className="h-5 w-5 rounded border-slate-300 text-[#6D5DF6] focus:ring-[#6D5DF6]" 
                />
                <div>
                  <div className="text-sm font-bold text-slate-800">ต้องการให้ทีม Buddy Review ลงพื้นที่ด้วยหรือไม่?</div>
                  <div className="text-xs text-slate-500 mt-0.5">ทีมงานจะลงพื้นที่เพื่อคุมงานและอำนวยความสะดวก (มีค่าใช้จ่ายเพิ่มเติม)</div>
                </div>
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
