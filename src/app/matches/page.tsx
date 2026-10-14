"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import StatusBadge from "@/components/ui/StatusBadge";
import { 
  FileCheck2, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  ArrowRight,
  HelpCircle,
  RefreshCw,
  Plus
} from "lucide-react";

export default function MatchesPage() {
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);

  const fetchMatches = () => {
    setLoading(true);
    fetch("/api/eligibility/assess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((r) => (r.ok ? r.json() : { evaluations: [] }))
      .then((data) => {
        setEvaluations(data.evaluations || []);
      })
      .catch(() => setEvaluations([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const filtered = evaluations.filter((item) => {
    if (filterStatus === "ALL") return true;
    return item.evaluation.overallStatus === filterStatus;
  });

  const matchCounts = {
    MATCH: evaluations.filter((e) => e.evaluation.overallStatus === "MATCH").length,
    UNKNOWN: evaluations.filter((e) => e.evaluation.overallStatus === "UNKNOWN").length,
    DOES_NOT_MATCH: evaluations.filter((e) => e.evaluation.overallStatus === "DOES_NOT_MATCH").length,
    REQUIRES_HUMAN_REVIEW: evaluations.filter((e) => e.evaluation.overallStatus === "REQUIRES_HUMAN_REVIEW").length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar role="CITIZEN" />

        <main className="flex-1 p-6 sm:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                Transparent Eligibility Matching
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                Scheme Compatibility Results
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Deterministic evaluation against verified government welfare schemes based on your profile.
              </p>
            </div>

            <button
              onClick={fetchMatches}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-teal-600" : ""}`} />
              <span>Re-run Evaluation</span>
            </button>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "ALL", label: `All Evaluated (${evaluations.length})` },
              { id: "MATCH", label: `Potential Match (${matchCounts.MATCH})` },
              { id: "UNKNOWN", label: `Missing Info (${matchCounts.UNKNOWN})` },
              { id: "DOES_NOT_MATCH", label: `Does Not Match (${matchCounts.DOES_NOT_MATCH})` },
              { id: "REQUIRES_HUMAN_REVIEW", label: `Review (${matchCounts.REQUIRES_HUMAN_REVIEW})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterStatus === tab.id
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Evaluation Cards List */}
          <div className="space-y-4">
            {filtered.map((item) => {
              const isExpanded = expandedSchemeId === item.scheme.id;
              const ev = item.evaluation;

              return (
                <div
                  key={item.scheme.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {item.scheme.category}
                          </span>
                          <StatusBadge status={ev.overallStatus} size="sm" />
                          <span className="text-xs font-semibold text-slate-500">
                            Score: {ev.matchScore}% ({ev.matchedCriteriaCount}/{ev.totalCriteriaCount} rules)
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          {item.scheme.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Department: {item.scheme.ministryOrDepartment} • Benefit:{" "}
                          <strong>{item.scheme.estimatedBenefitAmount || item.scheme.benefitType}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/schemes/${item.scheme.slug || item.scheme.id}`}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors"
                        >
                          View Scheme
                        </Link>
                        <button
                          onClick={() => setExpandedSchemeId(isExpanded ? null : item.scheme.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          aria-label="Toggle rule details"
                        >
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Reasons summary if missing or does not match */}
                    {ev.reasons.length > 0 && (
                      <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                        <p className="font-semibold text-slate-900">Evaluation Notes:</p>
                        {ev.reasons.map((r: string, idx: number) => (
                          <p key={idx} className="flex items-start gap-1.5">
                            <span className="text-slate-400">•</span>
                            <span>{r}</span>
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Missing information action prompt */}
                    {ev.overallStatus === "UNKNOWN" && ev.missingInformationKeys?.length > 0 && (
                      <div className="mt-3 flex items-center justify-between text-xs p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                        <span>
                          Missing attributes: <strong>{ev.missingInformationKeys.join(", ")}</strong>
                        </span>
                        <Link href="/profile" className="font-bold underline hover:text-amber-950">
                          Update Profile →
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Expanded Detailed Rules Breakdown */}
                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        Detailed Criterion-by-Criterion Evaluation:
                      </h4>

                      <div className="space-y-2.5">
                        {ev.criteria.map((c: any) => (
                          <div
                            key={c.ruleId}
                            className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">{c.criterionName}</span>
                                <StatusBadge status={c.status} size="sm" />
                              </div>
                              <p className="text-slate-600 mt-1">{c.reason}</p>
                            </div>

                            {c.sourceUrl && (
                              <a
                                href={c.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-teal-700 hover:underline flex items-center gap-1 shrink-0"
                              >
                                <span>Official Rule Source</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 text-[11px] text-slate-400 italic">
                        {ev.disclaimer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
