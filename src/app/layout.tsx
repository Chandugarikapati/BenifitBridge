import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BenefitBridge | Public Benefits Discovery & Application Platform",
  description: "Independent CivicTech platform simplifying government welfare eligibility, document checklists, and community assistance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans bg-[#f8fafc] text-slate-900 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2.5 focus:bg-teal-700 focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
