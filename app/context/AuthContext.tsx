"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    username: string;
    role: 'admin' | 'student';
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // 1. Try to recover user from sessionStorage (Instant UI)
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // 2. Silent Refresh - Get new access token using refresh token cookie
        const checkSession = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${API_URL}/api/auth/refresh`, {
                    method: "POST",
                    credentials: "include" // Send refresh token cookie
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    setAccessToken(data.access_token); // Keep in memory only
                    // Sync user data to sessionStorage for UI recovery
                    sessionStorage.setItem("user", JSON.stringify(data.user));
                } else {
                    // Session invalid - clear everything
                    sessionStorage.removeItem("user");
                    setUser(null);
                    setAccessToken(null);
                }
            } catch (err) {
                console.error("Session Check Failed:", err);
                sessionStorage.removeItem("user");
                setUser(null);
                setAccessToken(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    const login = (userData: User, token: string) => {
        setUser(userData);
        setAccessToken(token); // Store in memory only
        sessionStorage.setItem("user", JSON.stringify(userData));
        // Note: Refresh token is automatically handled by backend via HttpOnly cookie

        if (userData.role === 'admin') {
            router.push("/dashboard/admin");
        } else {
            router.push("/dashboard/student");
        }
    };

    const logout = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            await fetch(`${API_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include" // Clear refresh token cookie
            });
        } catch (err) {
            console.error("Logout failed", err);
        }
        setUser(null);
        setAccessToken(null); // Clear memory
        sessionStorage.removeItem("user");
        router.push("/login");
    };

    const isAuthenticated = !!user && !!accessToken;

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout, isLoading, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
