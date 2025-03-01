import { useAuth } from '../contexts/AuthContext';

export const createApiClient = () => {
    const { refreshAccessToken, accessToken, logout } = useAuth();

    const api = async (url: string, options: RequestInit = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            ...options.headers,
        };

        let response = await fetch(url, { ...options, headers });

        if (response.status === 401) {
            try {
                await refreshAccessToken();
                const newResponse = await fetch(url, {
                    ...options,
                    headers: { ...headers, Authorization: `Bearer ${accessToken}` }
                });
                return newResponse;
            } catch (error) {
                logout();
                throw error;
            }
        }

        return response;
    };

    return { api };
};