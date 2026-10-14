"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Lock, Mail, User, Phone, ArrowRight, ShieldCheck, CheckSquare, Square } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"CITIZEN" | "NGO_WORKER">("CITIZEN");
  const [organizationName, setOrganizationName] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) {
      setErrorMsg("You must provide consent for demographic evaluation to register.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          phone,
          role,
          organizationName: role === "NGO_WORKER" ? organizationName : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      if (role === "NGO_WORKER") {
        router.push("/organization/dashboard");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 focus:outline-none">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-600 text-white mb-3 shadow-md shadow-teal-600/20">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create BenefitBridge Account
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Join thousands discovering public subsidies, scholarships, and pensions.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  I am registering as:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("CITIZEN")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      role === "CITIZEN"
                        ? "bg-teal-50 border-teal-600 text-teal-800"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    👤 Citizen / Beneficiary
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("NGO_WORKER")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      role === "NGO_WORKER"
                        ? "bg-indigo-50 border-indigo-600 text-indigo-800"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🤝 NGO Caseworker
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-slate-50/50"
                  />
                </div>
              </div>

              {role === "NGO_WORKER" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Organization / NGO Name
                  </label>
                  <input
                    type="text"
                    required
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="e.g. Seva Welfare Trust"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-slate-50/50"
                  />
                </div>
              )}

              {/* Explicit Consent Box */}
              <div
                onClick={() => setConsentGiven(!consentGiven)}
                className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/50 flex items-start gap-3 cursor-pointer"
              >
                <button type="button" className="mt-0.5 shrink-0 text-teal-700">
                  {consentGiven ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  <strong className="text-slate-900">Informed Consent:</strong> I agree that BenefitBridge may store my demographic profile exclusively to evaluate welfare scheme eligibility. I understand this platform is not a government authority and does not guarantee approval.
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <span>{loading ? "Creating Account..." : "Complete Registration"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Already registered?{" "}
                <Link href="/auth/sign-in" className="font-bold text-teal-700 hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
