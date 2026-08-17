const fs = require('fs');

// 1. Update googleDriveService.ts
let serviceCode = fs.readFileSync('src/lib/googleDriveService.ts', 'utf8');

const newParser = `
export const parseDriveFileToCatalogProduct = (
  file: DriveItem,
  accessToken: string,
  folderDescription?: string
): CatalogProduct => {
  const combinedDescription = [folderDescription, file.description].filter(Boolean).join(' | ');
  const rawText = \`\${file.name} \${combinedDescription}\`;
  const lower = rawText.toLowerCase();

  // Detect Grade
  let conditionGrade: CatalogProduct['conditionGrade'] = 'Grade A1';
  if (lower.includes('grade a1') || lower.includes('a1') || lower.includes('new condition')) {
    conditionGrade = 'Grade A1';
  } else if (lower.includes('grade a') || lower.includes('under warranty') || lower.includes('service center')) {
    conditionGrade = 'Grade A';
  } else if (lower.includes('grade b1') || lower.includes('b1') || lower.includes('repaired') || lower.includes('folder')) {
    conditionGrade = 'Grade B1';
  } else if (lower.includes('grade b') || lower.includes('scuffs') || lower.includes('minor rough')) {
    conditionGrade = 'Grade B';
  } else if (lower.includes('open box')) {
    conditionGrade = 'Open Box (5-10 Days)';
  }

  // Detect Brand
  let brand = 'Apple';
  if (lower.includes('samsung') || lower.includes('galaxy')) brand = 'Samsung';
  else if (lower.includes('oneplus')) brand = 'OnePlus';
  else if (lower.includes('google') || lower.includes('pixel')) brand = 'Google';
  else if (lower.includes('xiaomi') || lower.includes('redmi') || lower.includes('poco')) brand = 'Xiaomi';
  else if (lower.includes('vivo')) brand = 'Vivo';
  else if (lower.includes('oppo')) brand = 'Oppo';
  else if (lower.includes('realme')) brand = 'Realme';
  else if (lower.includes('motorola') || lower.includes('moto')) brand = 'Motorola';

  // Detect Storage
  let storage = '128GB';
  if (lower.match(/512\\s*gb/)) storage = '512GB';
  else if (lower.match(/256\\s*gb/)) storage = '256GB';
  else if (lower.match(/128\\s*gb/)) storage = '128GB';
  else if (lower.match(/64\\s*gb/)) storage = '64GB';
  else if (lower.match(/1\\s*tb/)) storage = '1TB';

  // Detect RAM
  let ram = '8GB RAM';
  if (lower.match(/16\\s*gb\\s*ram/)) ram = '16GB RAM';
  else if (lower.match(/12\\s*gb\\s*ram/)) ram = '12GB RAM';
  else if (lower.match(/8\\s*gb\\s*ram/)) ram = '8GB RAM';
  else if (lower.match(/6\\s*gb\\s*ram/)) ram = '6GB RAM';
  else if (lower.match(/4\\s*gb\\s*ram/)) ram = '4GB RAM';

  // Extract Price if present (prioritize explicit "Price: 45000" or similar)
  let refurbPrice = 29999;
  const explicitPriceMatch = lower.match(/(?:price|rs|inr|₹)\\s*[:=]?\\s*(?:rs\\.?|inr|₹)?\\s*([\\d,]{4,7})/i);
  if (explicitPriceMatch) {
    const parsedPrice = parseInt(explicitPriceMatch[1].replace(/[\\s,]/g, ''), 10);
    if (parsedPrice > 1000 && parsedPrice < 500000) {
      refurbPrice = parsedPrice;
    }
  } else {
    // Fallback implicit price matching
    const priceMatch = rawText.match(/(?:₹|rs\\.?|inr)?\\s*(\\d{1,2}[,\\s]?\\d{3,5})/i);
    if (priceMatch) {
      const parsedPrice = parseInt(priceMatch[1].replace(/[\\s,]/g, ''), 10);
      if (parsedPrice > 2000 && parsedPrice < 300000) {
        refurbPrice = parsedPrice;
      }
    }
  }

  const originalPrice = Math.round(refurbPrice * 1.35);

  // Extract Battery Health
  let batteryHealthPercent = 92;
  const batteryMatch = lower.match(/battery.*?(\\d{2})\\s*%/i) || lower.match(/(\\d{2})\\s*%/);
  if (batteryMatch) {
    const batt = parseInt(batteryMatch[1], 10);
    if (batt >= 70 && batt <= 100) batteryHealthPercent = batt;
  }

  // Clean title
  let cleanName = file.name.replace(/\\.(png|jpg|jpeg|heic|webp|png|txt)$/i, '').trim();
  if (!cleanName || cleanName.length < 3) {
    cleanName = \`\${brand} Mobile Device\`;
  }

  // Generate Image URL
  let imageUrl = \`https://lh3.googleusercontent.com/d/\${file.id}=s1000\`;
  if (file.thumbnailLink) {
    imageUrl = file.thumbnailLink.replace(/=s\\d+/, '=s1000');
  }

  let finalDescription = combinedDescription;
  if (!finalDescription) {
    if (conditionGrade === 'Grade A') finalDescription = \`Grade A: Mobile phone under official brand service center warranty. 100% original parts, zero scratches.\`;
    else if (conditionGrade === 'Grade A1') finalDescription = \`Grade A1: New Condition mobile phone with 3-Month ReCell Warranty. 100% original untampered hardware and pristine display.\`;
    else if (conditionGrade === 'Grade B') finalDescription = \`Grade B: Minor rough cosmetic condition, 100% NEVER REPAIRED, original screen & motherboard.\`;
    else if (conditionGrade === 'Grade B1') finalDescription = \`Grade B1: Repaired phone (Folder screen/jack/mic/speaker replaced). Fully tested working, lowest budget price.\`;
    else finalDescription = \`Open Box / Refurbished mobile device imported directly from Google Drive catalog.\`;
  }

  return {
    id: \`gdrive-\${file.id}\`,
    title: \`\${cleanName} [\${conditionGrade}]\`,
    brand,
    model: cleanName,
    storage,
    color: 'Original Finish',
    originalPrice,
    refurbPrice,
    conditionGrade,
    warrantyMonths: conditionGrade === 'Grade A' ? 6 : conditionGrade === 'Grade B1' ? 0 : 3,
    batteryHealthPercent,
    images: [imageUrl],
    inStock: true,
    stockCount: 1,
    serialImei: \`GD-\${file.id.substring(0, 10).toUpperCase()}\`,
    inspectionPassed: true,
    description: finalDescription,
    boxChargerIncluded: lower.includes('box') || lower.includes('charger'),
    specs: {
      screen: 'Super Retina / AMOLED High Density Display',
      processor: 'Octa-Core High Performance Chipset',
      ram: ram,
      camera: 'Ultra-HD Multi-Lens Camera System'
    }
  };
};
`;

