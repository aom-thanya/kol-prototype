const fs = require('fs');
const file = './src/components/tracker/TrackerTable.jsx';
const code = fs.readFileSync(file, 'utf8');

const lines = code.split('\n');

const sliceBlock = (startMatch, endMatch, minStart = 0) => {
    let start = -1;
    let end = -1;
    for(let i = minStart; i < lines.length; i++) {
        if(lines[i].includes(startMatch) && start === -1) {
            start = i;
        }
        if(start !== -1 && lines[i].includes(endMatch)) {
            end = i;
            break;
        }
    }
    return lines.slice(start, end + 1).join('\n');
};

const B = sliceBlock('<td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs min-w-[280px] align-top">', ')}</td>', 580); // Contact
const C1 = sliceBlock('<td className="px-3 py-2 border-r border-slate-100 text-center align-middle relative">', '</td>', 540); // Status
const C2 = sliceBlock('<td className="px-3 py-2 border-r border-slate-100 text-center align-middle">', '</td>', 540); // Lot
const D = sliceBlock('const matchingSow = submittedSows.find(s => s.id === inf.scopeOfWork);', '</td>', 540); // SOW
const D_full = `<td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs min-w-[200px] max-w-[280px] whitespace-normal align-top">\n                      <div className="text-slate-600 font-medium leading-relaxed">\n                        {(() => {\n                          ${D}`;
const E = sliceBlock('<input type="text" value={inf.rawCost || ""} disabled={readOnly}', '</td>', 540); // Cost
const E_full = `<td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs align-top">\n                      {readOnly ? (\n                        <span>{inf.rawCost || "-"}</span>\n                      ) : (\n                        ${E}`;
const F = sliceBlock('{requiredServices.map(srv => {', '})}'); // Services
const G = sliceBlock('{(group.questions || []).map((q, idx) => (', '))}'); // Questions
const H = sliceBlock('{brandSupports.map(bs => (', '))}'); // BrandSupports
const I = sliceBlock('{hasCompetitor && (', ')}', 800); // Competitor Note (wait, we need to match the specific one)
const J1 = sliceBlock('<span>{inf.creditTerm ? `${inf.creditTerm} วัน` : "-"}</span>', '</td>', 690); // Credit Term
const J1_full = `<td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs">\n                      {readOnly ? (\n                        ${J1}`;
const J2 = sliceBlock('<span>{inf.paymentType || "-"}</span>', '</td>', 690); // Payment Type
const J2_full = `<td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs">\n                      {readOnly ? (\n                        ${J2}`;
const K = sliceBlock('textarea rows={6} value={inf.condition', '</td>', 770); // Condition
const K_full = `<td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs min-w-[400px] max-w-[600px] whitespace-pre-wrap leading-relaxed">\n                      {readOnly ? (\n                        inf.condition || "-"\n                      ) : (\n                        ${K}`;
const L = sliceBlock('textarea rows={3} value={inf.note', '</td>', 810); // Note
const L_full = `<td className="px-3 py-2 border-slate-100 text-slate-700 text-xs min-w-[180px] whitespace-pre-wrap">\n                      {readOnly ? (\n                        inf.note || "-"\n                      ) : (\n                        ${L}`;

const newContent = [
    B, C1, C2, D_full, E_full, F, G, H, I, J1_full, J2_full, K_full, L_full
].join('\n');

const startIdx = lines.findIndex(l => l.includes('<td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs min-w-[200px] max-w-[280px] whitespace-normal align-top">'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('</tr>'));

if (startIdx !== -1 && endIdx !== -1) {
    const before = lines.slice(0, startIdx).join('\n');
    const after = lines.slice(endIdx).join('\n');
    fs.writeFileSync(file, before + '\n' + newContent + '\n                  ' + after);
    console.log("Successfully replaced block");
} else {
    console.log("Could not find start or end index");
}
