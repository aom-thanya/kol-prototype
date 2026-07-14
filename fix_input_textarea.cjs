const fs = require('fs');
let content = fs.readFileSync('src/components/common/Input.jsx', 'utf8');

content = content.replace('export default function Input({', `export default function Input({
  multiline = false,
  rows = 3,`);

content = content.replace(`<input
        id={id}
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />`, `{multiline ? (
        <textarea
          id={id}
          rows={rows}
          className={cn(
            "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-[#6D5DF6] focus:outline-none focus:ring-1 focus:ring-[#6D5DF6] resize-none",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
      ) : (
        <input
          id={id}
          className={cn(
            "w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:border-[#6D5DF6] focus:outline-none focus:ring-1 focus:ring-[#6D5DF6]",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
      )}`);

fs.writeFileSync('src/components/common/Input.jsx', content);
