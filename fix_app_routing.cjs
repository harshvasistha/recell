const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const eventListener = `
  useEffect(() => {
    const handleAdminNav = () => setCurrentTab('admin');
    document.addEventListener('NAVIGATE_ADMIN', handleAdminNav);
    return () => document.removeEventListener('NAVIGATE_ADMIN', handleAdminNav);
  }, []);
`;

// Insert the event listener inside the App component, right after the first useEffect
if (!code.includes('NAVIGATE_ADMIN')) {
  code = code.replace(
    /useEffect\(\(\) => \{\n\s+const fetchDriveToken/,
    eventListener + '\n  useEffect(() => {\n    const fetchDriveToken'
  );
  fs.writeFileSync('src/App.tsx', code);
}
