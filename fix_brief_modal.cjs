const fs = require('fs');

let content = fs.readFileSync('src/features/briefs/components/BriefFormModal.jsx', 'utf8');

// Add import
if (!content.includes('import Modal from')) {
  content = content.replace('import Button', 'import Modal from "../../../components/common/Modal";\nimport Button');
}

// Replace the markup
const oldMarkup = `<AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        >`;

const headerMarkup = `<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{initialData ? \`Edit Section \${currentStep}\` : "Create New Brief"}</h2>
              {!initialData && <div className="text-sm font-medium text-slate-500 mt-1">Step {currentStep} of {totalSteps}</div>}
            </div>
            <button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {!initialData && (
            <div className="h-1 w-full bg-slate-100">
              <motion.div 
                className="h-full bg-[#6D5DF6]"
                initial={{ width: 0 }}
                animate={{ width: \`\${(currentStep / totalSteps) * 100}%\` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}`;

const newMarkup = `<Modal
        isOpen={open}
        onClose={onClose}
        maxWidth="max-w-4xl"
        className="h-[90vh]"
        header={(
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{initialData ? \`Edit Section \${currentStep}\` : "Create New Brief"}</h2>
                {!initialData && <div className="text-sm font-medium text-slate-500 mt-1">Step {currentStep} of {totalSteps}</div>}
              </div>
              <button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            {!initialData && (
              <div className="h-1 w-full bg-slate-100">
                <motion.div 
                  className="h-full bg-[#6D5DF6]"
                  initial={{ width: 0 }}
                  animate={{ width: \`\${(currentStep / totalSteps) * 100}%\` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </div>
        )}
      >`;

const target = oldMarkup + '\n          ' + headerMarkup;

content = content.replace(target, newMarkup);

// Fix the closing tags
content = content.replace(`          </div>
        </motion.div>
      </div>
      </AnimatePresence>`, `          </div>
      </Modal>`);

fs.writeFileSync('src/features/briefs/components/BriefFormModal.jsx', content);
