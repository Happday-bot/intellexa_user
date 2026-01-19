"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Ticket,
    BrainCircuit,
    Users,
    Settings,
    LogOut,
    CalendarRange,
    Radio,
    Home
} from "lucide-react";

export function FloatingDock({ type }: { type: 'student' | 'admin' }) {
    const pathname = usePathname();

    const studentLinks = [
        { name: "Overview", href: "/dashboard/student", icon: Home },
        { name: "Tickets", href: "/dashboard/student/tickets", icon: Ticket },
        { name: "Skills", href: "/dashboard/student/skills", icon: BrainCircuit },
        { name: "Team Finder", href: "/dashboard/student/team", icon: Users },
        { name: "Resume AI", href: "/dashboard/student/resume", icon: Settings },
    ];

    const adminLinks = [
        { name: "Insights", href: "/dashboard/admin", icon: LayoutDashboard },
        { name: "Events", href: "/dashboard/admin/events", icon: CalendarRange },
        { name: "Members", href: "/dashboard/admin/members", icon: Users },
        { name: "News", href: "/dashboard/admin/news", icon: Radio },
        { name: "Challenges", href: "/dashboard/admin/code-challenges", icon: BrainCircuit },
        { name: "Site Data", href: "/dashboard/admin/site-data", icon: Settings },
    ];

    const links = type === 'admin' ? adminLinks : studentLinks;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-2 p-3 rounded-full bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-primary/10"
            >
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="relative group"
                        >
                            <div
                                className={cn(
                                    "p-3 rounded-full transition-all duration-300 hover:bg-white/10 flex items-center justify-center",
                                    isActive ? "bg-primary text-white scale-110" : "text-dim"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                            </div>

                            {/* Tooltip */}
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 rounded border border-white/10 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {link.name}
                            </span>
                        </Link>
                    );
                })}

                <div className="w-px h-8 bg-white/10 mx-2" />

                <button className="p-3 rounded-full hover:bg-red-500/20 text-red-400 transition-colors group relative">
                    <LogOut className="w-5 h-5" />
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 rounded border border-white/10 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Logout
                    </span>
                </button>
            </motion.div>
        </div>
    );
}
