"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface AnalyticsChartsProps {
  barrierData?: any[];
  documentBottlenecks?: any[];
  outcomeFunnel?: any[];
}

const DEFAULT_BARRIERS = [
  { category: "Agriculture", unawareEligible: 42, applied: 58 },
  { category: "Health (PMJAY)", unawareEligible: 64, applied: 36 },
  { category: "Scholarships", unawareEligible: 51, applied: 49 },
  { category: "Senior Pensions", unawareEligible: 72, applied: 28 },
  { category: "Housing (PMAY)", unawareEligible: 59, applied: 41 },
  { category: "Disability Aid", unawareEligible: 78, applied: 22 },
];

const DEFAULT_DOC_BOTTLENECKS = [
  { document: "Income Certificate", missingCount: 148, delayDays: 24 },
  { document: "Caste / Tribe Certificate", missingCount: 112, delayDays: 31 },
  { document: "Land Record / Patta", missingCount: 89, delayDays: 18 },
  { document: "BPL Ration Card Linkage", missingCount: 76, delayDays: 22 },
  { document: "College Bonafide Receipt", missingCount: 65, delayDays: 12 },
  { document: "Disability UDID Card", missingCount: 54, delayDays: 45 },
];

const DEFAULT_OUTCOME_FUNNEL = [
  { stage: "Discovered Eligible", beneficiaries: 1200 },
  { stage: "Profile Consented", beneficiaries: 980 },
  { stage: "Checklist Initiated", beneficiaries: 840 },
  { stage: "All Docs Verified", beneficiaries: 620 },
  { stage: "Portal Submitted", beneficiaries: 540 },
  { stage: "Reported Approved", beneficiaries: 490 },
];

const COLORS = ["#0d9488", "#0e7490", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899"];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  barrierData = DEFAULT_BARRIERS,
  documentBottlenecks = DEFAULT_DOC_BOTTLENECKS,
  outcomeFunnel = DEFAULT_OUTCOME_FUNNEL,
}) => {
  return (
    <div className="space-y-8">
      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Awareness Deficit */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Awareness Gap Among Potentially Eligible Citizens (%)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Percentage of surveyed eligible households who were unaware of available schemes prior to BenefitBridge.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barrierData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, ""]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="unawareEligible" name="Unaware of Benefit" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="applied" name="Already Accessing" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Document Bottlenecks */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Civil Certificate Bottlenecks & Avg Delay (Days)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Frequency of missing mandatory documents and average bureaucratic acquisition delays reported by caseworkers.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={documentBottlenecks} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="document" type="category" tick={{ fontSize: 10 }} width={110} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="missingCount" name="Incomplete Case Count" fill="#0e7490" radius={[0, 4, 4, 0]} />
                <Bar dataKey="delayDays" name="Avg Issue Delay (Days)" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3: Preparation Funnel */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900">
            Citizen Journey & Readiness Conversion Funnel
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Tracking drop-off points from initial eligibility discovery to verified official submission and approval.
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={outcomeFunnel} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
              <Line
                type="monotone"
                dataKey="beneficiaries"
                name="Beneficiary Count"
                stroke="#0d9488"
                strokeWidth={3}
                dot={{ r: 5, fill: "#0d9488" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default AnalyticsCharts;
