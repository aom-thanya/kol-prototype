import React from "react";
import { motion } from "framer-motion";

export default function RateCardListPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="rounded-3xl border border-slate-200 bg-white p-16 text-center space-y-3 shadow-sm"
    >
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Rate Card List</h1>
      <p className="text-sm text-slate-500 max-w-md mx-auto">This section is currently under development. Detailed rate card listings and cost cards will appear here.</p>
    </motion.div>
  );
}
