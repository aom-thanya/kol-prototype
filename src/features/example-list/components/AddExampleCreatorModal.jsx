import { useState, useEffect } from "react";
import { X, Search, UploadCloud, Check, ExternalLink, SlidersHorizontal } from "lucide-react";
import TagInput from "../../briefs/components/TagInput";

const MOCK_RESULTS = [
  { id: 1, username: "@jane_doe", platform: "Instagram", profileUrl: "https://instagram.com/jane_doe", followers: "120K", engagement: "3.2%", category: ["Beauty", "Skincare", "Lifestyle"], persona: ["Trendy"], match: 95, avatar: "https://i.pravatar.cc/150?u=1", suggestedDemographic: "Female 18-24", suggestedLocation: "Bangkok", suggestedOccupation: "Student", suggestedStoryTelling: "Aesthetic Vlogs, Product Reviews" },
  { id: 2, username: "@john_smith", platform: "TikTok", profileUrl: "https://tiktok.com/@john_smith", followers: "45K", engagement: "4.5%", category: ["Tech"], persona: ["Geek"], match: 88, avatar: "https://i.pravatar.cc/150?u=2", suggestedDemographic: "Male 18-34", suggestedLocation: "Urban Cities", suggestedOccupation: "Tech Professional", suggestedStoryTelling: "Gadget Unboxing, Tutorials" },
  { id: 3, username: "@foodie_bkk", platform: "Facebook", profileUrl: "https://facebook.com/foodiebkk", followers: "250K", engagement: "2.1%", category: ["Food"], persona: ["Friendly"], match: 82, avatar: "https://i.pravatar.cc/150?u=3", suggestedDemographic: "All 25-45", suggestedLocation: "Thailand", suggestedOccupation: "Any", suggestedStoryTelling: "Cafe Hopping, Honest Reviews" },
  { id: 4, username: "@travel_wander", platform: "Instagram", profileUrl: "https://instagram.com/travel_wander", followers: "80K", engagement: "5.0%", category: ["Travel"], persona: ["Adventurous"], match: 75, avatar: "https://i.pravatar.cc/150?u=4", suggestedDemographic: "All 20-35", suggestedLocation: "Global", suggestedOccupation: "Freelancer", suggestedStoryTelling: "Cinematic, Adventure Story" },
  { id: 5, username: "@fit_guru", platform: "YouTube", profileUrl: "https://youtube.com/fitguru", followers: "300K", engagement: "1.8%", category: ["Fitness", "Health"], persona: ["Motivator"], match: 60, avatar: "https://i.pravatar.cc/150?u=5", suggestedDemographic: "Male 25-40", suggestedLocation: "City", suggestedOccupation: "Office Worker", suggestedStoryTelling: "Workout Routine, Diet Plan" },
  { id: 6, username: "@pet_lover", platform: "TikTok", profileUrl: "https://tiktok.com/@pet_lover", followers: "15K", engagement: "8.9%", category: ["Pets"], persona: ["Cute"], match: 55, avatar: "https://i.pravatar.cc/150?u=6", suggestedDemographic: "Female 13-24", suggestedLocation: "Suburbs", suggestedOccupation: "Student", suggestedStoryTelling: "Funny Pet Moments" },
  { id: 7, username: "@skincare_junkie", platform: "TikTok", profileUrl: "https://tiktok.com/@skincare_junkie", followers: "500K", engagement: "6.2%", category: ["Skincare", "Beauty"], persona: ["Expert"], match: 92, avatar: "https://i.pravatar.cc/150?u=7", suggestedDemographic: "Female 18-35", suggestedLocation: "Bangkok", suggestedOccupation: "Any", suggestedStoryTelling: "Reviews, Skincare Routine" },
];

