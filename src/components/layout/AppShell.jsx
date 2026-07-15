import { useState } from "react";
 

import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { cn } from "../../utils/helpers";
import Sidebar from "./Sidebar";

function AppShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.startsWith("/brief")) return "Brief Management Flow";
    if (location.pathname.startsWith("/standard-pricing")) return "Standard Pricing";
    if (location.pathname.startsWith("/final-dealsheet")) return "Final Dealsheet";
    if (location.pathname.startsWith("/example-list")) return "Example List Flow";
    return "Buddy Platform";
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={cn("flex-1 transition-all duration-300 min-w-0", collapsed ? "lg:pl-[80px]" : "lg:pl-[240px]")}>
        <div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-xl p-2 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <div className="text-sm font-medium text-slate-500">Prototype</div>
              <div className="text-base font-semibold text-slate-900">{getPageTitle()}</div>
            </div>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <div className="rounded-full bg-white px-4 py-2 text-sm font-normal text-slate-600 shadow-sm ring-1 ring-slate-200">
              planner.beauty@buddyreview.co
            </div>
          </div>
        </div>
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

export default AppShell;
