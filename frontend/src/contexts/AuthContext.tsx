import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/config'

interface AuthContextType {
    isAuthenticated: boolean;
    accessToken: string | null;
    login: (tokens: { accessToken: string; refreshToken: string }) => void;
    logout: () => void;
    refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const initAuth = async () => {
            const storedAccess = localStorage.getItem('accessToken');
            const storedRefresh = localStorage.getItem('refreshToken');

            if (storedAccess && storedRefresh) {
                try {
                    const response = await fetch(`${API_URL}/user/me`, {
                        headers: { Authorization: `Bearer ${storedAccess}` }
                    });

                    if (response.ok) {
                        setIsAuthenticated(true);
                        setAccessToken(storedAccess);
                        setRefreshToken(storedRefresh);
                        navigate('/');
                    } else {
                        await handleTokenRefresh(storedRefresh);
                    }
                } catch (error) {
                    console.error('Token validation failed:', error);
                    logout();
                }
            }
        };

        initAuth();
    }, []);

    const handleTokenRefresh = async (refreshToken: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            });

            if (response.ok) {
                const { accessToken, refreshToken: newRefresh } = await response.json();
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefresh);
                setAccessToken(accessToken);
                setRefreshToken(newRefresh);
                setIsAuthenticated(true);
            } else {
                logout();
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
        }
    };

    const login = (tokens: { accessToken: string; refreshToken: string }) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        setIsAuthenticated(true);
        navigate('/');
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAccessToken(null);
        setRefreshToken(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    const refreshAccessToken = async () => {
        if (refreshToken) {
            await handleTokenRefresh(refreshToken);
        }
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            accessToken,
            login,
            logout,
            refreshAccessToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
