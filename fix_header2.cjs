const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace("onNavigateTab('admin')", "setCurrentTab('admin')");

fs.writeFileSync('src/components/Header.tsx', code);
console.log('Fixed header 2');
