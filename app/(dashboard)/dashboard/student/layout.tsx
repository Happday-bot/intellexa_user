"use client";

import { DashboardGuard } from "@/app/components/auth/DashboardGuard";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardGuard allowedRoles={['student']}>
            <main className="min-h-screen p-8">
                {children}
            </main>
        </DashboardGuard>
    );
}