serviceCode = serviceCode.replace(/export const parseDriveFileToCatalogProduct = \([\s\S]*?};/m, newParser);
fs.writeFileSync('src/lib/googleDriveService.ts', serviceCode);
console.log('googleDriveService updated');

// 2. Update GoogleDriveImportModal.tsx
let modalCode = fs.readFileSync('src/components/GoogleDriveImportModal.tsx', 'utf8');

// Update folderHistory type
modalCode = modalCode.replace(
  "folderHistory, setFolderHistory] = useState<{ id?: string; name: string }[]>([",
  "folderHistory, setFolderHistory] = useState<{ id?: string; name: string; description?: string }[]>(["
);

// Add folderDescription to loadDriveDirectory signature and mapping
modalCode = modalCode.replace(
  "const loadDriveDirectory = async (token: string, folderId?: string, shared: boolean = isSharedWithMe) => {",
  "const loadDriveDirectory = async (token: string, folderId?: string, shared: boolean = isSharedWithMe, folderDesc?: string) => {"
);

modalCode = modalCode.replace(
  "newMap[f.id] = parseDriveFileToCatalogProduct(f, token);",
  "newMap[f.id] = parseDriveFileToCatalogProduct(f, token, folderDesc);"
);

// Update handleOpenFolder to pass folder description
modalCode = modalCode.replace(
  "setFolderHistory(prev => [...prev, { id: folder.id, name: folder.name }]);",
  "setFolderHistory(prev => [...prev, { id: folder.id, name: folder.name, description: folder.description }]);"
);
modalCode = modalCode.replace(
  "loadDriveDirectory(accessToken, folder.id);",
  "loadDriveDirectory(accessToken, folder.id, isSharedWithMe, folder.description);"
);

// Update handleNavigateBack to use folder desc
modalCode = modalCode.replace(
  "loadDriveDirectory(accessToken, targetFolder.id);",
  "loadDriveDirectory(accessToken, targetFolder.id, isSharedWithMe, targetFolder.description);"
);

// Also the first loadDriveDirectory call in handleSignIn might need 4 args now
modalCode = modalCode.replace(
  "await loadDriveDirectory(res.accessToken, currentFolderId, false);",
  "await loadDriveDirectory(res.accessToken, currentFolderId, false, undefined);"
);

fs.writeFileSync('src/components/GoogleDriveImportModal.tsx', modalCode);
console.log('GoogleDriveImportModal updated');

