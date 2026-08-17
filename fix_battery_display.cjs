const fs = require('fs');

// 1. Storefront.tsx
let storefront = fs.readFileSync('src/components/Storefront.tsx', 'utf8');
storefront = storefront.replace(
  /if \(sortBy === 'battery'\) return b\.batteryHealthPercent - a\.batteryHealthPercent;/g,
  "if (sortBy === 'battery') return (b.batteryHealthPercent || 0) - (a.batteryHealthPercent || 0);"
);
storefront = storefront.replace(
  /<span className="flex items-center gap-1">\\s*<Battery className="w-3 h-3 text-emerald-500" \/>\\s*\{product\.batteryHealthPercent\}% Battery\\s*<\/span>/g,
  `{product.batteryHealthPercent && (
    <span className="flex items-center gap-1">
      <Battery className="w-3 h-3 text-emerald-500" />
      {product.batteryHealthPercent}% Battery
    </span>
  )}`
);
fs.writeFileSync('src/components/Storefront.tsx', storefront);

// 2. ProductDetailModal.tsx
let pdm = fs.readFileSync('src/components/ProductDetailModal.tsx', 'utf8');
pdm = pdm.replace(
  /<span className="font-bold text-emerald-400">\{product\.batteryHealthPercent\}% Health Pass<\/span>/g,
  `{product.batteryHealthPercent ? (
    <span className="font-bold text-emerald-400">{product.batteryHealthPercent}% Health Pass</span>
  ) : (
    <span className="font-bold text-emerald-400">Battery Pass</span>
  )}`
);

pdm = pdm.replace(
  /<div className="flex items-center justify-between p-3 bg-slate-900\/50 rounded-xl border border-slate-700">\\s*<span className="text-slate-400">Battery Health<\/span>\\s*<span className="text-emerald-400 font-bold">\{product\.batteryHealthPercent\}%<\/span>\\s*<\/div>/g,
  `{product.batteryHealthPercent && (
    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700">
      <span className="text-slate-400">Battery Health</span>
      <span className="text-emerald-400 font-bold">{product.batteryHealthPercent}%</span>
    </div>
  )}`
);
fs.writeFileSync('src/components/ProductDetailModal.tsx', pdm);

// 3. AdminDashboard.tsx
let admin = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');
admin = admin.replace(
  /<td className="p-3 font-mono text-emerald-600 font-bold">\{item\.batteryHealthPercent\}%<\/td>/g,
  `<td className="p-3 font-mono text-emerald-600 font-bold">{item.batteryHealthPercent ? \`\${item.batteryHealthPercent}%\` : 'N/A'}</td>`
);
fs.writeFileSync('src/components/AdminDashboard.tsx', admin);

console.log('Fixed battery display');
