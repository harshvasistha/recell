import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// The browser's default scroll restoration ('auto') tries to restore the
// scroll position from before a reload. On this app that lands the page
// near the footer on reload: the browser restores scroll based on the
// page's height at the moment it captured the old position, but this is a
// single-page app whose content (and therefore page height) is still
// being fetched/rendered at reload time, so the restored scroll offset no
// longer corresponds to where it should be. Setting this to 'manual'
// disables that automatic restoration - the app is responsible for its
// own scroll position (see the scrollTo(0, 0) in App.tsx's route effect).
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
