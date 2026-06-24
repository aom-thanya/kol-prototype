import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BriefFlow from "./BriefFlow";
import CustomerFlow from "./CustomerFlow";
import StandardPricingFlow from "./StandardPricingFlow";
import FinalDealsheetFlow from "./FinalDealsheetFlow";
import { customersSeed, briefsSeed } from "./data/mockData";
import RateCardListPage from "./components/brief/RateCardListPage";
import {
  Search,
  Plus,
  Copy,
  Trash2,
  Eye,
  Download,
  Users,
  CheckCircle2,
  X,
  ChevronDown,
  ArrowUpDown,
  Sparkles,
  ClipboardList,
  Compass,
  Filter,
  UserPlus,
  ExternalLink,
  Loader2,
  Menu,
  FileText,
  DollarSign,
  CreditCard
} from "lucide-react";

const primary = "#6D5DF6";

const planners = ["All", "planner.beauty@buddyreview.co", "planner.mc@buddyreview.co", "senior.planner@buddyreview.co"];
const buyers = ["All", "buyer.team@buddyreview.co", "buyer.lead@buddyreview.co", "beauty.buyer@buddyreview.co"]; 

const exampleListsSeed = [
  {
    id: "EXL202605048",
    name: "Beauty Launch Q2 Candidate Pool",
    group: "Beauty",
    buyer: "beauty.buyer@buddyreview.co",
    planner: "planner.beauty@buddyreview.co",
    createdAt: "2026-05-04",
    description: "",
    cover:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "EXL202605031",
    name: "Lifestyle Family Creator Test",
    group: "Lifestyle",
    buyer: "buyer.team@buddyreview.co",
    planner: "planner.beauty@buddyreview.co",
    createdAt: "2026-05-03",
    description:
      "Family and daily-life creators for soft-sell content validation before shortlist approval.",
    cover:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "EXL202604229",
    name: "MC Event Host Review",
    group: "MC",
    buyer: "buyer.lead@buddyreview.co",
    planner: "planner.mc@buddyreview.co",
    createdAt: "2026-04-22",
    description:
      "MC and presenter profiles for event activation. Compare engagement, tone, and previous content style.",
    cover:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "EXL202604188",
    name: "Gen Z Lifestyle Seed List",
    group: "Lifestyle",
    buyer: "buyer.team@buddyreview.co",
    planner: "senior.planner@buddyreview.co",
    createdAt: "2026-04-18",
    description:
      "Exploratory list for youth lifestyle, campus, cafe, and fashion-adjacent creators.",
    cover:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "EXL202604115",
    name: "Premium Beauty Reviewer Pool",
    group: "Beauty",
    buyer: "beauty.buyer@buddyreview.co",
    planner: "senior.planner@buddyreview.co",
    createdAt: "2026-04-11",
    description:
      "Premium beauty reviewers with high trust signals and strong review storytelling.",
    cover:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
  },
];

const influencerSeed = [
  {
    id: "inf_001",
    username: "@mindglow",
    name: "Mind Glow",
    platform: "Instagram",
    followers: 184500,
    character: "Skincare educator",
    er: 4.8,
    avgLikes: 8200,
    avgViews: 118000,
    avatar: "https://i.pravatar.cc/160?img=5",
    briefId: "BRD-2193",
    briefName: "Mega Bangna Event",
    rawCost: "฿400,000",
    scopeOfWork: "Live 2 hour / day",
    condition: "แชร์ช่องทางอื่นๆฟรีไหม: ได้",
  },
  {
    id: "inf_002",
    username: "@beaureview.bow",
    name: "Bow Beauty Review",
    platform: "TikTok",
    followers: 322000,
    character: "Honest review / demo",
    er: 5.6,
    avgLikes: 19100,
    avgViews: 276000,
    avatar: "https://i.pravatar.cc/160?img=10",
    briefId: "BRD-3001",
    briefName: "Srichand Summer Collection",
    rawCost: "฿320,000",
    scopeOfWork: "VDO Clip 1 min",
    condition: "รับตรวจงาน 2 ครั้ง",
  },
  {
    id: "inf_003",
    username: "@dailywithpim",
    name: "Pim Daily",
    platform: "Instagram",
    followers: 96500,
    character: "Lifestyle soft-sell",
    er: 3.9,
    avgLikes: 4100,
    avgViews: 67000,
    avatar: "https://i.pravatar.cc/160?img=32",
    rawCost: "฿350,000",
    scopeOfWork: "Photo 1 Set / 5 Pics",
    condition: "รับบรีฟล่วงหน้า 1 สัปดาห์",
  },
  {
    id: "inf_004",
    username: "@hostmark",
    name: "Mark Host",
    platform: "Facebook",
    followers: 128000,
    character: "MC / Presenter",
    er: 2.7,
    avgLikes: 2600,
    avgViews: 42000,
    avatar: "https://i.pravatar.cc/160?img=12",
    briefId: "BRD-3002",
    briefName: "Unilever Pure Drink Launch",
    rawCost: "฿250,000",
    scopeOfWork: "Post 1 Album",
    condition: "ลงงานภายใน 3 วันหลังตรวจ",
  },
  {
    id: "inf_005",
    username: "@nina.nomad",
    name: "Nina Nomad",
    platform: "TikTok",
    followers: 512000,
    character: "Travel lifestyle",
    er: 6.4,
    avgLikes: 30900,
    avgViews: 488000,
    avatar: "https://i.pravatar.cc/160?img=47",
    briefId: "BRD-2193",
    briefName: "Mega Bangna Event",
    rawCost: "฿400,000",
    scopeOfWork: "Live 2 hour / day",
    condition: "แชร์ช่องทางอื่นๆฟรีไหม: ได้",
  },
  {
    id: "inf_006",
    username: "@cleanfaceclub",
    name: "Clean Face Club",
    platform: "Instagram",
    followers: 74000,
    character: "Clean beauty niche",
    er: 5.1,
    avgLikes: 3900,
    avgViews: 53000,
    avatar: "https://i.pravatar.cc/160?img=25",
  },
  {
    id: "inf_007",
    username: "@kai.cafehop",
    name: "Kai Cafe Hop",
    platform: "TikTok",
    followers: 218000,
    character: "Cafe / casual lifestyle",
    er: 4.2,
    avgLikes: 9800,
    avgViews: 144000,
    avatar: "https://i.pravatar.cc/160?img=15",
    briefId: "BRD-2193",
    briefName: "Mega Bangna Event",
    rawCost: "฿400,000",
    scopeOfWork: "Live 2 hour / day",
    condition: "แชร์ช่องทางอื่นๆฟรีไหม: ได้",
  },
  {
    id: "inf_008",
    username: "@mommymild",
    name: "Mommy Mild",
    platform: "Facebook",
    followers: 156000,
    character: "Family / parenting",
    er: 3.5,
    avgLikes: 5700,
    avgViews: 91000,
    avatar: "https://i.pravatar.cc/160?img=44",
  },
];

