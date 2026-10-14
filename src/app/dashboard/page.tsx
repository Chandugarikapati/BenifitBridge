"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import MetricCard from "@/components/ui/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { 
  FileCheck2, 
  FolderClock, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  Bot, 
  User, 
  Building2,
  ExternalLink,
  Plus
} from "lucide-react";

export default function CitizenDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/cases").then((r) => (r.ok ? r.json() : { cases: [] })),
      fetch("/api/eligibility/assess", { method: "POST", body: JSON.stringify({}) }).then((r) =>
        r.ok ? r.json() : { evaluations: [] }
      ),
    ])
      .then(([userData, casesData, matchesData]) => {
        setUser(userData?.user || null);
        setCases(casesData?.cases || []);
        setMatches(matchesData?.evaluations || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const profileComplete = user?.profile?.annualIncome && user?.profile?.state;
  const potentialMatches = matches.filter((m) => m.evaluation.overallStatus === "MATCH");
  const missingInfoMatches = matches.filter((m) => m.evaluation.overallStatus === "UNKNOWN");

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar role="CITIZEN" />

        <main className="flex-1 p-6 sm:p-8 space-y-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 bg-teal-500/20 px-2.5 py-1 rounded-md border border-teal-500/30">
                Citizen Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
                Welcome back, {user?.fullName || "Citizen"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Track your benefit applications, manage document checklists, and discover government welfare schemes.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/profile"
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-teal-300 hover:bg-teal-200 transition-colors flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>{profileComplete ? "Edit Profile" : "Complete Profile"}</span>
              </Link>
              <Link
                href="/schemes"
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
              >
                Find Schemes
              </Link>
            </div>
          </div>

          {/* Missing info profile alert if incomplete */}
          {!profileComplete && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <p className="font-bold text-amber-900">Your profile information is incomplete</p>
                <p className="text-amber-800 mt-0.5">
                  Provide your household income, state, and occupation so our deterministic engine can accurately evaluate welfare schemes.
                </p>
                <Link
                  href="/profile"
                  className="mt-2 inline-flex items-center gap-1 font-bold text-teal-800 hover:underline"
                >
                  <span>Update Profile Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Potential Matches"
              value={potentialMatches.length}
              subtitle="Schemes meeting all criteria"
              icon={<FileCheck2 className="w-4 h-4 text-teal-600" />}
            />
            <MetricCard
              title="Active Cases"
              value={cases.length}
              subtitle="Applications in progress"
              icon={<FolderClock className="w-4 h-4 text-indigo-600" />}
            />
            <MetricCard
              title="Missing Info Schemes"
              value={missingInfoMatches.length}
              subtitle="Requires profile update"
              icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
            />
            <MetricCard
              title="Completed Cases"
              value={cases.filter((c) => c.status === "SUBMITTED" || c.reportedOutcome === "APPROVED").length}
              subtitle="Submitted or approved"
              icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            />
          </div>

          {/* Active Application Cases Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">My Application Cases</h2>
                <p className="text-xs text-slate-500">Track preparation and submission milestones</p>
              </div>
              <Link
                href="/cases"
                className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
              >
                <span>View All ({cases.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {cases.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <p className="text-sm font-bold text-slate-800">No active application cases yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Start by exploring public schemes and clicking &quot;Start Application Case&quot;.
                </p>
                <Link
                  href="/schemes"
                  className="mt-4 inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Browse Schemes</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cases.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-mono text-slate-500">{c.caseNumber}</span>
                        <StatusBadge status={c.status} size="sm" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{c.scheme?.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{c.scheme?.shortDescription}</p>

                      <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                        <span>Checklist: {c.checklist?.filter((i: any) => i.isCompleted).length || 0} / {c.checklist?.length || 0} Done</span>
                        {c.assignments?.[0]?.assignedTo && (
                          <span className="text-indigo-700 font-medium text-[11px]">
                            Worker: {c.assignments[0].assignedTo.fullName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        Updated {new Date(c.updatedAt).toLocaleDateString()}
                      </span>
                      <Link
                        href={`/cases/${c.id}`}
                        className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                      >
                        <span>Manage Checklist</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Potential Matches Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recommended Schemes For You</h2>
                <p className="text-xs text-slate-500">Based on your demographic and income profile</p>
              </div>
              <Link
                href="/matches"
                className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
              >
                <span>View All Matches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {potentialMatches.slice(0, 2).map((item) => (
                <div
                  key={item.scheme.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                        {item.scheme.category}
                      </span>
                      <StatusBadge status="MATCH" size="sm" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{item.scheme.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Benefit: <strong>{item.scheme.estimatedBenefitAmount || item.scheme.benefitType}</strong>
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-emerald-600 font-semibold">
                      ✓ Satisfies {item.evaluation.matchedCriteriaCount} of {item.evaluation.totalCriteriaCount} rules
                    </span>
                    <Link
                      href={`/schemes/${item.scheme.slug || item.scheme.id}`}
                      className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
                    >
                      <span>View Rules</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
