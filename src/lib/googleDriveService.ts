import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { CatalogProduct } from '../types';
import { uploadProductImageBlob, productImageStoragePath } from './storage';

// CRITICAL: this must be a SEPARATE, named Firebase App instance, not the
// app returned by getApp() with no name.  src/lib/firebase.ts also
// initializes the (unnamed/default) app and exports `auth`/`db` from it for
// the whole rest of the site, including the admin login. Auth instances
// created from the SAME app share one signed-in user. Previously this file
// called getApp() with no name, which resolves to that same default app -
// so signInWithPopup() here (connecting Google Drive) silently REPLACED the
// admin's signed-in session (admin@recell.in) with the admin's personal
// Google account the moment they connected Drive, and logoutGoogleDrive()
// signed that shared session out entirely. Firestore's isAdmin() rule
// checks request.auth.token.email == 'admin@recell.in', so every catalog
// save after connecting Drive was silently rejected as permission-denied -
// the newly "published" products only ever existed in local React state,
// never actually in Firestore, and vanished on the next reload/logout.
// Using a distinct named app here keeps Drive's Google OAuth session fully
// isolated from the admin's real login, exactly as Firebase's own docs
// recommend for "sign in to get a token for another API without switching
// your primary user."
const DRIVE_AUTH_APP_NAME = 'recell-drive-oauth';
const app = getApps().some(a => a.name === DRIVE_AUTH_APP_NAME)
  ? getApp(DRIVE_AUTH_APP_NAME)
  : initializeApp(firebaseConfig, DRIVE_AUTH_APP_NAME);
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
    conditionGrade = 'Open Box';
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

  // Preview-only image URL for the import browser's thumbnail grid.
  // IMPORTANT: this Google-internal thumbnail link must never be the URL
  // that actually gets saved to the catalog - see the big comment on
  // rehostDriveFileImage() below for why. GoogleDriveImportModal replaces
  // this with a permanent Firebase Storage URL before publishing.
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

/**
 * Downloads a Drive file's actual image bytes (via the Drive API's
 * authenticated `alt=media` download, not the public thumbnail service)
 * and re-uploads them to Recell's own Firebase Storage bucket, returning a
 * permanent, CDN-backed download URL.
 *
 * Why this exists: `lh3.googleusercontent.com/d/<fileId>` (used above for
 * the import browser's preview thumbnails) is Google Drive's internal
 * thumbnail-rendering endpoint, not a documented or supported hosting API.
 * It works fine for one person occasionally previewing a file inside
 * Drive's own UI, but Google throttles and eventually blocks it once a
 * link gets real third-party traffic - exactly what happens once a photo
 * imported this way starts being requested by every visitor loading the
 * storefront. That's the actual mechanism behind "images worked for a few
 * hours, then disappeared everywhere at once": it's not a caching bug and
 * it's not random, it's Drive's anti-abuse throttling on a link that was
 * never meant to serve production traffic. Self-hosting the bytes here
 * removes that dependency entirely - once uploaded, the photo is served by
 * Firebase's own Storage CDN and Google Drive is no longer involved at all.
 */
export async function rehostDriveFileImage(
  file: DriveItem,
  accessToken: string
): Promise<string> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) {
    throw new Error(`Could not download "${file.name}" from Google Drive (${res.status}).`);
  }
  const blob = await res.blob();
  const path = productImageStoragePath(`gdrive-${file.id}`, file.mimeType);
  return uploadProductImageBlob(blob, path);
}

