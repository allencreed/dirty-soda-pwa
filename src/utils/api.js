const isDev = import.meta.env.DEV
export const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || (isDev ? 'http://localhost:3001' : '')
