"use client";

import { DashboardGuard } from "@/app/components/auth/DashboardGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardGuard allowedRoles={['admin']}>
            <main className="min-h-screen p-8">
                {children}
            </main>
        </DashboardGuard>
    );
}
