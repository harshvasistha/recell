import data from './seed_data.json';
import { CatalogProduct } from '../types';

const IMAGES = [
  'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1598327105666-5b89351cb315?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1601784551446-20c9e07cd562?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80'
];

export const generateOpenBoxSeed = (): CatalogProduct[] => {
  return data.map((d, i) => ({
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
    warrantyMonths: 12,
    specs: {
      screen: 'AMOLED Display',
      processor: 'High Performance Octa-Core',
      ram: d.storage.split('+')[0] + 'GB',
      camera: 'Pro Camera System'
    }
  }));
};
