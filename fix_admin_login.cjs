const fs = require('fs');
let code = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

code = code.replace(
  "role: 'customer' as const,",
  "role: (email.trim() === 'admin@recell.in' || phone.includes('9310552055')) ? 'admin' : 'customer',"
);

code = code.replace(
  "role: 'customer',",
  "role: (email.trim() === 'admin@recell.in' || phone.includes('9310552055')) ? 'admin' : 'customer',"
);

fs.writeFileSync('src/components/AuthModal.tsx', code);
console.log('Fixed admin login');
