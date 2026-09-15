import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Support external backend for GitHub Pages or decoupled frontend
const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
if (apiBase) {
  const originalFetch = window.fetch;
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      return originalFetch(`${apiBase}${input}`, init);
    }
    return originalFetch(input, init);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
