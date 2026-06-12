export const formatCurrency = (val) => {
  if (val === "" || val === undefined || val === null) return "฿0.00";
  const num = typeof val === "string" ? parseFloat(val.replace(/,/g, "")) : Number(val);
  if (isNaN(num)) return val;
  return `฿${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
