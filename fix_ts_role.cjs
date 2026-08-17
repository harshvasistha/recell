const fs = require('fs');
let code = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

code = code.replace(
  "const userProfileData =",
  "const userProfileData: import('../lib/dbService').UserProfile ="
);

fs.writeFileSync('src/components/AuthModal.tsx', code);
