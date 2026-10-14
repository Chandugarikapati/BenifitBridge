"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import { 
  User, 
  Save, 
  ShieldCheck, 
  CheckSquare, 
  Square, 
  AlertCircle, 
  CheckCircle2,
  FileText
} from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    age: "",
    gender: "male",
    state: "Maharashtra",
    district: "",
    pinCode: "",
    annualIncome: "",
    employmentStatus: "employed",
    occupation: "farmer",
    casteCategory: "general",
    disabilityStatus: false,
    disabilityPercentage: "",
    isStudent: false,
    educationLevel: "secondary",
    maritalStatus: "married",
    householdSize: "4",
    isRural: true,
    hasBPLCard: false,
    hasAadhaarCard: true,
    hasRationCard: false,
    hasIncomeCertificate: false,
    hasDisabilityCertificate: false,
    hasCasteCertificate: false,
    hasBankPassbook: true,
    consentGiven: true,
  });

  const [consents, setConsents] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.profile) {
          const p = data.profile;
          setFormData({
            age: p.age !== null && p.age !== undefined ? String(p.age) : "",
            gender: p.gender || "male",
            state: p.state || "Maharashtra",
            district: p.district || "",
            pinCode: p.pinCode || "",
            annualIncome: p.annualIncome !== null && p.annualIncome !== undefined ? String(p.annualIncome) : "",
            employmentStatus: p.employmentStatus || "employed",
            occupation: p.occupation || "",
            casteCategory: p.casteCategory || "general",
            disabilityStatus: Boolean(p.disabilityStatus),
            disabilityPercentage: p.disabilityPercentage ? String(p.disabilityPercentage) : "",
            isStudent: Boolean(p.isStudent),
            educationLevel: p.educationLevel || "secondary",
            maritalStatus: p.maritalStatus || "married",
            householdSize: p.householdSize ? String(p.householdSize) : "4",
            isRural: Boolean(p.isRural),
            hasBPLCard: Boolean(p.hasBPLCard),
            hasAadhaarCard: Boolean(p.hasAadhaarCard),
            hasRationCard: Boolean(p.hasRationCard),
            hasIncomeCertificate: Boolean(p.hasIncomeCertificate),
            hasDisabilityCertificate: Boolean(p.hasDisabilityCertificate),
            hasCasteCertificate: Boolean(p.hasCasteCertificate),
            hasBankPassbook: Boolean(p.hasBankPassbook),
            consentGiven: true,
          });
        }
        if (data?.consents) {
          setConsents(data.consents);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to save profile.");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar role="CITIZEN" />

        <main className="flex-1 p-6 sm:p-8 space-y-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              Beneficiary Profile & Privacy Consent
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              My Eligibility Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Your profile is evaluated by our deterministic engine against official scheme guidelines.
            </p>
          </div>

          {saveSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully! Scheme matches have been refreshed.</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Demographics */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                1. Demographic & Household Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    name="age"
                    min={0}
                    max={120}
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 42"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other / Transgender</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Marital Status</label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="widowed">Widowed</option>
                    <option value="divorced">Divorced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State / UT</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Other">Other State</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="e.g. Nashik"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Area Type</label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="isRural"
                        checked={formData.isRural === true}
                        onChange={() => setFormData((p) => ({ ...p, isRural: true }))}
                      />
                      <span>Rural (Village)</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="isRural"
                        checked={formData.isRural === false}
                        onChange={() => setFormData((p) => ({ ...p, isRural: false }))}
                      />
                      <span>Urban (City/Town)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Socioeconomic & Livelihood */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                2. Socioeconomic, Caste & Income
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Annual Family Income (₹)
                  </label>
                  <input
                    type="number"
                    name="annualIncome"
                    value={formData.annualIncome}
                    onChange={handleChange}
                    placeholder="e.g. 140000"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Social Category / Caste
                  </label>
                  <select
                    name="casteCategory"
                    value={formData.casteCategory}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
                  >
                    <option value="general">General</option>
                    <option value="obc">OBC (Other Backward Classes)</option>
                    <option value="sc">SC (Scheduled Caste)</option>
                    <option value="st">ST (Scheduled Tribe)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Occupation</label>
                  <select
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
                  >
                    <option value="farmer">Farmer / Agriculturalist</option>
                    <option value="student">Student</option>
                    <option value="daily_wage">Daily Wage Worker</option>
                    <option value="self_employed">Self Employed / Artisan</option>
                    <option value="salaried">Salaried Employee</option>
                    <option value="retired">Senior / Retired</option>
                    <option value="unemployed">Unemployed</option>
                  </select>
                </div>
              </div>

              {/* Disability & Student conditional flags */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="disabilityStatus"
                      checked={formData.disabilityStatus}
                      onChange={handleChange}
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      Person with Benchmark Disability (PwD)
                    </span>
                  </label>
                  {formData.disabilityStatus && (
                    <div className="mt-2 pl-6">
                      <label className="block text-[11px] text-slate-600 mb-1">
                        Disability Percentage (%) as per UDID
                      </label>
                      <input
                        type="number"
                        name="disabilityPercentage"
                        min={0}
                        max={100}
                        value={formData.disabilityPercentage}
                        onChange={handleChange}
                        placeholder="e.g. 80"
                        className="w-32 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                      />
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isStudent"
                      checked={formData.isStudent}
                      onChange={handleChange}
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      Currently Enrolled Student
                    </span>
                  </label>
                  {formData.isStudent && (
                    <div className="mt-2 pl-6">
                      <label className="block text-[11px] text-slate-600 mb-1">Education Stage</label>
                      <select
                        name="educationLevel"
                        value={formData.educationLevel}
                        onChange={handleChange}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                      >
                        <option value="secondary">Class 9-10 (Pre-Matric)</option>
                        <option value="higher_secondary">Class 11-12 (Post-Matric)</option>
                        <option value="graduate">Undergraduate / College</option>
                        <option value="post_graduate">Postgraduate</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Available Certificates */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  3. Certificates Already in Possession
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pre-checks your document checklists and flags missing civil certificates early.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {[
                  { name: "hasAadhaarCard", label: "Aadhaar Card" },
                  { name: "hasBankPassbook", label: "Bank Account (DBT Seeded)" },
                  { name: "hasRationCard", label: "Ration Card (NFSA / State)" },
                  { name: "hasBPLCard", label: "BPL Certificate / Survey Card" },
                  { name: "hasIncomeCertificate", label: "Income Certificate (Current FY)" },
                  { name: "hasCasteCertificate", label: "Caste / Tribe Certificate" },
                  { name: "hasDisabilityCertificate", label: "UDID / Disability Certificate" },
                ].map((doc) => (
                  <label
                    key={doc.name}
                    className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      name={doc.name}
                      checked={(formData as any)[doc.name]}
                      onChange={handleChange}
                    />
                    <span className="text-xs font-medium text-slate-800">{doc.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section 4: Consent & Save */}
            <div className="p-6 rounded-2xl bg-teal-50 border border-teal-200 space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div className="text-xs text-teal-900 leading-relaxed">
                  <strong>Explicit Consent Logged:</strong> Your demographic information is processed solely for deterministic scheme rule matching and is never shared with third-party advertising brokers.
                </div>
              </div>

              <div className="pt-2 border-t border-teal-200/60 flex items-center justify-between">
                <span className="text-xs text-teal-800">
                  {consents.length > 0
                    ? `Last consent recorded on ${new Date(consents[0].createdAt).toLocaleDateString()}`
                    : "Consent will be recorded upon save."}
                </span>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-teal-700 hover:bg-teal-800 shadow-sm transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving Profile..." : "Save & Evaluate Matches"}</span>
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
}
