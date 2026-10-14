"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import { Plus, Trash2, ArrowLeft, ShieldCheck, Save, AlertCircle } from "lucide-react";

export default function NewSchemePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    category: "Health",
    targetBeneficiaries: "",
    jurisdiction: "Central",
    stateOrUnionTerritory: "All India",
    ministryOrDepartment: "",
    officialUrl: "",
    applicationPortalUrl: "",
    helplineNumber: "",
    benefitType: "Direct Cash Transfer",
    estimatedBenefitAmount: "",
    processingTimeDays: "30",
    status: "PUBLISHED",
  });

  const [rules, setRules] = useState([
    {
      criterionName: "Income Ceiling",
      operator: "LESS_THAN_EQUAL",
      fieldKey: "annualIncome",
      expectedValue: "250000",
      explanation: "Annual family income must not exceed ₹2,50,000.",
      isMandatory: true,
      sourceReferenceUrl: "",
    },
  ]);

  const [documents, setDocuments] = useState([
    {
      documentName: "Aadhaar Card",
      description: "Identity and biometric validation.",
      issuingAuthority: "UIDAI",
      isMandatory: true,
      alternativeDocuments: "Masked e-Aadhaar",
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddRule = () => {
    setRules((prev) => [
      ...prev,
      {
        criterionName: "",
        operator: "EQUALS",
        fieldKey: "age",
        expectedValue: "",
        explanation: "",
        isMandatory: true,
        sourceReferenceUrl: "",
      },
    ]);
  };

  const handleRemoveRule = (index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddDoc = () => {
    setDocuments((prev) => [
      ...prev,
      {
        documentName: "",
        description: "",
        issuingAuthority: "",
        isMandatory: true,
        alternativeDocuments: "",
      },
    ]);
  };

  const handleRemoveDoc = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          rules,
          documents,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create scheme");
      }

      router.push("/admin/schemes");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save scheme.");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar role="ADMIN" />

        <main className="flex-1 p-6 sm:p-8 space-y-6">
          <div>
            <Link
              href="/admin/schemes"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-3"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Schemes Catalog</span>
            </Link>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Publish New Welfare Scheme
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure deterministic eligibility rules, document requirements, and gazette sources.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                1. General Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Scheme Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. National Apprenticeship Promotion Scheme"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sector / Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                  >
                    <option value="Health">Health</option>
                    <option value="Education & Scholarship">Education & Scholarship</option>
                    <option value="Agriculture & Farming">Agriculture & Farming</option>
                    <option value="Pensions & Senior Citizens">Pensions & Senior Citizens</option>
                    <option value="Housing & Shelter">Housing & Shelter</option>
                    <option value="Social Welfare & Disability">Social Welfare & Disability</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ministry / Department</label>
                  <input
                    type="text"
                    required
                    value={formData.ministryOrDepartment}
                    onChange={(e) => setFormData({ ...formData, ministryOrDepartment: e.target.value })}
                    placeholder="e.g. Ministry of Skill Development"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Website URL</label>
                  <input
                    type="url"
                    required
                    value={formData.officialUrl}
                    onChange={(e) => setFormData({ ...formData, officialUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Benefit Amount / Form</label>
                  <input
                    type="text"
                    value={formData.estimatedBenefitAmount}
                    onChange={(e) => setFormData({ ...formData, estimatedBenefitAmount: e.target.value })}
                    placeholder="e.g. ₹1,500 / month stipend"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea
                  required
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Concise 1-2 sentence overview for cards..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            {/* Rules Builder */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">
                  2. Deterministic Eligibility Rules ({rules.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Criterion</span>
                </button>
              </div>

              <div className="space-y-3">
                {rules.map((rule, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        placeholder="Criterion Name (e.g. Maximum Age Limit)"
                        value={rule.criterionName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRules((p) => p.map((r, i) => (i === idx ? { ...r, criterionName: val } : r)));
                        }}
                        className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <select
                        value={rule.fieldKey}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRules((p) => p.map((r, i) => (i === idx ? { ...r, fieldKey: val } : r)));
                        }}
                        className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="annualIncome">annualIncome (Income)</option>
                        <option value="age">age (Age in years)</option>
                        <option value="gender">gender (male/female)</option>
                        <option value="casteCategory">casteCategory (general/obc/sc/st)</option>
                        <option value="occupation">occupation</option>
                        <option value="isStudent">isStudent (true/false)</option>
                        <option value="disabilityStatus">disabilityStatus (true/false)</option>
                        <option value="hasAadhaarCard">hasAadhaarCard (true/false)</option>
                      </select>

                      <select
                        value={rule.operator}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRules((p) => p.map((r, i) => (i === idx ? { ...r, operator: val as any } : r)));
                        }}
                        className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="EQUALS">EQUALS</option>
                        <option value="LESS_THAN_EQUAL">LESS_THAN_EQUAL (&lt;=)</option>
                        <option value="GREATER_THAN_EQUAL">GREATER_THAN_EQUAL (&gt;=)</option>
                        <option value="IN_LIST">IN_LIST (comma-separated)</option>
                        <option value="BOOLEAN">BOOLEAN (true/false)</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Expected Value (e.g. 250000)"
                        value={rule.expectedValue}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRules((p) => p.map((r, i) => (i === idx ? { ...r, expectedValue: val } : r)));
                        }}
                        className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Requirements */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">
                  3. Mandatory Documents Checklist ({documents.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddDoc}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Document</span>
                </button>
              </div>

              <div className="space-y-3">
                {documents.map((doc, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        placeholder="Document Name (e.g. Caste Validity Certificate)"
                        value={doc.documentName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDocuments((p) => p.map((d, i) => (i === idx ? { ...d, documentName: val } : d)));
                        }}
                        className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Issuing Authority (e.g. Tehsildar / Sub-Divisional Magistrate)"
                        value={doc.issuingAuthority}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDocuments((p) => p.map((d, i) => (i === idx ? { ...d, issuingAuthority: val } : d)));
                        }}
                        className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Alternative Documents (e.g. e-District digital slip)"
                        value={doc.alternativeDocuments}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDocuments((p) => p.map((d, i) => (i === idx ? { ...d, alternativeDocuments: val } : d)));
                        }}
                        className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Link
                href="/admin/schemes"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-700 shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Publishing..." : "Publish to Catalog"}</span>
              </button>
            </div>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
}
