import { useRef, useEffect } from "react";

export default function SimpleHtmlEditor({ value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    onChange(editorRef.current.innerHTML);
  };

  const exec = (cmd, arg = null) => {
    document.execCommand(cmd, false, arg);
    editorRef.current.focus();
  };

  const addLink = () => {
    const url = prompt("Enter the link URL:");
    if (url) exec("createLink", url);
  };

  const addImage = () => {
    const url = prompt("Enter the image URL:");
    if (url) exec("insertImage", url);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
        <button type="button" onClick={() => exec('bold')} className="rounded p-1 text-slate-600 hover:bg-slate-200 font-bold w-7 h-7 flex items-center justify-center">B</button>
        <button type="button" onClick={() => exec('italic')} className="rounded p-1 text-slate-600 hover:bg-slate-200 italic w-7 h-7 flex items-center justify-center">I</button>
        <button type="button" onClick={() => exec('underline')} className="rounded p-1 text-slate-600 hover:bg-slate-200 underline w-7 h-7 flex items-center justify-center">U</button>
        <div className="w-px h-4 bg-slate-300 mx-1"></div>
        <button type="button" onClick={() => exec('insertUnorderedList')} className="rounded px-2 py-1 text-slate-600 hover:bg-slate-200 text-xs font-medium">Bullet List</button>
        <div className="w-px h-4 bg-slate-300 mx-1"></div>
        <button type="button" onClick={addLink} className="rounded px-2 py-1 text-slate-600 hover:bg-slate-200 text-xs font-medium">Link</button>
        <button type="button" onClick={addImage} className="rounded px-2 py-1 text-slate-600 hover:bg-slate-200 text-xs font-medium">Image</button>
      </div>
      <div 
        ref={editorRef}
        contentEditable 
        onInput={handleInput}
        className="min-h-[120px] max-h-[300px] overflow-y-auto p-4 text-sm outline-none"
      />
    </div>
  );
}
