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

export async function uploadProductImageBlob(blob: Blob): Promise<string> {
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
