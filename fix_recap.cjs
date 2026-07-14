const fs = require('fs');

let content = fs.readFileSync('src/components/brief/RecapSetup.jsx', 'utf8');

// 1. Add ExternalLink import
content = content.replace(
  'import { Plus, X, Trash2, Edit2, ChevronDown, Check, Copy } from "lucide-react";',
  'import { Plus, X, Trash2, Edit2, ChevronDown, Check, Copy, ExternalLink } from "lucide-react";'
);

// 2. Fix 1 SOW = 1 Group in useState and handleAddGroup
content = content.replace(
  'const [groups, setGroups] = useState(brief.groups || []);',
  `const [groups, setGroups] = useState(() => {
    if (brief.groups && brief.groups.length > 0) return brief.groups;
    
    const sows = brief.budgetOptions?.[0]?.scopeOfWorks || [];
    return sows.map((sow, idx) => {
      const getArray = (val) => Array.isArray(val) ? val : (val ? [val] : []);
      return {
        id: \`group_\${Date.now()}_\${idx}\`,
        name: sow.name || \`Group \${idx + 1}\`,
        pillars: {
          demographic: getArray(sow.persona?.demographic),
          location: getArray(sow.persona?.location),
          occupation: getArray(sow.persona?.occupation),
          persona: getArray(sow.persona?.persona),
          contentCategory: getArray(sow.persona?.contentCategory),
          storyTelling: getArray(sow.persona?.storyTelling)
        },
        sows: [{ ...sow, id: \`sow_\${Date.now()}_\${idx}\` }]
      };
    });
  });

  React.useEffect(() => {
    if (!brief.groups || brief.groups.length === 0) {
      onUpdateBrief({ ...brief, groups });
    }
  }, []);`
);

content = content.replace(
  'sows: []',
  `sows: [{
        id: \`sow_\${Date.now()}\`,
        name: newGroupName || \`Group \${groups.length + 1}\`,
        platforms: [],
        contentType: [],
        notes: "",
        allocation: "",
        numInfluencers: "",
        followerReqFrom: "",
        followerReqTo: "",
        details: "",
        serviceScope: {}
      }]`
);

// 3. Remove Add SOW, Delete SOW, Duplicate SOW functions
content = content.replace(/const handleAddSow = \([\s\S]*?onUpdateBrief\({ \.\.\.brief, groups: updated }\);\n  };\n/, '');
content = content.replace(/const handleDuplicateSow = \([\s\S]*?onUpdateBrief\({ \.\.\.brief, groups: updated }\);\n  };\n/, '');
content = content.replace(/const handleDeleteSow = \([\s\S]*?onUpdateBrief\({ \.\.\.brief, groups: updated }\);\n  };\n/, '');

// 4. Update the UI for Step 2.3: Scope of Work Details to remove the loop header and Add SOW button
content = content.replace(
  /<div className="flex justify-between items-center mb-3">\s*<h5 className="text-sm font-bold text-slate-700 border-l-4 border-emerald-500 pl-2">Step 2.3: Scopes of Work \(SOW\)<\/h5>[\s\S]*?<div className="space-y-4">\s*\{group\.sows\.map\(\(sow, sIndex\) => \(\s*<div key=\{sow\.id\} className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">\s*<div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">[\s\S]*?<\/button>\s*<\/div>\s*<div className="p-4 space-y-6 bg-white">/,
  `<h5 className="text-sm font-bold text-slate-700 border-l-4 border-emerald-500 pl-2 mb-3">Step 2.3: Scope of Work Details</h5>
                  <div className="space-y-4">
                    {group.sows.map((sow) => (
                      <div key={sow.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                        <div className="p-4 space-y-6 bg-white">`
);

// Remove the Duplicate SOW button in the UI
content = content.replace(
  /<div className="flex justify-end pt-2 border-t border-slate-100">\s*<button type="button" onClick=\{[\s\S]*?Duplicate SOW\s*<\/button>\s*<\/div>/,
  ''
);

// 5. Add Reference Influencers Display before Details label
const referenceDisplay = `
                            {/* Reference Influencers Display */}
                            {sow.referenceInfluencers && sow.referenceInfluencers.length > 0 && (
                              <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-100">
                                <div className="text-slate-500 mb-3 text-sm font-semibold uppercase tracking-wider">Reference Influencers</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {sow.referenceInfluencers.map(ref => (
                                    <div key={ref.id} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                                      <img src={ref.avatar || "https://ui-avatars.com/api/?name=" + ref.username} alt={ref.username} className="h-10 w-10 rounded-full object-cover border border-slate-200 mt-1" />
                                      <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center justify-between">
                                          <a href={ref.profileUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-800 hover:text-[#6D5DF6] text-sm flex items-center gap-1 transition-colors">
                                            {ref.username} <ExternalLink className="h-3 w-3" />
                                          </a>
                                          <span className="text-[10px] font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full">{ref.platform}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 pb-1">
                                          <span><strong className="text-slate-700">Folls:</strong> {ref.followers || "-"}</span>
                                          <span><strong className="text-slate-700">ER:</strong> {ref.engagement || "-"}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                          {ref.category && ref.category.map(c => (
                                            <span key={c} className="text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-md">{c}</span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
`;

content = content.replace(
  /<div className="md:col-span-2">\s*<label className="mb-1 block text-sm font-medium text-slate-700">Details<\/label>/,
  `${referenceDisplay}
                            <div className="md:col-span-2">
                              <label className="mb-1 block text-sm font-medium text-slate-700">Details</label>`
);

fs.writeFileSync('src/components/brief/RecapSetup.jsx', content);
console.log('Done fixing RecapSetup.jsx');
