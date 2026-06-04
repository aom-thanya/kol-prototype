import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Eye, X, CheckCircle2, ChevronDown, ArrowUpDown, FileText } from "lucide-react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
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

function CreateCustomerModal({ open, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [type, setType] = useState("Key Account");

  const handleSubmit = () => {
    if (!name) return;
    onSubmit({ name, image: image || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=160&q=80", type });
    setName("");
    setImage("");
    setType("Key Account");
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-lg font-semibold text-slate-900">Add New Customer</h2>
              <button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100"><X className="h-5 w-5 text-slate-500" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-800">Customer Name <span className="text-red-500">*</span></label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Acme Corp" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6] focus:bg-white" />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-800">Customer Image URL</label>
                <input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6] focus:bg-white" />
                <p className="text-xs text-slate-500 mt-1">Leave blank to use a default placeholder.</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">Customer Type <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="custType" value="Key Account" checked={type === "Key Account"} onChange={e => setType(e.target.value)} className="h-4 w-4 text-[#6D5DF6] focus:ring-[#6D5DF6]" />
                    <span className="text-sm text-slate-700">Key Account</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="custType" value="Non-Key Account" checked={type === "Non-Key Account"} onChange={e => setType(e.target.value)} className="h-4 w-4 text-[#6D5DF6] focus:ring-[#6D5DF6]" />
                    <span className="text-sm text-slate-700">Non-Key Account</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!name}>Create Customer</Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CustomerDetail({ customer, briefs, onBack, onViewBrief }) {
  const customerBriefs = briefs.filter(b => b.customerId === customer.id);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-[#6D5DF6] flex items-center gap-1">
        ← Back to Customers
      </button>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6 lg:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
          <img src={customer.image} alt={customer.name} className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover bg-slate-100 shadow-sm border border-slate-200" />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">{customer.name}</h1>
            <div className="mt-2 inline-flex items-center gap-2">
              <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-[#6D5DF6] ring-1 ring-violet-100">
                {customer.id}
              </span>
              <span className={cn(
                "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                customer.type === "Key Account" ? "bg-amber-50 text-amber-600 ring-1 ring-amber-200" : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
              )}>
                {customer.type}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="rounded-xl bg-slate-50 px-5 py-3 border border-slate-100 text-center md:text-left min-w-[120px]">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Joined Date</div>
                <div className="mt-1 font-medium text-slate-900">{customer.createdAt}</div>
              </div>
              <div className="rounded-xl bg-slate-50 px-5 py-3 border border-slate-100 text-center md:text-left min-w-[120px]">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Briefs</div>
                <div className="mt-1 font-bold text-slate-900 text-lg">{customerBriefs.length}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#6D5DF6]" /> Briefs for this Customer
        </h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {customerBriefs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Brief ID</th>
                  <th className="px-6 py-4">Campaign Name</th>
                  <th className="px-6 py-4">Buyer</th>
                  <th className="px-6 py-4">Planner</th>
                  <th className="px-6 py-4">Package Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {customerBriefs.map((brief) => (
                  <tr key={brief.id} className="transition hover:bg-slate-50 group">
                    <td className="px-6 py-4 font-semibold text-[#6D5DF6]">{brief.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{brief.campaignName}</td>
                    <td className="px-6 py-4 text-slate-600">{brief.buyer || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{brief.planner || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {Array.isArray(brief.packageType) ? brief.packageType.join(", ") : brief.packageType || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                        brief.internalStatus === "Draft" ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-600"
                      )}>
                        {brief.internalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onViewBrief(brief)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-[#6D5DF6] transition hover:bg-violet-50 hover:border-violet-200 shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <Eye className="h-3.5 w-3.5" /> View Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
              <FileText className="h-6 w-6 text-slate-300" />
            </div>
            <p>No briefs found for this customer.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function CustomerFlow({ showToast, customers, setCustomers, briefs, onViewBrief }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filtered = useMemo(() => {
    return customers.filter((cust) => {
      const matchesSearch = `${cust.id} ${cust.name}`.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "All" || cust.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [customers, search, typeFilter]);

  const handleCreateCustomer = (data) => {
    const newCustomer = {
      id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
      name: data.name,
      image: data.image,
      type: data.type,
      createdAt: new Date().toISOString().split("T")[0]
    };
    setCustomers(prev => [newCustomer, ...prev]);
    showToast("Customer created successfully!");
    setCreateModalOpen(false);
  };

  if (selectedCustomer) {
    return <CustomerDetail customer={selectedCustomer} briefs={briefs} onBack={() => setSelectedCustomer(null)} onViewBrief={onViewBrief} />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-[28px]">Customer Management</h1>
          <p className="mt-1 text-sm text-slate-500">Manage all clients and key accounts.</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}><Plus className="h-4 w-4" /> Add Customer</Button>
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
        <div className="w-full md:w-auto relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 w-full md:min-w-[180px] appearance-none bg-transparent px-4 pr-10 text-sm font-normal text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">Type: All</option>
            <option value="Key Account">Type: Key Account</option>
            <option value="Non-Key Account">Type: Non-Key Account</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Customer ID</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((cust) => (
                <tr key={cust.id} className="transition hover:bg-slate-50/70 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={cust.image} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200 bg-white" />
                      <div className="font-semibold text-slate-900">{cust.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">{cust.id}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                      cust.type === "Key Account" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-600"
                    )}>
                      {cust.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{cust.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-[#6D5DF6] transition hover:bg-violet-50 hover:border-violet-200 shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Eye className="h-3.5 w-3.5" /> Detail
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No customers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateCustomerModal 
        open={createModalOpen} 
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateCustomer}
      />
    </motion.div>
  );
}
