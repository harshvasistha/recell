import data from './seed_data.json';
import { CatalogProduct } from '../types';

const IMAGES = [
  "/devices/redmi-13c/view-1.png",
  "/devices/redmi-13c/view-2.png",
  "/devices/redmi-13c/view-3.png",
  "/devices/redmi-13c/view-4.png",
  "/devices/redmi-13c/view-5.png"
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
    conditionGrade: 'Open Box',
    batteryHealthPercent: 100,
    serialImei: `35${Math.floor(Math.random() * 10000000000000)}`,
    images: (d as any).images?.length > 0 ? (d as any).images : [IMAGES[i % IMAGES.length]],
    inStock: true,
    stockCount: 2,
    inspectionPassed: true,
    description: `Sealed device. 100% original condition with 12-Month manufacturer warranty. ZERO scratches or dents.`,
    boxChargerIncluded: true,
    
    brandWarrantyMonths: 12,
    warrantyMonths: 12,
    specs: ((d as any).specs) ? (d as any).specs : {
      screen: 'AMOLED Display',
      processor: 'High Performance Octa-Core',
      ram: d.storage.split('+')[0] + 'GB',
      camera: 'Pro Camera System'
    }
  }));
};

export const generateRefurbishedSeed = (): CatalogProduct[] => {
  return data.slice(0, 10).map((d, i) => ({
    id: `refurb-${Date.now()}-${i}`,
    title: `${d.brand} ${d.model} (${d.storage}) [Grade A]`,
    brand: d.brand,
    model: d.model,
    storage: d.storage,
    color: 'Assorted',
    originalPrice: d.originalPrice,
    refurbPrice: Math.floor(d.refurbPrice * 0.8), // cheaper than open box
    conditionGrade: 'Grade A',
    batteryHealthPercent: 95,
    serialImei: `35${Math.floor(Math.random() * 10000000000000)}`,
    images: (d as any).images?.length > 0 ? (d as any).images : [IMAGES[i % IMAGES.length]],
    inStock: true,
    stockCount: 5,
    inspectionPassed: true,
    description: `Refurbished ${d.brand} ${d.model}. Grade A certified, minor wear, fully functional with 3-Month ReCell warranty.`,
    boxChargerIncluded: false,
    warrantyMonths: 3,
    specs: ((d as any).specs) ? (d as any).specs : {
      screen: 'AMOLED Display',
      processor: 'High Performance Octa-Core',
      ram: d.storage.split('+')[0] + 'GB',
      camera: 'Pro Camera System'
    }
  }));
};
