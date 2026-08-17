import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Prevent browser extension injection rejections (like MetaMask / Web3 provider noise) from breaking runtime
if (typeof window !== 'undefined') {
  const isExtensionError = (arg: any) => 
    typeof arg === 'string' && (arg.toLowerCase().includes('ethereum') || arg.toLowerCase().includes('metamask')) ||
    (arg instanceof Error && (arg.message.toLowerCase().includes('ethereum') || arg.message.toLowerCase().includes('metamask')));

  const suppressError = (msg: string | Event | unknown) => {
    return isExtensionError(msg);
  };

  window.addEventListener('error', (event) => {
    if (suppressError(event.message)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    if (
      event.reason &&
      (isExtensionError(event.reason) || event.reason.code === 4001)
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
  
  // Monkey patch console.error to avoid React error overlay from picking it up
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (!args.some(isExtensionError)) {
      originalError.apply(console, args);
    }
  };

  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (!args.some(isExtensionError)) {
      originalWarn.apply(console, args);
    }
  };

  const originalLog = console.log;
  console.log = (...args: any[]) => {
    if (!args.some(isExtensionError)) {
      originalLog.apply(console, args);
    }
  };

  const originalInfo = console.info;
  console.info = (...args: any[]) => {
    if (!args.some(isExtensionError)) {
      originalInfo.apply(console, args);
    }
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
