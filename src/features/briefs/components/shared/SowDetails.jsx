import React from "react";
import SowFormFields from "./forms/SowFormFields";
import ServiceScopeFormFields from "./forms/ServiceScopeFormFields";
import BrandSupportFormFields from "./forms/BrandSupportFormFields";
import TravelDetailsFormFields from "./forms/TravelDetailsFormFields";
import SowDetailsDisplay from "./SowDetailsDisplay";

export default function SowDetails({ sow, index, packageType, onChange, editable = true, onEdit }) {
  const handleUpdateSow = (field, val) => {
    onChange("sow", field, val);
  };
  
  const handleUpdateServiceScope = (field, val) => {
    onChange("serviceScope", field, val);
  };

  if (!editable) {
    return <SowDetailsDisplay sow={sow} index={index} onEdit={onEdit} />;
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-slate-50 p-6 relative">
      <h4 className="mb-6 text-base font-semibold text-slate-900 border-b border-slate-200 pb-2">
        Scope {index !== undefined ? index + 1 : ""} {sow.name ? `: ${sow.name}` : ""}
      </h4>
      
      <SowFormFields 
        scope={sow} 
        onChange={handleUpdateSow} 
        onUpdateServiceScope={handleUpdateServiceScope} 
      />
      <ServiceScopeFormFields 
        scope={sow} 
        packageType={packageType} 
        onChange={handleUpdateServiceScope} 
      />
      <BrandSupportFormFields 
        scope={sow} 
        onChange={handleUpdateSow} 
      />
      <TravelDetailsFormFields 
        scope={sow} 
        packageType={packageType} 
        onChange={handleUpdateSow} 
      />
    </div>
  );
}
