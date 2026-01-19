"use client";

import { DashboardGuard } from "@/app/components/auth/DashboardGuard";

import { Sidebar } from "@/app/components/layout/Sidebar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardGuard allowedRoles={['student']}>
            <div className="flex">
                <Sidebar />
                <main className="flex-1 ml-64 p-8">
                    {children}
                </main>
            </div>
        </DashboardGuard>
    );
}
