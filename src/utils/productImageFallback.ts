// Shared fallback for catalog product photos.
//
// Before this, different pages used two different random Unsplash stock
// photos (a lifestyle shot of a phone + AirPods on a desk, and a separate
// hero shot) as their "something went wrong" fallback, and several pages
// had no fallback at all. When a product's real photo URL was broken, that
// meant one of two confusing things happened depending on which page you
// were on: a stock photo of someone else's phone appeared (looking like a
// wrong/mismatched product image), or the image area just went blank.
//
// Neither is right. A missing photo should look like a placeholder, not
// like a wrong photo or a broken page. Every product image render should
// use PRODUCT_IMAGE_FALLBACK + onProductImageError below so a bad URL
// always degrades to the same clearly-labeled "photo coming soon" tile.
import type { SyntheticEvent } from 'react';

export const PRODUCT_IMAGE_FALLBACK = '/product-image-placeholder.svg';

export function onProductImageError(e: SyntheticEvent<HTMLImageElement, Event>) {
  const img = e.currentTarget;
  // Guard against a loop if the placeholder itself ever fails to load.
  if (img.src.endsWith(PRODUCT_IMAGE_FALLBACK)) return;
  img.src = PRODUCT_IMAGE_FALLBACK;
}
