import React from "react";
import { cn } from "../../utils/helpers";

export default function Input({
  multiline = false,
  rows = 3,
  label,
  id,
  error,
  className,
  containerClassName,
  ...props
}) {
  return (
    <div className={cn("flex flex-col space-y-1", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          id={id}
          rows={rows}
          className={cn(
            "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-[#6D5DF6] focus:outline-none focus:ring-1 focus:ring-[#6D5DF6] resize-none",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
      ) : (
        <input
          id={id}
          className={cn(
            "w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:border-[#6D5DF6] focus:outline-none focus:ring-1 focus:ring-[#6D5DF6]",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
