"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import MetricCard from "@/components/ui/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { 
  Users, 
  FileCheck2, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  Calendar,
  Building,
  CheckSquare
} from "lucide-react";

export default function NgoDashboardPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/organization/cases")
      .then((r) => (r.ok ? r.json() : { cases: [] }))
      .then((data) => setCases(data.cases || []))
      .catch(() => setCases([]))
      .finally(() => setLoading(false));
  }, []);

  const total = cases.length;
  const readyToSubmit = cases.filter((c) => c.status === "READY_TO_SUBMIT").length;
  const preparing = cases.filter((c) => c.status === "PREPARING_DOCUMENTS").length;
  const submitted = cases.filter((c) => c.status === "SUBMITTED").length;

  const urgentTasks = [
    {
      id: "t1",
      title: "CSC Biometric e-KYC Verification for Rajesh Patil",
      scheme: "PM Kisan Samman Nidhi",
      due: "In 2 days",
      priority: "HIGH",
    },
    {
      id: "t2",
      title: "Follow up with Patna College Registrar for Bonafide Certificate",
      scheme: "Post-Matric SC/ST Scholarship",
      due: "In 4 days",
      priority: "MEDIUM",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar role="NGO_WORKER" />

        <main className="flex-1 p-6 sm:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                Authorized NGO Casework Workspace
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                Seva Welfare Casework Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Manage beneficiary applications, resolve certificate bottlenecks, and track submissions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/organization/cases"
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm flex items-center gap-1.5"
              >
                <Users className="w-4 h-4" />
                <span>View All Cases</span>
              </Link>
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Assigned Cases"
              value={total}
              subtitle="Beneficiaries in workspace"
              icon={<Users className="w-4 h-4 text-indigo-600" />}
            />
            <MetricCard
              title="Ready For Portal"
              value={readyToSubmit}
              subtitle="All mandatory docs verified"
              icon={<CheckCircle2 className="w-4 h-4 text-teal-600" />}
            />
            <MetricCard
              title="Document Prep"
              value={preparing}
              subtitle="Certificates pending"
              icon={<Clock className="w-4 h-4 text-amber-600" />}
            />
            <MetricCard
              title="Reported Submitted"
              value={submitted}
              subtitle="Portal filed"
              icon={<FileCheck2 className="w-4 h-4 text-emerald-600" />}
            />
          </div>

          {/* Follow-up Tasks */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Urgent Follow-Up Tasks
              </h3>
              <span className="text-xs text-slate-400">2 pending tasks</span>
            </div>

            <div className="space-y-3">
              {urgentTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">{t.title}</p>
                      <p className="text-slate-500 text-[11px]">{t.scheme} • Due: {t.due}</p>
                    </div>
                  </div>
                  <StatusBadge status={t.priority} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Beneficiary Cases Table Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Beneficiary Cases</h3>
                <p className="text-xs text-slate-500">Casework active in your district</p>
              </div>
              <Link
                href="/organization/cases"
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>View Full List</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3">Case ID</th>
                    <th className="px-6 py-3">Beneficiary</th>
                    <th className="px-6 py-3">Scheme</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Priority</th>
                    <th className="px-6 py-3">Caseworker</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {cases.slice(0, 5).map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-slate-900 font-semibold">{c.caseNumber}</td>
                      <td className="px-6 py-3.5 font-medium">{c.citizenName}</td>
                      <td className="px-6 py-3.5">{c.schemeName}</td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={c.status} size="sm" />
                      </td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={c.priority} size="sm" />
                      </td>
                      <td className="px-6 py-3.5 text-slate-500">{c.assignedWorker}</td>
                      <td className="px-6 py-3.5 text-right">
                        <Link
                          href={`/cases/${c.id}`}
                          className="font-bold text-indigo-600 hover:underline"
                        >
                          Review Case →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
