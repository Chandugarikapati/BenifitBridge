"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import StatusBadge from "@/components/ui/StatusBadge";
import { Plus, Search, Filter, ShieldCheck, ArrowRight, ExternalLink } from "lucide-react";

export default function AdminSchemesPage() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/schemes")
      .then((r) => (r.ok ? r.json() : { schemes: [] }))
      .then((data) => setSchemes(data.schemes || []))
      .catch(() => setSchemes([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = schemes.filter((s) => {
    if (statusFilter === "ALL") return true;
    return s.status === statusFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar role="ADMIN" />

        <main className="flex-1 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                Administration & Content Governance
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                Scheme Catalog Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Manage published public schemes, deterministic eligibility criteria, and verification sources.
              </p>
            </div>

            <Link
              href="/admin/schemes/new"
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-700 shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Scheme</span>
            </Link>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">All Catalog Programs ({filtered.length})</span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Filter Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="py-1 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                >
                  <option value="ALL">All</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="DRAFT">Draft</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3">Scheme Name</th>
                    <th className="px-6 py-3">Sector</th>
                    <th className="px-6 py-3">Jurisdiction</th>
                    <th className="px-6 py-3">Rules</th>
                    <th className="px-6 py-3">Documents</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-3.5">
                        <p className="font-bold text-slate-900">{s.name}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-xs">{s.ministryOrDepartment}</p>
                      </td>
                      <td className="px-6 py-3.5">{s.category}</td>
                      <td className="px-6 py-3.5">{s.jurisdiction} ({s.stateOrUnionTerritory || "All India"})</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-900">{s.rules?.length || 0}</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-900">{s.documents?.length || 0}</td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={s.status} size="sm" />
                      </td>
                      <td className="px-6 py-3.5 text-right space-x-2">
                        <Link
                          href={`/schemes/${s.slug || s.id}`}
                          className="font-bold text-teal-700 hover:underline"
                        >
                          View
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
