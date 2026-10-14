"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.user.role === "NGO_WORKER") {
        router.push("/organization/dashboard");
      } else if (data.user.role === "ADMIN") {
        router.push("/admin/schemes");
      } else {
        router.push(redirectUrl);
      }
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Password123!");
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail, password: "Password123!" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Demo login failed");
      }

      if (data.user.role === "NGO_WORKER") {
        router.push("/organization/dashboard");
      } else if (data.user.role === "ADMIN") {
        router.push("/admin/schemes");
      } else {
        router.push(redirectUrl);
      }
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Demo login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-600 text-white mb-3 shadow-md shadow-teal-600/20">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign In to BenefitBridge
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Access your saved schemes, application cases, and caseworker notes.
        </p>
      </div>

      {/* Demonstration Quick Login Buttons */}
      <div className="p-4 rounded-2xl bg-white border border-teal-200/80 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>One-Click Demonstration Logins</span>
        </div>
        <p className="text-[11px] text-slate-500 mb-3">
          Click any verified persona below to test role-based capabilities:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin("citizen@benefitbridge.org")}
            className="p-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 text-[11px] font-bold text-left border border-teal-200 transition-colors"
          >
            👤 Citizen: Rajesh (Farmer)
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin("student@benefitbridge.org")}
            className="p-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 text-[11px] font-bold text-left border border-teal-200 transition-colors"
          >
            🎓 Citizen: Sunita (Student)
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin("worker@benefitbridge.org")}
            className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-[11px] font-bold text-left border border-indigo-200 transition-colors"
          >
            🤝 NGO Caseworker (Priya)
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin("admin@benefitbridge.org")}
            className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 text-[11px] font-bold text-left border border-purple-200 transition-colors"
          >
            🛡️ System Administrator
          </button>
        </div>
      </div>

      {/* Standard Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-slate-50/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <span>{loading ? "Authenticating..." : "Sign In"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-bold text-teal-700 hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading sign in...</div>}>
          <SignInForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
