const fs = require('fs');
let code = fs.readFileSync('src/data/initialData.ts', 'utf8');

// Find where SEED_CATALOG starts and ends
const startIndex = code.indexOf('export const SEED_CATALOG: CatalogProduct[] = [');
if (startIndex !== -1) {
  // Find the end of this array. It might be followed by another export.
  const nextExportIndex = code.indexOf('export const SEED_BUY_REQUESTS', startIndex);
  if (nextExportIndex !== -1) {
    code = code.substring(0, startIndex) + 'export const SEED_CATALOG: CatalogProduct[] = [];\n\n' + code.substring(nextExportIndex);
    fs.writeFileSync('src/data/initialData.ts', code);
    console.log('Catalog cleared successfully.');
  } else {
    console.log('Could not find next export after SEED_CATALOG');
  }
} else {
  console.log('Could not find SEED_CATALOG');
}
