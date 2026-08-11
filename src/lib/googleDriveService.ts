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
  accessToken: string
): CatalogProduct => {
  const rawText = `${file.name} ${file.description || ''}`;
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

  // Detect Storage
  let storage = '128GB';
  if (lower.includes('256gb') || lower.includes('256')) storage = '256GB';
  else if (lower.includes('512gb') || lower.includes('512')) storage = '512GB';
  else if (lower.includes('1tb')) storage = '1TB';
  else if (lower.includes('64gb') || lower.includes('64')) storage = '64GB';

  // Extract Price if present (e.g., 48999, 48,999 or Rs 48000)
  let refurbPrice = 29999;
  const priceMatch = rawText.match(/(?:₹|rs\.?|inr)?\s*(\d{1,2}[,\s]?\d{3,5})/i);
  if (priceMatch) {
    const parsedPrice = parseInt(priceMatch[1].replace(/[\s,]/g, ''), 10);
    if (parsedPrice > 2000 && parsedPrice < 300000) {
      refurbPrice = parsedPrice;
    }
  }

  const originalPrice = Math.round(refurbPrice * 1.35);

  // Extract Battery Health if present (e.g. 95% or Battery 92)
  let batteryHealthPercent = 92;
  const batteryMatch = rawText.match(/(\d{2})\s*%/);
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

  // Descriptions according to ReCell Grade rules
  let description = file.description || '';
  if (!description) {
    if (conditionGrade === 'Grade A') {
      description = `Grade A: Mobile phone under official brand service center warranty. 100% original parts, zero scratches. High resolution Google Drive photo verified.`;
    } else if (conditionGrade === 'Grade A1') {
      description = `Grade A1: New Condition mobile phone with 3-Month ReCell Warranty. 100% original untampered hardware and pristine display.`;
    } else if (conditionGrade === 'Grade B') {
      description = `Grade B: Minor rough cosmetic condition, 100% NEVER REPAIRED, original screen & motherboard. Comes with ReCell warranty.`;
    } else if (conditionGrade === 'Grade B1') {
      description = `Grade B1: Repaired phone (Folder screen/jack/mic/speaker replaced). Fully tested working, lowest budget price.`;
    } else {
      description = `Open Box / Refurbished mobile device imported directly from Google Drive catalog.`;
    }
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
    description,
    boxChargerIncluded: true,
    specs: {
      screen: 'Super Retina / AMOLED High Density Display',
      processor: 'Octa-Core High Performance Chipset',
      ram: '8GB RAM',
      camera: 'Ultra-HD Multi-Lens Camera System'
    }
  };
};
