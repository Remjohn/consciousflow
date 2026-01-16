/**
 * API Configuration for Production Deployment
 * 
 * - Production (Netlify): VITE_API_URL is empty, calls are relative (/api/*)
 * - Development: Falls back to localhost:3000
 */

// API base URL - empty in production means relative calls via Netlify redirects
const envUrl = import.meta.env.VITE_API_URL;
export const API_URL = envUrl !== undefined && envUrl !== ''
    ? envUrl
    : (import.meta.env.DEV ? 'http://localhost:3000' : '');

// Helper to construct full API URLs
export const apiUrl = (path: string) => `${API_URL}${path}`;

// Typed fetch helpers
export const api = {
    get: async (path: string) => {
        const res = await fetch(apiUrl(path));
        return res;
    },

    post: async (path: string, data?: any) => {
        const res = await fetch(apiUrl(path), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data ? JSON.stringify(data) : undefined
        });
        return res;
    },

    put: async (path: string, data?: any) => {
        const res = await fetch(apiUrl(path), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: data ? JSON.stringify(data) : undefined
        });
        return res;
    },

    delete: async (path: string) => {
        const res = await fetch(apiUrl(path), { method: 'DELETE' });
        return res;
    },

    upload: async (path: string, formData: FormData) => {
        const res = await fetch(apiUrl(path), {
            method: 'POST',
            body: formData
        });
        return res;
    }
};

// For image URLs (photos, etc.)
export const assetUrl = (path: string) => path ? `${API_URL}${path}` : '';
