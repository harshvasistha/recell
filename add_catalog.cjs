const fs = require('fs');
let code = fs.readFileSync('src/data/initialData.ts', 'utf8');

const replacement = `export const SEED_CATALOG: CatalogProduct[] = [
  {
    id: 'refurb-1',
    title: 'Apple iPhone 15 Pro Max',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    storage: '256GB',
    color: 'Natural Titanium',
    originalPrice: 159900,
    refurbPrice: 115000,
    conditionGrade: 'Superb',
    warrantyMonths: 12,
    batteryHealthPercent: 95,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
    stockCount: 2,
    serialImei: 'IMEI3847592837492',
    inspectionPassed: true,
    description: 'Immaculate condition. Looks and works like brand new. Passes 32-point quality check.',
    boxChargerIncluded: true,
    specs: {
      screen: '6.7" Super Retina XDR OLED',
      processor: 'A17 Pro',
      ram: '8GB',
      camera: '48MP Main | 12MP Ultra | 12MP Telephoto (5x)'
    }
  },
  {
    id: 'refurb-2',
    title: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    storage: '512GB',
    color: 'Titanium Black',
    originalPrice: 139999,
    refurbPrice: 98000,
    conditionGrade: 'Good',
    warrantyMonths: 6,
    batteryHealthPercent: 88,
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
    stockCount: 1,
    serialImei: 'IMEI9384758239475',
    inspectionPassed: true,
    description: 'Great condition with minor scuffs on the bottom edge. Screen is pristine.',
    boxChargerIncluded: false,
    specs: {
      screen: '6.8" Dynamic AMOLED 2X',
      processor: 'Snapdragon 8 Gen 3 for Galaxy',
      ram: '12GB',
      camera: '200MP Main | 50MP Tele (5x) | 10MP Tele (3x) | 12MP Ultra'
    }
  },
  {
    id: 'refurb-3',
    title: 'OnePlus 12 5G',
    brand: 'OnePlus',
    model: '12 5G',
    storage: '256GB',
    color: 'Flowy Emerald',
    originalPrice: 64999,
    refurbPrice: 42000,
    conditionGrade: 'Grade B',
    warrantyMonths: 3,
    batteryHealthPercent: 82,
    images: ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
    stockCount: 3,
    serialImei: 'IMEI2834759283745',
    inspectionPassed: true,
    description: 'Fully functional but has visible scratches on the back panel. Front glass is intact.',
    boxChargerIncluded: true,
    specs: {
      screen: '6.82" LTPO AMOLED 120Hz',
      processor: 'Snapdragon 8 Gen 3',
      ram: '12GB',
      camera: '50MP Main | 64MP Telephoto | 48MP Ultra Wide'
    }
  },
`;

if (code.includes('export const SEED_CATALOG: CatalogProduct[] = [')) {
  code = code.replace('export const SEED_CATALOG: CatalogProduct[] = [', replacement);
  fs.writeFileSync('src/data/initialData.ts', code);
  console.log('Added mock catalog items');
} else {
  console.log('Could not find SEED_CATALOG array');
}
