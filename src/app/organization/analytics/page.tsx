"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import MetricCard from "@/components/ui/MetricCard";
import AnalyticsCharts from "@/components/analytics/AnalyticsCharts";
import { 
  BarChart3, 
  HelpCircle, 
  Info, 
  Database, 
  CheckCircle2, 
  AlertTriangle,
  Bot,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function OrganizationAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/organization/analytics")
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const summary = data?.summary || {
    totalCases: 24,
    readyCases: 14,
    submittedCases: 10,
    approvedCases: 8,
    readinessRate: 58,
    submissionRate: 42,
    reportedApprovalRate: 80,
  };

  const metricsRegistry = data?.metricsRegistry || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar role="NGO_WORKER" />

        <main className="flex-1 p-6 sm:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                Evaluation & Impact Analytics
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                Community Problem & Efficacy Evaluation
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Investigating whether structural welfare exclusion exists and empirically measuring platform intervention efficacy.
              </p>
            </div>

            {/* Synthetic Data Label */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold shrink-0">
              <Info className="w-3.5 h-3.5 text-amber-700" />
              <span>Synthetic Demo Dataset</span>
            </div>
          </div>

          {/* Top Level Empirical Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Awareness Deficit"
              value="57.8%"
              subtitle="Eligible citizens unaware of schemes"
              hint="Numerator: Unaware eligible / Denominator: Evaluated eligible"
            />
            <MetricCard
              title="Doc Bottleneck Share"
              value="62.4%"
              subtitle="Cases stalled on civil certificates"
              hint="Numerator: Missing income/caste certs / Denominator: All mandatory items"
            />
            <MetricCard
              title="Readiness Conversion"
              value={`${summary.readinessRate}%`}
              subtitle="Cases reaching 100% prepared docs"
              hint="Numerator: Ready to submit / Denominator: Active cases"
            />
            <MetricCard
              title="Reported Approval"
              value={`${summary.reportedApprovalRate}%`}
              subtitle="Citizen reported official sanctions"
              hint="Numerator: Approved reported / Denominator: Submitted"
            />
          </div>

          {/* Interactive Charts */}
          <AnalyticsCharts
            barrierData={data?.barrierData}
            documentBottlenecks={data?.documentBottlenecks}
            outcomeFunnel={data?.outcomeFunnel}
          />

          {/* Formal Community Evaluation Metrics Dictionary */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-600" />
                  Empirical Metric Dictionary & Data Lineage
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Every metric defined with its exact numerator, denominator, and primary data source.
                </p>
              </div>
              <span className="text-xs text-slate-400">
                {metricsRegistry.length} Formally Defined Metrics
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {metricsRegistry.map((m: any) => (
                <div key={m.id} className="py-4 space-y-1.5 first:pt-0 last:pb-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-bold text-slate-900 text-xs">{m.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {m.category}
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed">{m.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px] bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                    <div>
                      <strong className="text-slate-700">Numerator:</strong>{" "}
                      <span className="text-slate-600">{m.numerator}</span>
                    </div>
                    <div>
                      <strong className="text-slate-700">Denominator:</strong>{" "}
                      <span className="text-slate-600">{m.denominator}</span>
                    </div>
                    <div>
                      <strong className="text-slate-700">Data Source:</strong>{" "}
                      <span className="text-indigo-700 font-mono text-[10px]">{m.dataSource}</span>
                    </div>
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
