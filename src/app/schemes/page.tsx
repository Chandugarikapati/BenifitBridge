"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SchemeCard from "@/components/schemes/SchemeCard";
import { Search, Filter, ShieldCheck, RefreshCw, X } from "lucide-react";

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("All");

  const categories = [
    "All",
    "Health",
    "Education & Scholarship",
    "Agriculture & Farming",
    "Pensions & Senior Citizens",
    "Housing & Shelter",
    "Social Welfare & Disability",
  ];

  const jurisdictions = ["All", "Central", "State"];

  const fetchSchemes = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (selectedJurisdiction !== "All") params.set("jurisdiction", selectedJurisdiction);

    fetch(`/api/schemes?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : { schemes: [] }))
      .then((data) => {
        setSchemes(data.schemes || []);
      })
      .catch(() => setSchemes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSchemes();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedJurisdiction]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Government Schemes Directory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Verified Public Welfare & Subsidies
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Explore authentic welfare schemes with official eligibility criteria, required documents, and application portals.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by scheme name, keywords, ministry, or beneficiary group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-slate-50/50"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
              {/* Categories */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <span className="text-xs font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Sector:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? "bg-slate-900 text-white font-semibold"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Jurisdiction */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-medium text-slate-500">Jurisdiction:</span>
                <select
                  value={selectedJurisdiction}
                  onChange={(e) => setSelectedJurisdiction(e.target.value)}
                  className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:border-teal-600"
                >
                  {jurisdictions.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-slate-500 font-medium">
                Showing <strong className="text-slate-800">{schemes.length}</strong> verified public schemes
              </p>
              {loading && (
                <span className="flex items-center gap-1.5 text-xs text-teal-600">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Updating directory...
                </span>
              )}
            </div>

            {schemes.length === 0 && !loading ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <p className="text-base font-bold text-slate-900">No schemes found</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your keywords or clearing the category filter to view all available benefits.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSelectedJurisdiction("All");
                  }}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schemes.map((s) => (
                  <SchemeCard
                    key={s.id}
                    id={s.id}
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
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
