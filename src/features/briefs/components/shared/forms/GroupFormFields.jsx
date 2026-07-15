import React from "react";
import MultiSelect from "../../../../../components/common/MultiSelect";

export default function GroupFormFields({ pillars, onChange }) {
  const handleUpdate = (key, val) => {
    onChange(key, val);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-500">Demographic</label>
        <MultiSelect 
          value={pillars?.demographic || []} 
          onChange={val => handleUpdate('demographic', val)} 
          options={["Male", "Female", "LGBTQ+", "Gen Z", "Millennials", "Gen X"]} 
          placeholder="เลือก" 
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-500">Location</label>
        <MultiSelect 
          value={pillars?.location || []} 
          onChange={val => handleUpdate('location', val)} 
          options={["Bangkok", "Upcountry", "Urban", "Rural", "Chiang Mai", "Phuket"]} 
          placeholder="เลือก" 
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-500">Occupation</label>
        <MultiSelect 
          value={pillars?.occupation || []} 
          onChange={val => handleUpdate('occupation', val)} 
          options={["Student", "First Jobber", "Office Worker", "Freelance", "Business Owner", "Housewife"]} 
          placeholder="เลือก" 
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-500">Persona</label>
        <MultiSelect 
          value={pillars?.persona || []} 
          onChange={val => handleUpdate('persona', val)} 
          options={["Fashionista", "Foodie", "Traveler", "Tech Geek", "Fitness Enthusiast", "Beauty Guru"]} 
          placeholder="เลือก" 
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-500">Content Category</label>
        <MultiSelect 
          value={pillars?.contentCategory || []} 
          onChange={val => handleUpdate('contentCategory', val)} 
          options={["Lifestyle", "Fashion", "Beauty", "Food", "Travel", "Technology", "Gaming"]} 
          placeholder="เลือก" 
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-500">Story Telling</label>
        <MultiSelect 
          value={pillars?.storyTelling || []} 
          onChange={val => handleUpdate('storyTelling', val)} 
          options={["Soft-sell", "Hard-sell", "Review", "Daily Vlog", "Tutorial", "Unboxing"]} 
          placeholder="เลือก" 
        />
      </div>
    </div>
  );
}
