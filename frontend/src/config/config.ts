const DEV_API_URL = 'http://localhost:5000/api';
const PROD_API_URL = 'https://globetrotte.api.sugam.cloud/api';

const FRONTEND_DOMAIN = window.location.origin;

export const API_URL = FRONTEND_DOMAIN.includes("localhost") ? DEV_API_URL : PROD_API_URL;