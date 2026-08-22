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
// image bytes into a real image host once, at import time, and use the
// permanent URL that host hands back.
//
// This uses Cloudinary's free tier via an unsigned upload preset, rather
// than Firebase Storage - Firebase now requires the paid Blaze plan just
// to turn Storage on at all (even to stay within its free-tier usage
// limits), and this project is staying on Firebase's free Spark plan.
// Cloudinary's free tier needs no card on file. An "unsigned" upload
// preset is Cloudinary's supported way to let a browser upload directly
// without a backend secret key - the cloud name and preset name below are
// meant to be public, client-visible values (that's how unsigned uploads
// work by design), never a secret.
const CLOUDINARY_CLOUD_NAME = 'pks9txyy';
const CLOUDINARY_UPLOAD_PRESET = 'recell-catalog';

// Real phone-camera photos routinely come in at 8-25MB (high-megapixel
// sensors, uncompressed originals), well above Cloudinary's free-plan
// upload size ceiling (10MB per image - fixed by the plan, not something
// the "recell-catalog" preset can raise). An oversized file gets a 400
// from Cloudinary and, upstream in GoogleDriveImportModal, silently falls
// back to the "Photo coming soon" placeholder. Because whether any given
// photo trips that ceiling depends on that one file's size, a batch import
// looks "random" from the outside - some photos of a device show up, some
// don't - when it's actually a per-file cutoff. Downscaling every photo
// client-side before upload keeps it comfortably under the limit and
// removes the size lottery entirely.
async function compressImageBlob(blob: Blob, maxDimension = 1600, quality = 0.85): Promise<Blob> {
  if (!blob.type.startsWith('image/') || blob.type === 'image/svg+xml') return blob;
  try {
    const bitmap = await createImageBitmap(blob);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return blob;

    // Flatten any transparency onto white first - JPEG has no alpha
    // channel, and an unfilled canvas defaults to black, which would turn
    // a transparent PNG/HEIC background solid black instead of white.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const compressed: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));

    // Only switch to the compressed version if it's actually smaller - a
    // photo that's already small or already compressed can come back
    // bigger after re-encoding, and there's no reason to trade quality for
    // that.
    if (compressed && compressed.size > 0 && compressed.size < blob.size) {
      return compressed;
    }
    return blob;
  } catch (err) {
    // A format the browser can't decode client-side (e.g. HEIC in Chrome)
    // throws here - fall back to the original bytes rather than failing
    // the whole upload over what was only ever meant as an optimization.
    console.warn('Image compression skipped, uploading original file:', err);
    return blob;
  }
}

async function uploadOnce(blob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', blob);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloudinary upload failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  if (!data.secure_url) {
    throw new Error('Cloudinary upload succeeded but returned no image URL.');
  }
  return data.secure_url as string;
}

export async function uploadProductImageBlob(blob: Blob): Promise<string> {
  const uploadBlob = await compressImageBlob(blob);

  try {
    return await uploadOnce(uploadBlob);
  } catch (err) {
    // One retry after a short pause - covers a transient network blip or a
    // momentary Cloudinary hiccup without letting one bad request sink a
    // photo that would otherwise have gone through fine on a second try.
    await new Promise(resolve => setTimeout(resolve, 1200));
    return await uploadOnce(uploadBlob);
  }
}
