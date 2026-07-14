const fs = require('fs');
let content = fs.readFileSync('src/components/brief/RateCardListPage.jsx', 'utf8');

if (!content.includes('import Stepper')) {
  content = content.replace('import EmptyState', 'import EmptyState from "../common/EmptyState";\nimport Stepper');
}

const startString = '{/* Step Progress Component (Compact) */}';
const startIdx = content.indexOf(startString);
const endString = '{/* Brief Info display for Step 1 */}';
const endIdx = content.indexOf(endString);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `<Stepper 
              steps={stepsOrder} 
              currentStepIndex={currentStepIdx} 
              onStepClick={(index) => handleUpdateStatus(stepsOrder[index])} 
            />

            `;
  content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
  fs.writeFileSync('src/components/brief/RateCardListPage.jsx', content);
  console.log('Stepper replaced in RateCardListPage');
} else {
  console.log('Could not find boundaries');
}
