import { useState, useEffect } from 'react';
import { useParams, useNavigate, Routes, Route } from "react-router-dom";

import BriefListingPage from "../../components/brief/BriefListingPage";
import BriefDetailPage from "../briefs/components/BriefDetailPage";
import BriefStepProgress from "../../components/brief/BriefStepProgress";
import RecapSetup from "../../components/brief/RecapSetup";

export default function ExampleListFlow({ briefs, showToast }) {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <BriefListingPage 
            briefs={briefs}
            title="Example List"
            description="View and manage example lists for non-standard package campaigns."
            excludePackageTypes={["Standard (1 D)", "Standard KPI"]}
            onView={(b) => navigate(`/example-list/${b.id}`)}
            onCreate={() => showToast("Create functionality not available in this view.")}
            listOnly={false}
          />
        } 
      />
      <Route 
        path="/:id" 
        element={
          <ExampleListDetailWrapper 
            briefs={briefs} 
            showToast={showToast} 
            onBack={() => navigate("/example-list")} 
          />
        } 
      />
    </Routes>
  );
}

function ExampleListDetailWrapper({ briefs, showToast, onBack }) {
  const { id } = useParams();
  const [currentBrief, setCurrentBrief] = useState(null);
  const [activeTab, setActiveTab] = useState("brief");

  useEffect(() => {
    if (id) {
      const found = briefs.find(b => b.id === id);
      setCurrentBrief(found);
    }
  }, [id, briefs]);

  if (!currentBrief) return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-slate-500">Brief not found.</p>
    </div>
  );

  return (
    <div className="w-full pb-20">
      <BriefStepProgress 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={onBack}
        brief={currentBrief}
        customSteps={[
          { id: "brief", label: "Brief Details" },
          { id: "recap", label: "Recap" }
        ]}
        customProgressIdx={activeTab === "brief" ? 0 : 1}
      />
      
      <div className="mt-6">
        {activeTab === "brief" && (
          <BriefDetailPage 
            brief={currentBrief}
            onBack={onBack}
            onStartRecap={() => setActiveTab("recap")}
            onUpdateBrief={(updated) => {
              setCurrentBrief(updated);
              showToast("Updates applied locally (Example List view).");
            }}
          />
        )}
        
        {activeTab === "recap" && (
          <RecapSetup 
            brief={currentBrief}
            onUpdateBrief={(updated) => {
              setCurrentBrief(updated);
              showToast("Recap updates saved locally.");
            }}
            onNext={() => setActiveTab("brief")}
          />
        )}
      </div>
    </div>
  );
}
