import React from "react";
import { cn } from "../../utils/helpers";

export default function Stepper({
  steps,
  currentStepIndex,
  onStepClick,
  className
}) {
  return (
    <div className={cn("py-3 px-6 max-w-xl mx-auto w-full", className)}>
      <div className="relative flex items-center justify-between">
        {/* Background Line */}
        <div className="absolute top-3.5 left-8 right-8 h-[2px] bg-slate-100 -translate-y-1/2 rounded-full z-0"></div>
        
        {/* Active Line Container */}
        <div className="absolute top-3.5 left-8 right-8 h-[2px] -translate-y-1/2 z-0">
          <div 
            className="h-full bg-[#6D5DF6] rounded-full transition-all duration-500"
            style={{ 
              width: `${(currentStepIndex / (Math.max(1, steps.length - 1))) * 100}%`
            }}
          />
        </div>

        {steps.map((step, index) => {
          const isActive = index <= currentStepIndex;
          const isCompleted = index < currentStepIndex;
          
          return (
            <button 
              key={step}
              onClick={() => onStepClick && onStepClick(index)}
              disabled={!onStepClick}
              className={cn(
                "relative z-10 flex flex-col items-center focus:outline-none group",
                onStepClick ? "cursor-pointer" : "cursor-default"
              )}
            >
              <div className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300 font-bold text-[11px]",
                isActive
                  ? "bg-white border-[#6D5DF6] text-[#6D5DF6] shadow-sm shadow-violet-100 scale-105"
                  : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-350"
              )}>
                {isCompleted ? "✓" : index + 1}
              </div>
              <span className={cn(
                "mt-1.5 text-[10px] font-bold transition-colors duration-300 whitespace-nowrap",
                isActive
                  ? "text-[#6D5DF6]"
                  : "text-slate-400 group-hover:text-slate-650"
              )}>
                {step}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
