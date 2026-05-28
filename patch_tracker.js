const fs = require('fs');
const content = fs.readFileSync('src/BriefFlow.jsx', 'utf-8');

const startIndex = content.indexOf('// --- Planner Tracker Page Component ---');
const endIndex = content.indexOf('// --- Main Container ---');

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find boundaries');
  process.exit(1);
}

const beforeTracker = content.substring(0, startIndex);
const afterTracker = content.substring(endIndex);

const trackerTableCode = `
// --- Sub-components for Tracker ---
function TrackerTable({ sow, brief, trackerData, onUpdateTracker, onAddClick }) {
  const influencers = trackerData.influencers || [];

  const updateInf = (id, field, value) => {
    const updated = influencers.map(inf => inf.id === id ? { ...inf, [field]: value } : inf);
    onUpdateTracker({ ...trackerData, influencers: updated });
  };

  const updateInfService = (id, serviceName, value) => {
    const updated = influencers.map(inf => inf.id === id ? { ...inf, services: { ...inf.services, [serviceName]: value } } : inf);
    onUpdateTracker({ ...trackerData, influencers: updated });
  };

  const updateInfBrandSupport = (id, supportName, value) => {
    const updated = influencers.map(inf => inf.id === id ? { ...inf, brandSupports: { ...inf.brandSupports, [supportName]: value } } : inf);
    onUpdateTracker({ ...trackerData, influencers: updated });
  };

  const requiredServices = [];
  const addServiceColumns = (reqKey, durationKey, labelPrefix) => {
    if (brief[reqKey]) {
      const durations = Array.isArray(brief[durationKey]) ? brief[durationKey] : (brief[durationKey] ? [brief[durationKey]] : []);
      if (durations.length > 0) {
        durations.forEach(d => {
          requiredServices.push({ key: \`\${reqKey}_\${d}\`, label: \`\${labelPrefix} (\${d})\` });
        });
      } else {
        requiredServices.push({ key: reqKey, label: labelPrefix });
      }
    }
  };

  addServiceColumns('buyoutRequired', 'buyoutDuration', 'Buyout');
  addServiceColumns('boostRequired', 'boostDuration', 'Boost Post');
  addServiceColumns('genCodeRequired', 'genCodeDuration', 'Gen Code');
  addServiceColumns('crossPostingRequired', 'crossPostingDuration', 'Cross Posting');
  addServiceColumns('paidPartnershipRequired', 'paidPartnershipDuration', 'Paid Partnership');
  addServiceColumns('addAdsRequired', 'addAdsDuration', 'Add Ads');
  requiredServices.push({ key: "Affiliate", label: "Affiliate" });
  
  const brandSupports = Array.isArray(brief.brandSupport) ? brief.brandSupport : [];
  const hasCompetitor = brief.competitor && brief.competitor.length > 0 && brief.competitor !== "<p><br></p>";

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 p-6 lg:px-8 bg-slate-50/50 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{sow.name}</h2>
          <p className="text-sm text-slate-500 mt-1">{sow.details || "No details provided"}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Group:</label>
            <select 
              value={trackerData.group || ""} 
              onChange={e => onUpdateTracker({ ...trackerData, group: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#6D5DF6]"
            >
              <option value="">Select Group</option>
              <option value="Beauty">Beauty</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Food">Food</option>
              <option value="Fashion">Fashion</option>
              <option value="Tech">Tech</option>
              <option value="MC">MC</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <Button onClick={() => onAddClick(sow.id)}><Plus className="h-4 w-4" /> Add Influencer</Button>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
            <thead className="bg-slate-50">
              <tr>
                <th colSpan="3" className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-violet-50/50">Influencer Detail</th>
                <th colSpan="3" className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-blue-50/50">Payment</th>
                {requiredServices.length > 0 && <th colSpan={requiredServices.length} className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-amber-50/50">Service (Price or "ไม่รับ")</th>}
                <th colSpan="3" className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-emerald-50/50">Timeline & Queue</th>
                {brandSupports.length > 0 && <th colSpan={brandSupports.length} className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-rose-50/50">Brand Support</th>}
                {hasCompetitor && <th className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-orange-50/50">Competitor</th>}
                <th className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-800 text-center bg-slate-100/50">Note</th>
              </tr>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-3 py-2 border-r border-slate-200">No.</th>
                <th className="px-5 py-4 border-r border-slate-200 w-[280px] min-w-[280px]">Influencer</th>
                <th className="px-3 py-2 border-r border-slate-200">Contact</th>
                <th className="px-3 py-2 border-r border-slate-200">Raw Cost</th>
                <th className="px-3 py-2 border-r border-slate-200">Credit Term (Days)</th>
                <th className="px-3 py-2 border-r border-slate-200">Tax 3%</th>
                {requiredServices.map(srv => <th key={srv.key} className="px-3 py-2 border-r border-slate-200">{srv.label}</th>)}
                <th className="px-3 py-2 border-r border-slate-200">Content Idea</th>
                <th className="px-3 py-2 border-r border-slate-200">Draft Timeline</th>
                <th className="px-3 py-2 border-r border-slate-200">Post Date</th>
                {brandSupports.map(bs => <th key={bs} className="px-3 py-2 border-r border-slate-200">{bs}</th>)}
                {hasCompetitor && <th className="px-3 py-2 border-r border-slate-200">Competitor Note</th>}
                <th className="px-3 py-2">Additional Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {influencers.length === 0 ? (
                <tr>
                  <td colSpan="100%" className="px-4 py-8 text-center text-slate-500">
                    No influencers added yet. Click "Add Influencer" to start tracking.
                  </td>
                </tr>
              ) : (
                influencers.map((inf, idx) => (
                  <tr key={inf.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-500 text-center">{idx + 1}</td>
                    <td className="px-5 py-3 border-r border-slate-100 min-w-[280px]">
                      <div className="flex gap-3 text-left w-full">
                        <img src={inf.avatar || \`https://ui-avatars.com/api/?name=\${encodeURIComponent(inf.accountName || 'New')}&background=random\`} alt="" className="h-11 w-11 rounded-full object-cover shrink-0" />
                        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                          <input type="text" value={inf.accountName} onChange={e => updateInf(inf.id, 'accountName', e.target.value)} placeholder="Account Name (@handle)" className="w-full font-semibold text-slate-900 hover:text-[#6D5DF6] text-[13px] bg-transparent outline-none placeholder:text-slate-300" />
                          <div className="flex items-center gap-2 w-full">
                             <input type="text" value={inf.follower} onChange={e => updateInf(inf.id, 'follower', e.target.value)} placeholder="Followers" className="w-20 text-xs text-slate-500 bg-transparent outline-none border-b border-dashed border-slate-300 placeholder:text-slate-300" />
                             <select value={inf.channel} onChange={e => updateInf(inf.id, 'channel', e.target.value)} className="text-[10px] font-medium text-slate-600 bg-slate-100 rounded-md px-1.5 py-0.5 outline-none cursor-pointer">
                               <option value="">Platform</option>
                               <option value="Instagram">IG</option>
                               <option value="TikTok">TT</option>
                               <option value="Facebook">FB</option>
                               <option value="YouTube">YT</option>
                               <option value="X">X</option>
                             </select>
                          </div>
                          <input type="text" value={inf.accountLink} onChange={e => updateInf(inf.id, 'accountLink', e.target.value)} placeholder="Link URL" className="w-full text-[10px] text-blue-500 bg-transparent outline-none border-b border-dashed border-slate-300 placeholder:text-slate-300" />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100"><input type="text" value={inf.contact} onChange={e => updateInf(inf.id, 'contact', e.target.value)} className="w-32 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6]" placeholder="Email, Line, Tel" /></td>
                    <td className="px-3 py-2 border-r border-slate-100"><input type="text" value={inf.rawCost} onChange={e => updateInf(inf.id, 'rawCost', e.target.value)} className="w-24 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6]" /></td>
                    <td className="px-3 py-2 border-r border-slate-100">
                      <select value={inf.creditTerm} onChange={e => updateInf(inf.id, 'creditTerm', e.target.value)} className="w-24 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] bg-white">
                        <option value="">Select...</option>
                        <option value="7">7 วัน</option>
                        <option value="15">15 วัน</option>
                        <option value="30">30 วัน</option>
                        <option value="60">60 วัน</option>
                        <option value="90">90 วัน</option>
                        <option value="120">120 วัน</option>
                        <option value="150">150 วัน</option>
                        <option value="180">180 วัน</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-center"><input type="checkbox" checked={inf.tax3} onChange={e => updateInf(inf.id, 'tax3', e.target.checked)} className="rounded border-slate-300 text-[#6D5DF6]" /></td>
                    {requiredServices.map(srv => (
                      <td key={srv.key} className="px-3 py-2 border-r border-slate-100"><input type="text" value={inf.services?.[srv.key] || ''} onChange={e => updateInfService(inf.id, srv.key, e.target.value)} className="w-24 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6]" placeholder="Price / ไม่รับ" /></td>
                    ))}
                    <td className="px-3 py-2 border-r border-slate-100"><input type="date" value={inf.ideaTimeline} onChange={e => updateInf(inf.id, 'ideaTimeline', e.target.value)} className="w-32 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6]" /></td>
                    <td className="px-3 py-2 border-r border-slate-100"><input type="date" value={inf.draftTimeline} onChange={e => updateInf(inf.id, 'draftTimeline', e.target.value)} className="w-32 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6]" /></td>
                    <td className="px-3 py-2 border-r border-slate-100"><input type="date" value={inf.postDate} onChange={e => updateInf(inf.id, 'postDate', e.target.value)} className="w-32 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6]" /></td>
                    {brandSupports.map(bs => (
                      <td key={bs} className="px-3 py-2 border-r border-slate-100"><input type="text" value={inf.brandSupports?.[bs] || ''} onChange={e => updateInfBrandSupport(inf.id, bs, e.target.value)} className="w-24 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6]" /></td>
                    ))}
                    {hasCompetitor && (
                      <td className="px-3 py-2 border-r border-slate-100"><textarea rows={1} value={inf.competitorNote} onChange={e => updateInf(inf.id, 'competitorNote', e.target.value)} className="w-40 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] resize-none"></textarea></td>
                    )}
                    <td className="px-3 py-2 border-slate-100"><textarea rows={1} value={inf.note} onChange={e => updateInf(inf.id, 'note', e.target.value)} className="w-40 rounded border border-slate-200 px-2 py-1 outline-none focus:border-[#6D5DF6] resize-none"></textarea></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
      </div>
    </div>
  );
}

// --- Planner Tracker Page Component ---
function PlannerTrackerPage({ brief, onBack, onUpdateBrief }) {
  const [sowTrackers, setSowTrackers] = useState(brief.sowTrackers || {});
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [activeSowForModal, setActiveSowForModal] = useState(null);

  const activeSows = brief.scopeOfWorks?.filter(sow => brief.submittedSows?.includes(sow.id)) || [];

  const handleAddInfluencerClick = (sowId) => {
    setActiveSowForModal(sowId);
    setSelectModalOpen(true);
  };

  const handleSelectInfluencer = (inf) => {
    setSelectModalOpen(false);
    if (!activeSowForModal) return;
    
    const currentSowData = sowTrackers[activeSowForModal] || { group: "", influencers: [] };
    const influencers = currentSowData.influencers || [];
    
    const newInfluencer = {
      id: Date.now(),
      accountName: inf ? inf.username : "",
      accountLink: inf ? \`https://\${inf.platform.toLowerCase()}.com/\${inf.username.replace('@', '')}\` : "",
      follower: inf ? inf.followers.toString() : "",
      channel: inf ? inf.platform : "",
      contact: "",
      rawCost: inf?.rawCost ? inf.rawCost.replace(/[^0-9]/g, '') : "",
      creditTerm: "",
      tax3: false,
      services: {},
      ideaTimeline: "",
      draftTimeline: "",
      postDate: "",
      brandSupports: {},
      competitorNote: "",
      note: ""
    };
    
    setSowTrackers({
      ...sowTrackers,
      [activeSowForModal]: {
        ...currentSowData,
        influencers: [...influencers, newInfluencer]
      }
    });
  };

  const handleSave = () => {
    onUpdateBrief({ ...brief, sowTrackers });
  };

  const handleBack = () => {
    onUpdateBrief({ ...brief, sowTrackers, viewingTracker: false });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <button onClick={handleBack} className="text-sm font-medium text-slate-500 hover:text-[#6D5DF6] flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 rotate-90" /> Back to Brief Details
        </button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Influencer Tracker</h1>
        <p className="text-slate-500 mt-1">{brief.campaignName} • {brief.id}</p>
      </div>

      {activeSows.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-white rounded-3xl border border-slate-200">
          No Scope of Work was submitted to the Buyer.
        </div>
      ) : (
        activeSows.map(sow => (
          <TrackerTable 
            key={sow.id}
            sow={sow}
            brief={brief}
            trackerData={sowTrackers[sow.id] || { group: "", influencers: [] }}
            onUpdateTracker={(newData) => setSowTrackers({ ...sowTrackers, [sow.id]: newData })}
            onAddClick={handleAddInfluencerClick}
          />
        ))
      )}

      <AnimatePresence>
        {selectModalOpen && (
          <InfluencerSelectModal 
            open={selectModalOpen} 
            onClose={() => setSelectModalOpen(false)} 
            onSelect={handleSelectInfluencer} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

`;

fs.writeFileSync('src/BriefFlow.jsx', beforeTracker + trackerTableCode + afterTracker);
console.log('Successfully patched BriefFlow.jsx');
