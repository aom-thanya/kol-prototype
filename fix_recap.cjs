const fs = require('fs');
let content = fs.readFileSync('src/components/brief/RecapSetup.jsx', 'utf8');

// Add import
if (!content.includes('import EmptyState')) {
  content = content.replace('import MultiSelect', 'import EmptyState from "../common/EmptyState";\nimport MultiSelect');
}

content = content.replace(`<div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                                    <p className="text-slate-400 font-semibold text-sm">No reference influencers added yet.</p>
                                    <p className="text-slate-400 text-xs mt-1">Click "Add Reference" to include example creators for this scope.</p>
                                  </div>`, `<EmptyState title="No reference influencers added yet." description='Click "Add Reference" to include example creators for this scope.' className="py-6 rounded-xl" />`);

content = content.replace(`{group.sows.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No SOWs added to this group yet.</p>
                    )}`, `{group.sows.length === 0 && (
                      <EmptyState title="No SOWs added to this group yet." className="py-4 border-none bg-transparent shadow-none italic" />
                    )}`);

content = content.replace(`{groups.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
              <p className="text-slate-400 font-semibold">No groups created yet. Add a group to get started.</p>
            </div>
          )}`, `{groups.length === 0 && (
            <EmptyState title="No groups created yet. Add a group to get started." className="py-12" />
          )}`);

fs.writeFileSync('src/components/brief/RecapSetup.jsx', content);
