export const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.endsWith('.local')
);

export const LANDING_URL = import.meta.env.VITE_LANDING_URL || (
  isLocalhost ? 'http://localhost:3000' : 'https://potvrdio.online'
);

export const API_URL = import.meta.env.VITE_API_URL || (
  isLocalhost ? 'http://localhost:4001' : 'https://potvrdio.online'
);
