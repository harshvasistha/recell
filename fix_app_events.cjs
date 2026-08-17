const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const eventListener = `
  useEffect(() => {
    const handleAdminNav = () => setCurrentTab('admin');
    const handleHomeNav = () => setCurrentTab('landing');
    document.addEventListener('NAVIGATE_ADMIN', handleAdminNav);
    document.addEventListener('NAVIGATE_HOME', handleHomeNav);
    return () => {
      document.removeEventListener('NAVIGATE_ADMIN', handleAdminNav);
      document.removeEventListener('NAVIGATE_HOME', handleHomeNav);
    };
  }, []);
`;

if (!code.includes('NAVIGATE_ADMIN')) {
  code = code.replace(
    "useEffect(() => {",
    eventListener + "\n  useEffect(() => {"
  );
  fs.writeFileSync('src/App.tsx', code);
}
