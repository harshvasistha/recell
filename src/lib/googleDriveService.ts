import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { CatalogProduct } from '../types';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const driveProvider = new GoogleAuthProvider();
driveProvider.addScope('https://www.googleapis.com/auth/drive.readonly');

let cachedAccessToken: string | null = null;

export const googleDriveSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  const result = await signInWithPopup(auth, driveProvider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  if (!credential?.accessToken) {
    throw new Error('Could not obtain access token for Google Drive. Please ensure popup permissions are granted.');
  }
  cachedAccessToken = credential.accessToken;
  return { user: result.user, accessToken: credential.accessToken };
};

export const getCachedDriveAccessToken = () => cachedAccessToken;

export const logoutGoogleDrive = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  description?: string;
  createdTime?: string;
  parents?: string[];
  size?: string;
}

export const fetchDriveFiles = async (
  accessToken: string,
  folderId?: string,
  isSharedWithMe: boolean = false
): Promise<{ files: DriveItem[]; folders: DriveItem[] }> => {
  let query = "trashed = false";
  if (folderId) {
    query += ` and '${folderId}' in parents`;
  } else if (isSharedWithMe) {
    query += " and sharedWithMe = true";
  } else {
    query += " and 'root' in parents";
  }

  const fields = "files(id, name, mimeType, thumbnailLink, webViewLink, webContentLink, description, createdTime, parents, size)";
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&pageSize=100&orderBy=folder,name`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Drive API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const allFiles: DriveItem[] = data.files || [];

  const folders = allFiles.filter(f => f.mimeType === 'application/vnd.google-apps.folder');
  const files = allFiles.filter(f => f.mimeType !== 'application/vnd.google-apps.folder');

  return { files, folders };
};

/**
 * Intelligent parser that converts a Google Drive file (image or text) + description
 * into a fully structured ReCell CatalogProduct with Grade A / A1 / B / B1 detection!
 */

export const parseDriveFileToCatalogProduct = (
  file: DriveItem,
  accessToken: string,
  folderDescription?: string,
  folderName?: string
): CatalogProduct => {
  const combinedDescription = [folderName, folderDescription, file.description].filter(Boolean).join(' | ');
  const rawText = `${file.name} ${combinedDescription}`;
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
  if (lower.match(/512\s*gb/)) storage = '512GB';
  else if (lower.match(/256\s*gb/)) storage = '256GB';
  else if (lower.match(/128\s*gb/)) storage = '128GB';
  else if (lower.match(/64\s*gb/)) storage = '64GB';
  else if (lower.match(/1\s*tb/)) storage = '1TB';

  // Detect RAM
  let ram = '8GB RAM';
  if (lower.match(/16\s*gb\s*ram/)) ram = '16GB RAM';
  else if (lower.match(/12\s*gb\s*ram/)) ram = '12GB RAM';
  else if (lower.match(/8\s*gb\s*ram/)) ram = '8GB RAM';
  else if (lower.match(/6\s*gb\s*ram/)) ram = '6GB RAM';
  else if (lower.match(/4\s*gb\s*ram/)) ram = '4GB RAM';

  // Extract Price if present (prioritize explicit "Price: 45000" or similar)
  let refurbPrice = 29999;
  const explicitPriceMatch = lower.match(/(?:price|rs|inr|₹|mrp)\s*[:=]?\s*(?:rs\.?|inr|₹)?\s*([\d,]{4,7})/i);
  if (explicitPriceMatch) {
    const parsedPrice = parseInt(explicitPriceMatch[1].replace(/[\s,]/g, ''), 10);
    if (parsedPrice > 1000 && parsedPrice < 500000) {
      refurbPrice = parsedPrice;
    }
  } else {
    // Fallback implicit price matching: Look for 4 to 6 digit numbers (that don't look like years)
    // Avoids 2023, 2024 by ensuring it ends with 00 or 99 or it's > 3000
    const numbers = rawText.match(/\b(\d{4,6})\b/g);
    if (numbers) {
      // Find the first plausible price
      for (const numStr of numbers) {
         const parsedPrice = parseInt(numStr, 10);
         // Most prices are between 3000 and 250000
         if (parsedPrice >= 3000 && parsedPrice <= 250000) {
            refurbPrice = parsedPrice;
            // Prefer the last matched plausible price in case the first is a model number? Or first?
            // Actually, in a string like "Samsung S20 20000", first is 2000 (wait S20 isn't matched because \b)
            // Let's just use the first match that looks like a price > 2999
            break;
         }
      }
    }
  }

  const originalPrice = Math.round(refurbPrice * 1.35);

  // Extract Battery Health
  let batteryHealthPercent = 92;
  const batteryMatch = lower.match(/battery.*?(\d{2})\s*%/i) || lower.match(/(\d{2})\s*%/);
  if (batteryMatch) {
    const batt = parseInt(batteryMatch[1], 10);
    if (batt >= 70 && batt <= 100) batteryHealthPercent = batt;
  }

  // Clean title
  let cleanName = file.name.replace(/\.(png|jpg|jpeg|heic|webp|png|txt)$/i, '').trim();
  if (!cleanName || cleanName.length < 3) {
    cleanName = `${brand} Mobile Device`;
  }

  // Generate Image URL
  let imageUrl = `https://lh3.googleusercontent.com/d/${file.id}=s1000`;
  if (file.thumbnailLink) {
    imageUrl = file.thumbnailLink.replace(/=s\d+/, '=s1000');
  }

  let finalDescription = combinedDescription;
  if (!finalDescription) {
    if (conditionGrade === 'Grade A') finalDescription = `Grade A: Mobile phone under official brand service center warranty. 100% original parts, zero scratches.`;
    else if (conditionGrade === 'Grade A1') finalDescription = `Grade A1: New Condition mobile phone with 3-Month ReCell Warranty. 100% original untampered hardware and pristine display.`;
    else if (conditionGrade === 'Grade B') finalDescription = `Grade B: Minor rough cosmetic condition, 100% NEVER REPAIRED, original screen & motherboard.`;
    else if (conditionGrade === 'Grade B1') finalDescription = `Grade B1: Repaired phone (Folder screen/jack/mic/speaker replaced). Fully tested working, lowest budget price.`;
    else finalDescription = `Open Box / Refurbished mobile device imported directly from Google Drive catalog.`;
  }

  return {
    id: `gdrive-${file.id}`,
    title: `${cleanName} [${conditionGrade}]`,
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
    serialImei: `GD-${file.id.substring(0, 10).toUpperCase()}`,
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

