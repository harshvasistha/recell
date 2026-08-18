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
  'product'
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
  let url = `/${tab}`;
  if (tab === 'buy' && searchQuery) {
    url += `?brand=${encodeURIComponent(searchQuery)}`;
  }
  if (tab === 'product' && productId) {
    url += `?id=${encodeURIComponent(productId)}`;
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
  
  const search = window.location.search;
  const searchParams = new URLSearchParams(search);
  const brandFromQuery = searchParams.get('brand') || searchParams.get('query') || searchParams.get('search');
  const tabFromQuery = searchParams.get('tab');
  const productIdFromQuery = searchParams.get('id');
  const legalFromQuery = searchParams.get('legal') as 'privacy' | 'terms' | 'warranty' | 'returns' | null;

  const activeRoute = pathname || hash;

  if (['privacy', 'terms', 'warranty', 'returns'].includes(activeRoute)) {
    return {
      tab: 'landing',
      legalTab: activeRoute as 'privacy' | 'terms' | 'warranty' | 'returns',
      searchQuery: brandFromQuery || undefined,
      productId: productIdFromQuery || undefined,
    };
  }

  let matchedTab: TabType = 'landing';
  if (VALID_TABS.includes(activeRoute as TabType)) {
    matchedTab = activeRoute as TabType;
  } else if (tabFromQuery && VALID_TABS.includes(tabFromQuery as TabType)) {
    matchedTab = tabFromQuery as TabType;
  }

  return {
    tab: matchedTab,
    searchQuery: brandFromQuery || undefined,
    legalTab: legalFromQuery || undefined,
    productId: productIdFromQuery || undefined,
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
