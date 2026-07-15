import { useState, useEffect } from 'react';
import { useParams, useNavigate, Routes, Route } from "react-router-dom";

import BriefListingPage from "../../components/brief/BriefListingPage";
import BriefDetailPage from "../briefs/components/BriefDetailPage";
import BriefStepProgress from "../../components/brief/BriefStepProgress";
import RecapSetup from "../../components/brief/RecapSetup";
import BriefExampleListView from "../briefs/components/BriefExampleListView";
import PlannerTrackerPage from "../../components/tracker/PlannerTrackerPage";

export default function ExampleListFlow({ briefs, onUpdateBriefs, showToast }) {
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
            onUpdateBriefs={onUpdateBriefs}
            showToast={showToast} 
            onBack={() => navigate("/example-list")} 
          />
        } 
      />
    </Routes>
  );
}

function ExampleListDetailWrapper({ briefs, onUpdateBriefs, showToast, onBack }) {
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
              if (onUpdateBriefs) {
                onUpdateBriefs(briefs.map(b => b.id === updated.id ? updated : b));
              }
              showToast("Updates applied (Example List view).");
            }}
          />
        )}
        
        {activeTab === "recap" && (
          <RecapSetup 
            brief={currentBrief}
            onUpdateBrief={(updated) => {
              setCurrentBrief(updated);
              if (onUpdateBriefs) {
                onUpdateBriefs(briefs.map(b => b.id === updated.id ? updated : b));
              }
              showToast("Recap updates saved.");
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
                    if (onUpdateBriefs) {
                      onUpdateBriefs(briefs.map(b => b.id === updated.id ? updated : b));
                    }
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
          <PlannerTrackerPage 
            brief={currentBrief}
            onUpdateBrief={(updated) => {
              setCurrentBrief(updated);
              if (onUpdateBriefs) {
                onUpdateBriefs(briefs.map(b => b.id === updated.id ? updated : b));
              }
              showToast("Rate card list updated.");
            }}
            isBriefManagement={true}
          />
        )}
      </div>
    </div>
  );
}
