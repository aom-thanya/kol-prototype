const fs = require('fs');
const content = fs.readFileSync('src/components/tracker/TrackerTable.jsx', 'utf8');
const readOnlyIndex = content.indexOf('disabled={readOnly}');
console.log("Found disabled={readOnly} at index", readOnlyIndex);
