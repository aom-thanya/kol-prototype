const fs = require('fs');
let content = fs.readFileSync('src/features/briefs/components/BriefFormModal.jsx', 'utf8');

if (!content.includes('import Stepper')) {
  content = content.replace('import Modal', 'import Modal from "../../../components/common/Modal";\nimport Stepper');
}

const target = `            {!initialData && (
              <div className="h-1 w-full bg-slate-100">
                <motion.div 
                  className="h-full bg-[#6D5DF6]"
                  initial={{ width: 0 }}
                  animate={{ width: \`\${(currentStep / totalSteps) * 100}%\` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}`;

const replacement = `            {!initialData && (
              <div className="border-b border-slate-100 bg-slate-50/50">
                <Stepper 
                  steps={["Client & Project", "Budget & SOW", "Support & Conditions"]}
                  currentStepIndex={currentStep - 1}
                />
              </div>
            )}`;

content = content.replace(target, replacement);

fs.writeFileSync('src/features/briefs/components/BriefFormModal.jsx', content);
