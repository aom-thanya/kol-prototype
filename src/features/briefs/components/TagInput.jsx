import { useState } from "react";
 

import {
  X, Sparkles
} from "lucide-react";

export default function TagInput({ value, onChange, label, suggested, onManualEdit }) {
  const [inputValue, setInputValue] = useState("");
  const tags = Array.isArray(value) ? value : [];

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        const newTags = [...tags, inputValue.trim()];
        onChange(newTags);
        if (onManualEdit) onManualEdit(newTags);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      const newTags = tags.slice(0, -1);
      onChange(newTags);
      if (onManualEdit) onManualEdit(newTags);
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    onChange(newTags);
    if (onManualEdit) onManualEdit(newTags);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        {suggested && (
          <span className="text-[10px] font-semibold text-[#6D5DF6] bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Suggested from reference
          </span>
        )}
      </div>
      <div className={`flex flex-wrap gap-2 p-2 min-h-[44px] rounded-lg border bg-white focus-within:border-[#6D5DF6] transition-colors ${suggested ? 'border-[#6D5DF6] bg-violet-50/30' : 'border-slate-200'}`}>
        {tags.map((tag, idx) => (
          <div key={idx} className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-medium">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-rose-500 rounded-full p-0.5">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-slate-700 py-1"
        />
      </div>
    </div>
  );
}

