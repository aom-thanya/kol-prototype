import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { formatCurrency } from "../../utils/formatHelpers";
import { getCampaignCalculations } from "../../utils/campaignCalculations";

export default function DealsheetStandardView({ brief, onUpdateBrief, showToast, activeOptId, setActiveOptId, children }) {

  const calc = getCampaignCalculations(brief, activeOptId);

  const hasStandard = brief && (
    Array.isArray(brief.packageType) 
      ? brief.packageType.some(p => p.toLowerCase().includes("standard"))
      : (typeof brief.packageType === "string" && brief.packageType.toLowerCase().includes("standard"))
  );
  
  const hasKpi = brief && (
    Array.isArray(brief.packageType) 
      ? brief.packageType.some(p => {
          if (typeof p !== "string") return false;
          if (p === "Others") {
            return brief.packageTypeOther && brief.packageTypeOther.toLowerCase().includes("kpi");
          }
          return p.toLowerCase().includes("kpi");
        })
      : (typeof brief.packageType === "string" && brief.packageType.toLowerCase().includes("kpi"))
  );

  const isStandardKpi = hasStandard && hasKpi;

  // States
  const optionContingency = brief.customContingencyPercent?.[activeOptId];
  const [contingencyPercent, setContingencyPercent] = useState(5);

  const optionDivisor = brief.customDivisor?.[activeOptId];
  const defaultDivisor = brief.customerType === "Non-Key Account" ? 2.3 : 2.1;
  const [divisor, setDivisor] = useState(defaultDivisor);

  const optionChannelCosts = brief.customChannelCosts?.[activeOptId] || {};
  const [channelCostsOverrides, setChannelCostsOverrides] = useState({});

  const optionAvgCost = brief.customAvgCost?.[activeOptId];

  // Synchronize state with incoming brief changes or option switches
  const serializedChannelCosts = JSON.stringify(brief.customChannelCosts?.[activeOptId] || {});
  
  // Other Services state
  const optionOtherServices = brief.customOtherServices?.[activeOptId] || [];
  const [otherServices, setOtherServices] = useState([]);

  // Sync otherServices with option switches or brief changes
  useEffect(() => {
    setOtherServices(optionOtherServices);
  }, [activeOptId, JSON.stringify(optionOtherServices)]);

  // Calculate total other services from overrides
  const totalOtherServicesVal = otherServices.reduce((sum, s) => {
    const price = Number(s.price) || 0;
    const feeType = s.feeType || (s.feePercent !== undefined ? "percent" : "baht");
    
    let feeVal = 0;
    if (s.feeValue !== undefined) {
      feeVal = Number(s.feeValue) || 0;
    } else if (s.feePercent !== undefined) {
      feeVal = Number(s.feePercent) || 0;
    } else if (s.fee !== undefined) {
      feeVal = Number(s.fee) || 0;
    }

    const calculatedFeeAmt = feeType === "percent" ? Math.round(calc.totalBudget * feeVal / 100) : feeVal;
    return sum + price + calculatedFeeAmt;
  }, 0);

  useEffect(() => {
    setContingencyPercent(optionContingency !== undefined ? optionContingency : 5);
    setDivisor(optionDivisor !== undefined ? optionDivisor : defaultDivisor);
    setChannelCostsOverrides(brief.customChannelCosts?.[activeOptId] || {});
  }, [activeOptId, optionContingency, optionDivisor, defaultDivisor, serializedChannelCosts]);

  // Buddy Boost overrides
  const optionBuddyboostAds = brief.customBuddyboostAds?.[activeOptId];
  const optionBuddyboostFeePercent = brief.customBuddyboostFeePercent?.[activeOptId];
  const optionBuddyboostCpr = brief.customBuddyboostCpr?.[activeOptId];

  const defaultBuddyboostAds = calc.totalBoostAds;
  const getCpr = () => {
    const platformList = Array.isArray(brief.platform) 
      ? brief.platform 
      : [brief.platform || "TikTok"];
    const matched = platformList.filter(p => {
      const name = String(p).toLowerCase();
      return name.includes("facebook") || name.includes("instagram") || name.includes("tiktok") || name.includes("youtube");
    });
    return matched.length > 0 ? "0.03" : "0.03";
  };
  const defaultBuddyboostCpr = getCpr();

  const [buddyboostAds, setBuddyboostAdsState] = useState(defaultBuddyboostAds);
  const [buddyboostFeePercent, setBuddyboostFeePercentState] = useState(20);
  const [buddyboostCpr, setBuddyboostCprState] = useState(defaultBuddyboostCpr);

  useEffect(() => {
    setBuddyboostAdsState(optionBuddyboostAds !== undefined ? optionBuddyboostAds : defaultBuddyboostAds);
  }, [activeOptId, optionBuddyboostAds, defaultBuddyboostAds]);

  useEffect(() => {
    setBuddyboostFeePercentState(optionBuddyboostFeePercent !== undefined ? optionBuddyboostFeePercent : 20);
  }, [activeOptId, optionBuddyboostFeePercent]);

  useEffect(() => {
    setBuddyboostCprState(optionBuddyboostCpr !== undefined ? optionBuddyboostCpr : defaultBuddyboostCpr);
  }, [activeOptId, optionBuddyboostCpr, defaultBuddyboostCpr]);

  const buddyboostFee = buddyboostAds * (buddyboostFeePercent / 100);

  // Derived budget values based on contingencyPercent
  const useBuddyBoostFormula = true;
  const availableBudget = useBuddyBoostFormula 
    ? calc.totalBudget - buddyboostAds - buddyboostFee - totalOtherServicesVal
    : calc.availableBudget;
  const rawCostForInfluencer = divisor > 0 ? (availableBudget / divisor) : 0;
  const contingencies = rawCostForInfluencer * (contingencyPercent / 100);
  const rawCostForCampaign = rawCostForInfluencer - contingencies;

  // Derived channel costs based on overrides
  const overriddenChannels = calc.channelBreakdown.map(c => {
    const overrides = channelCostsOverrides[c.id] || {};
    const logistics = overrides.logistics !== undefined ? overrides.logistics : c.logistics;
    const product = overrides.product !== undefined ? overrides.product : c.product;
    const travel = overrides.travel !== undefined ? overrides.travel : c.travel;
    const social = overrides.social !== undefined ? overrides.social : c.social;
    const support = overrides.support !== undefined ? overrides.support : c.support;
    const special = overrides.special !== undefined ? overrides.special : c.special;
    const via = overrides.via !== undefined ? overrides.via : c.via;
    const other = overrides.other !== undefined ? overrides.other : c.other;

    const channelCost = logistics + product + travel + social + support + special + via + other;
    return {
      ...c,
      logistics,
      product,
      travel,
      social,
      support,
      special,
      via,
      other,
      channelCost
    };
  });

  const calculatedAvgCost = overriddenChannels.reduce((acc, c) => acc + c.channelCost * (c.allocationPercent / 100), 0);

  const [customAvgCost, setCustomAvgCost] = useState(calculatedAvgCost);

  // Update customAvgCost when calculatedAvgCost or activeOption changes (unless manually overridden by user)
  useEffect(() => {
    setCustomAvgCost(optionAvgCost !== undefined ? optionAvgCost : calculatedAvgCost);
  }, [activeOptId, optionAvgCost, calculatedAvgCost]);

  const handleContingencyChange = (e) => {
    const val = e.target.value.replace(/%/g, '');
    if (!isNaN(val)) {
      const p = Number(val);
      setContingencyPercent(p);
      if (onUpdateBrief) {
        onUpdateBrief({ 
          ...brief, 
          customContingencyPercent: {
            ...(brief.customContingencyPercent || {}),
            [activeOptId]: p
          }
        });
      }
    }
  };

  const handleCostOverrideChange = (chanId, key, value) => {
    const val = value.replace(/,/g, '');
    if (!isNaN(val)) {
      const numVal = Number(val);
      const updatedOverrides = {
        ...channelCostsOverrides,
        [chanId]: {
          ...(channelCostsOverrides[chanId] || {}),
          [key]: numVal
        }
      };
      setChannelCostsOverrides(updatedOverrides);
      if (onUpdateBrief) {
        onUpdateBrief({ 
          ...brief, 
          customChannelCosts: {
            ...(brief.customChannelCosts || {}),
            [activeOptId]: updatedOverrides
          }
        });
      }
    }
  };

  const handleAvgCostChange = (e) => {
    const val = e.target.value.replace(/,/g, '');
    if (!isNaN(val)) {
      const numVal = Number(val);
      setCustomAvgCost(numVal);
      if (onUpdateBrief) {
        onUpdateBrief({ 
          ...brief, 
          customAvgCost: {
            ...(brief.customAvgCost || {}),
            [activeOptId]: numVal
          }
        });
      }
    }
  };

  const handleDivisorChange = (e) => {
    const val = e.target.value;
    if (!isNaN(val)) {
      const numVal = Number(val);
      setDivisor(numVal);
      if (onUpdateBrief) {
        onUpdateBrief({
          ...brief,
          customDivisor: {
            ...(brief.customDivisor || {}),
            [activeOptId]: numVal
          }
        });
      }
    }
  };

  const handleBudgetSpendingChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (brief.budgetOptions && brief.budgetOptions.length > 0) {
      const updatedOptions = brief.budgetOptions.map(opt => {
        if (opt.id === activeOptId) {
          return { ...opt, budgetSpending: val };
        }
        return opt;
      });
      onUpdateBrief({ ...brief, budgetOptions: updatedOptions });
    } else {
      onUpdateBrief({ ...brief, budgetSpending: val });
    }
  };

  const handleBuddyboostAdsChange = (e) => {
    const val = e.target.value.replace(/,/g, '');
    if (!isNaN(val)) {
      const numVal = Number(val);
      setBuddyboostAdsState(numVal);
      if (onUpdateBrief) {
        onUpdateBrief({
          ...brief,
          customBuddyboostAds: {
            ...(brief.customBuddyboostAds || {}),
            [activeOptId]: numVal
          }
        });
      }
    }
  };

  const handleBuddyboostFeePercentChange = (e) => {
    const val = e.target.value.replace(/%/g, '');
    if (!isNaN(val)) {
      const p = Number(val);
      setBuddyboostFeePercentState(p);
      if (onUpdateBrief) {
        onUpdateBrief({
          ...brief,
          customBuddyboostFeePercent: {
            ...(brief.customBuddyboostFeePercent || {}),
            [activeOptId]: p
          }
        });
      }
    }
  };

  const handleBuddyboostCprChange = (e) => {
    const val = e.target.value;
    setBuddyboostCprState(val);
    if (onUpdateBrief) {
      onUpdateBrief({
        ...brief,
        customBuddyboostCpr: {
          ...(brief.customBuddyboostCpr || {}),
          [activeOptId]: val
        }
      });
    }
  };

  const handleAddOtherService = () => {
    const newService = { id: Date.now(), name: "", price: 0, feeType: "baht", feeValue: 0 };
    const updated = [...otherServices, newService];
    setOtherServices(updated);
    if (onUpdateBrief) {
      onUpdateBrief({
        ...brief,
        customOtherServices: {
          ...(brief.customOtherServices || {}),
          [activeOptId]: updated
        }
      });
    }
  };

  const handleUpdateOtherService = (id, updates) => {
    const updated = otherServices.map(s => {
      if (s.id === id) {
        let newService = { ...s, ...updates };
        if (updates.price !== undefined) {
          const priceStr = String(updates.price).replace(/,/g, '');
          newService.price = isNaN(priceStr) || priceStr === "" ? updates.price : Number(priceStr);
        }
        if (updates.name !== undefined) {
          // Calculate default feeType and feeValue based on updated service type
          if (updates.name === "ค่าสถานที่") {
            newService.feeType = "percent";
            newService.feeValue = 30;
          } else if (updates.name === "Refer") {
            newService.feeType = "percent";
            newService.feeValue = 5;
          } else {
            newService.feeType = "baht";
            newService.feeValue = 0;
          }
        }
        if (updates.feeValue !== undefined) {
          const feeValueStr = String(updates.feeValue).replace(/,/g, '').replace(/%/g, '');
          newService.feeValue = isNaN(feeValueStr) || feeValueStr === "" ? updates.feeValue : Number(feeValueStr);
        }
        return newService;
      }
      return s;
    });
    setOtherServices(updated);
    if (onUpdateBrief) {
      onUpdateBrief({
        ...brief,
        customOtherServices: {
          ...(brief.customOtherServices || {}),
          [activeOptId]: updated
        }
      });
    }
  };

  const handleRemoveOtherService = (id) => {
    const updated = otherServices.filter(s => s.id !== id);
    setOtherServices(updated);
    if (onUpdateBrief) {
      onUpdateBrief({
        ...brief,
        customOtherServices: {
          ...(brief.customOtherServices || {}),
          [activeOptId]: updated
        }
      });
    }
  };

  const getCostItemNote = (key, chanId) => {
    const activeOpt = brief.budgetOptions?.find(o => o.id === activeOptId) || brief.budgetOptions?.[0];
    const sow = activeOpt?.scopeOfWorks?.find(s => s.id === chanId);
    if (!sow) return null;

    if (key === "logistics") {
      let notes = [];
      if (sow.productReceiveMethod) notes.push(sow.productReceiveMethod);
      if (sow.logisticsPerInfluencer) notes.push(`฿${sow.logisticsPerInfluencer}`);
      return notes.join(" • ");
    }
    if (key === "product") {
      let notes = [];
      if (sow.brandSupportType) notes.push(sow.brandSupportType);
      if (sow.productValue) notes.push(`฿${sow.productValue}`);
      return notes.join(" • ");
    }
    if (key === "travel") {
      let notes = [];
      if (sow.requireTravel) {
        notes.push(sow.requireTravel.split(" ")[0]);
      }
      if (sow.reviewerTravelExpense) {
        notes.push(`ค่าเดินทาง: ${sow.reviewerTravelExpense}`);
      }
      if (sow.locationDetails) {
        notes.push(`สถานที่: ${sow.locationDetails}`);
      }
      return notes.join(" | ");
    }
    return null;
  };

  const avgCostToUse = customAvgCost !== undefined ? customAvgCost : calculatedAvgCost;
  const totalInfluencers = avgCostToUse > 0 ? Math.floor(rawCostForCampaign / avgCostToUse) : 0;

  // Recalculate channel breakdown based on custom totalInfluencers
  let remainingInfs = totalInfluencers;
  const recalculatedChannels = overriddenChannels.map((c, idx) => {
    let numInfs = Math.round(totalInfluencers * (c.allocationPercent / 100));
    if (idx === overriddenChannels.length - 1) {
      numInfs = remainingInfs;
    } else {
      remainingInfs -= numInfs;
    }
    numInfs = Math.max(0, numInfs);
    const reserveInfs = Math.floor(numInfs / 20);
    const influencerCost = c.channelCost * numInfs;

    return {
      ...c,
      numInfs,
      reserveInfs,
      influencerCost
    };
  });

  const sumReserveInfluencers = recalculatedChannels.reduce((acc, c) => acc + c.reserveInfs, 0);

  const handleAddOption = () => {
    if (!brief.budgetOptions || brief.budgetOptions.length === 0) return;
    const sourceOpt = brief.budgetOptions.find(o => o.id === activeOptId) || brief.budgetOptions[0];
    const newId = `opt-${Date.now()}`;
    const newOptionName = `Option ${String.fromCharCode(65 + brief.budgetOptions.length)}`;
    const clonedSows = sourceOpt.scopeOfWorks ? sourceOpt.scopeOfWorks.map((sow, idx) => ({
      ...sow,
      id: `sow-${Date.now()}-${idx}`
    })) : [];
    const newOption = {
      ...sourceOpt,
      id: newId,
      name: newOptionName,
      scopeOfWorks: clonedSows
    };
    const updatedOptions = [...brief.budgetOptions, newOption];
    onUpdateBrief({
      ...brief,
      budgetOptions: updatedOptions
    });
    setActiveOptId(newId);
  };

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {isStandardKpi ? "Dealsheet" : "Dealsheet & Proposal"}
          </h1>
          
          {/* Option Selector Tabs */}
          {calc.budgetOptions && calc.budgetOptions.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
              {calc.budgetOptions.map((opt, idx) => (
                <button
                  key={opt.id}
                  onClick={() => setActiveOptId(opt.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    activeOptId === opt.id 
                      ? "bg-white text-slate-800 shadow-xs" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {opt.name || `Option ${String.fromCharCode(65 + idx)}`}
                </button>
              ))}
              <button
                onClick={handleAddOption}
                className="px-2 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center rounded-lg hover:bg-slate-200/50"
                title="Add Option"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Brief Input Card */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="bg-[#e9f0fc] px-6 py-4 border-b border-slate-200">
          <h2 className="text-[15px] font-semibold text-slate-800">Brief Input</h2>
        </div>
        <div className="p-6">
          <div className="max-w-3xl space-y-4">
            {useBuddyBoostFormula ? (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Budget</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      value={(() => {
                        const activeOpt = (brief.budgetOptions || []).find(o => o.id === activeOptId) || (brief.budgetOptions || [])[0];
                        return formatCurrency(activeOpt?.budgetSpending || brief.budgetSpending || 15000);
                      })()}
                      onChange={handleBudgetSpendingChange}
                      className="w-32 text-right border-b border-slate-200 focus:border-blue-500 outline-none p-0 bg-transparent font-semibold text-slate-800 text-sm"
                    />
                    <span className="font-semibold text-slate-800">บาท</span>
                  </div>
                </div>

                {/* Buddy Boost Section */}
                <div className="pt-3 pb-3 border-t border-slate-100 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-705">Buddy Boost</h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">Ads</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={buddyboostAds !== undefined && buddyboostAds !== null ? buddyboostAds : ""}
                        onChange={handleBuddyboostAdsChange}
                        className="w-28 text-right border-b border-slate-200 focus:border-blue-500 outline-none p-0 bg-transparent font-semibold text-slate-800 text-sm"
                      />
                      <span className="font-semibold text-slate-800">บาท</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 font-medium">Fee</span>
                      <div className="flex items-center bg-[#e9f0fc] rounded-full px-2 py-0.5 border border-blue-200">
                        <input 
                          type="text" 
                          value={buddyboostFeePercent !== undefined && buddyboostFeePercent !== null ? buddyboostFeePercent : ""} 
                          onChange={handleBuddyboostFeePercentChange}
                          className="w-8 text-center text-blue-600 text-[10px] font-bold bg-transparent border-none outline-none p-0 focus:ring-0"
                        />
                        <span className="text-blue-600 text-[10px] font-bold">%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{formatCurrency(buddyboostFee)}</span>
                      <span className="font-semibold text-slate-800">บาท</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">CPR</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={buddyboostCpr !== undefined && buddyboostCpr !== null ? buddyboostCpr : ""}
                        onChange={handleBuddyboostCprChange}
                        className="w-28 text-right border-b border-slate-200 focus:border-blue-500 outline-none p-0 bg-transparent font-semibold text-slate-800 text-sm"
                      />
                      <span className="font-semibold text-slate-800 invisible select-none">บาท</span>
                    </div>
                  </div>
                </div>

                {/* Other Services Section */}
                <div className="pt-4 space-y-4 border-t border-slate-100 pb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-700">Other Services</span>
                    <button 
                      onClick={handleAddOtherService}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      + Add Service
                    </button>
                  </div>

                  {otherServices.length > 0 ? (
                    <div className="space-y-3">
                      {otherServices.map(service => {
                        const presetServiceTypes = [
                          "ค่าสถานที่",
                          "Third Party",
                          "ค่า Studio",
                          "ค่าตากล้อง",
                          "Refer",
                          "กันค่าแอลกอฮอล์",
                          "Logistic Brand to Buddy"
                        ];
                        const isPreset = !service.isCustom && (presetServiceTypes.includes(service.name) || service.name === "");

                        return (
                          <div key={service.id} className="flex flex-col sm:flex-row gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 relative">
                            <div className="flex-1 flex gap-2 items-center">
                              {isPreset ? (
                                <select
                                  value={service.name}
                                  onChange={(e) => {
                                    if (e.target.value === "custom") {
                                      handleUpdateOtherService(service.id, { isCustom: true, name: "" });
                                    } else {
                                      handleUpdateOtherService(service.id, { name: e.target.value });
                                    }
                                  }}
                                  className="w-full text-sm border-b border-slate-250 focus:border-blue-500 outline-none px-1 py-0.5 bg-transparent text-slate-800"
                                >
                                  <option value="">เลือกประเภทบริการ...</option>
                                  {presetServiceTypes.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                  ))}
                                  <option value="custom">อื่นๆ (กรอกเอง)</option>
                                </select>
                              ) : (
                                <div className="flex-1 flex gap-2 items-center">
                                  <input 
                                    type="text" 
                                    placeholder="กรอกประเภทบริการ..." 
                                    value={service.name || ""} 
                                    onChange={(e) => handleUpdateOtherService(service.id, { name: e.target.value })}
                                    className="flex-1 text-sm border-b border-slate-250 focus:border-blue-500 outline-none px-1 py-0.5 bg-transparent font-semibold text-slate-800"
                                    autoFocus
                                  />
                                  <button 
                                    onClick={() => {
                                      handleUpdateOtherService(service.id, { isCustom: false, name: "" });
                                    }}
                                    className="text-[10px] text-blue-500 hover:underline cursor-pointer whitespace-nowrap"
                                  >
                                    เลือกจากรายการ
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 items-center">
                              <input 
                                type="text" 
                                placeholder="Price" 
                                value={service.price !== undefined && service.price !== null ? service.price : ""} 
                                onChange={(e) => handleUpdateOtherService(service.id, { price: e.target.value })}
                                className="w-20 text-right text-sm border-b border-slate-250 focus:border-blue-500 outline-none px-1 py-0.5 bg-transparent font-semibold text-slate-800"
                              />
                              <span className="text-xs text-slate-400">บาท</span>
                            </div>
                            <div className="flex gap-2 items-center">
                              <input 
                                type="text" 
                                placeholder={service.feeType === "percent" ? "Fee %" : "Fee"} 
                                value={service.feeValue !== undefined && service.feeValue !== null ? service.feeValue : ""} 
                                onChange={(e) => handleUpdateOtherService(service.id, { feeValue: e.target.value })}
                                className="w-16 text-right text-sm border-b border-slate-250 focus:border-blue-500 outline-none px-1 py-0.5 bg-transparent font-semibold text-slate-800"
                              />
                              <button
                                onClick={() => {
                                  const nextType = service.feeType === "percent" ? "baht" : "percent";
                                  handleUpdateOtherService(service.id, { feeType: nextType });
                                }}
                                className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-100 hover:bg-slate-200 border border-slate-350 text-slate-600 cursor-pointer select-none"
                                title="คลิกเพื่อสลับหน่วยระหว่าง % และ บาท"
                              >
                                {service.feeType === "percent" ? "%" : "บาท"}
                              </button>
                            </div>
                            <div className="text-xs self-center whitespace-nowrap min-w-[80px] text-right font-semibold">
                              {service.feeType === "percent" ? (
                                <span className="text-slate-750">{formatCurrency(Math.round((Number(calc.totalBudget) || 0) * (Number(service.feeValue) || 0) / 100))}</span>
                              ) : (
                                <span className="text-slate-400">{(Number(calc.totalBudget) || 0) > 0 ? Math.round((Number(service.feeValue) || 0) / (Number(calc.totalBudget) || 1) * 100) : 0}%</span>
                              )}
                            </div>
                            <button 
                              onClick={() => handleRemoveOtherService(service.id)}
                              className="text-xs text-rose-500 hover:text-rose-700 font-bold self-center cursor-pointer ml-2"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic text-center py-2">No other services added.</div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Total Budget</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      value={(() => {
                        const activeOpt = (brief.budgetOptions || []).find(o => o.id === activeOptId) || (brief.budgetOptions || [])[0];
                        return formatCurrency(activeOpt?.budgetSpending || brief.budgetSpending || 15000);
                      })()}
                      onChange={handleBudgetSpendingChange}
                      className="w-32 text-right border-b border-slate-200 focus:border-blue-500 outline-none p-0 bg-transparent font-semibold text-slate-800 text-sm"
                    />
                    <span className="font-semibold text-slate-800">บาท</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Total Boost Ads</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(calc.totalBoostAds)} บาท</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Total Other Services</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(calc.totalOtherServices)} บาท</span>
                </div>
              </>
            )}
            
            <div className="flex justify-between items-center bg-blue-50/60 border border-blue-100 p-3.5 px-4 rounded-xl mt-3 shadow-xs">
              <span className="text-blue-700 font-semibold text-sm">Available Budget</span>
              <span className="text-blue-700 font-bold text-base">{formatCurrency(availableBudget)} บาท</span>
            </div>
            
            <div className="flex justify-between items-center text-sm pt-4">
              <span className="text-slate-600 font-medium">Divisor ({brief.customerType || "Key Account"})</span>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={divisor !== undefined && divisor !== null ? divisor : ""} 
                  onChange={handleDivisorChange}
                  className="w-28 text-right border-b border-slate-200 focus:border-blue-500 outline-none p-0 bg-transparent font-semibold text-slate-800 text-sm"
                />
                <span className="font-semibold text-slate-800 invisible select-none">บาท</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm pt-4">
              <span className="text-slate-600 font-medium">Raw Cost for Influencer</span>
              <span className="font-semibold text-slate-800">{formatCurrency(rawCostForInfluencer)} บาท</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Contingencies</span>
                <div className="flex items-center bg-[#e9f0fc] rounded-full px-2 py-0.5 border border-blue-200">
                  <input 
                    type="text" 
                    value={contingencyPercent !== undefined && contingencyPercent !== null ? contingencyPercent : ""} 
                    onChange={handleContingencyChange}
                    className="w-8 text-center text-blue-600 text-[10px] font-bold bg-transparent border-none outline-none p-0 focus:ring-0"
                  />
                  <span className="text-blue-600 text-[10px] font-bold">%</span>
                </div>
              </div>
              <span className="font-semibold text-slate-800">{formatCurrency(contingencies)} บาท</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-4">
              <span className="text-slate-600 font-medium">Raw Cost for Campaign</span>
              <span className="font-semibold text-slate-800">{formatCurrency(rawCostForCampaign)} บาท</span>
            </div>
          </div>
        </div>
      </div>

      {hasStandard && (
        <>
          {/* Channel Breakdown Card */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="bg-[#e9f0fc] px-6 py-4 border-b border-slate-200">
          <h2 className="text-[15px] font-semibold text-slate-800">Channel Breakdown</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recalculatedChannels.map((chan, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 p-6 space-y-6 relative overflow-hidden">
                {/* Channel Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {String(chan.platform || "T").charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-800 text-[15px]">{chan.platform}</span>
                  </div>
                  <div className="bg-[#e9f0fc] text-blue-700 font-bold text-xs px-3 py-1 rounded-full">
                    Allocation: {chan.allocationPercent}%
                  </div>
                </div>

                {/* Costs list */}
                <div className="space-y-3">
                  {[
                    { label: "Logistics", key: "logistics" },
                    { label: "Product", key: "product" },
                    { label: "Travel", key: "travel" },
                    { label: "Social", key: "social" },
                    { label: "Support", key: "support" },
                    { label: "Special", key: "special" },
                    { label: "Via", key: "via" },
                    { label: "Others (Add Ads)", key: "other" }
                  ].map(costItem => (
                    <div key={costItem.key} className="flex justify-between items-start text-sm">
                      <div>
                        <span className="text-slate-500 font-medium block">{costItem.label}</span>
                        {getCostItemNote(costItem.key, chan.id) && (
                          <span className="text-[10px] text-slate-400 block max-w-[200px] leading-tight mt-0.5">{getCostItemNote(costItem.key, chan.id)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <input
                          type="text"
                          value={chan[costItem.key] !== undefined && chan[costItem.key] !== null ? chan[costItem.key] : ""}
                          onChange={(e) => handleCostOverrideChange(chan.id, costItem.key, e.target.value)}
                          className="w-20 text-right border-b border-slate-200 focus:border-blue-500 outline-none p-0 bg-transparent font-semibold text-slate-800 text-sm"
                        />
                        <span className="font-medium text-slate-500 text-xs">บาท</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sub-cards */}
                <div className="grid grid-cols-3 gap-3 pt-4">
                  <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/50">
                    <h4 className="text-[11px] font-bold text-blue-500 mb-1">Number of Influencers</h4>
                    <span className="text-sm font-semibold text-slate-800">{chan.numInfs} คน</span>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/50">
                    <h4 className="text-[11px] font-bold text-blue-500 mb-1">Reserve Influencers</h4>
                    <span className="text-sm font-semibold text-slate-800">{chan.reserveInfs} คน</span>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/50">
                    <h4 className="text-[11px] font-bold text-blue-500 mb-1">Influencer Cost</h4>
                    <span className="text-sm font-semibold text-slate-800">{formatCurrency(chan.influencerCost)} บาท</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Influencer Calculations Card */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="bg-[#e9f0fc] px-6 py-4 border-b border-slate-200">
          <h2 className="text-[15px] font-semibold text-slate-800">Influencer Calculations</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Average Influencer Cost (Editable) */}
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-[13px] font-bold text-blue-500 mb-2">Average Influencer Cost</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <input 
                type="text" 
                value={customAvgCost} 
                onChange={handleAvgCostChange}
                className="w-24 text-lg font-semibold text-slate-800 border-b-2 border-blue-200 focus:border-blue-500 outline-none p-0 bg-transparent"
              />
              <span className="text-sm font-semibold text-slate-800">บาท</span>
            </div>
            <p className="text-[10px] text-slate-500">Sum of (Channel Cost × Allocation %)</p>
          </div>

          {/* Total Influencers */}
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-[13px] font-bold text-blue-500 mb-2">Total Influencers</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-lg font-semibold text-slate-800">{totalInfluencers}</span>
              <span className="text-sm font-semibold text-slate-800">คน</span>
            </div>
            <p className="text-[10px] text-slate-500">FLOOR.MATH(Raw Cost for Campaign ÷ Average Cost)</p>
          </div>

          {/* Total Reserve Influencers */}
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-[13px] font-bold text-blue-500 mb-2">Total Reserve Influencers</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-lg font-semibold text-slate-800">{sumReserveInfluencers}</span>
              <span className="text-sm font-semibold text-slate-800">คน</span>
            </div>
            <p className="text-[10px] text-slate-500">Sum of (Channel Influencers ÷ 20)</p>
          </div>
        </div>
      </div>
      </>
      )}

      {children}
    </div>
  );
}
