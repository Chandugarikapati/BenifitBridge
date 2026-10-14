import React from "react";
import Link from "next/link";
import { 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  FileCheck2, 
  Bot, 
  HeartHandshake, 
  Sparkles, 
  FileText,
  Search,
  ExternalLink
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SchemeCard from "@/components/schemes/SchemeCard";
import { VERIFIED_SCHEMES_SEED } from "@/lib/data/verifiedSchemes";

export default function HomePage() {
  const featuredSchemes = VERIFIED_SCHEMES_SEED.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-teal-950 via-slate-900 to-slate-900 text-white pt-16 pb-24 sm:pt-24 sm:pb-32">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-teal-500/10 blur-[120px] pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Civic Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Independent Public Benefits Discovery & Application Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
              Connecting Citizens to the Welfare Entitlements They Deserve.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Every year, billions in government subsidies, scholarships, and pensions go uncollected due to complex rules and missing documents. BenefitBridge simplifies criteria, generates personalized document checklists, and connects you with verified assistance.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/schemes"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                <Search className="w-4 h-4" />
                <span>Explore Verified Schemes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth/register"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 flex items-center justify-center gap-2 transition-all"
              >
                <span>Check My Eligibility</span>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-4xl mx-auto">
              <div>
                <p className="text-2xl font-bold text-white">100%</p>
                <p className="text-xs text-slate-400 mt-0.5">Deterministic Rules</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-400">Zero</p>
                <p className="text-xs text-slate-400 mt-0.5">Platform Filing Fees</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">Gazette</p>
                <p className="text-xs text-slate-400 mt-0.5">Verified Guidelines</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-400">Caseworker</p>
                <p className="text-xs text-slate-400 mt-0.5">Community Support</p>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                The Community Challenge
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                Why Millions Never Receive the Benefits They Qualify For
              </h2>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Navigating social welfare shouldn&apos;t require legal expertise. Marginalized families, elderly seniors, and first-generation students face structural exclusion barriers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900">Information Fragmentation</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Scheme rules are scattered across hundreds of ministerial circulars, state gazettes, and outdated portals with convoluted bureaucratic jargon.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900">Document Rejection Bottlenecks</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Applicants waste months traveling to government offices only to be turned away for missing income certificates, unseeded bank passbooks, or outdated caste validity.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900">Lack of Casework Support</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Social workers and NGOs lack centralized case-tracking tools to follow up with vulnerable beneficiaries until official sanction orders are released.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How BenefitBridge Works */}
        <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                Our Transparent Workflow
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                How BenefitBridge Bridges the Welfare Gap
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">1. Scheme Discovery</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Filter verified welfare programs by sector, state, income group, and family demographics.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">2. Deterministic Matching</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Transparent rule engine evaluates your profile without guessing or assumptions, highlighting missing data.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">3. Document Readiness</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Interactive checklists show exactly which certificates you need, accepted alternatives, and issuing desks.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">4. Community Assistance</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Connect with authorized local NGO caseworkers to assist with digital submissions and in-person follow-ups.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Schemes Catalog Preview */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                  Verified Directory
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  Featured Public Welfare Schemes
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Each scheme has been cross-checked with official departmental gazettes and application portals.
                </p>
              </div>

              <Link
                href="/schemes"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredSchemes.map((s) => (
                <SchemeCard
                  key={s.slug}
                  id={s.slug}
                  slug={s.slug}
                  name={s.name}
                  shortDescription={s.shortDescription}
                  category={s.category}
                  jurisdiction={s.jurisdiction}
                  stateOrUnionTerritory={s.stateOrUnionTerritory}
                  ministryOrDepartment={s.ministryOrDepartment}
                  estimatedBenefitAmount={s.estimatedBenefitAmount}
                  benefitType={s.benefitType}
                  processingTimeDays={s.processingTimeDays}
                  isDemo={s.isDemo}
                />
              ))}
            </div>
          </div>
        </section>

        {/* AI Assistant Banner */}
        <section className="py-16 bg-gradient-to-r from-teal-900 to-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-3">
                  <Bot className="w-3.5 h-3.5" />
                  <span>Grounded AI Welfare Guide</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Have Questions About Eligibility or Certificates?
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
                  Ask our server-grounded AI Assistant. It translates complex eligibility circulars into plain language, identifies missing documents, and provides verified source links.
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href="/assistant"
                  className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-900 bg-teal-300 hover:bg-teal-200 shadow-md transition-all inline-flex items-center gap-2"
                >
                  <Bot className="w-4 h-4" />
                  <span>Chat with AI Assistant</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
