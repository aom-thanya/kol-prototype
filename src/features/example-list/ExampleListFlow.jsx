import { useState, useEffect } from 'react';
import { useParams, useNavigate, Routes, Route } from "react-router-dom";

import BriefListingPage from "../../components/brief/BriefListingPage";
import BriefDetailPage from "../briefs/components/BriefDetailPage";
import BriefStepProgress from "../../components/brief/BriefStepProgress";
import RecapSetup from "../../components/brief/RecapSetup";
import BriefExampleListView from "../briefs/components/BriefExampleListView";

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
          { id: "recap", label: "Recap" },
          { id: "exampleList", label: "Example List" },
          { id: "rateCardList", label: "Rate Card List" }
        ]}
        customProgressIdx={activeTab === "brief" ? 0 : activeTab === "recap" ? 1 : activeTab === "exampleList" ? 2 : 3}
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
            onNext={() => setActiveTab("exampleList")}
          />
        )}

        {activeTab === "exampleList" && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                <BriefExampleListView 
                  brief={currentBrief} 
                  onUpdateBrief={(updated) => {
                    setCurrentBrief(updated);
                    showToast("Example list updated.");
                  }}
                />
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="w-full lg:w-1/4 shrink-0 text-sm">
              <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white shadow-3xs p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Brief Status & Actions</h3>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setActiveTab("rateCardList")}
                    className="w-full py-3 text-base font-bold bg-[#6D5DF6] hover:bg-[#5b4dcc] text-white rounded-lg transition-colors shadow-sm"
                  >
                    Start Rate Card List
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "rateCardList" && (
          <div className="flex h-[60vh] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm p-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Rate Card List</h2>
            <p className="mt-2 text-slate-500 text-center max-w-md">
              This step will allow you to request and review rate cards for the selected example creators.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
