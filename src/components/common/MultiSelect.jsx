import { X } from "lucide-react";

export default function MultiSelect({ value = [], onChange, options, placeholder }) {
  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-2 min-h-[42px] cursor-text">
        {value.map(val => (
          <span key={val} className="inline-flex items-center gap-1 rounded bg-violet-50 px-2 py-0.5 text-xs font-medium text-[#6D5DF6]">
            {val}
            <X className="h-3 w-3 cursor-pointer" onClick={() => onChange(value.filter(v => v !== val))} />
          </span>
        ))}
        <select 
          className="flex-1 outline-none text-sm text-slate-700 bg-transparent min-w-[120px]"
          onChange={(e) => {
            if (e.target.value && !value.includes(e.target.value)) {
              onChange([...value, e.target.value]);
            }
            e.target.value = "";
          }}
          defaultValue=""
        >
          <option value="" disabled>{value.length ? "" : placeholder}</option>
          {options.filter(o => !value.includes(o)).map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
