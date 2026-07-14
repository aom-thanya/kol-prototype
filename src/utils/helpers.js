export function formatNumber(value) {
  if (value == null) return "";
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 100000 ? 0 : 1)}K`;
  return value.toLocaleString();
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
export const formatCurrency = (val) => {
  if (val === "" || val === undefined || val === null) return "฿0.00";
  const num = typeof val === "string" ? parseFloat(val.replace(/,/g, "")) : Number(val);
  if (isNaN(num)) return val;
  return `฿${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
