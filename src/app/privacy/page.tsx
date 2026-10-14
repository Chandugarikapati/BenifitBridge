import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, Lock, EyeOff, FileText, Trash2, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              Civic Trust & Data Rights
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Privacy, Consent & Data Protection
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              BenefitBridge was engineered with privacy-by-design to safeguard vulnerable citizens. We collect only what is strictly necessary to evaluate eligibility.
            </p>
          </div>

          <div className="space-y-8">
            {/* Principles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <Lock className="w-6 h-6 text-teal-600 mb-2" />
                <h3 className="text-sm font-bold text-slate-900">Minimal Data Collection</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  We only request demographic and economic parameters (e.g., annual income, age, occupation) required to check scheme criteria.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <EyeOff className="w-6 h-6 text-teal-600 mb-2" />
                <h3 className="text-sm font-bold text-slate-900">No Sensitive Credentials</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  We NEVER ask for bank PINs, OTPs, Aadhaar passwords, or sensitive financial account numbers.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <Trash2 className="w-6 h-6 text-teal-600 mb-2" />
                <h3 className="text-sm font-bold text-slate-900">Full Deletion Rights</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  You can purge your profile, remove consent, and delete all case records at any time from your account settings.
                </p>
              </div>
            </div>

            {/* Detailed Policy Sections */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
              <section>
                <h2 className="text-base font-bold text-slate-900 mb-2">1. Informed Consent Architecture</h2>
                <p>
                  Before storing any demographic or socioeconomic profile details, BenefitBridge presents an explicit consent disclosure. Every grant of consent is logged as an immutable <code>ConsentRecord</code> with timestamp, purpose (e.g. <code>ELIGIBILITY_ASSESSMENT</code>), and scope.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900 mb-2">2. Anonymous Browsing</h2>
                <p>
                  Citizens are never forced to create an account to explore government programs. You can browse the complete scheme catalog, read official guidelines, view document requirements, and test eligibility anonymously.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900 mb-2">3. NGO Caseworker Access Controls</h2>
                <p>
                  When you request community worker assistance, access to your document checklist is strictly scoped to authorized caseworkers in your assigned non-profit organization. Caseworkers only view documents needed to prepare your application.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900 mb-2">4. AI Assistant Grounding & Zero Data Sharing</h2>
                <p>
                  Our server-side AI Assistant is powered by Google Gemini using retrieval-augmented generation grounded exclusively in verified government circulars. Personal identifiers are never sent to external AI providers for model training.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900 mb-2">5. Data Retention & Erasure</h2>
                <p>
                  Case records and draft checklists are retained only for the active duration of application preparation. Inactive accounts with no activity for 12 months are scheduled for automatic data pruning.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
