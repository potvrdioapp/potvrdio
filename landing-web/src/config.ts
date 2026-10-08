export const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.endsWith('.local')
);

export const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || (
  isLocalhost ? 'http://localhost:3002' : 'https://dashboard.potvrdio.online'
);

export const API_URL = import.meta.env.VITE_API_URL || (
  isLocalhost ? 'http://localhost:4001' : ''
);
