"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import StatusBadge from "@/components/ui/StatusBadge";
import ChecklistManager from "@/components/cases/ChecklistManager";
import { 
  Building2, 
  ExternalLink, 
  FileCheck2, 
  CheckCircle2, 
  Send, 
  History, 
  Clock, 
  ShieldCheck,
  User,
  ArrowLeft,
  AlertCircle
} from "lucide-react";

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params?.id as string;
  const router = useRouter();

  const [applicationCase, setApplicationCase] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionRef, setSubmissionRef] = useState("");
  const [reportedOutcome, setReportedOutcome] = useState("PENDING");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchCase = () => {
    fetch(`/api/cases/${caseId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.case) {
          setApplicationCase(data.case);
          setSubmissionRef(data.case.officialApplicationReference || "");
          setReportedOutcome(data.case.reportedOutcome || "PENDING");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCase();
  }, [caseId]);

  const handleReportSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/cases/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "SUBMITTED",
          officialApplicationReference: submissionRef,
          reportedOutcome,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to record submission.");
      }

      setShowSubmitModal(false);
      fetchCase();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update case submission.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <p className="text-xs text-slate-500 animate-pulse">Loading application case...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!applicationCase) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Navbar />
        <div className="flex-1 max-w-md mx-auto text-center py-20 px-4">
          <h2 className="text-lg font-bold text-slate-900">Case Not Found</h2>
          <p className="text-xs text-slate-500 mt-2">Could not find record for case #{caseId}.</p>
          <Link href="/cases" className="mt-4 inline-block text-xs font-bold text-teal-700">
            ← Back to Cases
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const worker = applicationCase.assignments?.[0]?.assignedTo;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar role="CITIZEN" />

        <main className="flex-1 p-6 sm:p-8 space-y-8">
          {/* Back button & Case Header */}
          <div>
            <Link
              href="/cases"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-3"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to My Cases</span>
            </Link>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                    {applicationCase.caseNumber}
                  </span>
                  <StatusBadge status={applicationCase.status} size="sm" />
                  <StatusBadge status={applicationCase.priority} size="sm" />
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {applicationCase.scheme?.name}
                </h1>

                <p className="text-xs text-slate-500">
                  Department: {applicationCase.scheme?.ministryOrDepartment} • Benefit:{" "}
                  <strong>{applicationCase.scheme?.estimatedBenefitAmount || applicationCase.scheme?.benefitType}</strong>
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 shrink-0 flex-wrap">
                {applicationCase.scheme?.applicationPortalUrl && (
                  <a
                    href={applicationCase.scheme.applicationPortalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}

                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Report Official Submission</span>
                </button>
              </div>
            </div>
          </div>

          {/* Submission status banner if submitted */}
          {applicationCase.status === "SUBMITTED" && (
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-start gap-3 text-xs text-teal-900">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Official Application Reported as Submitted</p>
                <p className="mt-0.5">
                  Reference: <strong>{applicationCase.officialApplicationReference || "Not provided"}</strong> • Reported Status: <strong>{applicationCase.reportedOutcome}</strong>
                </p>
                <p className="text-[11px] text-teal-700 mt-1">
                  Note: Verified outcome remains &apos;{applicationCase.verifiedOutcome}&apos; until department sanction list is confirmed.
                </p>
              </div>
            </div>
          )}

          {/* Grid: Checklist on left (2 cols), Details on right (1 col) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Interactive Checklist Manager */}
              <ChecklistManager
                caseId={applicationCase.id}
                initialItems={applicationCase.checklist || []}
                onUpdate={fetchCase}
              />

              {/* Case History / Activity Log */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <History className="w-4 h-4 text-teal-600" />
                  Case Activity Timeline
                </h3>

                <div className="space-y-4">
                  {applicationCase.events?.map((ev: any) => {
                    let details: any = {};
                    try {
                      details = JSON.parse(ev.detailsJson);
                    } catch (e) {}

                    return (
                      <div key={ev.id} className="flex items-start gap-3 text-xs">
                        <div className="w-2 h-2 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">
                            {ev.eventType.replace(/_/g, " ")} by{" "}
                            {ev.actor?.fullName || "System"} ({ev.actorRole || "Automated"})
                          </p>
                          {details.reason && <p className="text-slate-500">{details.reason}</p>}
                          {details.itemTitle && (
                            <p className="text-slate-500">
                              Updated document: {details.itemTitle} (Completed: {details.isCompleted ? "Yes" : "No"})
                            </p>
                          )}
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(ev.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Caseworker & Instructions */}
            <div className="space-y-6">
              {/* Caseworker Box */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-teal-600" />
                  Assigned Community Caseworker
                </h3>

                {worker ? (
                  <div className="text-xs space-y-1.5">
                    <p className="font-bold text-slate-900">{worker.fullName}</p>
                    <p className="text-slate-500">
                      Organization: {applicationCase.organization?.name || "Community Network"}
                    </p>
                    {worker.phone && <p className="text-slate-600">Phone: {worker.phone}</p>}
                    <p className="text-slate-600">Email: {worker.email}</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 leading-relaxed">
                    No individual caseworker is assigned yet. Your local organization desk has access to support your document verification.
                  </p>
                )}
              </div>

              {/* Instructions Box */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-3">
                <h4 className="font-bold text-slate-900">Official Submission Steps</h4>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-600 text-[11px] leading-relaxed">
                  <li>Ensure all mandatory checklist certificates are marked complete.</li>
                  <li>Visit the official government scheme website or your local Common Service Centre (CSC).</li>
                  <li>Submit physical or digital forms along with your certified documents.</li>
                  <li>Return to BenefitBridge and record your submission acknowledgment number above.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Submission Modal */}
          {showSubmitModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Report Official Application Submission</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Record your official portal filing or CSC physical acknowledgement receipt.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 text-xs text-rose-700 border border-rose-200">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleReportSubmission} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Application / Acknowledgment Number
                    </label>
                    <input
                      type="text"
                      required
                      value={submissionRef}
                      onChange={(e) => setSubmissionRef(e.target.value)}
                      placeholder="e.g. MH/2026/PMK/48912"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Reported Application Status
                    </label>
                    <select
                      value={reportedOutcome}
                      onChange={(e) => setReportedOutcome(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
                    >
                      <option value="PENDING">Under Official Review (Pending)</option>
                      <option value="APPROVED">Sanctioned / Approved</option>
                      <option value="REJECTED">Official Rejection</option>
                      <option value="WITHDRAWN">Withdrawn</option>
                    </select>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700"
                    >
                      {submitting ? "Saving..." : "Save Submission Details"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
