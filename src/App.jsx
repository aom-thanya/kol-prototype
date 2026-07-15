import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BriefFlow from "./features/briefs/BriefFlow";
import StandardPricingFlow from "./features/standard-pricing/StandardPricingFlow";
import FinalDealsheetFlow from "./features/final-dealsheet/FinalDealsheetFlow";
import { customersSeed, briefsSeed } from "./data/mockData";
import AppShell from "./components/layout/AppShell";
import Toast from "./components/common/Toast";
import ExampleListFlow from "./features/example-list/ExampleListFlow";

export default function App() {
  const [customers, setCustomers] = useState(customersSeed);
  const [briefs, setBriefs] = useState(briefsSeed);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <AppShell>
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
      
      <Routes>
        <Route path="/" element={<Navigate to="/brief" replace />} />
        <Route path="/brief" element={<BriefFlow showToast={showToast} customers={customers} briefs={briefs} setBriefs={setBriefs} />} />
        <Route path="/brief/:id" element={<BriefFlow showToast={showToast} customers={customers} briefs={briefs} setBriefs={setBriefs} />} />
        
        <Route path="/final-dealsheet" element={<FinalDealsheetFlow briefs={briefs} setBriefs={setBriefs} showToast={showToast} />} />
        <Route path="/standard-pricing" element={<StandardPricingFlow />} />
        
        <Route path="/example-list/*" element={<ExampleListFlow briefs={briefs} onUpdateBriefs={setBriefs} showToast={showToast} />} />
      </Routes>
    </AppShell>
  );
}
