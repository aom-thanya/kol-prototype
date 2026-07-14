import { useState } from "react";
 

import { motion } from "framer-motion";

import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import Input from "../../../components/common/Input";

export default function AddRequestModal({ open, onClose, onSubmit }) {
  const [requestText, setRequestText] = useState("");
  
  if (!open) return null;
  return (
    <Modal isOpen={open} onClose={onClose} title="Add Change Request" maxWidth="max-w-md">
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
    </Modal>
  );
}
