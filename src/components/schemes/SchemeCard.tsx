import React from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Landmark, ExternalLink, ArrowRight, ShieldCheck } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";

export interface SchemeCardProps {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: string;
  jurisdiction: string;
  stateOrUnionTerritory?: string | null;
  ministryOrDepartment: string;
  estimatedBenefitAmount?: string | null;
  benefitType: string;
  processingTimeDays?: number | null;
  isDemo?: boolean;
  matchStatus?: "MATCH" | "DOES_NOT_MATCH" | "UNKNOWN" | "REQUIRES_HUMAN_REVIEW" | null;
  matchScore?: number | null;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  id,
  slug,
  name,
  shortDescription,
  category,
  jurisdiction,
  stateOrUnionTerritory,
  ministryOrDepartment,
  estimatedBenefitAmount,
  benefitType,
  processingTimeDays,
  isDemo,
  matchStatus,
  matchScore,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-5 sm:p-6">
        {/* Header badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200/70">
              {category}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {jurisdiction} • {stateOrUnionTerritory || "All India"}
            </span>
          </div>

          {matchStatus && (
            <StatusBadge status={matchStatus} size="sm" />
          )}
        </div>

        {/* Title */}
        <Link href={`/schemes/${slug || id}`} className="block">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
            {name}
          </h3>
        </Link>

        {/* Ministry */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-3">
          <Landmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{ministryOrDepartment}</span>
        </div>

        {/* Short description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {shortDescription}
        </p>

        {/* Key Benefit Highlight */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Entitled Benefit</p>
            <p className="text-sm font-bold text-slate-900">{estimatedBenefitAmount || benefitType}</p>
          </div>
          {processingTimeDays && (
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-end gap-1">
                <Clock className="w-3 h-3" /> Processing
              </p>
              <p className="text-xs font-semibold text-slate-700">~{processingTimeDays} Days</p>
            </div>
          )}
        </div>

        {/* Match score bar if available */}
        {typeof matchScore === "number" && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span>Rule Compatibility</span>
              <span className="font-semibold text-slate-900">{matchScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  matchScore >= 80 ? "bg-emerald-500" : matchScore >= 50 ? "bg-amber-500" : "bg-rose-500"
                }`}
                style={{ width: `${matchScore}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] text-teal-700 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Catalog</span>
        </div>

        <Link
          href={`/schemes/${slug || id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
        >
          <span>View Guidelines</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
export default SchemeCard;
