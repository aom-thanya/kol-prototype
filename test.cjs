const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.js', 'utf8');
const index = content.indexOf('export const briefsSeed = [');
const arrayStr = content.substring(index + 'export const briefsSeed = '.length).trim().replace(/;$/, '');
let briefs = eval('(' + arrayStr + ')');
const b = briefs.find(b => b.id === 'BRD-2193');
console.log(JSON.stringify(b.groups, null, 2));
console.log(Object.keys(b.groupTrackers));
