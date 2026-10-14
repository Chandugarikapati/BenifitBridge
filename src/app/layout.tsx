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
        {children}
      </body>
    </html>
  );
}
