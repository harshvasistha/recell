const fs = require('fs');
let code = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

code = code.replace("role: isAdmin ? 'admin' : 'customer' as const,", "role: (isAdmin ? 'admin' : 'customer') as 'admin' | 'customer',");
code = code.replace("role: userProfileData.role,", "role: userProfileData.role,"); // No change needed if typed correctly above

fs.writeFileSync('src/components/AuthModal.tsx', code);
