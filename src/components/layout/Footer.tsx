"use client";

import React from "react";
import Link from "next/link";
import { Shield, ExternalLink, HeartHandshake, Info } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Platform Identity */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold text-base">
                BB
              </div>
              <span className="text-white font-bold text-lg tracking-tight">BenefitBridge</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An open CivicTech initiative connecting citizens and community caseworkers with verified public welfare, scholarships, pensions, and subsidies.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-[11px] text-teal-300">
              <Shield className="w-3.5 h-3.5 text-teal-400" />
              <span>Independent Civic Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/schemes" className="hover:text-teal-400 transition-colors">
                  Browse All Schemes
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-teal-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-teal-400 transition-colors">
                  AI Welfare Assistant
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-teal-400 transition-colors">
                  Privacy & Data Consent
                </Link>
              </li>
            </ul>
          </div>

          {/* Citizen & NGO Workspaces */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Workspaces</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/auth/sign-in" className="hover:text-teal-400 transition-colors">
                  Citizen Portal
                </Link>
              </li>
              <li>
                <Link href="/organization/dashboard" className="hover:text-teal-400 transition-colors">
                  NGO Caseworker Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/schemes" className="hover:text-teal-400 transition-colors">
                  Scheme Catalog Management
                </Link>
              </li>
              <li>
                <Link href="/admin/audit-logs" className="hover:text-teal-400 transition-colors">
                  Transparency & Audit Logs
                </Link>
              </li>
            </ul>
          </div>

          {/* Civic Trust & Sources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Official Portals</h4>
            <p className="text-xs text-slate-400 mb-3">
              We link directly to official departments for verified submissions:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5 hover:text-white">
                <ExternalLink className="w-3 h-3 text-slate-500" />
                <a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer">
                  pmkisan.gov.in (PM-KISAN)
                </a>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white">
                <ExternalLink className="w-3 h-3 text-slate-500" />
                <a href="https://pmjay.gov.in" target="_blank" rel="noreferrer">
                  pmjay.gov.in (Ayushman Bharat)
                </a>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white">
                <ExternalLink className="w-3 h-3 text-slate-500" />
                <a href="https://scholarships.gov.in" target="_blank" rel="noreferrer">
                  scholarships.gov.in (NSP)
                </a>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white">
                <ExternalLink className="w-3 h-3 text-slate-500" />
                <a href="https://nsap.nic.in" target="_blank" rel="noreferrer">
                  nsap.nic.in (NSAP Pension)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="mt-8 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400 flex items-start gap-3">
          <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-300">Important Disclaimer:</strong> BenefitBridge is an independent community assistance platform, not an official government authority or affiliated agency. We do not issue benefits, approve applications, or charge any fees for government schemes. Potential matches and AI guidance are informational aids based on published guidelines and never guarantee official entitlement or approval.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 BenefitBridge Initiative. Built for public empowerment.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-400">
              Privacy & Consent Policy
            </Link>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <HeartHandshake className="w-3.5 h-3.5 text-teal-400" /> Powered by Community Caseworkers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
