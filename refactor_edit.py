import re

def refactor():
    with open('src/BriefFlow.jsx', 'r') as f:
        content = f.read()

    # 1. Rename CreateBriefModal to BriefFormModal and add props
    content = content.replace(
        "function CreateBriefModal({ open, onClose, onSubmit }) {",
        "function BriefFormModal({ open, onClose, onSubmit, initialData = null, initialStep = 1 }) {"
    )
    
    # 2. Fix the initialStep initialization
    content = content.replace(
        "const [currentStep, setCurrentStep] = useState(1);",
        "const [currentStep, setCurrentStep] = useState(initialStep);\n  useEffect(() => { if (open) setCurrentStep(initialStep); }, [open, initialStep]);"
    )

    # We need to import useEffect if it's not imported. 
    if "useEffect" not in content[:200]:
        content = content.replace("import React, { useMemo, useState }", "import React, { useMemo, useState, useEffect }")

    # 3. Replace all useState initializations in BriefFormModal
    # We will use regex to find `const [varName, setVarName] = useState(defaultValue);`
    # and replace with `const [varName, setVarName] = useState(initialData?.varName || defaultValue);`
    
    # Let's map the variables to their default values for step 1-5
    # The safest way is to do precise replacements.
    
    replacements = [
        ('const [brand, setBrand] = useState("");', 'const [brand, setBrand] = useState(initialData?.brand || "");'),
        ('const [clientStatus, setClientStatus] = useState("New");', 'const [clientStatus, setClientStatus] = useState(initialData?.clientStatus || "New");'),
        ('const [customerType, setCustomerType] = useState("Key Account");', 'const [customerType, setCustomerType] = useState(initialData?.customerType || "Key Account");'),
        ('const [salesOwner, setSalesOwner] = useState("planner.beauty@buddyreview.co");', 'const [salesOwner, setSalesOwner] = useState(initialData?.salesOwner || "planner.beauty@buddyreview.co");'),
        ('const [campaignName, setCampaignName] = useState("");', 'const [campaignName, setCampaignName] = useState(initialData?.campaignName || "");'),
        ('const [packageType, setPackageType] = useState([]);', 'const [packageType, setPackageType] = useState(initialData?.packageType || []);'),
        ('const [packageTypeOther, setPackageTypeOther] = useState("");', 'const [packageTypeOther, setPackageTypeOther] = useState(initialData?.packageTypeOther || "");'),
        ('const [product, setProduct] = useState("");', 'const [product, setProduct] = useState(initialData?.product || "");'),
        ('const [objective, setObjective] = useState([]);', 'const [objective, setObjective] = useState(initialData?.objective || []);'),
        ('const [objectiveNote, setObjectiveNote] = useState("");', 'const [objectiveNote, setObjectiveNote] = useState(initialData?.objectiveNote || "");'),
        ('const [gender, setGender] = useState([]);', 'const [gender, setGender] = useState(initialData?.gender || []);'),
        ('const [country, setCountry] = useState("");', 'const [country, setCountry] = useState(initialData?.country || "");'),
        ('const [province, setProvince] = useState("");', 'const [province, setProvince] = useState(initialData?.province || "");'),
        ('const [ageRange, setAgeRange] = useState([]);', 'const [ageRange, setAgeRange] = useState(initialData?.ageRange || []);'),
        ('const [lifestyle, setLifestyle] = useState("");', 'const [lifestyle, setLifestyle] = useState(initialData?.lifestyle || "");'),
        ('const [persona, setPersona] = useState("");', 'const [persona, setPersona] = useState(initialData?.persona || "");'),
        ('const [occupation, setOccupation] = useState("");', 'const [occupation, setOccupation] = useState(initialData?.occupation || "");'),
        ('const [campaignStartDate, setCampaignStartDate] = useState("");', 'const [campaignStartDate, setCampaignStartDate] = useState(initialData?.campaignStartDate || "");'),
        ('const [campaignEndDate, setCampaignEndDate] = useState("");', 'const [campaignEndDate, setCampaignEndDate] = useState(initialData?.campaignEndDate || "");'),
        ('const [platform, setPlatform] = useState([]);', 'const [platform, setPlatform] = useState(initialData?.platform || []);'),
        ('const [otherPlatform, setOtherPlatform] = useState("");', 'const [otherPlatform, setOtherPlatform] = useState(initialData?.otherPlatform || "");'),
        ('const [previousCampaign, setPreviousCampaign] = useState("");', 'const [previousCampaign, setPreviousCampaign] = useState(initialData?.previousCampaign || "");'),
        ('const [competitor, setCompetitor] = useState("");', 'const [competitor, setCompetitor] = useState(initialData?.competitor || "");'),
        ('const [additionalInfo, setAdditionalInfo] = useState("");', 'const [additionalInfo, setAdditionalInfo] = useState(initialData?.additionalInfo || "");'),

        ('const [budgetSpending, setBudgetSpending] = useState("");', 'const [budgetSpending, setBudgetSpending] = useState(initialData?.budgetSpending || "");'),
        ('const [budgetBoostSpending, setBudgetBoostSpending] = useState("");', 'const [budgetBoostSpending, setBudgetBoostSpending] = useState(initialData?.budgetBoostSpending || "");'),
        ('const [vat, setVat] = useState("Incl. VAT");', 'const [vat, setVat] = useState(initialData?.vat || "Incl. VAT");'),
        ('const [budgetCondition, setBudgetCondition] = useState("");', 'const [budgetCondition, setBudgetCondition] = useState(initialData?.budgetCondition || "");'),
        ('const [estimatedBrandSpending, setEstimatedBrandSpending] = useState("");', 'const [estimatedBrandSpending, setEstimatedBrandSpending] = useState(initialData?.estimatedBrandSpending || "");'),
        ('const [budgetPerInfluencer, setBudgetPerInfluencer] = useState("");', 'const [budgetPerInfluencer, setBudgetPerInfluencer] = useState(initialData?.budgetPerInfluencer || "");'),
        ('const [expectedNumInfluencers, setExpectedNumInfluencers] = useState("");', 'const [expectedNumInfluencers, setExpectedNumInfluencers] = useState(initialData?.expectedNumInfluencers || "");'),
        ('const [expectedReach, setExpectedReach] = useState("");', 'const [expectedReach, setExpectedReach] = useState(initialData?.expectedReach || "");'),

        ('const [scopeOfWorks, setScopeOfWorks] = useState([{ id: Date.now(), name: "", details: "", contentType: "", platforms: [], followerReq: "", numInfluencers: "" }]);',
         'const [scopeOfWorks, setScopeOfWorks] = useState(initialData?.scopeOfWorks || [{ id: Date.now(), name: "", details: "", contentType: "", platforms: [], followerReq: "", numInfluencers: "" }]);'),

        ('const [buyoutRequired, setBuyoutRequired] = useState(false);', 'const [buyoutRequired, setBuyoutRequired] = useState(initialData?.buyoutRequired || false);'),
        ('const [buyoutDuration, setBuyoutDuration] = useState([]);', 'const [buyoutDuration, setBuyoutDuration] = useState(initialData?.buyoutDuration || []);'),
        ('const [boostRequired, setBoostRequired] = useState(false);', 'const [boostRequired, setBoostRequired] = useState(initialData?.boostRequired || false);'),
        ('const [boostDuration, setBoostDuration] = useState([]);', 'const [boostDuration, setBoostDuration] = useState(initialData?.boostDuration || []);'),
        ('const [addAdsRequired, setAddAdsRequired] = useState(false);', 'const [addAdsRequired, setAddAdsRequired] = useState(initialData?.addAdsRequired || false);'),
        ('const [addAdsDuration, setAddAdsDuration] = useState([]);', 'const [addAdsDuration, setAddAdsDuration] = useState(initialData?.addAdsDuration || []);'),
        ('const [paidPartnershipRequired, setPaidPartnershipRequired] = useState(false);', 'const [paidPartnershipRequired, setPaidPartnershipRequired] = useState(initialData?.paidPartnershipRequired || false);'),
        ('const [paidPartnershipDuration, setPaidPartnershipDuration] = useState([]);', 'const [paidPartnershipDuration, setPaidPartnershipDuration] = useState(initialData?.paidPartnershipDuration || []);'),
        ('const [genCodeRequired, setGenCodeRequired] = useState(false);', 'const [genCodeRequired, setGenCodeRequired] = useState(initialData?.genCodeRequired || false);'),
        ('const [genCodeDuration, setGenCodeDuration] = useState([]);', 'const [genCodeDuration, setGenCodeDuration] = useState(initialData?.genCodeDuration || []);'),
        ('const [tiktokShopRequired, setTiktokShopRequired] = useState(false);', 'const [tiktokShopRequired, setTiktokShopRequired] = useState(initialData?.tiktokShopRequired || false);'),
        ('const [tiktokShopDuration, setTiktokShopDuration] = useState([]);', 'const [tiktokShopDuration, setTiktokShopDuration] = useState(initialData?.tiktokShopDuration || []);'),
        ('const [crossPostingRequired, setCrossPostingRequired] = useState(false);', 'const [crossPostingRequired, setCrossPostingRequired] = useState(initialData?.crossPostingRequired || false);'),
        ('const [crossPostingDuration, setCrossPostingDuration] = useState([]);', 'const [crossPostingDuration, setCrossPostingDuration] = useState(initialData?.crossPostingDuration || []);'),

        ('const [brandSupport, setBrandSupport] = useState([]);', 'const [brandSupport, setBrandSupport] = useState(initialData?.brandSupport || []);'),
        ('const [influencerBuyValue, setInfluencerBuyValue] = useState("");', 'const [influencerBuyValue, setInfluencerBuyValue] = useState(initialData?.influencerBuyValue || "");'),
        ('const [influencerPickupLocation, setInfluencerPickupLocation] = useState("");', 'const [influencerPickupLocation, setInfluencerPickupLocation] = useState(initialData?.influencerPickupLocation || "");'),
        ('const [condition, setCondition] = useState(defaultCondition);', 'const [condition, setCondition] = useState(initialData?.condition || defaultCondition);'),
    ]

    for old, new in replacements:
        content = content.replace(old, new)
        
    # Also need to re-initialize state if initialData changes (or just use key={initialData.id} when rendering the modal in BriefDetailPage)
    
    # 4. Change Modal UI texts
    content = content.replace(
        '<h2 className="text-lg font-semibold text-slate-900">Create New Brief</h2>',
        '<h2 className="text-lg font-semibold text-slate-900">{initialData ? "Edit Brief" : "Create New Brief"}</h2>'
    )
    content = content.replace(
        '<Button onClick={handleSubmit}>Create Brief</Button>',
        '<Button onClick={handleSubmit}>{initialData ? "Save Changes" : "Create Brief"}</Button>'
    )

    # 5. BriefDetailPage modifications
    # Remove AddRequestModal
    content = content.replace('      <AddRequestModal open={requestModalOpen} onClose={() => setRequestModalOpen(false)} onSubmit={handleAddRequest} />\n', "")
    content = content.replace('const [requestModalOpen, setRequestModalOpen] = useState(false);', '')
    
    # Add Edit Modal state to BriefDetailPage
    edit_state = """  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditStep, setCurrentEditStep] = useState(1);
  
  const handleEditSection = (step) => {
    setCurrentEditStep(step);
    setEditModalOpen(true);
  };
  
  const handleEditSubmit = (updatedData) => {
    const log = {
      date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action: `Sales updated Brief Section ${currentEditStep}`,
      details: "Inline update saved."
    };
    onUpdateBrief({
      ...brief,
      ...updatedData,
      activityLog: [...(brief.activityLog || []), log]
    });
    setEditModalOpen(false);
  };
"""
    content = content.replace('  const [submitModalOpen, setSubmitModalOpen] = useState(false);\n', '  const [submitModalOpen, setSubmitModalOpen] = useState(false);\n' + edit_state)

    # Remove + Add Request button
    content = content.replace('<Button variant="secondary" onClick={() => setRequestModalOpen(true)}><Plus className="h-4 w-4" /> Add Request</Button>', '')
    
    # Add Edit button to Section headers in BriefDetailPage
    content = content.replace(
        '<h3 className="text-sm font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2 text-[#6D5DF6]">1. Client & Project Details</h3>',
        '<div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2"><h3 className="text-sm font-semibold text-slate-900 text-[#6D5DF6]">1. Client & Project Details</h3><button onClick={() => handleEditSection(1)} className="text-xs font-semibold text-slate-500 hover:text-[#6D5DF6]">Edit</button></div>'
    )
    content = content.replace(
        '<h3 className="text-sm font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2 text-[#6D5DF6]">2. Budget Details</h3>',
        '<div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2"><h3 className="text-sm font-semibold text-slate-900 text-[#6D5DF6]">2. Budget Details</h3><button onClick={() => handleEditSection(2)} className="text-xs font-semibold text-slate-500 hover:text-[#6D5DF6]">Edit</button></div>'
    )
    content = content.replace(
        '<h3 className="text-sm font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2 text-[#6D5DF6]">3. Scope of Work (SOW)</h3>',
        '<div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2"><h3 className="text-sm font-semibold text-slate-900 text-[#6D5DF6]">3. Scope of Work (SOW)</h3><button onClick={() => handleEditSection(3)} className="text-xs font-semibold text-slate-500 hover:text-[#6D5DF6]">Edit</button></div>'
    )
    content = content.replace(
        '<h3 className="text-sm font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2 text-[#6D5DF6]">4. Service Scope</h3>',
        '<div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2"><h3 className="text-sm font-semibold text-slate-900 text-[#6D5DF6]">4. Service Scope</h3><button onClick={() => handleEditSection(4)} className="text-xs font-semibold text-slate-500 hover:text-[#6D5DF6]">Edit</button></div>'
    )
    content = content.replace(
        '<h3 className="text-sm font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2 text-[#6D5DF6]">5. Brand Support & Condition</h3>',
        '<div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2"><h3 className="text-sm font-semibold text-slate-900 text-[#6D5DF6]">5. Brand Support & Condition</h3><button onClick={() => handleEditSection(5)} className="text-xs font-semibold text-slate-500 hover:text-[#6D5DF6]">Edit</button></div>'
    )

    # Render BriefFormModal at the end of BriefDetailPage
    edit_modal_render = """      <AnimatePresence>
        {editModalOpen && (
          <BriefFormModal 
            key={brief.id} 
            open={editModalOpen} 
            onClose={() => setEditModalOpen(false)} 
            onSubmit={handleEditSubmit} 
            initialData={brief} 
            initialStep={currentEditStep} 
          />
        )}
      </AnimatePresence>
"""
    content = content.replace('<ActivityTimeline logs={brief.activityLog || []} />', edit_modal_render + '      <ActivityTimeline logs={brief.activityLog || []} />')

    # Update BriefFlow to use BriefFormModal
    content = content.replace('<CreateBriefModal', '<BriefFormModal')

    with open('src/BriefFlow.jsx', 'w') as f:
        f.write(content)
        
    print("Refactor completed")

if __name__ == '__main__':
    refactor()
