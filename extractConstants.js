const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');
const lines = content.split('\n');

const constantLines = lines.slice(36, 230); // 0-indexed, so 37-230
const appConstantsContent = `export ` + constantLines.join('\n').replace(/^const /gm, 'export const ');

fs.writeFileSync('src/constants/appConstants.js', appConstantsContent);

// Remove those lines from App.jsx and add import
const remainingLines = [
  ...lines.slice(0, 36),
  `import { primary, planners, buyers, exampleListsSeed, influencerSeed } from "./constants/appConstants";`,
  ...lines.slice(230)
];

fs.writeFileSync('src/App.jsx', remainingLines.join('\n'));
