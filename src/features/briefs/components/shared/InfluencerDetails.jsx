import React, { useState, useEffect } from "react";
import { X, Search, Sparkles, UploadCloud, ExternalLink, Check } from "lucide-react";
import TagInput from "../TagInput";

// Mock Data from the original modal
const MOCK_RESULTS = [
  { id: 1, username: "@jane_doe", platform: "Instagram", profileUrl: "https://instagram.com/jane_doe", followers: "120K", engagement: "3.2%", category: ["Beauty", "Lifestyle"], persona: ["Trendy"], match: 95, avatar: "https://i.pravatar.cc/150?u=1", suggestedFollowerFrom: "100000", suggestedFollowerTo: "200000", suggestedDemographic: "Female 18-24", suggestedLocation: "Bangkok", suggestedOccupation: "Student", suggestedStoryTelling: "Aesthetic Vlogs, Product Reviews" },
  { id: 2, username: "@john_smith", platform: "TikTok", profileUrl: "https://tiktok.com/@john_smith", followers: "45K", engagement: "4.5%", category: ["Tech"], persona: ["Geek"], match: 88, avatar: "https://i.pravatar.cc/150?u=2", suggestedFollowerFrom: "10000", suggestedFollowerTo: "50000", suggestedDemographic: "Male 18-34", suggestedLocation: "Urban Cities", suggestedOccupation: "Tech Professional", suggestedStoryTelling: "Gadget Unboxing, Tutorials" },
  { id: 3, username: "@foodie_bkk", platform: "Facebook", profileUrl: "https://facebook.com/foodiebkk", followers: "250K", engagement: "2.1%", category: ["Food"], persona: ["Friendly"], match: 82, avatar: "https://i.pravatar.cc/150?u=3", suggestedFollowerFrom: "150000", suggestedFollowerTo: "300000", suggestedDemographic: "All 25-45", suggestedLocation: "Thailand", suggestedOccupation: "Any", suggestedStoryTelling: "Cafe Hopping, Honest Reviews" },
  { id: 4, username: "@travel_wander", platform: "Instagram", profileUrl: "https://instagram.com/travel_wander", followers: "80K", engagement: "5.0%", category: ["Travel"], persona: ["Adventurous"], match: 75, avatar: "https://i.pravatar.cc/150?u=4", suggestedFollowerFrom: "50000", suggestedFollowerTo: "100000", suggestedDemographic: "All 20-35", suggestedLocation: "Global", suggestedOccupation: "Freelancer", suggestedStoryTelling: "Cinematic, Adventure Story" },
  { id: 5, username: "@fit_guru", platform: "YouTube", profileUrl: "https://youtube.com/fitguru", followers: "300K", engagement: "1.8%", category: ["Fitness"], persona: ["Motivator"], match: 60, avatar: "https://i.pravatar.cc/150?u=5", suggestedFollowerFrom: "250000", suggestedFollowerTo: "500000", suggestedDemographic: "Male 25-40", suggestedLocation: "City", suggestedOccupation: "Office Worker", suggestedStoryTelling: "Workout Routine, Diet Plan" },
  { id: 6, username: "@pet_lover", platform: "TikTok", profileUrl: "https://tiktok.com/@pet_lover", followers: "15K", engagement: "8.9%", category: ["Pets"], persona: ["Cute"], match: 55, avatar: "https://i.pravatar.cc/150?u=6", suggestedFollowerFrom: "5000", suggestedFollowerTo: "20000", suggestedDemographic: "Female 13-24", suggestedLocation: "Suburbs", suggestedOccupation: "Student", suggestedStoryTelling: "Funny Pet Moments" },
];

