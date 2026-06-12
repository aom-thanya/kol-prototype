import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function ActivityTimeline({ logs }) {
  if (!logs || logs.length === 0) return null;
  const sortedLogs = [...logs].reverse();
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-800 mb-4">Brief Activity Log</h3>
      <div className="space-y-4">
        {sortedLogs.map((log, index) => (
          <div key={index} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex mt-0.5 items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-500 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-slate-800">{log.action}</span>
                <span className="text-xs text-slate-500">{log.date}</span>
              </div>
              {typeof log.details === 'string' ? (
                <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap">{log.details}</p>
              ) : log.details && Array.isArray(log.details) ? (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-slate-700 font-medium mb-1">รายการที่ถูกแก้ไข:</p>
                  {log.details.map((change, idx) => (
                    <div key={idx} className="text-xs text-slate-600">
                      - เปลี่ยน {change.field} จาก <span className="text-[#6D5DF6] font-semibold">{change.oldVal}</span> เป็น <span className="text-[#6D5DF6] font-semibold">{change.newVal}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
