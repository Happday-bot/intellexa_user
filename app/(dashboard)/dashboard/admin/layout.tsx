"use client";

import { DashboardGuard } from "@/app/components/auth/DashboardGuard";

import { AdminSidebar } from "@/app/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardGuard allowedRoles={['admin']}>
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 ml-64 p-8">
                    {children}
                </main>
            </div>
        </DashboardGuard>
    );
}
