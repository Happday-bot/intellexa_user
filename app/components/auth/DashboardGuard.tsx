"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface DashboardGuardProps {
    children: React.ReactNode;
    allowedRoles?: ('admin' | 'student')[];
}

export function DashboardGuard({ children, allowedRoles }: DashboardGuardProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                // Not authenticated -> Login
                // Extract return URL logic here if needed
                router.push("/login");
            } else if (allowedRoles && !allowedRoles.includes(user.role)) {
                // Unauthorized Role
                if (user.role === 'student' && pathname.startsWith('/dashboard/admin')) {
                    router.push("/dashboard/student");
                } else if (user.role === 'admin' && pathname === '/dashboard/student') {
                    // Admins redirected to admin dash if they hit root student dash?
                    // Or allowed? Let's redirect for strict separation as requested.
                    router.push("/dashboard/admin");
                }
            }
        }
    }, [user, isLoading, router, pathname, allowedRoles]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!user) return null; // Will redirect
    if (allowedRoles && !allowedRoles.includes(user.role)) return null; // Will redirect

    return <>{children}</>;
}
