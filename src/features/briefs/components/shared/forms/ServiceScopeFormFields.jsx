import React from "react";
import MultiSelect from "../../../../../components/common/MultiSelect";

export default function ServiceScopeFormFields({ scope, packageType, onChange }) {
  const scopePlats = Array.isArray(scope.platforms) ? scope.platforms : (scope.platforms ? [scope.platforms] : []);
  const durationOptions = packageType?.startsWith("Standard") 
    ? ["7 วัน", "15 วัน", "30 วัน"] 
    : ["7 วัน", "15 วัน", "30 วัน", "60 วัน", "90 วัน", "180 วัน", "365 วัน", "Permanent"];

  return (
    <div className="md:col-span-2">
      <h5 className="mb-4 text-sm font-semibold text-slate-900 pt-6 mt-4 border-t border-slate-200">Boost by page</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div>
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input 
              type="checkbox" 
              checked={scope.serviceScope?.buyoutRequired || false} 
              onChange={e => onChange('buyoutRequired', e.target.checked)} 
              className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" 
            />
            <span className="text-sm font-medium text-slate-700">Buyout</span>
          </label>
          {scope.serviceScope?.buyoutRequired && (
            <div className="pl-6">
              <MultiSelect value={scope.serviceScope?.buyoutDuration || []} onChange={val => onChange('buyoutDuration', val)} options={durationOptions} placeholder="Duration" />
            </div>
          )}
        </div>

        {scopePlats.some(p => ["Facebook", "Facebook Page", "Instagram", "TikTok"].includes(p)) && (
          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input type="checkbox" checked={scope.serviceScope?.boostPostRequired || false} onChange={e => onChange('boostPostRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-350 text-[#6D5DF6]" />
              <span className="text-sm font-medium text-slate-700">Boost by Page</span>
            </label>
            {scope.serviceScope?.boostPostRequired && (
              <div className="pl-6">
                <MultiSelect value={scope.serviceScope?.boostPostDuration || []} onChange={val => onChange('boostPostDuration', val)} options={durationOptions} placeholder="Duration" />
              </div>
            )}
          </div>
        )}

        {scopePlats.some(p => ["Facebook", "Facebook Page", "Instagram", "TikTok", "YouTube", "X"].includes(p)) && (
          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input type="checkbox" checked={scope.serviceScope?.addAdsRequired || false} onChange={e => onChange('addAdsRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
              <span className="text-sm font-medium text-slate-700">Add Ads</span>
            </label>
            {scope.serviceScope?.addAdsRequired && (
              <div className="pl-6">
                <MultiSelect value={scope.serviceScope?.addAdsDuration || []} onChange={val => onChange('addAdsDuration', val)} options={durationOptions} placeholder="Duration" />
              </div>
            )}
          </div>
        )}

        {scopePlats.some(p => ["Facebook", "Facebook Page", "Instagram", "TikTok"].includes(p)) && (
          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input type="checkbox" checked={scope.serviceScope?.paidPartnershipRequired || false} onChange={e => onChange('paidPartnershipRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-350 text-[#6D5DF6]" />
              <span className="text-sm font-medium text-slate-700">Paid Partnership</span>
            </label>
            {scope.serviceScope?.paidPartnershipRequired && (
              <div className="pl-6">
                <MultiSelect value={scope.serviceScope?.paidPartnershipDuration || []} onChange={val => onChange('paidPartnershipDuration', val)} options={durationOptions} placeholder="Duration" />
              </div>
            )}
          </div>
        )}

        {scopePlats.includes("YouTube") && (
          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input type="checkbox" checked={scope.serviceScope?.discoveryRequired || false} onChange={e => onChange('discoveryRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
              <span className="text-sm font-medium text-slate-700">Youtube Discovery</span>
            </label>
            {scope.serviceScope?.discoveryRequired && (
              <div className="pl-6">
                <MultiSelect value={scope.serviceScope?.discoveryDuration || []} onChange={val => onChange('discoveryDuration', val)} options={durationOptions} placeholder="Duration" />
              </div>
            )}
          </div>
        )}

        {scopePlats.includes("TikTok") && (
          <>
            <div>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input type="checkbox" checked={scope.serviceScope?.genCodeRequired || false} onChange={e => onChange('genCodeRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-350 text-[#6D5DF6]" />
                <span className="text-sm font-medium text-slate-700">Gen Code</span>
              </label>
              {scope.serviceScope?.genCodeRequired && (
                <div className="pl-6">
                  <MultiSelect value={scope.serviceScope?.genCodeDuration || []} onChange={val => onChange('genCodeDuration', val)} options={durationOptions} placeholder="Duration" />
                </div>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={scope.serviceScope?.tiktokShopRequired || false} onChange={e => onChange('tiktokShopRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
                <span className="text-sm font-medium text-slate-700">TikTok Shop</span>
              </label>
            </div>
          </>
        )}

        {scopePlats.some(p => ["Facebook", "Facebook Page"].includes(p)) && (
          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input type="checkbox" checked={scope.serviceScope?.brandedContentRequired || false} onChange={e => onChange('brandedContentRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
              <span className="text-sm font-medium text-slate-700">FB Branded Content</span>
            </label>
            {scope.serviceScope?.brandedContentRequired && (
              <div className="pl-6">
                <MultiSelect value={scope.serviceScope?.brandedContentDuration || []} onChange={val => onChange('brandedContentDuration', val)} options={durationOptions} placeholder="Duration" />
              </div>
            )}
          </div>
        )}

        {scopePlats.includes("X") && (
          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input type="checkbox" checked={scope.serviceScope?.whitelistingRequired || false} onChange={e => onChange('whitelistingRequired', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D5DF6]" />
              <span className="text-sm font-medium text-slate-700">X Whitelisting</span>
            </label>
            {scope.serviceScope?.whitelistingRequired && (
              <div className="pl-6">
                <MultiSelect value={scope.serviceScope?.whitelistingDuration || []} onChange={val => onChange('whitelistingDuration', val)} options={durationOptions} placeholder="Duration" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
