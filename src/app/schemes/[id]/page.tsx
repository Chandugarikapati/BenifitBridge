"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatusBadge from "@/components/ui/StatusBadge";
import { 
  Building2, 
  ExternalLink, 
  Phone, 
  Clock, 
  ShieldCheck, 
  FileCheck2, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  HelpCircle,
  FileText,
  UserCheck
} from "lucide-react";

export default function SchemeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const schemeId = params?.id as string;

  const [scheme, setScheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [caseCreating, setCaseCreating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Check user session
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.user || null));

    // Fetch scheme
    fetch(`/api/schemes/${schemeId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.scheme) setScheme(d.scheme);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [schemeId]);

  const handleStartCase = async () => {
    if (!user) {
      router.push(`/auth/sign-in?redirect=/schemes/${schemeId}`);
      return;
    }

    setCaseCreating(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemeId: scheme.id,
          requestNgoAssistance: true,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create application case.");
      }

      const data = await res.json();
      router.push(`/cases/${data.case.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Could not initiate case.");
      setCaseCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <p className="text-xs text-slate-500 animate-pulse">Loading verified scheme guidelines...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto text-center py-20 px-4">
          <h2 className="text-xl font-bold text-slate-900">Scheme Not Found</h2>
          <p className="text-xs text-slate-500 mt-2">The requested welfare program record could not be located.</p>
          <Link href="/schemes" className="mt-4 inline-block text-xs font-bold text-teal-700">
            ← Return to Schemes Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 py-10 sm:py-14 focus:outline-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/schemes" className="hover:text-teal-700">
              Schemes Directory
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-medium truncate max-w-xs">{scheme.name}</span>
          </div>

          {/* Scheme Header Banner */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                    {scheme.category}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {scheme.jurisdiction} • {scheme.stateOrUnionTerritory || "All India"}
                  </span>
                  <StatusBadge status={scheme.status} size="sm" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {scheme.name}
                </h1>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{scheme.ministryOrDepartment}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                  {scheme.fullDescription}
                </p>
              </div>

              {/* Action Card */}
              <div className="w-full lg:w-72 bg-slate-50 rounded-2xl p-5 border border-slate-200/80 shrink-0 space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Entitled Benefit</p>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">
                    {scheme.estimatedBenefitAmount || scheme.benefitType}
                  </p>
                </div>

                {scheme.processingTimeDays && (
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Avg Processing:
                    </span>
                    <span className="font-semibold text-slate-800">~{scheme.processingTimeDays} Days</span>
                  </div>
                )}

                {errorMsg && (
                  <p className="text-xs text-rose-600 p-2 rounded bg-rose-50 border border-rose-200">
                    {errorMsg}
                  </p>
                )}

                <button
                  onClick={handleStartCase}
                  disabled={caseCreating}
                  className="w-full py-3 rounded-xl font-bold text-xs text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>{caseCreating ? "Preparing Checklist..." : "Start Application Case"}</span>
                </button>

                {scheme.applicationPortalUrl && (
                  <a
                    href={scheme.applicationPortalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Scheme Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Eligibility Rules & Documents */}
            <div className="lg:col-span-2 space-y-8">
              {/* Eligibility Criteria */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    Official Eligibility Criteria
                  </h2>
                  <span className="text-xs text-slate-400">
                    {scheme.rules?.length || 0} Criteria Evaluated
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {scheme.rules?.map((rule: any) => (
                    <div key={rule.id} className="py-3.5 first:pt-0 last:pb-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900">
                          {rule.criterionName}
                        </h4>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            rule.isMandatory
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {rule.isMandatory ? "Mandatory" : "Optional"}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {rule.explanation}
                      </p>

                      {rule.sourceReferenceUrl && (
                        <div className="mt-2 text-[11px] text-teal-700 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          <a
                            href={rule.sourceReferenceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline"
                          >
                            Source: {rule.sourceReferenceText || "Official Departmental Rule"}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Documents */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal-600" />
                    Required Documents & Certificates
                  </h2>
                  <span className="text-xs text-slate-400">
                    {scheme.documents?.length || 0} Documents
                  </span>
                </div>

                <div className="space-y-3">
                  {scheme.documents?.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{doc.documentName}</h4>
                        {doc.isMandatory ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                            Required
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">Supporting</span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mt-1">{doc.description}</p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                        <span>Issuing Desk: <strong>{doc.issuingAuthority}</strong></span>
                        {doc.verificationMethod && (
                          <span>Mode: {doc.verificationMethod}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Source Verification & Helplines */}
            <div className="space-y-6">
              {/* Gazette Verification Badge */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  Source Verification
                </h3>

                <div className="text-xs text-slate-600 space-y-2">
                  <p>
                    <strong>Last Verified:</strong>{" "}
                    {new Date(scheme.lastVerifiedAt || scheme.updatedAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Official Gazette Ref:</strong>{" "}
                    {scheme.verifications?.[0]?.officialGazetteReference || "Central Ministry Notification"}
                  </p>
                  <div className="pt-2 border-t border-slate-100">
                    <a
                      href={scheme.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-teal-700 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{scheme.officialUrl}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Official Helplines */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-teal-600" />
                  Official Department Helplines
                </h3>
                <p className="text-xs text-slate-600 mb-2">
                  Contact official ministerial desks for toll-free grievance redressal:
                </p>
                <p className="text-sm font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {scheme.helplineNumber || "1800-11-0001 (National Portal Helpline)"}
                </p>
              </div>

              {/* AI Guidance Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-900 to-slate-900 text-white shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-2">
                  Need Help With This Scheme?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Ask our server-grounded AI Assistant to explain how your family details match this scheme.
                </p>
                <Link
                  href="/assistant"
                  className="w-full py-2 rounded-lg text-xs font-bold text-slate-900 bg-teal-300 hover:bg-teal-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Ask AI Assistant</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
