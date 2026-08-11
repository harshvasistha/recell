/**
 * ReCell Inventory & Photo Bulk Upload Script
 * --------------------------------------------
 * This script demonstrates how to format and upload inventory items
 * with associated device photos into ReCell's catalog system using the
 * Grade A, Grade A1, Grade B, and Grade B1 taxonomy.
 * 
 * Grade Classification Matrix:
 * - Grade A : Under official brand warranty from service center
 * - Grade A1: New Condition mobile phone with ReCell warranty
 * - Grade B : Minor rough condition, never repaired, with ReCell warranty
 * - Grade B1: Repaired phone (Folder/Screen, Jack, Mic, Speaker) - no warranty, lower budget price
 */

const sampleProductsToUpload = [
  {
    title: "Apple iPhone 14 (128GB) - Midnight [Grade A]",
    brand: "Apple",
    model: "iPhone 14",
    storage: "128GB",
    color: "Midnight Black",
    originalPrice: 69900,
    refurbPrice: 48999,
    conditionGrade: "Grade A",
    batteryHealthPercent: 96,
    serialImei: "358921104829102",
    images: [
      "https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Grade A: Under official service center warranty with 100% original OEM parts and box."
  },
  {
    title: "Samsung Galaxy S23 Ultra 5G (256GB) - Green [Grade A1]",
    brand: "Samsung",
    model: "Galaxy S23 Ultra",
    storage: "256GB",
    color: "Botanic Green",
    originalPrice: 124999,
    refurbPrice: 68500,
    conditionGrade: "Grade A1",
    batteryHealthPercent: 95,
    serialImei: "357102948201948",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Grade A1: New condition mobile phone with ReCell 3-Month warranty."
  },
  {
    title: "Apple iPhone 13 (128GB) - Starlight [Grade B]",
    brand: "Apple",
    model: "iPhone 13",
    storage: "128GB",
    color: "Starlight White",
    originalPrice: 59900,
    refurbPrice: 38499,
    conditionGrade: "Grade B",
    batteryHealthPercent: 86,
    serialImei: "351029384756102",
    images: [
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Grade B: Minor rough cosmetic condition, 100% NEVER REPAIRED, with ReCell warranty."
  },
  {
    title: "OnePlus 11 5G (256GB) - Titan Black [Grade B1 Repaired Budget]",
    brand: "OnePlus",
    model: "OnePlus 11 5G",
    storage: "256GB",
    color: "Titan Black",
    originalPrice: 61999,
    refurbPrice: 28999,
    conditionGrade: "Grade B1",
    batteryHealthPercent: 88,
    serialImei: "864920194830192",
    images: [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Grade B1: Repaired phone (Folder screen & charging jack replaced). No warranty, lowest budget price."
  }
];

function generateCsvString(products) {
  const header = "Title,Brand,Model,Storage,Color,OriginalPrice,RefurbPrice,ConditionGrade,BatteryHealth,SerialIMEI,ImageUrl,Description\n";
  const rows = products.map(p => {
    const img = p.images[0] || '';
    return `"${p.title}","${p.brand}","${p.model}","${p.storage}","${p.color}",${p.originalPrice},${p.refurbPrice},"${p.conditionGrade}",${p.batteryHealthPercent},"${p.serialImei}","${img}","${p.description}"`;
  }).join("\n");

  return header + rows;
}

console.log("Generated CSV Payload for Bulk Import:\n");
console.log(generateCsvString(sampleProductsToUpload));
