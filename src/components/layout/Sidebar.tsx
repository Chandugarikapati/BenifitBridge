"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  User, 
  FileCheck, 
  CheckSquare, 
  Bot, 
  Users, 
  BarChart3, 
  FolderPlus, 
  ShieldCheck, 
  ListFilter,
  FileText
} from "lucide-react";

interface SidebarProps {
  role: "CITIZEN" | "NGO_WORKER" | "ADMIN";
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname();

  const citizenNav = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Profile & Consent", href: "/profile", icon: User },
    { label: "Scheme Matches", href: "/matches", icon: FileCheck },
    { label: "My Application Cases", href: "/cases", icon: CheckSquare },
    { label: "AI Welfare Assistant", href: "/assistant", icon: Bot },
  ];

  const ngoNav = [
    { label: "Casework Overview", href: "/organization/dashboard", icon: LayoutDashboard },
    { label: "Beneficiary Cases", href: "/organization/cases", icon: Users },
    { label: "Barrier Analytics", href: "/organization/analytics", icon: BarChart3 },
  ];

  const adminNav = [
    { label: "Scheme Catalog", href: "/admin/schemes", icon: ListFilter },
    { label: "Add New Scheme", href: "/admin/schemes/new", icon: FolderPlus },
    { label: "User Directory", href: "/admin/users", icon: Users },
    { label: "Organizations", href: "/admin/organizations", icon: ShieldCheck },
    { label: "Audit & Transparency Logs", href: "/admin/audit-logs", icon: FileText },
  ];

  const items = role === "CITIZEN" ? citizenNav : role === "NGO_WORKER" ? ngoNav : adminNav;

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 shrink-0">
      <div className="mb-4 px-2 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Workspace</p>
        <p className="text-xs font-semibold text-slate-800 capitalize">
          {role === "CITIZEN" ? "Citizen Portal" : role === "NGO_WORKER" ? "NGO Caseworker" : "System Administrator"}
        </p>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-teal-50 text-teal-800 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-teal-600" : "text-slate-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Role Switcher Quick Links */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Switch Workspace</p>
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="block px-2.5 py-1.5 text-xs text-slate-600 hover:text-teal-700 hover:bg-slate-50 rounded-lg"
          >
            → Citizen View
          </Link>
          <Link
            href="/organization/dashboard"
            className="block px-2.5 py-1.5 text-xs text-slate-600 hover:text-indigo-700 hover:bg-slate-50 rounded-lg"
          >
            → NGO Workspace
          </Link>
          <Link
            href="/admin/schemes"
            className="block px-2.5 py-1.5 text-xs text-slate-600 hover:text-purple-700 hover:bg-slate-50 rounded-lg"
          >
            → Admin Console
          </Link>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
