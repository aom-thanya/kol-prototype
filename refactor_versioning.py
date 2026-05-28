import re

def refactor_brief_flow():
    with open('src/BriefFlow.jsx', 'r') as f:
        content = f.read()

    # 1. Inject components (Timeline, AddRequestModal, ReviewChangeModal)
    # We will insert them right after SimpleHtmlEditor component
    components_code = """
function ActivityTimeline({ logs }) {
  if (!logs || logs.length === 0) return null;
  return (
    <div className="mt-8">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">Activity Timeline</h3>
      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {logs.map((log, index) => (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <CheckCircle2 className="w-5 h-5 text-violet-500" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-slate-800">{log.action}</span>
                <span className="text-xs text-slate-500">{log.date}</span>
              </div>
              {log.details && <p className="text-xs text-slate-600 mt-1">{log.details}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddRequestModal({ open, onClose, onSubmit }) {
  const [requestText, setRequestText] = useState("");
  
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Add Change Request</h3>
        <p className="text-sm text-slate-500 mb-4">This will notify the Buyer that there is a new requirement impacting the current candidates.</p>
        <textarea rows={3} value={requestText} onChange={e => setRequestText(e.target.value)} className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-[#6D5DF6]" placeholder="e.g., เพิ่ม Service Buyout Asset 6 เดือน" />
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSubmit(requestText)} disabled={!requestText}>Submit Request</Button>
        </div>
      </motion.div>
    </div>
  );
}

function ReviewChangeModal({ open, pendingChanges, onApply, onLater }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Review Change Request</h3>
        <p className="text-sm text-slate-500 mb-4">Sales has added new requirements. Applying these updates will generate Tracker V{(pendingChanges?.targetVersion || 2)}.</p>
        <div className="rounded-lg bg-amber-50 p-4 border border-amber-200 mb-6">
          <h4 className="text-xs font-semibold text-amber-800 uppercase mb-2">New Requirements</h4>
          <p className="text-sm text-amber-900">{pendingChanges?.text || "No details provided"}</p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onLater}>Later</Button>
          <Button onClick={onApply}>Apply Update (Create V{(pendingChanges?.targetVersion || 2)})</Button>
        </div>
      </motion.div>
    </div>
  );
}
"""
    content = re.sub(r'(function SimpleHtmlEditor.*?</div>\s*);\s*}', r'\1;\n}\n' + components_code, content, flags=re.DOTALL)

    # 2. BriefDetailPage changes
    # Add AddRequestModal state
    bdp_state = """  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);"""
    content = content.replace('  const [submitModalOpen, setSubmitModalOpen] = useState(false);', bdp_state)

    # Update handleSubmitToBuyer
    submit_buyer_replacement = """  const handleSubmitToBuyer = () => {
    const log = {
      date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action: "Sales submitted Brief V1",
      details: "Initial submission to buyer."
    };
    onUpdateBrief({
      ...brief,
      version: 1,
      internalStatus: "Submitted to Buyer",
      submittedSows: selectedSows,
      viewingTracker: true,
      activityLog: [...(brief.activityLog || []), log]
    });
    setSubmitModalOpen(false);
  };

  const handleAddRequest = (text) => {
    const log = {
      date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action: "Sales added a new requirement",
      details: text
    };
    const currentVersion = brief.version || 1;
    onUpdateBrief({
      ...brief,
      pendingChanges: { text, targetVersion: currentVersion + 1 },
      activityLog: [...(brief.activityLog || []), log]
    });
    setRequestModalOpen(false);
  };"""
    content = re.sub(r'  const handleSubmitToBuyer = \(\) => \{.*?\n  \};\n', submit_buyer_replacement + '\n', content, flags=re.DOTALL)

    # Add Add Request button and Modals to JSX
    buttons_replacement = """        <div className="flex gap-2">
          {(!brief.internalStatus || brief.internalStatus === "Draft") && (
            <Button onClick={() => setSubmitModalOpen(true)}>Submit to Buyer</Button>
          )}
          {brief.internalStatus === "Submitted to Buyer" && (
            <>
              <Button variant="secondary" onClick={() => setRequestModalOpen(true)}><Plus className="h-4 w-4" /> Add Request</Button>
              <Button onClick={() => onUpdateBrief({ ...brief, viewingTracker: true })}>Go to Influencer Tracker</Button>
            </>
          )}
          <Button variant="secondary"><Copy className="h-4 w-4" /> Duplicate</Button>
        </div>"""
    content = re.sub(r'        <div className="flex gap-2">.*?</div>', buttons_replacement, content, flags=re.DOTALL)

    # Add AddRequestModal and Timeline to BriefDetailPage
    modal_injection = """      <AddRequestModal open={requestModalOpen} onClose={() => setRequestModalOpen(false)} onSubmit={handleAddRequest} />
      
      <div className="overflow-hidden"""
    content = content.replace('      <div className="overflow-hidden', modal_injection)

    timeline_injection = """      </div>
      <ActivityTimeline logs={brief.activityLog || []} />
    </motion.div>"""
    content = content.replace('      </div>\n    </motion.div>', timeline_injection)

    # 3. PlannerTrackerPage changes
    # Add ReviewChangeModal state
    ptp_state = """function PlannerTrackerPage({ brief, onBack, onUpdateBrief }) {
  const [trackerData, setTrackerData] = useState({ influencers: [], group: "", ...brief.trackerData });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);"""
    content = content.replace("""function PlannerTrackerPage({ brief, onBack, onUpdateBrief }) {
  const [trackerData, setTrackerData] = useState({ influencers: [], group: "", ...brief.trackerData });
  const [addModalOpen, setAddModalOpen] = useState(false);""", ptp_state)

    # Update Save handler to persist tracker data
    ptp_save = """  const handleSave = () => {
    onUpdateBrief({ ...brief, trackerData });
  };
  
  const handleApplyUpdate = () => {
    const log = {
      date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action: `Buyer applied Brief V${brief.pendingChanges.targetVersion}`,
      details: "Table updated and new columns generated."
    };
    onUpdateBrief({ 
      ...brief, 
      version: brief.pendingChanges.targetVersion,
      pendingChanges: null,
      trackerData,
      activityLog: [...(brief.activityLog || []), log]
    });
    setReviewModalOpen(false);
  };"""
    content = content.replace("""  const handleSave = () => {
    onUpdateBrief({ ...brief, trackerData });
  };""", ptp_save)

    # Add Notification Banner and Version Badge
    ptp_header_replace = """    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
      <ReviewChangeModal open={reviewModalOpen} pendingChanges={brief.pendingChanges} onApply={handleApplyUpdate} onLater={() => setReviewModalOpen(false)} />
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-[#6D5DF6] flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 rotate-90" /> Back to Brief
        </button>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">Working on Brief V{brief.version || 1}</span>
          <Button variant="secondary" onClick={handleSave}>Save Draft</Button>
          <Button>Submit Tracker</Button>
        </div>
      </div>
      
      {brief.pendingChanges && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <span className="text-lg">!</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-900">มี requirement ใหม่ที่กระทบ candidate ปัจจุบัน</h4>
              <p className="text-xs text-amber-700 mt-0.5">Sales added new requirements to the brief.</p>
            </div>
          </div>
          <Button variant="secondary" className="border-amber-300 text-amber-800 hover:bg-amber-100" onClick={() => setReviewModalOpen(true)}>Review Change</Button>
        </div>
      )}"""
    content = re.sub(r'    <motion\.div initial=\{\{ opacity: 0, y: 8 \}\} animate=\{\{ opacity: 1, y: 0 \}\} className="space-y-6 pb-20">\n      <div className="flex items-center justify-between">\n        <button onClick=\{onBack\} className="text-sm font-medium text-slate-500 hover:text-\[#6D5DF6\] flex items-center gap-1">\n          <ArrowUpDown className="h-4 w-4 rotate-90" /> Back to Brief\n        </button>\n        <div className="flex gap-2">\n          <Button variant="secondary" onClick=\{handleSave\}>Save Draft</Button>\n          <Button>Submit Tracker</Button>\n        </div>\n      </div>', ptp_header_replace, content)

    # Add Timeline to PlannerTrackerPage
    ptp_timeline_replace = """          onAddClick={() => setAddModalOpen(true)}
        />
      ))}

      <ActivityTimeline logs={brief.activityLog || []} />"""
    content = content.replace("""          onAddClick={() => setAddModalOpen(true)}
        />
      ))}""", ptp_timeline_replace)

    # 4. Update Create Brief Modal to init arrays
    create_replace = """    const newBrief = {
      id: `BRF-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString().split('T')[0],
      internalStatus: "Draft",
      version: 1,
      activityLog: [{
        date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        action: "Brief Created",
        details: "Draft initiated by Sales."
      }],
      ...data,
    };"""
    content = content.replace("""    const newBrief = {
      id: `BRF-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString().split('T')[0],
      internalStatus: "Draft",
      ...data,
    };""", create_replace)

    with open('src/BriefFlow.jsx', 'w') as f:
        f.write(content)
    
    print("Refactoring complete.")

if __name__ == '__main__':
    refactor_brief_flow()
