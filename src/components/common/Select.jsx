import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

export default function Select({ value, onChange, options, label, className }) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-full w-full appearance-none bg-transparent px-4 pr-10 text-sm font-normal text-slate-700 outline-none cursor-pointer",
          !className?.includes("border-none") && "rounded-lg border border-slate-200 py-2.5 bg-white"
        )}
      >
        <option value="" disabled>{label || "Select..."}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}
