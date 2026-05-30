import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress ResizeObserver and Finnhub background errors
const isSuppressibleError = (msg: string) => {
  const lowercaseMsg = msg.toLowerCase();
  return (
    lowercaseMsg.includes('resizeobserver') ||
    lowercaseMsg.includes('limit exceeded') ||
    lowercaseMsg.includes('undelivered notifications') ||
    lowercaseMsg.includes('finnhub') ||
    lowercaseMsg.includes('poll failed')
  );
};

window.addEventListener('error', (e) => {
  const msg = e.message || '';
  if (isSuppressibleError(msg)) {
    const resizeObserverErrDiv = document.getElementById('webpack-dev-server-client-overlay-div');
    const resizeObserverErr = document.getElementById('webpack-dev-server-client-overlay');
    if (resizeObserverErr) resizeObserverErr.setAttribute('style', 'display: none');
    if (resizeObserverErrDiv) resizeObserverErrDiv.setAttribute('style', 'display: none');
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
});

window.addEventListener('unhandledrejection', (e) => {
  const msg = e.reason?.message || (e.reason && String(e.reason)) || '';
  if (isSuppressibleError(msg)) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
});

const originalOnError = window.onerror;
window.onerror = function (message, source, lineno, colno, error) {
  const msg = String(message || '');
  if (isSuppressibleError(msg)) {
    return true; // suppresses native error bubble
  }
  if (originalOnError) {
    return originalOnError.apply(this, arguments as any);
  }
  return false;
};

// Also safely override console.error to ignore these noise errors
const originalConsoleError = console.error;
console.error = function (...args) {
  const combined = args.map(arg => String(arg)).join(' ');
  if (isSuppressibleError(combined)) {
    return;
  }
  originalConsoleError.apply(console, args);
};

const originalConsoleWarn = console.warn;
console.warn = function (...args) {
  const combined = args.map(arg => String(arg)).join(' ');
  if (isSuppressibleError(combined)) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
