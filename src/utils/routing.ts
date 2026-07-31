import { TabType } from '../components/Header';

export interface RouteState {
  tab: TabType;
  searchQuery?: string;
  legalTab?: 'privacy' | 'terms' | 'warranty' | 'returns';
}

const VALID_TABS: TabType[] = [
  'landing',
  'sell',
  'buy',
  'track',
  'repair',
  'about',
  'how-it-works',
  'recycle',
  'contact',
  'agent',
  'admin'
];

export function buildRouteUrl(
  tab: TabType,
  searchQuery?: string,
  legalTab?: 'privacy' | 'terms' | 'warranty' | 'returns'
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
  return url;
}

export function parseRouteFromLocation(): RouteState {
  if (typeof window === 'undefined') {
    return { tab: 'landing' };
  }

  // Handle legacy hash e.g. #sell or #buy?brand=Apple if opened from an old bookmark
  let hash = window.location.hash.replace(/^#\/?/, '');
  if (hash.includes('?')) {
    hash = hash.split('?')[0];
  }

  // Extract clean pathname e.g. "/sell" -> "sell", "/" -> ""
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const search = window.location.search;
  const searchParams = new URLSearchParams(search);
  const brandFromQuery = searchParams.get('brand') || searchParams.get('query') || searchParams.get('search');
  const tabFromQuery = searchParams.get('tab');
  const legalFromQuery = searchParams.get('legal') as 'privacy' | 'terms' | 'warranty' | 'returns' | null;

  // Active path segment
  const activeRoute = pathname || hash;

  // Handle legal aliases /privacy, /terms, /warranty, /returns
  if (['privacy', 'terms', 'warranty', 'returns'].includes(activeRoute)) {
    return {
      tab: 'landing',
      legalTab: activeRoute as 'privacy' | 'terms' | 'warranty' | 'returns',
      searchQuery: brandFromQuery || undefined,
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
  };
}

export function syncUrlWithRoute(
  tab: TabType,
  searchQuery?: string,
  legalTab?: 'privacy' | 'terms' | 'warranty' | 'returns',
  push: boolean = false
) {
  if (typeof window === 'undefined') return;
  const targetUrl = buildRouteUrl(tab, searchQuery, legalTab);
  const currentUrl = window.location.pathname + window.location.search;

  if (currentUrl !== targetUrl || window.location.hash) {
    if (push) {
      window.history.pushState(null, '', targetUrl);
    } else {
      window.history.replaceState(null, '', targetUrl);
    }
  }
}
