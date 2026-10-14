"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import StatusBadge from "@/components/ui/StatusBadge";
import { FolderClock, Plus, ArrowRight, CheckCircle2, Building, RefreshCw } from "lucide-react";

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = () => {
    setLoading(true);
    fetch("/api/cases")
      .then((r) => (r.ok ? r.json() : { cases: [] }))
      .then((data) => setCases(data.cases || []))
      .catch(() => setCases([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar role="CITIZEN" />

        <main className="flex-1 p-6 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                Application Management
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                My Application Cases
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Track your document preparation, submission readiness, and caseworker updates.
              </p>
            </div>

            <Link
              href="/schemes"
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Start New Case</span>
            </Link>
          </div>

          {cases.length === 0 && !loading ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <FolderClock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No application cases yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Explore our catalog of welfare schemes and initiate a case to generate your document checklist.
              </p>
              <Link
                href="/schemes"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors"
              >
                <span>Browse Scheme Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cases.map((c) => {
                const total = c.checklist?.length || 0;
                const completed = c.checklist?.filter((i: any) => i.isCompleted).length || 0;
                const percent = total > 0 ? Math.round((completed / total) * 100) : 100;
                const worker = c.assignments?.[0]?.assignedTo;

                return (
                  <div
                    key={c.id}
                    className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                          {c.caseNumber}
                        </span>
                        <StatusBadge status={c.status} size="sm" />
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{c.scheme?.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {c.scheme?.shortDescription}
                      </p>

                      {/* Progress bar */}
                      <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                          <span>Document Readiness</span>
                          <span className="font-bold text-slate-900">{completed} of {total} ({percent}%)</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              percent === 100 ? "bg-emerald-600" : "bg-teal-600"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {worker && (
                        <p className="mt-3 text-xs text-indigo-700 font-semibold flex items-center gap-1.5">
                          <span>Assigned Caseworker:</span>
                          <span className="text-slate-900 font-normal">{worker.fullName} ({worker.phone || worker.email})</span>
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        Initiated {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                      <Link
                        href={`/cases/${c.id}`}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                      >
                        <span>Open Case Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