export default function AddExampleCreatorModal({ open, onClose, onSave, initialCreators = [], pillar = "", group = null }) {
  const [selectedCreators, setSelectedCreators] = useState([]);
  const [activeTab, setActiveTab] = useState("username");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchingUsername, setIsSearchingUsername] = useState(false);
  const [usernameResults, setUsernameResults] = useState([]);
  const [faceImage, setFaceImage] = useState(null);
  const [faceImagePreview, setFaceImagePreview] = useState(null);
  const [faceError, setFaceError] = useState("");
  const [isSearchingFace, setIsSearchingFace] = useState(false);
  const [faceResults, setFaceResults] = useState([]);
  const [hasSearchedUsername, setHasSearchedUsername] = useState(false);
  const [hasSearchedFace, setHasSearchedFace] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Advanced Filters
  const [filterDemographic, setFilterDemographic] = useState([]);
  const [filterLocation, setFilterLocation] = useState([]);
  const [filterOccupation, setFilterOccupation] = useState([]);
  const [filterPersona, setFilterPersona] = useState([]);
  const [filterCategory, setFilterCategory] = useState([]);
  const [filterStorytelling, setFilterStorytelling] = useState([]);

  useEffect(() => {
    if (open) {
      setSelectedCreators(initialCreators || []);
      setUsernameResults([]);
      setFaceResults([]);
      setHasSearchedUsername(false);
      setHasSearchedFace(false);
      setSearchQuery("");
      setFaceImage(null);
      setFaceImagePreview(null);

      // Set default filters from group data
      setFilterDemographic(group?.persona?.demographic || []);
      setFilterLocation(group?.persona?.location || []);
      setFilterOccupation(group?.persona?.occupation || []);
      setFilterPersona(group?.persona?.persona || []);
      setFilterCategory(group?.persona?.contentCategory || []);
      setFilterStorytelling(group?.persona?.storyTelling || []);
    }
  }, [open, initialCreators, group]);

  if (!open) return null;

  const applyFilters = (results) => {
    return results.filter(res => {
      const matchTags = (itemTags, filterTags) => {
        if (!filterTags || filterTags.length === 0) return true;
        if (!itemTags) return false;
        const itemTagsLower = Array.isArray(itemTags) ? itemTags.map(t => t.toLowerCase()) : String(itemTags).toLowerCase();
        return filterTags.some(ft => {
          const ftLower = ft.toLowerCase();
          return Array.isArray(itemTagsLower) 
            ? itemTagsLower.some(it => it.includes(ftLower))
            : itemTagsLower.includes(ftLower);
        });
      };

      const matchesDemographic = matchTags(res.suggestedDemographic, filterDemographic);
      const matchesLocation = matchTags(res.suggestedLocation, filterLocation);
      const matchesOccupation = matchTags(res.suggestedOccupation, filterOccupation);
      const matchesPersona = matchTags(res.persona, filterPersona);
      const matchesCategory = matchTags(res.category, filterCategory);
      const matchesStorytelling = matchTags(res.suggestedStoryTelling, filterStorytelling);

      return matchesDemographic && matchesLocation && matchesOccupation && matchesPersona && matchesCategory && matchesStorytelling;
    });
  };

  const handleUsernameSearch = () => {
    setIsSearchingUsername(true);
    setTimeout(() => {
      let filtered = MOCK_RESULTS;
      if (searchQuery) {
        filtered = filtered.filter(res => res.username.toLowerCase().includes(searchQuery.toLowerCase()));
      } else if (pillar) {
        const normalizedPillar = String(pillar).toLowerCase();
        filtered = filtered.filter(res => res.category.some(c => c.toLowerCase().includes(normalizedPillar)) || res.persona.some(p => p.toLowerCase().includes(normalizedPillar)));
      }
      
      filtered = applyFilters(filtered);

      setUsernameResults(filtered.sort((a,b) => b.match - a.match));
      setIsSearchingUsername(false);
      setHasSearchedUsername(true);
    }, 600);
  };

  const handleFaceUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFaceError("File size exceeds 10MB");
        return;
      }
      setFaceError("");
      setFaceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setFaceImagePreview(reader.result);
      reader.readAsDataURL(file);
      setFaceResults([]);
      setHasSearchedFace(false);
    }
  };

  const handleFaceSearch = () => {
    setIsSearchingFace(true);
    setTimeout(() => {
      let filtered = MOCK_RESULTS;
      if (pillar) {
        const normalizedPillar = String(pillar).toLowerCase();
        filtered = filtered.filter(res => res.category.some(c => c.toLowerCase().includes(normalizedPillar)) || res.persona.some(p => p.toLowerCase().includes(normalizedPillar)));
      }
      
      filtered = applyFilters(filtered);
      
      setFaceResults((filtered.length > 0 ? filtered : MOCK_RESULTS).sort((a,b) => b.match - a.match));
      setIsSearchingFace(false);
      setHasSearchedFace(true);
    }, 1200);
  };

  const toggleCreator = (creator) => {
    const isSelected = selectedCreators.some(c => c.id === creator.id);
    if (isSelected) {
      setSelectedCreators(selectedCreators.filter(c => c.id !== creator.id));
    } else {
      setSelectedCreators([...selectedCreators, creator]);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-[95vw] max-w-[1600px] max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 p-4 shrink-0 bg-white">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Add Example Creators</h2>
            {pillar && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-slate-500">Suggested by Pillar:</span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">
                  {pillar}
                </span>
              </div>
            )}
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row bg-slate-50">
          
          {/* Left Column: Selected Creators */}
          <div className="w-full md:w-1/3 bg-white border-r border-slate-100 p-6 flex flex-col overflow-y-auto min-h-full">
            <h3 className="text-sm font-bold text-slate-800 mb-4">{selectedCreators.length} Creator{selectedCreators.length !== 1 ? 's' : ''} Selected</h3>
            
            {selectedCreators.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-10">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                  <Check className="w-5 h-5 text-slate-300" />
                </div>
                <p className="text-sm text-center">No creators selected yet.</p>
                <p className="text-xs text-center mt-1">Search and add creators from the right panel.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {selectedCreators.map(creator => (
                  <div key={creator.id} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 relative">
                    <button 
                      onClick={() => toggleCreator(creator)} 
                      className="absolute top-3 right-3 p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-md transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <img src={creator.avatar} alt="Avatar" className="h-12 w-12 rounded-full object-cover border border-slate-100 mt-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 pr-6">
                        <span className="text-sm font-bold text-slate-800 truncate">{creator.username}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-medium shrink-0">{creator.platform}</span>
                      </div>
                      <div className="text-xs text-slate-500 mb-2">{creator.followers} followers • {creator.engagement} ER</div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {creator.category?.map(c => <span key={c} className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md">{c}</span>)}
                        {creator.persona?.map(c => <span key={c} className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-md">{c}</span>)}
                      </div>
                      <a href={creator.profileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#6D5DF6] hover:underline flex w-max items-center gap-1">
                        View Profile <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Search Interface */}
          <div className="w-full md:w-2/3 p-6 flex flex-col bg-slate-50/50 min-h-full">
            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg mb-6 max-w-md mx-auto w-full">
              <button onClick={() => setActiveTab("username")} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "username" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Search by Username</button>
              <button onClick={() => setActiveTab("face")} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "face" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Search by Face</button>
            </div>

            {/* Advanced Filters Section */}
            <div className="mb-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                  <h3 className="text-sm font-bold text-slate-800">Advanced Filters</h3>
                </div>
                <button className="text-xs font-semibold text-[#6D5DF6] hover:underline">
                  {showFilters ? "Hide" : "Show"}
                </button>
              </div>
              
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <TagInput label="Demographic" value={filterDemographic} onChange={setFilterDemographic} />
                  <TagInput label="Location" value={filterLocation} onChange={setFilterLocation} />
                  <TagInput label="Occupation" value={filterOccupation} onChange={setFilterOccupation} />
                  <TagInput label="Tone / Persona" value={filterPersona} onChange={setFilterPersona} />
                  <TagInput label="Content Category" value={filterCategory} onChange={setFilterCategory} />
                  <TagInput label="Storytelling" value={filterStorytelling} onChange={setFilterStorytelling} />
                </div>
              )}
            </div>

            {activeTab === "username" && (
              <div className="relative flex items-center mb-6 w-full max-w-2xl mx-auto">
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
                    <button onClick={() => { setSearchQuery(""); handleUsernameSearch(); }} className="p-1 hover:bg-slate-100 rounded-full">
                      <X className="h-3 w-3 text-slate-400" />
                    </button>
                  )}
                  <button onClick={handleUsernameSearch} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-md">Search</button>
                </div>
              </div>
            )}

            {activeTab === "face" && (
              <div className="flex flex-col gap-3 mb-6 max-w-md mx-auto">
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

            {(isSearchingUsername || isSearchingFace) && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1,2,3].map(i => (
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(activeTab === "username" ? usernameResults : faceResults).map(res => {
                  const isSelected = selectedCreators.some(c => c.id === res.id);
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
                        onClick={() => toggleCreator(res)} 
                        className={`mt-auto w-full rounded-lg py-1.5 text-xs font-semibold transition-colors ${isSelected ? 'bg-violet-50 text-[#6D5DF6]' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                      >
                        {isSelected ? "Added" : "Add Creator"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            
            {!isSearchingUsername && !isSearchingFace && (
              activeTab === "username" 
                ? (hasSearchedUsername && usernameResults.length === 0) 
                : (hasSearchedFace && faceResults.length === 0 && faceImagePreview)
            ) && (
              <div className="text-center py-10">
                <div className="text-sm text-slate-500">No matching influencers found.</div>
              </div>
            )}
            
            {!isSearchingUsername && !isSearchingFace && (
              activeTab === "username"
                ? (!hasSearchedUsername)
                : (!hasSearchedFace && faceImagePreview)
            ) && (
              <div className="text-center py-10">
                <div className="text-sm text-slate-500">Click Search to find creators.</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-slate-100 p-4 bg-white shrink-0 gap-3">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
          <button type="button" onClick={() => { onSave(selectedCreators); onClose(); }} className="rounded-lg bg-[#6D5DF6] px-5 py-2 text-sm font-semibold text-white hover:bg-[#5b4df0] shadow-sm">Save List</button>
        </div>
      </div>
    </div>
  );
}
