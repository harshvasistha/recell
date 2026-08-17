const fs = require('fs');
let code = fs.readFileSync('src/data/initialData.ts', 'utf8');

const additionalRefurbished = `
  { id: 'refurb-ap-15pro', brand: 'Apple', name: 'iPhone 15 Pro (Refurbished)', variant: '128GB', baseMarketPrice: 75000, imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', releaseYear: 2023, grade: 'Superb (A+)' },
  { id: 'refurb-sam-s23u', brand: 'Samsung', name: 'Galaxy S23 Ultra 5G (Refurbished)', variant: '256GB', baseMarketPrice: 65000, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', releaseYear: 2023, grade: 'Good (A)' },
  { id: 'refurb-op-11', brand: 'OnePlus', name: 'OnePlus 11 5G (Refurbished)', variant: '128GB', baseMarketPrice: 32000, imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80', releaseYear: 2023, grade: 'Fair (B)' },
`;

code = code.replace('export const ALL_PRODUCTS: CatalogProduct[] = [', 'export const ALL_PRODUCTS: CatalogProduct[] = [' + additionalRefurbished);
fs.writeFileSync('src/data/initialData.ts', code);
console.log('Added sample refurbished items');
