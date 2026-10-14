import React from "react";

export type BadgeVariant =
  | "MATCH"
  | "DOES_NOT_MATCH"
  | "UNKNOWN"
  | "REQUIRES_HUMAN_REVIEW"
  | "DRAFT"
  | "PREPARING_DOCUMENTS"
  | "READY_TO_SUBMIT"
  | "SUBMITTED"
  | "UNDER_OFFICIAL_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CLOSED"
  | "ACTIVE"
  | "PUBLISHED"
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "URGENT";

interface StatusBadgeProps {
  status: BadgeVariant | string;
  size?: "sm" | "md";
  className?: string;
}

const BADGE_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  // Eligibility states
  MATCH: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Potential Match" },
  DOES_NOT_MATCH: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", label: "Does Not Match" },
  UNKNOWN: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Missing Information" },
  REQUIRES_HUMAN_REVIEW: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", label: "Needs Case Worker Review" },

  // Case states
  DRAFT: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", label: "Draft Case" },
  PREPARING_DOCUMENTS: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", label: "Preparing Documents" },
  READY_TO_SUBMIT: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", label: "Ready to Submit" },
  SUBMITTED: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: "Submitted" },
  UNDER_OFFICIAL_REVIEW: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", label: "Under Official Review" },
  APPROVED: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-300", label: "Approved" },
  REJECTED: { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-300", label: "Rejected" },
  CLOSED: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-300", label: "Closed" },

  // Priorities
  URGENT: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300", label: "Urgent Priority" },
  HIGH: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", label: "High" },
  MEDIUM: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: "Medium" },
  LOW: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", label: "Low" },

  // Scheme catalog states
  PUBLISHED: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Published & Verified" },
  UNDER_REVIEW: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Under Content Review" },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "md", className = "" }) => {
  const config = BADGE_STYLES[status] || {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    label: status.replace(/_/g, " "),
  };

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-medium";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {config.label}
    </span>
  );
};
export default StatusBadge;