export default function InfluencerDetails({ value, onChange, editable = true, showSuggestionSource = true }) {
  const [activeTab, setActiveTab] = useState("username"); 
  const [manualEdits, setManualEdits] = useState({});
  const [suggestedValues, setSuggestedValues] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchingUsername, setIsSearchingUsername] = useState(false);
  const [usernameResults, setUsernameResults] = useState([]);
  const [faceImage, setFaceImage] = useState(null);
  const [faceImagePreview, setFaceImagePreview] = useState(null);
  const [faceError, setFaceError] = useState("");
  const [isSearchingFace, setIsSearchingFace] = useState(false);
  const [faceResults, setFaceResults] = useState([]);

  const getPillar = (key) => {
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    const arr = value?.persona?.[key] || value?.pillars?.[key] || value?.pillars?.[capitalizedKey];
    return Array.isArray(arr) ? arr : (arr ? [arr] : []);
  };

  const data = {
    numInfluencers: value?.numInfluencers || value?.totalInfluencers || value?.sows?.[0]?.numInfluencers || "",
    followerReqFrom: value?.followerReqFrom || (value?.followerRequirement ? value.followerRequirement.split('-')[0]?.trim() : (value?.sows?.[0]?.followerReqFrom || "")),
    followerReqTo: value?.followerReqTo || (value?.followerRequirement ? value.followerRequirement.split('-')[1]?.trim() : (value?.sows?.[0]?.followerReqTo || "")),
    persona: { 
      demographic: getPillar("demographic"), 
      location: getPillar("location"), 
      occupation: getPillar("occupation"), 
      persona: getPillar("persona"), 
      contentCategory: getPillar("contentCategory"), 
      storyTelling: getPillar("storyTelling") 
    },
    referenceInfluencers: value?.referenceInfluencers || []
  };

  const handleManualEdit = (fieldPath, val) => {
    if (!editable) return;
    setManualEdits(prev => ({...prev, [fieldPath]: true}));
    
    if (fieldPath.includes('.')) {
      const [parent, child] = fieldPath.split('.');
      onChange({
        ...data,
        [parent]: { ...data[parent], [child]: val }
      });
    } else {
      onChange({ ...data, [fieldPath]: val });
    }
  };

  const updateReferences = (newRefs) => {
    if (!editable) return;
    
    const getTags = (str) => {
      if (!str) return [];
      if (Array.isArray(str)) return str;
      return str.split(',').map(s => s.trim()).filter(Boolean);
    };

    const aggregatedSuggestions = {
       "persona.demographic": [],
       "persona.location": [],
       "persona.occupation": [],
       "persona.persona": [],
       "persona.contentCategory": [],
       "persona.storyTelling": []
    };
    
    newRefs.forEach(r => {
        aggregatedSuggestions["persona.demographic"].push(...getTags(r.suggestedDemographic));
        aggregatedSuggestions["persona.location"].push(...getTags(r.suggestedLocation));
        aggregatedSuggestions["persona.occupation"].push(...getTags(r.suggestedOccupation));
        aggregatedSuggestions["persona.persona"].push(...(r.persona || []));
        aggregatedSuggestions["persona.contentCategory"].push(...(r.category || []));
        aggregatedSuggestions["persona.storyTelling"].push(...getTags(r.suggestedStoryTelling));
    });

    Object.keys(aggregatedSuggestions).forEach(k => {
      aggregatedSuggestions[k] = [...new Set(aggregatedSuggestions[k])];
    });
    
    if (newRefs.length > 0) {
      aggregatedSuggestions.followerReqFrom = newRefs[0].suggestedFollowerFrom || "";
      aggregatedSuggestions.followerReqTo = newRefs[0].suggestedFollowerTo || "";
    } else {
      aggregatedSuggestions.followerReqFrom = "";
      aggregatedSuggestions.followerReqTo = "";
    }

    setSuggestedValues(aggregatedSuggestions);
    
    const newData = { ...data, referenceInfluencers: newRefs };
    
    Object.keys(aggregatedSuggestions).forEach(key => {
      if (!manualEdits[key]) {
        if (key.includes('.')) {
          const [parent, child] = key.split('.');
          newData[parent] = { ...(newData[parent] || {}), [child]: aggregatedSuggestions[key] };
        } else {
          newData[key] = aggregatedSuggestions[key];
        }
      }
    });
    
    onChange(newData);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 0) handleUsernameSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleUsernameSearch = () => {
    setIsSearchingUsername(true);
    setTimeout(() => {
      setUsernameResults(MOCK_RESULTS.sort((a,b) => b.match - a.match));
      setIsSearchingUsername(false);
    }, 800);
  };

  const handleFaceUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setFaceError("Unsupported file format. Please upload JPG, JPEG, or PNG.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFaceError("File size exceeds 10 MB limit.");
      return;
    }
    setFaceError("");
    setFaceImage(file);
    setFaceImagePreview(URL.createObjectURL(file));
  };

  const handleFaceSearch = () => {
    setIsSearchingFace(true);
    setTimeout(() => {
      setFaceResults(MOCK_RESULTS.sort((a,b) => b.match - a.match));
      setIsSearchingFace(false);
    }, 1200);
  };

  const renderLabel = (label, fieldPath) => {
    const isSuggested = showSuggestionSource && !manualEdits[fieldPath] && suggestedValues[fieldPath] && 
                        (fieldPath.includes('.') 
                          ? data[fieldPath.split('.')[0]]?.[fieldPath.split('.')[1]] === suggestedValues[fieldPath] 
                          : data[fieldPath] === suggestedValues[fieldPath]);
    
    return (
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        {isSuggested && (
          <span className="text-[10px] font-semibold text-[#6D5DF6] bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Suggested from reference
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-xs overflow-hidden">
      {/* Left Column: Form */}
      <div className={`p-6 border-slate-100 relative ${editable ? 'md:w-1/2 md:border-r' : 'w-full'}`}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Number of Influencers</label>
            {editable ? (
              <input 
                type="number" 
                value={data.numInfluencers} 
                onChange={e => handleManualEdit("numInfluencers", e.target.value)} 
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
              />
            ) : (
              <div className="font-semibold text-slate-900">{data.numInfluencers || "-"}</div>
            )}
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">Follower Requirement</label>
              {showSuggestionSource && ((!manualEdits["followerReqFrom"] && suggestedValues["followerReqFrom"] && data.followerReqFrom === suggestedValues["followerReqFrom"]) || 
                (!manualEdits["followerReqTo"] && suggestedValues["followerReqTo"] && data.followerReqTo === suggestedValues["followerReqTo"])) && (
                <span className="text-[10px] font-semibold text-[#6D5DF6] bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Suggested from reference
                </span>
              )}
            </div>
            {editable ? (
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={data.followerReqFrom} onChange={e => handleManualEdit("followerReqFrom", e.target.value)} placeholder="From" className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6D5DF6] ${showSuggestionSource && !manualEdits["followerReqFrom"] && suggestedValues["followerReqFrom"] && data["followerReqFrom"] === suggestedValues["followerReqFrom"] ? 'border-[#6D5DF6] bg-violet-50/30' : 'border-slate-200'}`} />
                <input type="number" value={data.followerReqTo} onChange={e => handleManualEdit("followerReqTo", e.target.value)} placeholder="To" className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6D5DF6] ${showSuggestionSource && !manualEdits["followerReqTo"] && suggestedValues["followerReqTo"] && data["followerReqTo"] === suggestedValues["followerReqTo"] ? 'border-[#6D5DF6] bg-violet-50/30' : 'border-slate-200'}`} />
              </div>
            ) : (
              <div className="font-semibold text-slate-900">
                {data.followerReqFrom || "-"} to {data.followerReqTo || "-"}
              </div>
            )}
          </div>
          {[
            { label: "Demographic", field: "demographic" },
            { label: "Location", field: "location" },
            { label: "Occupation", field: "occupation" },
            { label: "Persona", field: "persona" },
            { label: "Content Category", field: "contentCategory" },
            { label: "Storytelling Styles", field: "storyTelling" },
          ].map(({ label, field }) => (
            <div key={field} className="md:col-span-2">
              {editable ? (
                <TagInput 
                  label={label} 
                  value={data.persona?.[field]} 
                  onChange={val => handleManualEdit(`persona.${field}`, val)} 
                  suggested={showSuggestionSource && !manualEdits[`persona.${field}`] && suggestedValues[`persona.${field}`]?.length > 0} 
                  onManualEdit={() => {}} 
                />
              ) : (
                <div>
                  <div className="mb-2 block text-sm font-medium text-slate-700">{label}</div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {data.persona?.[field]?.length > 0 ? (
                      data.persona[field].map((t, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-800 font-medium px-2.5 py-1 rounded-md text-sm border border-slate-200">
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-sm">-</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Selected References Detailed List */}
        {data.referenceInfluencers?.length > 0 && (
          <div className="mt-8 border-t border-slate-100 pt-6">
            <h3 className="text-sm font-bold text-slate-800 mb-4">{data.referenceInfluencers.length} Reference{data.referenceInfluencers.length > 1 ? 's' : ''} Selected</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.referenceInfluencers.map(ref => (
                <div key={ref.id} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 relative">
                  {editable && (
                    <button onClick={() => updateReferences(data.referenceInfluencers.filter(r => r.id !== ref.id))} className="absolute top-3 right-3 p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-md transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <img src={ref.avatar} alt="Avatar" className="h-12 w-12 rounded-full object-cover border border-slate-100 mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-800">{ref.username}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-medium">{ref.platform}</span>
                    </div>
                    <div className="text-xs text-slate-500 mb-2">{ref.followers} followers • {ref.engagement} ER</div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {ref.category?.map(c => <span key={c} className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md">{c}</span>)}
                      {ref.persona?.map(c => <span key={c} className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-md">{c}</span>)}
                    </div>
                    <a href={ref.profileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#6D5DF6] hover:underline flex items-center gap-1">
                      View Profile <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Reference Search */}
      {editable && (
        <div className="md:w-1/2 flex flex-col overflow-hidden bg-slate-50/50 min-h-[500px]">
          <div className="p-6 shrink-0 border-b border-slate-100 bg-white shadow-sm z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Reference Influencers <span className="text-xs font-normal text-slate-500">(Optional)</span></h3>
            </div>

            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg mb-6">
              <button onClick={() => setActiveTab("username")} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "username" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Search by Username</button>
              <button onClick={() => setActiveTab("face")} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "face" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Search by Face</button>
            </div>

            {activeTab === "username" && (
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleUsernameSearch()}
                  placeholder="Search influencer username" 
                  className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-20 py-2.5 text-sm outline-none focus:border-[#6D5DF6]" 
                />
                <div className="absolute right-2 flex items-center gap-1">
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(""); setUsernameResults([]); }} className="p-1 hover:bg-slate-100 rounded-full">
                      <X className="h-3 w-3 text-slate-400" />
                    </button>
                  )}
                  <button onClick={handleUsernameSearch} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-md">Search</button>
                </div>
              </div>
            )}

            {activeTab === "face" && (
              <div className="flex flex-col gap-3">
                {!faceImagePreview ? (
                  <div className="relative group border-2 border-dashed border-slate-200 hover:border-[#6D5DF6] rounded-xl p-6 text-center transition-colors bg-white">
                    <input type="file" accept="image/jpeg, image/png, image/jpg" onChange={handleFaceUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <UploadCloud className="mx-auto h-8 w-8 text-slate-400 group-hover:text-[#6D5DF6] mb-2 transition-colors" />
                    <div className="text-sm font-medium text-slate-700">Upload a clear face photo</div>
                    <div className="text-xs text-slate-400 mt-1">JPG, JPEG, PNG up to 10 MB</div>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl p-4 bg-white flex items-center gap-4">
                    <img src={faceImagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-slate-100" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-700 truncate">{faceImage.name}</div>
                      <div className="flex gap-3 mt-1">
                        <label className="text-xs font-semibold text-[#6D5DF6] cursor-pointer hover:underline">
                          Replace image
                          <input type="file" accept="image/jpeg, image/png, image/jpg" onChange={handleFaceUpload} className="hidden" />
                        </label>
                        <button onClick={() => { setFaceImage(null); setFaceImagePreview(null); setFaceResults([]); }} className="text-xs font-semibold text-rose-500 hover:underline">Remove image</button>
                      </div>
                    </div>
                  </div>
                )}
                {faceError && <div className="text-xs text-rose-500">{faceError}</div>}
                {faceImagePreview && (
                  <button onClick={handleFaceSearch} className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition-colors">
                    Find Similar Influencers
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-0 bg-slate-50/50">
            {(isSearchingUsername || isSearchingFace) && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-xl p-4 flex flex-col items-center">
                    <div className="h-16 w-16 bg-slate-200 rounded-full mb-3"></div>
                    <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 w-16 bg-slate-200 rounded mb-4"></div>
                    <div className="w-full h-8 bg-slate-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            )}

            {!isSearchingUsername && !isSearchingFace && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {(activeTab === "username" ? usernameResults : faceResults).slice(0, 6).map(res => {
                  const isSelected = data.referenceInfluencers?.some(r => r.id === res.id);
                  return (
                    <div key={res.id} className={`bg-white border rounded-xl p-4 flex flex-col items-center hover:shadow-md transition-all relative ${isSelected ? 'border-[#6D5DF6] ring-1 ring-[#6D5DF6]' : 'border-slate-200'}`}>
                      {isSelected && (
                        <div className="absolute top-3 left-3 h-5 w-5 bg-[#6D5DF6] text-white rounded-full flex items-center justify-center shadow-sm">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      {activeTab === "face" && (
                        <div className="absolute top-3 right-3 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-100">
                          {res.match}% Match
                        </div>
                      )}
                      <img src={res.avatar} alt="Avatar" className="h-14 w-14 rounded-full object-cover border border-slate-100 mb-2" />
                      <div className="text-sm font-bold text-slate-800">{res.username}</div>
                      <div className="text-xs text-slate-500 mb-3">{res.followers} followers • {res.engagement} ER</div>
                      <div className="flex flex-wrap justify-center gap-1 mb-4">
                        {res.category.map(c => <span key={c} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">{c}</span>)}
                        {res.persona.map(c => <span key={c} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">{c}</span>)}
                      </div>
                      <button 
                        onClick={() => {
                          if (isSelected) updateReferences(data.referenceInfluencers.filter(r => r.id !== res.id));
                          else updateReferences([...(data.referenceInfluencers || []), { ...res, source: activeTab }]);
                        }} 
                        className={`mt-auto w-full rounded-lg py-1.5 text-xs font-semibold transition-colors ${isSelected ? 'bg-violet-50 text-[#6D5DF6]' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                      >
                        {isSelected ? "Added" : "Add Reference"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            
            {!isSearchingUsername && !isSearchingFace && (activeTab === "username" ? usernameResults.length === 0 && searchQuery : faceResults.length === 0 && faceImagePreview) && (
              <div className="text-center py-10">
                <div className="text-sm text-slate-500">No matching influencers found.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
