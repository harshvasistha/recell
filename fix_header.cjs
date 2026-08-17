const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

const adminButton = `
          {user?.role === 'admin' && (
            <button
              onClick={() => onNavigateTab('admin')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          )}
          {user ? (
`;

code = code.replace('{user ? (', adminButton);

fs.writeFileSync('src/components/Header.tsx', code);
console.log('Fixed header');
