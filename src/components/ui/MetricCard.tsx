import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  hint?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = "neutral",
  icon,
  hint,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        {icon && <div className="p-2 rounded-lg bg-teal-50 text-teal-700">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
        {change && (
          <span
            className={`text-xs font-medium ${
              changeType === "positive"
                ? "text-emerald-600"
                : changeType === "negative"
                ? "text-rose-600"
                : "text-slate-500"
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1 text-xs text-slate-600">{subtitle}</p>}
      {hint && <p className="mt-2 text-[11px] text-slate-400 border-t border-slate-100 pt-2">{hint}</p>}
    </div>
  );
};
export default MetricCard;
