const fs = require('fs');
const file = './src/components/tracker/TrackerTable.jsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

const getBlock = (startMatch, endMatch, minIndex = 0) => {
    let start = -1;
    let end = -1;
    for (let i = minIndex; i < lines.length; i++) {
        if (start === -1 && lines[i].includes(startMatch)) start = i;
        if (start !== -1 && lines[i].includes(endMatch)) { end = i; break; }
    }
    return { start, end, text: lines.slice(start, end + 1).join('\n') };
}

const b_status = getBlock('<td className="px-3 py-2 border-r border-slate-100 text-center align-middle relative">', '</td>', 520); // 525-547
const b_lot = getBlock('<td className="px-3 py-2 border-r border-slate-100 text-center align-middle">', '</td>', 545); // 548-554
const b_contact = getBlock('<td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs min-w-[280px] align-top">', '</td>', 550); // 555-653
const b_cost = getBlock('<td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs">', '</td>', 650); // 654-660
const b_credit = getBlock('<td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs">', '</td>', 661); // 661-667
const b_payment = getBlock('<td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs">', '</td>', 668); // 668-678
const b_services = getBlock('{requiredServices.map(srv => {', '})}'); // 679-749
const b_sow = getBlock('<td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs min-w-[200px] max-w-[280px] whitespace-normal">', '</td>', 740); // 750-758
const b_condition = getBlock('<td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-xs min-w-[400px] max-w-[600px] whitespace-pre-wrap leading-relaxed">', '</td>', 750); // 759-765
const b_questions = getBlock('{(group.questions || []).map((q, idx) => (', '))}'); // 766-774
const b_brand = getBlock('{brandSupports.map(bs => (', '))}'); // 775-783
const b_competitor = getBlock('{hasCompetitor && (', ')}', 780); // 784-792
// Wait! b_competitor will end prematurely on the `)}` of the inner ternary expression! 
// Let's use getBlock with a different logic for competitor.
