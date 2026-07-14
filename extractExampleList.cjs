const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// The App.jsx currently has imports, PlatformBadge, Button, Toast, ListingPage, DetailPage, etc.
// All of these up to export default function App() { belong to ExampleListFlow.
// Let's split it.
const appIndex = content.indexOf('export default function App() {');
if (appIndex === -1) throw new Error('Could not find App function');

const componentsCode = content.substring(content.indexOf('function PlatformBadge'), appIndex);
const appCode = content.substring(appIndex);

const exampleListCode = `import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, Plus, Copy, Trash2, Eye, Download, Users, CheckCircle2, 
  X, ChevronDown, ArrowUpDown, ClipboardList, Compass, Filter, 
  UserPlus, ExternalLink, Loader2, FileText, DollarSign, CreditCard, 
  ChevronRight, ChevronLeft 
} from "lucide-react";
import { primary, planners, buyers, exampleListsSeed, influencerSeed } from "../../constants/appConstants";
import { cn, formatNumber } from "../../utils/helpers";

` + componentsCode + `

export default function ExampleListFlow() {
  const [lists, setLists] = useState(exampleListsSeed);
  const [viewState, setViewState] = useState({ mode: "list", selectedId: null });
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleDuplicate = (id) => {
    const listToDup = lists.find((l) => l.id === id);
    if (!listToDup) return;
    const newList = {
      ...listToDup,
      id: "EXL" + Math.floor(Math.random() * 1000000000),
      name: listToDup.name + " (Copy)",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setLists([newList, ...lists]);
    showToast("List duplicated successfully.");
  };

  const handleCreate = (data) => {
    const newList = {
      id: "EXL" + Math.floor(Math.random() * 1000000000),
      name: data.name,
      group: data.group,
      buyer: data.buyer,
      planner: data.planner,
      description: data.description,
      createdAt: new Date().toISOString().split("T")[0],
      cover: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    };
    setLists([newList, ...lists]);
    showToast("List created successfully.");
  };

  return (
    <div className="mx-auto max-w-6xl">
      {viewState.mode === "list" ? (
        <ListingPage
          lists={lists}
          onView={(id) => setViewState({ mode: "detail", selectedId: id })}
          onDuplicate={handleDuplicate}
          onCreate={handleCreate}
        />
      ) : (
        <DetailPage
          list={lists.find((l) => l.id === viewState.selectedId)}
          onBack={() => setViewState({ mode: "list", selectedId: null })}
          showToast={showToast}
        />
      )}
      {toastMsg && <Toast toast={toastMsg} onClose={() => setToastMsg("")} />}
    </div>
  );
}
`;

fs.writeFileSync('src/features/example-list/ExampleListFlow.jsx', exampleListCode);

// Now update App.jsx
// We need to keep the imports at the top and just leave the App function
const importsCode = content.substring(0, content.indexOf('function PlatformBadge'));

const newAppCode = importsCode + `
import ExampleListFlow from "./features/example-list/ExampleListFlow";

` + content.substring(appIndex).replace(/<ExampleListFlow \/>/g, '<ExampleListFlow />'); // Assuming it was already rendered somehow, or wait, it was inline inside App.jsx!
// Let's see how ExampleListFlow was rendered in App.jsx.

// Oh, I need to check how it was rendered.
