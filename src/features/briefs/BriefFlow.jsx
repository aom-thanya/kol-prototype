import { useState, useEffect } from 'react';

import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2
} from "lucide-react";

import BriefStepProgress from "../../components/brief/BriefStepProgress";
import BriefListingPage from "../../components/brief/BriefListingPage";
import DealsheetPage from "../../components/brief/DealsheetPage";
import ProposalPage from "../../components/brief/ProposalPage";
import PlannerTrackerPage from "../../components/tracker/PlannerTrackerPage";
import { getBriefDefaultTab } from "../../utils/briefHelpers";
import { generateSeedData } from "../standard-pricing/StandardPricingFlow";

const getStandardPricingRecords = () => {
  const saved = localStorage.getItem("kol_standard_pricing_v4");
  if (saved) return JSON.parse(saved);
  return generateSeedData();
};

const getSpecialConditionsForPlatforms = (plats) => {
  if (!plats || plats.length === 0) return [];
  const records = getStandardPricingRecords();
  
  const specialCosts = new Set();
  plats.forEach(plat => {
    let mappedPlat = plat;
    if (plat === "X") mappedPlat = "X/Twitter";
    const record = records.find(r => r.platform === mappedPlat);
    if (record) {
      const specialCat = record.costTypes.find(c => c.category === "Special Cost");
      if (specialCat && specialCat.items) {
        specialCat.items.forEach(item => specialCosts.add(item.topic));
      }
    }
  });
  return Array.from(specialCosts);
};

// Helper utilities
import BriefFormModal from "./components/BriefFormModal";
import BriefDetailPage from "./components/BriefDetailPage";
import BriefExampleListView from "./components/BriefExampleListView";

export default function BriefFlow({ showToast, customers = [], briefs = [], setBriefs, listOnly = false, forceOpenBrief = null }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentBrief, setCurrentBrief] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [pendingBriefData, setPendingBriefData] = useState(null);
  const [createdBrief, setCreatedBrief] = useState(null);

  useEffect(() => {
    if (forceOpenBrief) {
      setCurrentBrief({ ...forceOpenBrief, activeTab: getBriefDefaultTab(forceOpenBrief) });
    }
  }, [forceOpenBrief]);

  useEffect(() => {
    if (id) {
      const found = briefs.find(b => b.id === id);
      if (found && (!currentBrief || currentBrief.id !== id)) {
        setCurrentBrief({ ...found, activeTab: getBriefDefaultTab(found) });
      }
    } else {
      setCurrentBrief(null);
    }
  }, [id, briefs, currentBrief]);

  useEffect(() => {
    if (currentBrief && id) {
      const latest = briefs.find(b => b.id === currentBrief.id);
      if (latest) {
        if (JSON.stringify(latest.groupTrackers) !== JSON.stringify(currentBrief.groupTrackers) || 
            latest.internalStatus !== currentBrief.internalStatus) {
          setCurrentBrief(prev => ({
            ...prev,
            ...latest
          }));
        }
      }
    }
  }, [briefs, currentBrief, id]);

  const handleCreateClick = (data, status) => {
    const briefData = { ...data, internalStatus: status || "Example List" };
    if (status === "Draft") {
      executeCreate(briefData);
    } else {
      setPendingBriefData(briefData);
      setConfirmSubmitOpen(true);
    }
  };

  const executeCreate = (data) => {
    const isDraft = data.internalStatus === "Draft";
    const newBrief = {
      id: `BRF-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString().split('T')[0],
      version: 1,
      activityLog: [{
        date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        action: isDraft ? "Brief Saved" : "Brief Submitted",
        details: isDraft ? "Saved as Draft." : "Brief created and submitted to Traffic."
      }],
      ...data,
    };
    if (setBriefs) {
      setBriefs([newBrief, ...briefs]);
    }
    setCreatedBrief(newBrief);
    setCreateModalOpen(false);

    if (isDraft) {
      if (showToast) showToast("Draft saved successfully!");
    } else {
      setSuccessModalOpen(true);
    }
  };

  const handleConfirmCreate = () => {
    executeCreate(pendingBriefData);
    setConfirmSubmitOpen(false);
  };

  const handleUpdateBrief = (updatedBrief) => {
    if (setBriefs) {
      setBriefs(briefs.map(b => b.id === updatedBrief.id ? updatedBrief : b));
    }
    setCurrentBrief(updatedBrief);
    if (showToast) showToast("Brief updated successfully!");
  };

  return (
    <>
      <BriefFormModal 
        open={createModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        onSubmit={handleCreateClick}
        customers={customers}
      />

      <AnimatePresence>
        {confirmSubmitOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">Confirm Submission</h3>
              <p className="mb-6 text-sm text-slate-500">
                Are you sure you want to create this Brief? You can edit details later if needed.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmSubmitOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCreate}
                  className="rounded-lg bg-[#6D5DF6] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#5a4add]"
                >
                  Yes, Create Brief
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl flex flex-col items-center"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">Brief Created Successfully!</h3>
              <p className="mb-6 text-slate-500">
                Your brief has been saved as <span className="font-semibold text-slate-700">{createdBrief?.id}</span>.
              </p>
              <button
                onClick={() => {
                  setSuccessModalOpen(false);
                  navigate(`/brief/${createdBrief.id}`);
                }}
                className="w-full rounded-xl bg-[#6D5DF6] py-3 text-sm font-bold text-white transition hover:bg-[#5a4add]"
              >
                Proceed to Next Step
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {!currentBrief || listOnly ? (
        <BriefListingPage 
          briefs={briefs} 
          onView={(b) => {
            if (listOnly) return;
            navigate(`/brief/${b.id}`);
          }} 
          onCreate={() => setCreateModalOpen(true)}
          listOnly={listOnly}
        />
      ) : (
        <div className="w-full">
          <BriefStepProgress 
            activeTab={currentBrief.activeTab || "brief"} 
            onTabChange={(tab) => handleUpdateBrief({ ...currentBrief, activeTab: tab })} 
            onBack={() => navigate("/brief")}
            status={currentBrief.internalStatus}
            brief={currentBrief}
          />
          {currentBrief.activeTab === "exampleList" ? (
            <BriefExampleListView brief={currentBrief} />
          ) : currentBrief.activeTab === "rateCardList" || currentBrief.viewingTracker ? (
            <PlannerTrackerPage
              brief={currentBrief}
              onBack={() => navigate("/brief")}
              onUpdateBrief={handleUpdateBrief}
              readOnly={true}
              isBriefManagement={true}
            />
          ) : currentBrief.activeTab === "dealsheet" ? (
            <DealsheetPage brief={currentBrief} onUpdateBrief={handleUpdateBrief} showToast={showToast} />
          ) : currentBrief.activeTab === "proposal" ? (
            <ProposalPage brief={currentBrief} onUpdateBrief={handleUpdateBrief} showToast={showToast} />
          ) : (
            <BriefDetailPage 
              brief={currentBrief} 
              onBack={() => navigate("/brief")} 
              onUpdateBrief={handleUpdateBrief}
            />
          )}
        </div>
      )}
    </>
  );
}
