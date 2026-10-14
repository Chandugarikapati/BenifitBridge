"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, AlertCircle, Building, FileCheck, Send, Info } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";

export interface ChecklistItemData {
  id: string;
  documentRequirementId?: string | null;
  title: string;
  description?: string | null;
  isMandatory: boolean;
  isCompleted: boolean;
  completedAt?: string | null;
  notes?: string | null;
  issuingAuthority?: string | null;
  alternativeDocuments?: string | null;
}

interface ChecklistManagerProps {
  caseId: string;
  initialItems: ChecklistItemData[];
  readOnly?: boolean;
  onUpdate?: () => void;
}

export const ChecklistManager: React.FC<ChecklistManagerProps> = ({
  caseId,
  initialItems,
  readOnly = false,
  onUpdate,
}) => {
  const [items, setItems] = useState<ChecklistItemData[]>(initialItems);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const total = items.length;
  const completedCount = items.filter((i) => i.isCompleted).length;
  const mandatoryItems = items.filter((i) => i.isMandatory);
  const mandatoryCompleted = mandatoryItems.filter((i) => i.isCompleted).length;
  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 100;
  const isReady = mandatoryItems.length === mandatoryCompleted;

  const handleToggle = async (itemId: string, currentStatus: boolean) => {
    if (readOnly) return;
    setLoadingItemId(itemId);
    setErrorMsg(null);

    const nextStatus = !currentStatus;

    try {
      const res = await fetch(`/api/cases/${caseId}/checklist`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checklistItemId: itemId,
          isCompleted: nextStatus,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update checklist item.");
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                isCompleted: nextStatus,
                completedAt: nextStatus ? new Date().toISOString() : null,
              }
            : item
        )
      );

      if (onUpdate) onUpdate();
    } catch (err: any) {
      setErrorMsg(err.message || "Network error while saving progress.");
    } finally {
      setLoadingItemId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-teal-600" />
              Document Preparation Checklist
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Acquire and verify all mandatory certificates before submitting to official government portal.
            </p>
          </div>

          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isReady
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {isReady ? "Ready For Official Submission" : `${mandatoryItems.length - mandatoryCompleted} Mandatory Documents Pending`}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
            <span>Overall Preparedness: {completedCount} of {total} items</span>
            <span className="font-bold text-slate-900">{progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                progressPercent === 100 ? "bg-emerald-600" : "bg-teal-600"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Checklist items */}
      <div className="space-y-3">
        {items.map((item) => {
          const isLoading = loadingItemId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => !readOnly && !isLoading && handleToggle(item.id, item.isCompleted)}
              className={`p-4 rounded-xl border transition-all ${
                item.isCompleted
                  ? "bg-emerald-50/40 border-emerald-200/80 text-slate-900"
                  : "bg-white border-slate-200/80 hover:border-slate-300 shadow-xs"
              } ${!readOnly ? "cursor-pointer" : ""}`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  type="button"
                  disabled={readOnly || isLoading}
                  aria-label={item.isCompleted ? "Mark incomplete" : "Mark complete"}
                  className={`mt-0.5 shrink-0 transition-transform ${
                    !readOnly ? "hover:scale-110" : ""
                  }`}
                >
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4
                      className={`text-sm font-semibold ${
                        item.isCompleted ? "line-through text-slate-500" : "text-slate-900"
                      }`}
                    >
                      {item.title}
                    </h4>

                    {item.isMandatory ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                        Mandatory
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        Optional / Supporting
                      </span>
                    )}

                    {isLoading && (
                      <span className="text-[10px] text-teal-600 animate-pulse">Saving...</span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                  )}

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                    {item.issuingAuthority && (
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>Authority: <strong>{item.issuingAuthority}</strong></span>
                      </span>
                    )}

                    {item.alternativeDocuments && (
                      <span className="flex items-center gap-1 text-slate-600">
                        <Info className="w-3.5 h-3.5 text-teal-600" />
                        <span>Accepted alternatives: {item.alternativeDocuments}</span>
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <p className="mt-2 text-xs text-slate-500 italic bg-white/60 p-2 rounded border border-slate-100">
                      Caseworker note: {item.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ChecklistManager;
