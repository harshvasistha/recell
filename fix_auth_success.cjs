const fs = require('fs');
let code = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

code = code.replace(
  "document.dispatchEvent(new CustomEvent('NAVIGATE_ADMIN'));\n      }",
  "document.dispatchEvent(new CustomEvent('NAVIGATE_ADMIN'));\n      } else {\n        document.dispatchEvent(new CustomEvent('NAVIGATE_HOME'));\n      }"
);

fs.writeFileSync('src/components/AuthModal.tsx', code);
