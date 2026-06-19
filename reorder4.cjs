const fs = require('fs');
const file = './src/components/tracker/TrackerTable.jsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

// Block ranges (1-indexed, we'll convert to 0-indexed in code)
const blocks = {
    contact: [555, 653],
    status: [525, 547],
    lot: [548, 554],
    sow: [750, 758],
    cost: [654, 660],
    services: [679, 749],
    questions: [766, 774],
    brand: [775, 783],
    competitor: [784, 792],
    credit: [661, 667],
    payment: [668, 678],
    condition: [759, 765],
    note: [800, 806]
};

const getLines = (range) => lines.slice(range[0] - 1, range[1]).join('\n');

const newSequence = [
    getLines(blocks.contact),
    getLines(blocks.status),
    getLines(blocks.lot),
    getLines(blocks.sow),
    getLines(blocks.cost),
    getLines(blocks.services),
    getLines(blocks.questions),
    getLines(blocks.brand),
    getLines(blocks.competitor),
    getLines(blocks.credit),
    getLines(blocks.payment),
    getLines(blocks.condition),
    getLines(blocks.note)
].join('\n');

const startIdx = 525 - 1;
const endIdx = 806 - 1;

const newLines = lines.slice(0, startIdx).join('\n') + '\n' + newSequence + '\n' + lines.slice(endIdx + 1).join('\n');

fs.writeFileSync(file, newLines);
console.log("File updated successfully.");
