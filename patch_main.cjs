const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');

// remove the block from // Prevent browser extension ... to just before createRoot
code = code.replace(/\/\/ Prevent browser extension injection rejections[\s\S]*?(?=createRoot)/, '');

fs.writeFileSync('src/main.tsx', code);
