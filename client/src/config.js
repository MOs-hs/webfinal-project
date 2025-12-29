// API configuration for deployment
// Uses environment variable in production, localhost for development
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
