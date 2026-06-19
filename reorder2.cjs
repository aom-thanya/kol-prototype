const fs = require('fs');
const file = './src/components/tracker/TrackerTable.jsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

const extractBlock = (startString, minLen = 1) => {
    let start = -1;
    let end = -1;
    let nesting = 0;
    
    for (let i = 0; i < lines.length; i++) {
        if (start === -1 && lines[i].includes(startString)) {
            start = i;
        }
        if (start !== -1 && i >= start) {
            // Count nesting of {} and ()? Better just count <td> and </td>
        }
    }
}
