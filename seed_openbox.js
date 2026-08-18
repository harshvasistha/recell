import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json'));
const app = initializeApp(config);
const db = getFirestore(app);

const newDevices = [
  // Xiaomi
  { brand: 'Xiaomi', model: 'Redmi Note 14 5G', storage: '6+128', originalPrice: 16499, refurbPrice: 15499 },
  { brand: 'Xiaomi', model: 'Redmi Note 14 5G', storage: '8+128', originalPrice: 16999, refurbPrice: 15999 },
  { brand: 'Xiaomi', model: 'Redmi Note 14 5G', storage: '8+256', originalPrice: 18499, refurbPrice: 17499 },
  { brand: 'Xiaomi', model: 'Redmi Note 15 5G', storage: '8+128', originalPrice: 26999, refurbPrice: 24999 },
  { brand: 'Xiaomi', model: 'Redmi Note 15 5G', storage: '8+256', originalPrice: 29999, refurbPrice: 27999 },
  { brand: 'Xiaomi', model: 'Redmi Note 14 Pro 5G', storage: '8+128', originalPrice: 23999, refurbPrice: 21999 },
  { brand: 'Xiaomi', model: 'Redmi Note 14 Pro 5G', storage: '8+256', originalPrice: 25999, refurbPrice: 23999 },
  { brand: 'Xiaomi', model: 'Redmi Note 15 Pro 5G', storage: '8+128', originalPrice: 31999, refurbPrice: 28999 },
  { brand: 'Xiaomi', model: 'Redmi Note 15 Pro 5G', storage: '8+256', originalPrice: 34999, refurbPrice: 31999 },
  { brand: 'Xiaomi', model: 'Redmi Note 14 Pro+ 5G', storage: '8+128', originalPrice: 28999, refurbPrice: 26999 },
  { brand: 'Xiaomi', model: 'Redmi Note 14 Pro+ 5G', storage: '8+256', originalPrice: 30999, refurbPrice: 28999 },
  { brand: 'Xiaomi', model: 'Redmi Note 14 Pro+ 5G', storage: '12+512', originalPrice: 33999, refurbPrice: 31999 },
  { brand: 'Xiaomi', model: 'Redmi Note 15 Pro+ 5G', storage: '8+256', originalPrice: 39999, refurbPrice: 36999 },
  { brand: 'Xiaomi', model: 'Redmi Note 15 Pro+ 5G', storage: '12+256', originalPrice: 41999, refurbPrice: 38999 },
  { brand: 'Xiaomi', model: 'Redmi Note 15 Pro+ 5G', storage: '12+512', originalPrice: 44999, refurbPrice: 41999 },
  { brand: 'Xiaomi', model: 'Xiaomi 17T', storage: '12+256', originalPrice: 59999, refurbPrice: 54999 },
  { brand: 'Xiaomi', model: 'Xiaomi 17T', storage: '12+512', originalPrice: 64999, refurbPrice: 59999 },
  { brand: 'Xiaomi', model: 'Xiaomi 17', storage: '12+512', originalPrice: 89999, refurbPrice: 82999 },
  { brand: 'Xiaomi', model: 'Xiaomi 17 Ultra', storage: '16+512', originalPrice: 139999, refurbPrice: 129999 },

  // Oppo
  { brand: 'Oppo', model: 'A6X 4G', storage: '4+64', originalPrice: 12999, refurbPrice: 12380 },
  { brand: 'Oppo', model: 'A6C 4G', storage: '4+64', originalPrice: 16999, refurbPrice: 16189 },
  { brand: 'Oppo', model: 'A6X', storage: '4+64', originalPrice: 17999, refurbPrice: 17142 },
  { brand: 'Oppo', model: 'A6X', storage: '4+128', originalPrice: 19999, refurbPrice: 19046 },
  { brand: 'Oppo', model: 'A6X', storage: '6+128', originalPrice: 22999, refurbPrice: 21904 },
  { brand: 'Oppo', model: 'K14X', storage: '4+64', originalPrice: 17999, refurbPrice: 17308 },
  { brand: 'Oppo', model: 'K14X', storage: '4+128', originalPrice: 19999, refurbPrice: 19231 },
  { brand: 'Oppo', model: 'K14X', storage: '6+128', originalPrice: 22999, refurbPrice: 22115 },
  { brand: 'Oppo', model: 'A6s', storage: '4+128', originalPrice: 21999, refurbPrice: 20951 },
  { brand: 'Oppo', model: 'A6s', storage: '6+128', originalPrice: 24999, refurbPrice: 23809 },
  { brand: 'Oppo', model: 'A6', storage: '4+128', originalPrice: 26999, refurbPrice: 25713 },
  { brand: 'Oppo', model: 'A6', storage: '6+128', originalPrice: 28999, refurbPrice: 27617 },
  { brand: 'Oppo', model: 'A6', storage: '6+256', originalPrice: 31999, refurbPrice: 30331 },
  { brand: 'Oppo', model: 'A6 PRO', storage: '8+128', originalPrice: 32999, refurbPrice: 31279 },
  { brand: 'Oppo', model: 'A6 PRO', storage: '8+256', originalPrice: 35999, refurbPrice: 34123 },
  { brand: 'Oppo', model: 'FIND X9', storage: '12+256', originalPrice: 74999, refurbPrice: 70754 },
  { brand: 'Oppo', model: 'FIND X9', storage: '16+512', originalPrice: 84999, refurbPrice: 80188 },
  { brand: 'Oppo', model: 'RENO15 C', storage: '8+256', originalPrice: 41999, refurbPrice: 39622 },
  { brand: 'Oppo', model: 'RENO15 C', storage: '12+256', originalPrice: 44999, refurbPrice: 42452 },
  { brand: 'Oppo', model: 'RENO15', storage: '12+512', originalPrice: 55999, refurbPrice: 52830 },
  { brand: 'Oppo', model: 'RENO15 PRO MINI', storage: '12+256', originalPrice: 59999, refurbPrice: 56603 },
  { brand: 'Oppo', model: 'RENO15 PRO MINI', storage: '12+512', originalPrice: 64999, refurbPrice: 61320 },
  { brand: 'Oppo', model: 'F33 PRO', storage: '8+256', originalPrice: 43999, refurbPrice: 41508 },
  { brand: 'Oppo', model: 'F33 PRO', storage: '8+128', originalPrice: 39999, refurbPrice: 37735 },
  { brand: 'Oppo', model: 'F33', storage: '8+256', originalPrice: 39999, refurbPrice: 37735 },
  { brand: 'Oppo', model: 'F33', storage: '8+128', originalPrice: 36999, refurbPrice: 35070 },
  { brand: 'Oppo', model: 'F33', storage: '6+128', originalPrice: 34999, refurbPrice: 33174 },
  { brand: 'Oppo', model: 'FIND X9s', storage: '12+256', originalPrice: 79999, refurbPrice: 74073 },
  { brand: 'Oppo', model: 'FIND X9s', storage: '12+512', originalPrice: 89999, refurbPrice: 83332 },
  { brand: 'Oppo', model: 'FIND X9 ULTRA', storage: '12+512', originalPrice: 169999, refurbPrice: 157406 },
  { brand: 'Oppo', model: 'RENO16 C', storage: '8+128', originalPrice: 46999, refurbPrice: 44549 },
  { brand: 'Oppo', model: 'RENO16 C', storage: '8+256', originalPrice: 49999, refurbPrice: 46728 },
  { brand: 'Oppo', model: 'RENO16 C', storage: '12+256', originalPrice: 55999, refurbPrice: 52336 },
  { brand: 'Oppo', model: 'RENO16', storage: '8+256', originalPrice: 61999, refurbPrice: 57406 },
  { brand: 'Oppo', model: 'RENO16', storage: '12+256', originalPrice: 67999, refurbPrice: 62962 },
  { brand: 'Oppo', model: 'PAD 5', storage: '8+128', originalPrice: 29999, refurbPrice: 27777 },
  { brand: 'Oppo', model: 'PAD 5', storage: '8+256', originalPrice: 34999, refurbPrice: 32406 },
  { brand: 'Oppo', model: 'K14', storage: '6+128', originalPrice: 23999, refurbPrice: 23076 },
];

