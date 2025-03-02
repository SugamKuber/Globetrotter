const DEV_API_URL = 'http://localhost:5000/api';
const PROD_API_URL = 'https://globetrotte.api.sugam.cloud/api';

const FRONTEND_DOMAIN = window.location.origin;

// Use DEV_API_URL if running on localhost, otherwise use PROD_API_URL
export const API_URL = FRONTEND_DOMAIN.includes("localhost") ? DEV_API_URL : PROD_API_URL;

console.log("Using API URL:", API_URL);
