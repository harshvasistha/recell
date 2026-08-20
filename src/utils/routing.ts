import { TabType } from '../components/Header';

export interface RouteState {
  tab: TabType;
  searchQuery?: string;
  legalTab?: 'privacy' | 'terms' | 'warranty' | 'returns';
  productId?: string;
}

const VALID_TABS: TabType[] = [
  'landing',
  'sell',
  'buy',
  'open-box',
  'track',
  'repair',
  'about',
  'how-it-works',
  'recycle',
  'contact',
  'agent',
  'admin',
  'product',
  'profile'
];

export function buildRouteUrl(
  tab: TabType,
  searchQuery?: string,
  legalTab?: 'privacy' | 'terms' | 'warranty' | 'returns',
  productId?: string
): string {
  if (legalTab) {
    return `/${legalTab}`;
  }
  if (tab === 'landing') {
    return '/';
  }
  // Product pages get a clean path-segment URL (e.g. /product/oppo-find-x9-
  // 12gb-256gb) instead of a query string, since every catalog product id
  // already includes the brand name - this reads as a real page URL and is
  // shareable/SEO-friendly, unlike /product?id=...
  if (tab === 'product' && productId) {
    return `/product/${encodeURIComponent(productId)}`;
  }
  let url = `/${tab}`;
  if (tab === 'buy' && searchQuery) {
    url += `?brand=${encodeURIComponent(searchQuery)}`;
  }
  return url;
}

export function parseRouteFromLocation(): RouteState {
  if (typeof window === 'undefined') {
    return { tab: 'landing' };
  }

  let hash = window.location.hash.replace(/^#\/?/, '');
  if (hash.includes('?')) {
    hash = hash.split('?')[0];
  }

  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const pathSegments = pathname ? pathname.split('/') : [];

  const search = window.location.search;
  const searchParams = new URLSearchParams(search);
  const brandFromQuery = searchParams.get('brand') || searchParams.get('query') || searchParams.get('search');
  const tabFromQuery = searchParams.get('tab');
  // ?id= is kept as a fallback so any old bookmarked/shared links using the
  // previous query-string format still resolve correctly.
  const productIdFromQuery = searchParams.get('id');
  const legalFromQuery = searchParams.get('legal') as 'privacy' | 'terms' | 'warranty' | 'returns' | null;

  const firstSegment = pathSegments[0] || hash;

  if (['privacy', 'terms', 'warranty', 'returns'].includes(firstSegment)) {
    return {
      tab: 'landing',
      legalTab: firstSegment as 'privacy' | 'terms' | 'warranty' | 'returns',
      searchQuery: brandFromQuery || undefined,
      productId: productIdFromQuery || undefined,
    };
  }

  let matchedTab: TabType = 'landing';
  if (VALID_TABS.includes(firstSegment as TabType)) {
    matchedTab = firstSegment as TabType;
  } else if (tabFromQuery && VALID_TABS.includes(tabFromQuery as TabType)) {
    matchedTab = tabFromQuery as TabType;
  }

  // /product/<id> - the second path segment is the product id.
  const productIdFromPath = matchedTab === 'product' ? pathSegments[1] : undefined;

  return {
    tab: matchedTab,
    searchQuery: brandFromQuery || undefined,
    legalTab: legalFromQuery || undefined,
    productId: (productIdFromPath ? decodeURIComponent(productIdFromPath) : undefined) || productIdFromQuery || undefined,
  };
}

export function syncUrlWithRoute(
  tab: TabType,
  searchQuery?: string,
  legalTab?: 'privacy' | 'terms' | 'warranty' | 'returns',
  productId?: string,
  push: boolean = false
) {
  if (typeof window === 'undefined') return;
  
  const targetUrl = buildRouteUrl(tab, searchQuery, legalTab, productId);
  const currentUrl = window.location.pathname + window.location.search;
  
  if (currentUrl !== targetUrl || window.location.hash) {
    if (push) {
      window.history.pushState(null, '', targetUrl);
    } else {
      window.history.replaceState(null, '', targetUrl);
    }
  }
}