const IMAGES = [
  'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1598327105666-5b89351cb315?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1601784551446-20c9e07cd562?auto=format&fit=crop&w=800&q=80'
];

async function run() {
  try {
    const docRef = doc(db, 'system', 'catalog');
    const snap = await getDoc(docRef);
    let existing = [];
    if (snap.exists()) {
      existing = snap.data().products || [];
    }

    const openBoxProducts = newDevices.map((d, i) => ({
      id: `openbox-${Date.now()}-${i}`,
      title: `${d.brand} ${d.model} (${d.storage})`,
      brand: d.brand,
      model: d.model,
      storage: d.storage,
      color: 'Assorted',
      originalPrice: d.originalPrice,
      refurbPrice: d.refurbPrice,
      conditionGrade: 'Open Box (5-10 Days)',
      batteryHealthPercent: 100,
      serialImei: `35${Math.floor(Math.random() * 10000000000000)}`,
      images: [IMAGES[i % IMAGES.length]],
      inStock: true,
      stockCount: 2,
      inspectionPassed: true,
      description: `Open box condition ${d.brand} ${d.model}. Zero scratches, fully functional with 12-Month brand warranty.`,
      boxChargerIncluded: true,
      openBoxAgeDays: Math.floor(Math.random() * 5) + 5,
      brandWarrantyMonths: 12,
      specs: {
        screen: 'AMOLED Display',
        processor: 'High Performance Octa-Core',
        ram: d.storage.split('+')[0] + 'GB',
        camera: 'Pro Camera System'
      }
    }));

    await setDoc(docRef, { products: [...openBoxProducts, ...existing] });
    console.log(`Successfully added ${openBoxProducts.length} devices to catalog!`);
  } catch (e) {
    console.error("Failed to seed:", e);
  }
  process.exit(0);
}

run();
