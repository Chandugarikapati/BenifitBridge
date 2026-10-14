"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import StatusBadge from "@/components/ui/StatusBadge";
import { Search, Filter, Users, ArrowRight, RefreshCw, X } from "lucide-react";

export default function OrganizationCasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const fetchCases = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (priorityFilter !== "ALL") params.set("priority", priorityFilter);

    fetch(`/api/organization/cases?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : { cases: [] }))
      .then((data) => setCases(data.cases || []))
      .catch(() => setCases([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCases();
  }, [searchTerm, statusFilter, priorityFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar role="NGO_WORKER" />

        <main className="flex-1 p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
              Casework Directory
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Beneficiary Application Cases
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Search and filter cases under your organization&apos;s jurisdiction.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Case ID, Beneficiary Name, or Scheme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-medium">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="py-1 px-2.5 rounded-lg border border-slate-200 bg-slate-50"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="DRAFT">Draft</option>
                  <option value="PREPARING_DOCUMENTS">Preparing Documents</option>
                  <option value="READY_TO_SUBMIT">Ready to Submit</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="APPROVED">Approved</option>
                </select>

                <span className="text-slate-500 font-medium ml-2">Priority:</span>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="py-1 px-2.5 rounded-lg border border-slate-200 bg-slate-50"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="URGENT">Urgent</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              <span className="text-slate-500">
                Found <strong>{cases.length}</strong> matching cases
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3">Case ID</th>
                    <th className="px-6 py-3">Beneficiary</th>
                    <th className="px-6 py-3">Contact</th>
                    <th className="px-6 py-3">Scheme</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Readiness</th>
                    <th className="px-6 py-3">Caseworker</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {cases.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-slate-900 font-semibold">{c.caseNumber}</td>
                      <td className="px-6 py-3.5 font-medium">{c.citizenName}</td>
                      <td className="px-6 py-3.5 text-slate-500">{c.citizenPhone || "—"}</td>
                      <td className="px-6 py-3.5 max-w-xs truncate">{c.schemeName}</td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={c.status} size="sm" />
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`font-semibold ${
                            c.isReadyToSubmit ? "text-emerald-700" : "text-amber-700"
                          }`}
                        >
                          {c.completedDocs}/{c.totalDocs} Docs
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-500">{c.assignedWorker}</td>
                      <td className="px-6 py-3.5 text-right">
                        <Link
                          href={`/cases/${c.id}`}
                          className="font-bold text-indigo-600 hover:underline"
                        >
                          Manage →
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
