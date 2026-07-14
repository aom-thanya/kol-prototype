import fs from 'fs';

const path = './src/data/mockData.js';
let content = fs.readFileSync(path, 'utf8');

const lastBracketIndex = content.lastIndexOf('];');

if (lastBracketIndex !== -1) {
  const regex = /{\s*"id":\s*"BRD-2193",[\s\S]*?(?=\n  },\n  {\n\s*"id"|\n];)/g;
  let matches = [...content.matchAll(regex)];
  
  if (matches.length > 0) {
    let template = matches[0][0];
    
    // Fix template closing brace since the lookahead doesn't consume it
    template = template + '\n  }';
    
    let newBrief1 = template.replace(/"id":\s*"BRD-2193"/, '"id": "BRD-2D-MOCK"').replace(/"campaignName":\s*"Mega Bangna Event"/, '"campaignName": "Rate Card (2 D)"');
    let newBrief2 = template.replace(/"id":\s*"BRD-2193"/, '"id": "BRD-KPI-MOCK"').replace(/"campaignName":\s*"Mega Bangna Event"/, '"campaignName": "Ratecard KPI"');

    const newContent = content.slice(0, lastBracketIndex) + `,\n  ${newBrief1},\n  ${newBrief2}\n];` + content.slice(lastBracketIndex + 2);
    fs.writeFileSync(path, newContent, 'utf8');
    console.log("Appended new briefs to the end.");
  } else {
    console.log("Could not find BRD-2193");
  }
}
