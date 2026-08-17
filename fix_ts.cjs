const fs = require('fs');
let code = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

code = code.replace(/window\.recaptchaVerifier/g, '(window as any).recaptchaVerifier');

fs.writeFileSync('src/components/AuthModal.tsx', code);
