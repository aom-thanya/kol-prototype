

import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Search, Sparkles,
  Compass,
  CreditCard,
  FileText,
  ClipboardList,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { cn } from "../../utils/helpers";

function Sidebar({ mobileOpen, setMobileOpen, collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();

  const kolDiscoveryItems = [
    { label: "KOL Discovery", icon: Search, Sparkles, href: "https://koldiscovery.buddyreview.co/kol" },
    { label: "Explore", icon: Compass, href: "https://koldiscovery.buddyreview.co/explore" },
    { label: "Example List", path: "/example-list", icon: FileText, active: location.pathname.startsWith("/example-list") },
    { label: "Rate Card List", path: "/rate-card", icon: CreditCard, active: location.pathname.startsWith("/rate-card") },
  ];

  const briefManagementItems = [
    { label: "Brief Management", path: "/brief", icon: FileText, active: location.pathname.startsWith("/brief") },
    { label: "Final Dealsheet", path: "/final-dealsheet", icon: ClipboardList, active: location.pathname.startsWith("/final-dealsheet") },
    { label: "Standard Pricing", path: "/standard-pricing", icon: DollarSign, active: location.pathname.startsWith("/standard-pricing") },
  ];

  const renderItem = (item) => {
    const isExternal = !!item.href;
    const Component = isExternal ? "a" : Link;
    const toProps = isExternal ? { href: item.href, target: "_blank", rel: "noopener noreferrer" } : { to: item.path || "#" };

    return (
      <Component
        key={item.label}
        {...toProps}
        onClick={() => {
          if (!isExternal) setMobileOpen(false);
        }}
        className={cn(
          "group relative flex w-full items-center gap-2 rounded-xl py-2.5 text-left text-[12px] font-medium transition cursor-pointer",
          collapsed ? "justify-center px-0" : "px-3",
          item.active
            ? "bg-violet-50 text-[#6D5DF6] ring-1 ring-violet-100"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        )}
      >
        <item.icon className={cn("shrink-0", collapsed ? "h-5 w-5" : "h-4 w-4")} />
        {!collapsed && <span className="truncate">{item.label}</span>}
        {!collapsed && isExternal && <ExternalLink className="ml-auto h-3 w-3 shrink-0 opacity-60" />}
        
        {/* Tooltip for collapsed state */}
        {collapsed && (
          <div className="pointer-events-none absolute left-full ml-4 whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 z-[100] shadow-md">
            {item.label}
          </div>
        )}
      </Component>
    );
  };

  return (
    <>
      <div className={cn("fixed inset-0 z-30 bg-slate-900/30 lg:hidden", mobileOpen ? "block" : "hidden")} onClick={() => setMobileOpen(false)} />
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full border-r border-slate-200 bg-white transition-all duration-300 flex flex-col",
          collapsed ? "w-[80px] p-4" : "w-[240px] p-4",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className={cn("mb-8 flex items-center gap-3", collapsed ? "justify-center" : "")}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#6D5DF6] text-white shadow-lg shadow-violet-200">
            <Sparkles className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <div className="text-[13px] font-semibold leading-tight text-slate-900">Buddy Platform</div>
              <div className="mt-1 text-[10px] leading-tight text-slate-500">KOL Management</div>
            </div>
          )}
        </div>
        
        <nav className="flex-1 space-y-4">
          {/* KOL Discovery Section */}
          <div className="space-y-1.5">
            {!collapsed ? (
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">KOL Discovery</div>
            ) : (
              <div className="h-4" />
            )}
            <div className="space-y-1">
              {kolDiscoveryItems.map(renderItem)}
            </div>
          </div>

          {/* Divider */}
          <div className="h-[1px] w-full bg-slate-100 my-2" />

          {/* Brief Management Section */}
          <div className="space-y-1.5">
            {!collapsed ? (
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-450">Brief Management</div>
            ) : (
              <div className="h-4" />
            )}
            <div className="space-y-1">
              {briefManagementItems.map(renderItem)}
            </div>
          </div>
        </nav>

        <div className="mt-auto pt-4 flex flex-col gap-3">
          {/* Toggle Button */}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          {!collapsed ? (
            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Role</div>
              <div className="mt-2 flex flex-col gap-2">
                <span className="rounded-full bg-white px-3 py-1.5 text-center text-[11px] font-medium text-slate-700 shadow-sm">Planner</span>
                <span className="rounded-full bg-white px-3 py-1.5 text-center text-[11px] font-medium text-slate-700 shadow-sm">Buyer</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center group relative cursor-help">
               <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">P+B</div>
               <div className="pointer-events-none absolute left-full ml-4 whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 z-[100] shadow-md">
                 Roles: Planner, Buyer
               </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
