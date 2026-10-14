import React from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Search, 
  FileCheck, 
  Users, 
  HelpCircle, 
  ShieldCheck, 
  ArrowRight,
  AlertTriangle,
  FileQuestion,
  Lock
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function HowItWorksPage() {
  const faqs = [
    {
      q: "Is BenefitBridge an official government agency?",
      a: "No. BenefitBridge is an independent CivicTech platform built to assist citizens and community caseworkers. We do not approve applications or disburse government funds. We provide explainable criteria matching, document readiness checklists, and direct links to official government application portals.",
    },
    {
      q: "Does BenefitBridge charge any money or application fees?",
      a: "Never. All services on BenefitBridge are 100% free and open. Government benefits themselves do not require intermediary commission fees. Never pay anyone claiming to guarantee approval for a government welfare scheme.",
    },
    {
      q: "What do the four eligibility match statuses mean?",
      a: "Our deterministic engine evaluates criteria into four transparent states: (1) Potential Match: you satisfy all mandatory rules; (2) Does Not Match: at least one mandatory rule is not satisfied; (3) Missing Information: your profile lacks data needed to evaluate a rule; (4) Requires Human Review: the rule involves discretionary or offline inspection.",
    },
    {
      q: "How is my privacy protected?",
      a: "We practice minimal data collection. We never ask for bank passwords, OTPs, or confidential identity credentials. You must provide explicit consent before demographic data is evaluated, and you can delete your profile at any time.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              User Guide
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-3 tracking-tight">
              How BenefitBridge Works
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              Step-by-step guidance on how our platform simplifies eligibility assessment, eliminates document confusion, and helps you file applications correctly.
            </p>
          </div>

          {/* 4 Steps Detailed */}
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xl shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">Discover Relevant Schemes</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Browse our verified catalog of central and state welfare programs across healthcare, agriculture, scholarships, pensions, and housing. Search by sector, state jurisdiction, and benefit type.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700">
                  <ShieldCheck className="w-4 h-4" />
                  <span>All schemes are verified against official government gazette guidelines.</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xl shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">Deterministic Eligibility Evaluation</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Unlike opaque AI predictions, our transparent rules engine checks each condition (age limits, income thresholds, student status, residency) deterministically. We never guess missing information: if a field is blank, we explicitly declare it as <em>Missing Information</em> so you can verify it.
                </p>
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded font-semibold text-center border border-emerald-200">
                    Potential Match
                  </div>
                  <div className="p-2 bg-rose-50 text-rose-800 rounded font-semibold text-center border border-rose-200">
                    Does Not Match
                  </div>
                  <div className="p-2 bg-amber-50 text-amber-800 rounded font-semibold text-center border border-amber-200">
                    Missing Information
                  </div>
                  <div className="p-2 bg-sky-50 text-sky-800 rounded font-semibold text-center border border-sky-200">
                    Needs Review
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xl shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">Personalized Document Checklist</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Avoid rejected submissions. BenefitBridge generates an actionable checklist showing mandatory vs optional certificates, official issuing authorities (Tehsildar, Medical Board, Panchayat), and accepted alternative proofs.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-600">
                  <FileCheck className="w-4 h-4 text-teal-600" />
                  <span>Tracks preparation percentage until your case reaches 100% Ready to Submit.</span>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xl shrink-0">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">Official Filing & Community Casework</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Once your documents are in order, follow direct links to official government portals or visit your local Common Service Centre (CSC). If you need hands-on assistance, authorized partner NGOs can help track your case and follow up on official sanction orders.
                </p>
              </div>
            </div>
          </div>

          {/* Transparent FAQ */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <h4 className="text-sm font-bold text-slate-900 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 rounded-3xl bg-teal-900 text-white text-center">
            <h3 className="text-xl sm:text-2xl font-bold">Ready to Check Your Entitlements?</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl mx-auto">
              Create an account in 60 seconds or browse schemes anonymously without registering.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/schemes"
                className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors"
              >
                Browse Schemes
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
