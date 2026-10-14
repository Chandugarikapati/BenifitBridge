import React from "react";

interface ProgressTrackerProps {
  currentStep: number;
  steps: { label: string; description?: string }[];
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 w-full -z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-teal-600 transition-all duration-300 -z-0"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div key={idx} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isCompleted
                    ? "bg-teal-600 text-white"
                    : isCurrent
                    ? "bg-slate-900 text-white ring-4 ring-teal-100"
                    : "bg-white border-2 border-slate-300 text-slate-500"
                }`}
              >
                {isCompleted ? "✓" : idx + 1}
              </div>
              <span
                className={`mt-2 text-xs font-medium text-center max-w-[90px] ${
                  isCurrent ? "text-slate-900 font-semibold" : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ProgressTracker;
