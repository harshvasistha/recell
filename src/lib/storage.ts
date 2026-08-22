import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from './firebase';

// Real, permanent image hosting for catalog product photos.
//
// Before this file existed, "importing" a photo from Google Drive meant
// storing a link to Google's own internal thumbnail-serving endpoint
// (lh3.googleusercontent.com/d/<fileId>) directly as the product's image.
// That endpoint is not a supported, stable hosting API - it's the same
// mechanism Google Drive/Docs use to render thumbnails inside Drive's own
// UI, and Google throttles/revokes it for third-party hotlinking without
// notice. That's the actual explanation for "images worked for a few
// hours, then disappeared": the link wasn't broken when it was saved, it
// just wasn't meant to survive real traffic.
//
// The fix is to stop borrowing someone else's link and instead copy the
// image bytes into Recell's own Firebase Storage bucket once, at import
// time, and use the permanent download URL that Storage hands back. That
// URL is served by Firebase's own CDN and does not depend on Google
// Drive's sharing/throttling behavior at all.
const storage = getStorage(app);

export async function uploadProductImageBlob(blob: Blob, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob, { contentType: blob.type || 'image/jpeg' });
  return getDownloadURL(storageRef);
}

function extensionForMimeType(mimeType: string | undefined): string {
  if (!mimeType) return 'jpg';
  if (mimeType.includes('png')) return 'png';
  if (mimeType.includes('webp')) return 'webp';
  if (mimeType.includes('gif')) return 'gif';
  if (mimeType.includes('heic')) return 'heic';
  return 'jpg';
}

export function productImageStoragePath(idSeed: string, mimeType?: string): string {
  const ext = extensionForMimeType(mimeType);
  return `product-images/${idSeed}.${ext}`;
}
