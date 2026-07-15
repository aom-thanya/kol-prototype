import React from "react";
import Select from "../../../../../components/common/Select";

export default function BrandSupportFormFields({ scope, onChange }) {
  return (
    <div className="md:col-span-2 border-t border-slate-200 pt-6 space-y-4">
      <h5 className="text-sm font-semibold text-slate-900">Brand Support & On-Site</h5>
      <div className="grid gap-6 md:grid-cols-2 bg-slate-50 p-6 md:p-8 rounded-xl border border-slate-100">
        <div className="md:col-span-2">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Brand Support Type</label>
          <div className="flex items-center gap-6 py-1">
            {["No Sponsor", "Brand Sponsor"].map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name={`brandSupportType-${scope.id}`} 
                  value={opt} 
                  checked={(scope.brandSupportType || "No Sponsor") === opt} 
                  onChange={e => {
                    onChange('brandSupportType', e.target.value);
                    onChange('productReceiveMethod', "");
                    onChange('reimbursement', "");
                  }} 
                  className="h-4 w-4 text-[#6D5DF6]" 
                />
                <span className="text-sm text-slate-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">วิธีการรับสินค้า/บริการ</label>
          <Select 
            value={scope.productReceiveMethod || ""} 
            onChange={val => {
              onChange('productReceiveMethod', val);
              if (val !== "Influencer ซื้อเอง") {
                onChange('reimbursement', "");
              }
            }} 
            options={
              (scope.brandSupportType || "No Sponsor") === "No Sponsor" 
                ? ["Buddy Review ซื้อและจัดส่งให้ Influencer", "Influencer ซื้อเอง"] 
                : scope.brandSupportType === "Brand Sponsor" 
                  ? ["Sponsor สินค้า (Buddy Review จัดส่ง)", "Sponsor สินค้า (แบรนด์จัดส่ง)", "สินค้าเวียน/ยืม (Borrowed/Rotated)"] 
                  : []
            } 
          />
        </div>

        {["Buddy Review ซื้อและจัดส่งให้ Influencer", "Sponsor สินค้า (Buddy Review จัดส่ง)"].includes(scope.productReceiveMethod) && (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">ค่าจัดส่งต่อ Influencer</label>
            <div className="relative">
              <input 
                type="number" 
                value={scope.logisticsPerInfluencer || ""} 
                onChange={e => onChange('logisticsPerInfluencer', e.target.value)} 
                placeholder="ระบุค่าจัดส่งต่อ Influencer" 
                className="w-full rounded-lg border border-slate-200 bg-white pl-4 pr-12 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">THB</span>
            </div>
          </div>
        )}

        {scope.productReceiveMethod === "สินค้าเวียน/ยืม (Borrowed/Rotated)" && (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Logistic Brand to Buddy</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={scope.logisticBrandToBuddy || ""} 
                  onChange={e => onChange('logisticBrandToBuddy', e.target.value)} 
                  placeholder="ระบุค่าจัดส่ง Brand to Buddy" 
                  className="w-full rounded-lg border border-slate-200 bg-white pl-4 pr-12 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">THB</span>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">ค่าจัดส่งต่อ Influencer</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={scope.logisticInfluencerToBuddy || ""} 
                  onChange={e => onChange('logisticInfluencerToBuddy', e.target.value)} 
                  placeholder="ระบุค่าจัดส่ง Influencer to Buddy" 
                  className="w-full rounded-lg border border-slate-200 bg-white pl-4 pr-12 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">THB</span>
              </div>
            </div>
          </>
        )}

        {scope.productReceiveMethod === "Influencer ซื้อเอง" && (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Reimbursement (Advance)</label>
            <div className="relative">
              <input 
                type="number" 
                value={scope.reimbursement || ""} 
                onChange={e => onChange('reimbursement', e.target.value)} 
                placeholder="ระบุยอดเงินที่เบิกจ่ายล่วงหน้า" 
                className="w-full rounded-lg border border-slate-200 bg-white pl-4 pr-12 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">THB</span>
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Product Value</label>
          <div className="relative">
            <input 
              type="number" 
              value={scope.productValue || ""} 
              onChange={e => onChange('productValue', e.target.value)} 
              placeholder="ระบุมูลค่าสินค้า" 
              className="w-full rounded-lg border border-slate-200 bg-white pl-4 pr-12 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">THB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
