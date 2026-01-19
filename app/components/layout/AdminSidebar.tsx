"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/context/AuthContext";
import { LayoutDashboard, CalendarRange, Users, Radio, LogOut, MessageSquare, Shield, UserCog } from "lucide-react";

const links = [
    { name: "Insights", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Event Manager", href: "/dashboard/admin/events", icon: CalendarRange },
    { name: "Member Database", href: "/dashboard/admin/members", icon: Users },
    { name: "Broadcasts", href: "/dashboard/admin/broadcasts", icon: Radio },
    { name: "Feedback Hub", href: "/dashboard/admin/feedback", icon: MessageSquare },
    { name: "User Management", href: "/dashboard/admin/users", icon: UserCog },
    { name: "Admin Team", href: "/dashboard/admin/admins", icon: Shield },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-slate-950/90 backdrop-blur-xl border-r border-red-500/20 flex flex-col p-6 z-40">
            <div className="mb-10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <div className="text-xl font-bold tracking-tight">
                    Command <span className="text-red-500">Center</span>
                </div>
            </div>

            <nav className="flex-1 flex flex-col gap-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                                isActive
                                    ? "bg-red-500/20 text-red-500 border border-red-500/50"
                                    : "text-dim hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-dim hover:text-white transition-colors w-full text-left"
                >
                    <LogOut className="w-5 h-5" />
                    Admin Logout
                </button>
            </div>
        </aside>
    );
}
