// Fallback to current host if NEXT_PUBLIC_API_URL is not provided
// This helps with cookie-based auth across different network interfaces (localhost vs IP)
const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

    // // Browser environment
    // if (typeof window !== "undefined") {
    //     // If running on localhost or local IP, use port 8000
    //     if (window.location.hostname === 'localhost' ||
    //         window.location.hostname === '127.0.0.1' ||
    //         window.location.hostname.startsWith('192.168.')) {
    //         return `${window.location.protocol}//${window.location.hostname}:8000`;
    //     }
    // } else {
    //     // Server side (building or SSR)
    //     if (process.env.NODE_ENV === 'development') {
    //         return "http://localhost:8000";
    //     }
    // }

    // Default to production backend
    return "https://intellexa-backend-dx5u.onrender.com";
};

export const API_BASE_URL = getBaseUrl();
