import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/helpers";
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  header,
  maxWidth = "max-w-2xl",
  children,
  className
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "relative w-full rounded-2xl bg-white shadow-xl flex flex-col overflow-hidden max-h-[90vh]",
            maxWidth,
            className
          )}
        >
          {header ? (
            header
          ) : title ? (
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <h2 className="text-xl font-bold text-slate-800">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : null}
          <div className="overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
