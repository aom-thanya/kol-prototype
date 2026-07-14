import React from "react";
import { cn } from "../../utils/helpers";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}) {
  return (
    <div className={cn("text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 border-dashed", className)}>
      {Icon && (
        <div className="flex justify-center mb-3">
          <Icon className="h-8 w-8 text-slate-400" />
        </div>
      )}
      <p className="text-slate-500 font-medium">{title}</p>
      {description && (
        <p className="text-sm text-slate-400 mt-1">{description}</p>
      )}
      {action && (
        <div className="mt-4 flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
}
