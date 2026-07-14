const fs = require('fs');
const { execSync } = require('child_process');

try {
  execSync('npx eslint src/**/*.jsx src/**/*.js --format json -o lint_output.json', { stdio: 'ignore' });
} catch (e) {
  // eslint usually exits with 1 if there are errors
}

const data = JSON.parse(fs.readFileSync('lint_output.json', 'utf8'));

for (const result of data) {
  const filePath = result.filePath;
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split('\n');

  // We sort errors by line number descending so we don't mess up line numbers when deleting
  const errors = result.messages
    .filter(m => m.ruleId === 'no-unused-vars' || m.ruleId === 'react/jsx-no-undef' || m.ruleId === 'no-undef')
    .sort((a, b) => b.line - a.line);

  for (const error of errors) {
    if (error.ruleId === 'no-undef' && error.message.includes('useState')) {
       // if useState is missing, add it to the top
       if (!content.includes('import { useState } from "react"')) {
           lines.unshift('import React, { useState, useEffect, useMemo, useRef } from "react";');
       }
    }
  }
  
  content = lines.join('\n');
  fs.writeFileSync(filePath, content);
}

// Now let's just make sure AppShell and Sidebar have React imports.
const ensureImports = (file) => {
   if(fs.existsSync(file)) {
      let code = fs.readFileSync(file, 'utf8');
      if(!code.includes('import React') && !code.includes('import { useState')) {
          code = 'import React, { useState, useEffect, useMemo, useRef } from "react";\n' + code;
          fs.writeFileSync(file, code);
      }
   }
}
ensureImports('src/components/layout/AppShell.jsx');
ensureImports('src/components/layout/Sidebar.jsx');
ensureImports('src/features/briefs/components/TagInput.jsx');
ensureImports('src/features/briefs/components/AddRequestModal.jsx');
ensureImports('src/features/briefs/components/ReviewChangeModal.jsx');
ensureImports('src/features/briefs/components/BriefFormModal.jsx');
ensureImports('src/features/briefs/components/InfluencerDetailModal.jsx');