function formatNumber(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 100000 ? 0 : 1)}K`;
  return value.toLocaleString();
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function PlatformBadge({ platform }) {
  const label = platform === "Instagram" ? "IG" : platform === "TikTok" ? "TT" : "FB";
  return (
    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-100 px-2 text-[11px] font-medium text-slate-600">
      {label}
    </span>
  );
}

function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "bg-[#6D5DF6] text-white shadow-sm shadow-violet-200 hover:bg-[#5d4df0]",
    secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-rose-50 text-rose-600 hover:bg-rose-100",
  };
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

function Toast({ toast, onClose }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="fixed right-5 top-5 z-50 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl"
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <div className="text-sm font-normal text-slate-800">{toast}</div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100">
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Sidebar({ mobileOpen, setMobileOpen, activeTab, setActiveTab }) {
  const kolDiscoveryItems = [
    { label: "KOL Discovery", icon: Search, href: "https://koldiscovery.buddyreview.co/kol" },
    { label: "Explore", icon: Compass, href: "https://koldiscovery.buddyreview.co/explore" },
    { label: "Rate Card List", id: "rateCardList", icon: CreditCard, active: activeTab === "rateCardList" },
  ];

  const briefManagementItems = [
    { label: "Brief Management", id: "brief2", icon: FileText, active: activeTab === "brief2" },
    { label: "Final Dealsheet", id: "finalDealsheet", icon: ClipboardList, active: activeTab === "finalDealsheet" },
    { label: "Standard Pricing", id: "standardPricing", icon: DollarSign, active: activeTab === "standardPricing" },
  ];

  const renderItem = (item) => (
    <a
      key={item.label}
      href={item.href || "#"}
      target={item.href ? "_blank" : undefined}
      rel={item.href ? "noopener noreferrer" : undefined}
      onClick={() => {
        if (item.id) {
          setActiveTab(item.id);
          setMobileOpen(false);
        }
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[12px] font-medium transition cursor-pointer",
        item.active
          ? "bg-violet-50 text-[#6D5DF6] ring-1 ring-violet-100"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{item.label}</span>
      {item.href && <ExternalLink className="ml-auto h-3 w-3 shrink-0 opacity-60" />}
    </a>
  );

  return (
    <>
      <div className={cn("fixed inset-0 z-30 bg-slate-900/30 lg:hidden", mobileOpen ? "block" : "hidden")} onClick={() => setMobileOpen(false)} />
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-[180px] border-r border-slate-200 bg-white p-4 transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-8 flex flex-col gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6D5DF6] text-white shadow-lg shadow-violet-200">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[13px] font-semibold leading-tight text-slate-900">Buddy Platform</div>
            <div className="mt-1 text-[10px] leading-tight text-slate-500">KOL Management</div>
          </div>
        </div>
        
        <nav className="space-y-4">
          {/* KOL Discovery Section */}
          <div className="space-y-1.5">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">KOL Discovery</div>
            <div className="space-y-1">
              {kolDiscoveryItems.map(renderItem)}
            </div>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-slate-100 my-2" />

          {/* Brief Management Section */}
          <div className="space-y-1.5">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-450">Brief Management</div>
            <div className="space-y-1">
              {briefManagementItems.map(renderItem)}
            </div>
          </div>
        </nav>

        <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-slate-50 p-3">
          <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Role</div>
          <div className="mt-2 flex flex-col gap-2">
            <span className="rounded-full bg-white px-3 py-1.5 text-center text-[11px] font-medium text-slate-700 shadow-sm">Planner</span>
            <span className="rounded-full bg-white px-3 py-1.5 text-center text-[11px] font-medium text-slate-700 shadow-sm">Buyer</span>
          </div>
        </div>
      </aside>
    </>
  );
}

function AppShell({ children, activeTab, setActiveTab }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="lg:pl-[180px]">
        <div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-xl p-2 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <div className="text-sm font-medium text-slate-500">Prototype</div>
              <div className="text-base font-semibold text-slate-900">{activeTab === "exampleList" ? "Example List Flow" : activeTab === "brief2" ? "Brief Management Flow" : activeTab === "standardPricing" ? "Standard Pricing" : activeTab === "finalDealsheet" ? "Final Dealsheet" : "Brief Flow"}</div>
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

function ListingPage({ lists, onView, onDuplicate, onCreate }) {
  const [search, setSearch] = useState("");
  const [planner, setPlanner] = useState("All");
  const [buyer, setBuyer] = useState("All");

  const filtered = useMemo(() => {
    return lists.filter((list) => {
      const matchesSearch = `${list.id} ${list.name}`.toLowerCase().includes(search.toLowerCase());
      const matchesPlanner = planner === "All" || list.planner === planner;
      const matchesBuyer = buyer === "All" || list.buyer === buyer;
      return matchesSearch && matchesPlanner && matchesBuyer;
    });
  }, [lists, search, planner, buyer]);

  const clearFilters = () => {
    setSearch("");
    setPlanner("All");
    setBuyer("All");
  };

  const formatDate = (dateStr) => {
    const [y, m, d] = dateStr.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return { d: `${d} ${months[parseInt(m) - 1]} ${y}`, t: "14:30" };
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-[28px]">Example List</h1>
          <p className="mt-1 text-sm text-slate-500">Manage all example lists created by planner and buyer.</p>
        </div>
        <button
          onClick={onCreate}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#6D5DF6] px-4 text-sm font-medium text-white transition hover:bg-[#5a4add]"
        >
          <Plus className="h-4 w-4" /> Create New Example List
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID or name"
            className="h-10 w-full bg-transparent pl-10 pr-4 text-sm outline-none text-slate-700"
          />
        </div>
        <div className="hidden md:block h-6 w-px bg-slate-200"></div>
        <div className="w-full md:w-auto">
          <Select value={planner} onChange={setPlanner} options={planners} label="Planner" className="w-full md:min-w-[180px] border-none shadow-none h-10" />
        </div>
        <div className="hidden md:block h-6 w-px bg-slate-200"></div>
        <div className="w-full md:w-auto">
          <Select value={buyer} onChange={setBuyer} options={buyers} label="Buyer" className="w-full md:min-w-[180px] border-none shadow-none h-10" />
        </div>
        <div className="hidden md:block h-6 w-px bg-slate-200"></div>
        <button
          onClick={clearFilters}
          className="inline-flex h-10 w-full md:w-auto items-center justify-center gap-2 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 rounded-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Clear
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-white text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                {["Example List ID", "Name", "Buyer", "Planner", "Created At", "Management"].map((head) => (
                  <th key={head} className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 cursor-pointer hover:text-slate-700 transition">
                      {head}
                      {head !== "Management" && <ArrowUpDown className="h-3.5 w-3.5" />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((list) => {
                const dateInfo = formatDate(list.createdAt);
                return (
                  <tr key={list.id} className="transition hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-[#6D5DF6] text-sm">{list.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-normal text-slate-800 text-sm">{list.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{list.buyer}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{list.planner}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div>{dateInfo.d}</div>
                      <div className="text-slate-400 mt-0.5">{dateInfo.t}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onView(list)}
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-[#6D5DF6] transition hover:bg-violet-50 hover:border-violet-200"
                        >
                          <Eye className="h-4 w-4" /> View Detail
                        </button>
                        <button
                          onClick={() => onDuplicate(list)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-200 p-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>Showing 1 to {filtered.length} of 24 results</div>
          <div className="flex items-center gap-2 text-xs">
            <button className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 hover:bg-slate-50 text-slate-400">&lt;</button>
            <button className="flex h-8 w-8 items-center justify-center rounded bg-[#6D5DF6] text-white font-normal">1</button>
            <button className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 hover:bg-slate-50 text-slate-700">2</button>
            <button className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 hover:bg-slate-50 text-slate-700">3</button>
            <button className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 hover:bg-slate-50 text-slate-400">&gt;</button>
            <div className="ml-2 flex h-8 items-center gap-2 rounded border border-slate-200 px-3 hover:bg-slate-50 cursor-pointer text-slate-600">
              10 / page <ChevronDown className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Select({ value, onChange, options, icon: Icon = ChevronDown, label, className }) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-full w-full appearance-none bg-transparent px-4 pr-10 text-sm font-normal text-slate-700 outline-none cursor-pointer",
          !className?.includes("border-none") && "rounded-lg border border-slate-200"
        )}
      >
        {options.map((option) => (
          <option key={option} value={option}>{label}: {option}</option>
        ))}
      </select>
      <Icon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function DetailPage({ list, onBack, showToast, briefs = [] }) {
  const [tab, setTab] = useState("example");
  const [search, setSearch] = useState("");
  const [exampleInfluencers, setExampleInfluencers] = useState(influencerSeed.slice(0, 5));
  const [shortList, setShortList] = useState(influencerSeed.slice(5, 7));
  const [selectedExample, setSelectedExample] = useState([]);
  const [selectedShort, setSelectedShort] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedExampleRows = exampleInfluencers.filter((inf) => selectedExample.includes(inf.id));

  const filteredExampleCount = exampleInfluencers.filter((inf) => inf.username.toLowerCase().includes(search.toLowerCase())).length;
  const filteredShortCount = shortList.filter((inf) => inf.username.toLowerCase().includes(search.toLowerCase())).length;

  const exportCsv = (rows, fileName) => {
    if (!rows.length) {
      showToast("Select at least one influencer before export.");
      return;
    }
    const fields = ["Username", "Platform", "Followers", "ER", "Avg Likes", "Avg Views", "Character"];
    const csv = [fields.join(","), ...rows.map((r) => [r.username, r.platform, r.followers, `${r.er}%`, r.avgLikes, r.avgViews, r.character].join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported successfully.");
  };

  const copyToClipboard = (rows) => {
    if (!rows.length) {
      showToast("Select at least one influencer before copying.");
      return;
    }
    
    const tsvData = rows.map((row, index) => {
      const usernameRaw = row.username.replace('@', '');
      return [
        index + 1,
        `'${usernameRaw}`,
        `"https://www.${(row.platform || 'tiktok').toLowerCase()}.com/@${usernameRaw}"`,
        row.followers.toLocaleString(),
        `"Line: @contact\nคุณผู้จัดการ"`,
        list.name,
        "฿100,000",
        `"Test Scope\nLive 2 hour / day"`,
        list.createdAt,
        "แชร์ช่องทางอื่นๆฟรีไหม: ได้",
        "สามารถใส่ลิงค์ในแคปชั่นได้ไหม: ได้"
      ].join('\t');
    }).join('\n');
    
    navigator.clipboard.writeText(tsvData).then(() => {
      showToast("Copied to clipboard! You can now paste in Excel.");
    }).catch(() => {
      showToast("Failed to copy to clipboard.");
    });
  };

  const confirmToShortList = () => {
    setLoading(true);
    setTimeout(() => {
      setShortList((prev) => [...selectedExampleRows, ...prev]);
      setExampleInfluencers((prev) => prev.filter((inf) => !selectedExample.includes(inf.id)));
      setSelectedExample([]);
      setTab("short");
      setLoading(false);
      setConfirmOpen(false);
      showToast("Selected influencers moved to Short List.");
    }, 700);
  };

  const moveToExampleList = () => {
    if (!selectedShort.length) return;
    setLoading(true);
    setTimeout(() => {
      const selectedShortRows = shortList.filter((inf) => selectedShort.includes(inf.id));
      setExampleInfluencers((prev) => [...selectedShortRows, ...prev]);
      setShortList((prev) => prev.filter((inf) => !selectedShort.includes(inf.id)));
      setSelectedShort([]);
      setTab("example");
      setLoading(false);
      showToast("Selected influencers moved back to Example List.");
    }, 700);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-[#6D5DF6]">← Back to Example List</button>
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="p-5 lg:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 lg:text-3xl">{list.name}</h1>
              <div className="mt-3 inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-[#6D5DF6] ring-1 ring-violet-100">
                {list.id} · {list.group}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <Metric label="Buyer" value={list.buyer} wide />
              <Metric label="Planner" value={list.planner} />
              <Metric label="Created Date" value={list.createdAt} />
              <Metric label="Total Influencers" value={exampleInfluencers.length + shortList.length} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-4 pt-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex">
            <TabButton active={tab === "example"} onClick={() => setTab("example")}>Example List ({filteredExampleCount})</TabButton>
            <TabButton active={tab === "short"} onClick={() => setTab("short")}>Short List ({filteredShortCount})</TabButton>
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none transition focus:border-[#6D5DF6] focus:bg-white focus:ring-1 focus:ring-[#6D5DF6] sm:w-64"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {tab === "example" ? (
            <motion.div key="example" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
              <TableSection
                search={search}
                mode="example"
                rows={exampleInfluencers}
                selected={selectedExample}
                setSelected={setSelectedExample}
                onAdd={() => setDrawerOpen(true)}
                onExport={() => exportCsv(selectedExampleRows, "example-list-selected.csv")}
                onCopy={() => copyToClipboard(selectedExampleRows)}
                onConfirm={() => setConfirmOpen(true)}
                onRemove={(id) => {
                  setExampleInfluencers((prev) => prev.filter((row) => row.id !== id));
                  setSelectedExample((prev) => prev.filter((rowId) => rowId !== id));
                  showToast("Influencer removed from Example List.");
                }}
                onProfile={setProfile}
                loading={loading}
                briefs={briefs}
              />
            </motion.div>
          ) : (
            <motion.div key="short" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
              <TableSection
                search={search}
                mode="short"
                rows={shortList}
                selected={selectedShort}
                setSelected={setSelectedShort}
                onMoveToExample={moveToExampleList}
                onExport={() => exportCsv(selectedShort.length ? shortList.filter((r) => selectedShort.includes(r.id)) : shortList, "short-list.csv")}
                onExportProposal={() => showToast("download proposal soon")}
                onRemove={(id) => {
                  setShortList((prev) => prev.filter((row) => row.id !== id));
                  setSelectedShort((prev) => prev.filter((rowId) => rowId !== id));
                  showToast("Influencer removed from Short List.");
                }}
                onProfile={setProfile}
                briefs={briefs}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <AddInfluencerDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        existing={[...exampleInfluencers, ...shortList].map((i) => i.id)}
        onAdd={(influencer) => {
          setExampleInfluencers((prev) => [influencer, ...prev]);
          showToast(`${influencer.username} added to Example List.`);
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm to Short List?"
        body={`${selectedExample.length} selected influencer(s) will be moved from Example List to Short List.`}
        disabled={!selectedExample.length || loading}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmToShortList}
        loading={loading}
      />

      <ProfileDialog profile={profile} onClose={() => setProfile(null)} />
    </motion.div>
  );
}

function Metric({ label, value, wide }) {
  return (
    <div className={cn("rounded-2xl bg-slate-50 p-4", wide && "col-span-2 md:col-span-1")}>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 truncate text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-4 py-4 text-sm font-semibold transition",
        active ? "text-[#6D5DF6]" : "text-slate-500 hover:text-slate-800"
      )}
    >
      {children}
      {active && <motion.div layoutId="tabLine" className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#6D5DF6]" />}
    </button>
  );
}

function TableSection({ mode, search, rows, selected, setSelected, onAdd, onExport, onExportProposal, onCopy, onMoveToExample, onConfirm, onRemove, onProfile, loading, briefs = [] }) {
  const filteredRows = rows.filter((r) => r.username.toLowerCase().includes(search.toLowerCase()));
  const allSelected = filteredRows.length > 0 && selected.length === filteredRows.length;
  const toggleAll = () => setSelected(allSelected ? [] : filteredRows.map((r) => r.id));
  const toggleOne = (id) => setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  const selectedRows = rows.filter(r => selected.includes(r.id));
  const hasKPI = selectedRows.some(row => {
    if (!row.briefId) return false;
    const brief = briefs.find(b => b.id === row.briefId);
    if (!brief) return false;
    const pType = brief.packageType;
    if (!pType) return false;
    const pkgs = Array.isArray(pType) ? pType : [pType];
    return pkgs.some(p => {
      if (typeof p !== "string") return false;
      if (p === "Others") {
        return brief.packageTypeOther && brief.packageTypeOther.toLowerCase().includes("kpi");
      }
      return p.toLowerCase().includes("kpi");
    });
  });

  return (
    <div>
      <div className="sticky top-16 z-10 flex flex-col gap-3 border-b border-slate-200 bg-white/90 p-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-base font-semibold text-slate-900">{mode === "example" ? "Candidate Influencers" : "Confirmed Short List"}</div>
          <div className="text-sm text-slate-500">{filteredRows.length} influencer(s) · {selected.length} selected</div>
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === "example" && (
            <Button onClick={onAdd}><UserPlus className="h-4 w-4" /> Add Influencer</Button>
          )}
          {mode === "example" && (
            <Button onClick={() => { if (selected.length !== filteredRows.length) setSelected(filteredRows.map(r => r.id)); setTimeout(onConfirm, 50); }}><CheckCircle2 className="h-4 w-4" /> Select All to Confirm to Short List</Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-10 left-1/2 z-50 flex items-center gap-4 rounded-xl bg-[#0B0F19] p-2 pr-3 shadow-[0_20px_40px_rgba(0,0,0,0.2)] lg:ml-[90px]"
          >
            <div className="pl-4 text-sm font-medium text-white whitespace-nowrap">{selected.length} selected</div>
            <div className="h-5 w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              {mode === "example" ? (
                <>
                  <button onClick={onCopy} className="rounded-lg bg-[#1E2335] px-4 py-2 text-xs font-medium text-slate-200 transition hover:bg-[#2A3143] hover:text-white whitespace-nowrap">Copy to clipboard</button>
                  <button onClick={onConfirm} className="rounded-lg bg-[#1E2335] px-4 py-2 text-xs font-medium text-slate-200 transition hover:bg-[#2A3143] hover:text-white whitespace-nowrap">Confirm to Shortlist</button>
                </>
              ) : (
                <>
                  <button onClick={onMoveToExample} className="rounded-lg bg-[#1E2335] px-4 py-2 text-xs font-medium text-slate-200 transition hover:bg-[#2A3143] hover:text-white whitespace-nowrap">Move to Example List</button>
                  <button onClick={onExport} className="rounded-lg bg-[#1E2335] px-4 py-2 text-xs font-medium text-slate-200 transition hover:bg-[#2A3143] hover:text-white whitespace-nowrap">Export Shortlist (.csv)</button>
                   <button 
                    onClick={() => {
                      const selectedBriefs = selectedRows.map(row => briefs.find(b => b.id === row.briefId)).filter(Boolean);
                      const isAnyStandard = selectedBriefs.some(brief => {
                        const pType = brief.packageType;
                        if (!pType) return false;
                        const pkgs = Array.isArray(pType) ? pType : [pType];
                        return pkgs.some(p => typeof p === "string" && p.toLowerCase().includes("standard"));
                      });
                      const url = isAnyStandard 
                        ? "https://docs.google.com/presentation/d/11CnO6DySSr7OQvtVEJZcAI0LJKBp7n2RCuLH5lQSfMc/edit?usp=sharing"
                        : "https://docs.google.com/presentation/d/1toI8ovvmuFr-bH7LdqSo4h-9-wFcSzen/edit?slide=id.p1#slide=id.p1";
                      window.open(url, "_blank");
                    }}
                    disabled={hasKPI}
                    className="rounded-lg bg-[#1E2335] px-4 py-2 text-xs font-medium text-slate-200 transition hover:bg-[#2A3143] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
                    title={hasKPI ? "Cannot export proposal for package types containing 'KPI'" : ""}
                  >
                    Export Proposal (.pptx)
                  </button>
                </>
              )}
            </div>
            <button onClick={() => setSelected([])} className="ml-1 rounded-lg p-1.5 text-slate-400 hover:bg-[#1E2335] hover:text-white transition">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <SkeletonTable />
      ) : filteredRows.length === 0 ? (
        <EmptyState mode={mode} onAdd={onAdd} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-white text-[11px] font-bold text-slate-500">
              <tr>
                <th className="sticky left-0 z-20 w-[60px] min-w-[60px] max-w-[60px] border-b border-slate-200 bg-white px-5 py-4"></th>
                <th colSpan="2" className="sticky left-[60px] z-20 border-b border-r border-slate-200 bg-white px-5 py-4 text-center text-[#6D5DF6]">Influencer Detail</th>
                <th colSpan="4" className="border-b border-l border-slate-200 bg-white px-5 py-4 text-center">Performance</th>
                <th colSpan="4" className="border-b border-l border-slate-200 bg-white px-5 py-4 text-center">Commercial & SOW</th>
                <th className="border-b border-l border-slate-200 bg-white px-5 py-4 text-center">Actions</th>
              </tr>
              <tr className="border-b border-slate-200 bg-white">
                <th className="sticky left-0 z-20 w-[60px] min-w-[60px] max-w-[60px] border-b border-slate-200 bg-white px-5 py-4 text-center"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded border-slate-300 accent-[#6D5DF6]" /></th>
                <th className="sticky left-[60px] z-20 w-[280px] min-w-[280px] max-w-[280px] border-b border-slate-200 bg-white px-5 py-4 text-center">Influencer</th>
                <th className="sticky left-[340px] z-20 w-[180px] min-w-[180px] max-w-[180px] border-b border-r border-slate-200 bg-white px-5 py-4 text-center">Character</th>
                <th className="px-5 py-4 text-center bg-white">Followers</th>
                <th className="px-5 py-4 text-center bg-white">ER</th>
                <th className="px-5 py-4 text-center bg-white">Avg Likes</th>
                <th className="border-r border-slate-200 bg-white px-5 py-4 text-center">Avg Views</th>
                <th className="px-5 py-4 text-center whitespace-nowrap bg-white">Reference Brief</th>
                <th className="px-5 py-4 text-center whitespace-nowrap bg-white">Raw Cost</th>
                <th className="px-5 py-4 text-center whitespace-nowrap bg-white">Scope of Work</th>
                <th className="border-r border-slate-200 bg-white px-5 py-4 text-center whitespace-nowrap">Condition</th>
                <th className="px-5 py-4 text-center bg-white"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredRows.map((row) => {
                const isSelected = selected.includes(row.id);
                return (
                  <tr key={row.id} className={cn("group transition", isSelected ? "bg-violet-50" : "hover:bg-slate-50")}>
                    <td className={cn("sticky left-0 z-10 w-[60px] min-w-[60px] max-w-[60px] px-5 py-4 text-center transition", isSelected ? "bg-violet-50" : "bg-white group-hover:bg-slate-50")}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleOne(row.id)} className="h-4 w-4 rounded border-slate-300 accent-[#6D5DF6]" />
                    </td>
                    <td className={cn("sticky left-[60px] z-10 w-[280px] min-w-[280px] max-w-[280px] px-5 py-4 transition", isSelected ? "bg-violet-50" : "bg-white group-hover:bg-slate-50")}>
                      <button className="flex items-center gap-3 text-left w-full" onClick={() => onProfile(row)}>
                        <img src={row.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                        <div>
                          <div className="flex items-center gap-1.5 font-semibold text-slate-900 hover:text-[#6D5DF6] text-[13px]">
                            {row.username} <ExternalLink className="h-3 w-3 text-slate-400" />
                          </div>
                          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                            {row.name} <span className="inline-flex items-center justify-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">{row.platform === "Instagram" ? "IG" : row.platform === "TikTok" ? "TT" : "FB"}</span>
                          </div>
                        </div>
                      </button>
                    </td>
                    <td className={cn("sticky left-[340px] z-10 w-[180px] min-w-[180px] max-w-[180px] border-r border-slate-200 px-5 py-4 text-center transition", isSelected ? "bg-violet-50" : "bg-white group-hover:bg-slate-50")}>
                      <span className="inline-block max-w-[140px] truncate rounded-full bg-violet-50 px-3 py-1 text-[11px] font-medium text-[#6D5DF6]">{row.character}</span>
                    </td>
                    <td className="px-5 py-4 text-center font-medium text-slate-700">{formatNumber(row.followers)}</td>
                    <td className="px-5 py-4 text-center font-semibold text-emerald-500">{row.er}%</td>
                    <td className="px-5 py-4 text-center text-slate-700 font-medium">{formatNumber(row.avgLikes)}</td>
                    <td className="border-r border-slate-200 px-5 py-4 text-center text-slate-700 font-medium">{formatNumber(row.avgViews)}</td>
                    <td className="px-5 py-4 text-left">
                      {row.briefId ? (
                        <>
                          <div className="text-xs font-semibold text-[#6D5DF6] whitespace-nowrap">{row.briefId}</div>
                          <div className="mt-0.5 max-w-[120px] text-[11px] text-slate-500 whitespace-normal break-words leading-tight">{row.briefName}</div>
                        </>
                      ) : (
                        <div className="text-xs text-slate-400 text-center font-medium">-</div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center text-[13px] font-medium text-slate-700 whitespace-nowrap">
                      {row.rawCost || <span className="text-slate-400">-</span>}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {row.scopeOfWork ? (
                        <div className="max-w-[140px] mx-auto text-[13px] text-slate-600 whitespace-normal break-words leading-snug">{row.scopeOfWork}</div>
                      ) : (
                        <span className="text-slate-400 font-medium">-</span>
                      )}
                    </td>
                    <td className="border-r border-slate-200 px-5 py-4 text-center">
                      {row.condition ? (
                        <div className="max-w-[140px] mx-auto text-[13px] text-slate-600 whitespace-normal break-words leading-snug">{row.condition}</div>
                      ) : (
                        <span className="text-slate-400 font-medium">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition" onClick={() => onProfile(row)}>
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition" onClick={() => onRemove(row.id)}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="space-y-3 p-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex animate-pulse items-center gap-4 rounded-2xl bg-slate-50 p-4">
          <div className="h-11 w-11 rounded-2xl bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded bg-slate-200" />
            <div className="h-3 w-1/5 rounded bg-slate-200" />
          </div>
          <div className="h-8 w-28 rounded-xl bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ mode, onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
        <Users className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">No influencers yet</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {mode === "example" ? "Start by adding influencer candidates into this Example List." : "Confirmed influencers will appear here after moving from Example List."}
      </p>
      {mode === "example" && <Button className="mt-5" onClick={onAdd}><Plus className="h-4 w-4" /> Add Influencer</Button>}
    </div>
  );
}

function AddInfluencerDrawer({ open, onClose, existing, onAdd }) {
  const [query, setQuery] = useState("");
  const available = influencerSeed.filter((inf) => !existing.includes(inf.id));
  const filtered = available.filter((inf) => `${inf.username} ${inf.name} ${inf.character} ${inf.platform}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-slate-900/30" onClick={onClose} />
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }} className="fixed right-0 top-0 z-50 h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Add Influencer</h2>
                  <p className="mt-1 text-sm text-slate-500">Search from discovery pool and add candidates into Example List.</p>
                </div>
                <button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="relative mt-5">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search username, platform, character" className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-50" />
              </div>
            </div>
            <div className="space-y-3 p-5">
              {filtered.length === 0 ? (
                <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500">No available influencers found.</div>
              ) : filtered.map((inf) => (
                <div key={inf.id} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-violet-200 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <img src={inf.avatar} alt="" className="h-12 w-12 rounded-2xl object-cover" />
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-slate-900">{inf.username}<PlatformBadge platform={inf.platform} /></div>
                      <div className="mt-1 text-xs text-slate-500">{formatNumber(inf.followers)} followers · ER {inf.er}% · {inf.character}</div>
                    </div>
                  </div>
                  <Button onClick={() => onAdd(inf)} className="shrink-0"><Plus className="h-4 w-4" /> Add</Button>
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function ConfirmDialog({ open, title, body, onClose, onConfirm, disabled, loading }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/35" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-[#6D5DF6]"><CheckCircle2 className="h-6 w-6" /></div>
            <h2 className="mt-4 text-xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              <Button disabled={disabled} onClick={onConfirm}>{loading && <Loader2 className="h-4 w-4 animate-spin" />} Confirm</Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ProfileDialog({ profile, onClose }) {
  return (
    <AnimatePresence>
      {profile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/35" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={profile.avatar} alt="" className="h-16 w-16 rounded-3xl object-cover" />
                <div>
                  <div className="flex items-center gap-2 text-xl font-semibold text-slate-900">{profile.username}<PlatformBadge platform={profile.platform} /></div>
                  <div className="mt-1 text-sm text-slate-500">{profile.name}</div>
                </div>
              </div>
              <button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              <Metric label="Followers" value={formatNumber(profile.followers)} />
              <Metric label="ER" value={`${profile.er}%`} />
              <Metric label="Avg Likes" value={formatNumber(profile.avgLikes)} />
              <Metric label="Avg Views" value={formatNumber(profile.avgViews)} />
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Character</div>
              <div className="mt-1 text-sm font-medium text-slate-700">{profile.character}</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CreateListModal({ open, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [planner, setPlanner] = useState(planners[1]);
  const [buyer, setBuyer] = useState(buyers[1]);

  const handleSubmit = () => {
    if (!name || !description) return;
    onSubmit({ name, description, planner, buyer });
    setName("");
    setDescription("");
    setPlanner(planners[1]);
    setBuyer(buyers[1]);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/35" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6 relative">
              <h2 className="text-xl font-semibold text-slate-900 mx-auto">New Example List</h2>
              <button onClick={onClose} className="absolute right-0 rounded-xl p-2 hover:bg-slate-100"><X className="h-5 w-5 text-slate-500" /></button>
            </div>
            
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E0B9B] to-[#6D5DF6] shadow-md relative">
              <span className="text-[40px] font-semibold text-white tracking-tighter" style={{ textShadow: "2px 2px 0px #000" }}>bd</span>
              <button onClick={() => {}} className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white"><X className="h-3 w-3" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-800">Name <span className="text-red-500">*</span></label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-50" />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-800">Description <span className="text-red-500">*</span></label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={4} className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-800">Planner</label>
                  <Select value={planner} onChange={setPlanner} options={planners.filter(p => p !== "All")} label="Planner" className="h-10 bg-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-800">Buyer</label>
                  <Select value={buyer} onChange={setBuyer} options={buyers.filter(b => b !== "All")} label="Buyer" className="h-10 bg-white" />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button onClick={onClose} className="rounded-lg bg-slate-100 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">Cancel</button>
              <button onClick={handleSubmit} disabled={!name || !description} className="rounded-lg bg-[#9BA3AF] px-5 py-2 text-sm font-medium text-white hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed">Create</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("brief2");
  const [lists, setLists] = useState(exampleListsSeed);
  const [customers, setCustomers] = useState(customersSeed);
  const [briefs, setBriefs] = useState(briefsSeed);
  const [currentList, setCurrentList] = useState(null);
  const [toast, setToast] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [forceOpenBrief, setForceOpenBrief] = useState(null);

  const handleViewBrief = (brief) => {
    setForceOpenBrief(brief);
    setActiveTab("brief2");
    // Clear forceOpenBrief after a small delay so we can navigate back and forth
    setTimeout(() => setForceOpenBrief(null), 100);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2600);
  };

  const handleCreateNewList = (data) => {
    const next = {
      id: `EXL${Date.now().toString().slice(-9)}`,
      name: data.name,
      group: "General",
      buyer: data.buyer,
      planner: data.planner,
      createdAt: "2026-05-25",
      description: data.description,
      cover: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    };
    setLists((prev) => [next, ...prev]);
    setCurrentList(next);
    showToast("New Example List created.");
    setCreateModalOpen(false);
  };

  return (
    <AppShell activeTab={activeTab} setActiveTab={setActiveTab}>
      <Toast toast={toast} onClose={() => setToast(null)} />
      
      {activeTab === "brief" && (
        <BriefFlow showToast={showToast} customers={customers} briefs={briefs} setBriefs={setBriefs} forceOpenBrief={forceOpenBrief} />
      )}
      {activeTab === "brief2" && (
        <BriefFlow showToast={showToast} customers={customers} briefs={briefs} setBriefs={setBriefs} forceOpenBrief={forceOpenBrief} />
      )}

      {activeTab === "finalDealsheet" && (
        <FinalDealsheetFlow briefs={briefs} setBriefs={setBriefs} showToast={showToast} />
      )}

      {activeTab === "standardPricing" && (
        <StandardPricingFlow />
      )}

      {activeTab === "rateCardList" && (
        <RateCardListPage briefs={briefs} onUpdateBriefs={setBriefs} showToast={showToast} />
      )}

      {activeTab === "exampleList" && (
        <>
          <CreateListModal 
            open={createModalOpen} 
            onClose={() => setCreateModalOpen(false)} 
            onSubmit={handleCreateNewList} 
          />
          {!currentList ? (
            <ListingPage
              lists={lists}
              onView={setCurrentList}
              onDuplicate={(list) => {
                const copy = { ...list, id: `EXL${Date.now().toString().slice(-9)}`, name: `${list.name} Copy`, createdAt: "2026-05-25" };
                setLists((prev) => [copy, ...prev]);
                showToast("Example List duplicated.");
              }}
              onCreate={() => setCreateModalOpen(true)}
            />
          ) : (
            <DetailPage list={currentList} onBack={() => setCurrentList(null)} showToast={showToast} briefs={briefs} />
          )}
        </>
      )}
    </AppShell>
  );
}
