import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Prevent browser extension injection rejections (like MetaMask / Web3 provider noise) from breaking runtime
if (typeof window !== 'undefined') {
  const suppressError = (msg: string | Event | unknown) => {
    if (typeof msg === 'string' && (msg.includes('ethereum') || msg.includes('MetaMask'))) {
      return true;
    }
    return false;
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
      (event.reason.message?.includes('MetaMask') ||
        event.reason.message?.includes('ethereum') ||
        event.reason.code === 4001)
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
  
  // Monkey patch console.error to avoid React error overlay from picking it up
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const isExtensionError = args.some(arg => 
      typeof arg === 'string' && (arg.includes('ethereum') || arg.includes('MetaMask')) ||
      (arg instanceof Error && (arg.message.includes('ethereum') || arg.message.includes('MetaMask')))
    );
    if (!isExtensionError) {
      originalError.apply(console, args);
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
