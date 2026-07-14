import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Search, ArrowUpDown, Eye, Copy } from "lucide-react";
import { cn } from "../../utils/cn";
import { getBriefProgressStatus } from "../../utils/briefHelpers";

export default function BriefListingPage({ briefs, onView, onCreate, listOnly }) {
  const [search, setSearch] = useState("");
  const [selectedSales, setSelectedSales] = useState("");

  const salesOwners = useMemo(() => {
    const owners = new Set();
    briefs.forEach((b) => {
      if (b.salesOwner) owners.add(b.salesOwner);
    });
    return Array.from(owners).sort();
  }, [briefs]);

  const filtered = useMemo(() => {
    return briefs.filter((b) => {
      const matchSearch = `${b.id} ${b.campaignName} ${b.brand}`.toLowerCase().includes(search.toLowerCase());
      const matchSales = !selectedSales || b.salesOwner === selectedSales;
      return matchSearch && matchSales;
    });
  }, [briefs, search, selectedSales]);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Brief":
        return "bg-slate-100 text-slate-600 border border-slate-200";
      case "Rate card list":
        return "bg-blue-50 text-blue-700 border border-blue-100";
      case "Dealsheet":
        return "bg-violet-50 text-[#6D5DF6] border border-[#e8e4ff]";
      case "Proposal":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100";
      default:
        return "bg-slate-100 text-slate-600 border border-slate-200";
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-[28px]">Brief Management</h1>
          <p className="mt-1 text-sm text-slate-500">Manage all campaign briefs and requirements.</p>
        </div>
        <button
          onClick={onCreate}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#6D5DF6] px-4 text-sm font-medium text-white transition hover:bg-[#5a4add]"
        >
          <Plus className="h-4 w-4" /> Create New Brief
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, Campaign, or Brand"
            className="h-10 w-full bg-transparent pl-10 pr-4 text-sm outline-none text-slate-700"
          />
        </div>
        <div className="w-full sm:w-64">
          <select
            value={selectedSales}
            onChange={(e) => setSelectedSales(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-650 outline-none focus:border-[#6D5DF6] font-medium"
          >
            <option value="">All Sales Owners</option>
            {salesOwners.map(owner => (
              <option key={owner} value={owner}>{owner}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-white text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                {["Brief No", "Campaign Name", "Brand", "Sales Owner", "Package Type", "Client Status", "Status", "Created Date", "Management"].map((head) => (
                  <th key={head} className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 cursor-pointer hover:text-slate-700 transition">
                      {head}
                      {head !== "Management" && head !== "Sales Owner" && <ArrowUpDown className="h-3.5 w-3.5" />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((b) => {
                const progressStatus = getBriefProgressStatus(b);
                return (
                  <tr key={b.id} className="transition hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-[#6D5DF6] text-sm">{b.id}</td>
                    <td className="px-6 py-4 font-normal text-slate-800 text-sm">{b.campaignName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{b.brand}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{b.salesOwner || "-"}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {Array.isArray(b.packageType) ? b.packageType.join(", ") : b.packageType || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{b.clientStatus || "New"}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                          getStatusBadgeStyle(progressStatus)
                      )}>
                        {progressStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{b.createdAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {!listOnly && (
                          <>
                            <button
                              onClick={() => onView(b)}
                              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-[#6D5DF6] transition hover:bg-violet-50 hover:border-violet-200"
                            >
                              <Eye className="h-4 w-4" /> View Details
                            </button>
                            <button
                              onClick={() => {
                                const url = `${window.location.origin}${window.location.pathname}?briefId=${b.id}`;
                                navigator.clipboard.writeText(url);
                                alert("คัดลอกลิงก์สำเร็จ!");
                                if (window.showToast) window.showToast("Copied Brief Link!");
                              }}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                              title="Copy link to this brief"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-6 py-10 text-center text-slate-500 text-sm">
                    No briefs found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
