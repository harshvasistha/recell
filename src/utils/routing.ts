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

export function parseRouteFromLocation(): RouteState {
  if (typeof window === 'undefined') {
    return { tab: 'landing' };
  }

  let hash = window.location.hash.replace(/^#\/?/, '');
  let pathname = window.location.pathname.replace(/^\//, '');
  let search = window.location.search;

  // Handle case where query is appended inside hash e.g., #buy?brand=Apple
  if (hash.includes('?')) {
    const parts = hash.split('?');
    hash = parts[0];
    if (!search) search = '?' + parts[1];
  }

  const searchParams = new URLSearchParams(search);
  const brandFromQuery = searchParams.get('brand') || searchParams.get('query') || searchParams.get('search');
  const tabFromQuery = searchParams.get('tab');
  const legalFromQuery = searchParams.get('legal') as 'privacy' | 'terms' | 'warranty' | 'returns' | null;

  let matchedTab: TabType = 'landing';

  // Check Hash first
  if (VALID_TABS.includes(hash as TabType)) {
    matchedTab = hash as TabType;
  }
  // Check Pathname second
  else if (VALID_TABS.includes(pathname as TabType)) {
    matchedTab = pathname as TabType;
  }
  // Check Query param third
  else if (tabFromQuery && VALID_TABS.includes(tabFromQuery as TabType)) {
    matchedTab = tabFromQuery as TabType;
  }

  // Handle aliases like #privacy, #terms, #warranty, #returns
  if (['privacy', 'terms', 'warranty', 'returns'].includes(hash)) {
    return {
      tab: 'landing',
      legalTab: hash as 'privacy' | 'terms' | 'warranty' | 'returns'
    };
  }

  return {
    tab: matchedTab,
    searchQuery: brandFromQuery || undefined,
    legalTab: legalFromQuery || undefined,
  };
}

export function buildRouteUrl(tab: TabType, searchQuery?: string): string {
  let url = `#${tab}`;
  if (tab === 'buy' && searchQuery) {
    url += `?brand=${encodeURIComponent(searchQuery)}`;
  }
  return url;
}

export function syncUrlWithRoute(tab: TabType, searchQuery?: string) {
  if (typeof window === 'undefined') return;
  const targetUrl = buildRouteUrl(tab, searchQuery);
  if (window.location.hash !== targetUrl) {
    window.history.replaceState(null, '', targetUrl);
  }
}
