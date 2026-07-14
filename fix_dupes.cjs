const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.jsx');
const targetLine = 'import React, { useState, useEffect, useMemo, useRef } from "react";';

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let lines = content.split('\n');
  
  let count = 0;
  let newLines = [];
  
  for (const line of lines) {
    if (line === targetLine) {
      count++;
      if (count === 1) {
        newLines.push(line);
      }
    } else {
      newLines.push(line);
    }
  }
  
  if (count > 1) {
    fs.writeFileSync(file, newLines.join('\n'));
    console.log('Fixed', file, 'removed', count - 1, 'duplicates');
  }
}
