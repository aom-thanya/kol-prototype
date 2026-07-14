const fs = require('fs');
let content = fs.readFileSync('src/features/briefs/components/AddRequestModal.jsx', 'utf8');

// replace imports
content = content.replace('import Button from "../../../components/common/Button";', 
`import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import Input from "../../../components/common/Input";`);

const oldMarkup = `<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Add Change Request</h3>
        <p className="text-sm text-slate-500 mb-4">This will notify the Buyer that there is a new requirement impacting the current candidates.</p>
        <textarea rows={3} value={requestText} onChange={e => setRequestText(e.target.value)} className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-[#6D5DF6]" placeholder="e.g., เพิ่ม Service Buyout Asset 6 เดือน" />
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSubmit(requestText)} disabled={!requestText}>Submit Request</Button>
        </div>
      </motion.div>
    </div>`;

const newMarkup = `<Modal isOpen={open} onClose={onClose} title="Add Change Request" maxWidth="max-w-md">
      <div className="p-6">
        <p className="text-sm text-slate-500 mb-4">This will notify the Buyer that there is a new requirement impacting the current candidates.</p>
        <Input 
          multiline 
          rows={3} 
          value={requestText} 
          onChange={e => setRequestText(e.target.value)} 
          placeholder="e.g., เพิ่ม Service Buyout Asset 6 เดือน" 
        />
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSubmit(requestText)} disabled={!requestText}>Submit Request</Button>
        </div>
      </div>
    </Modal>`;

content = content.replace(oldMarkup, newMarkup);
fs.writeFileSync('src/features/briefs/components/AddRequestModal.jsx', content);
