"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { TiltCard } from "@/app/components/ui/TiltCard";
import {
    ChevronLeft,
    CalendarRange,
    Users,
    Radio,
    BrainCircuit,
    Settings,
    ArrowRight,
    LayoutDashboard,
    MessageSquare,
    QrCode,
    Activity,
    Scan
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const adminApps = [
    {
        title: "Event Manager",
        description: "Create, edit, and orchestrate club activities.",
        icon: CalendarRange,
        href: "/dashboard/admin/events",
        color: "text-primary",
        bg: "bg-primary/10",
        border: "border-primary/20"
    },
    {
        title: "Member Database",
        description: "Manage the strategic leadership and core team.",
        icon: Users,
        href: "/dashboard/admin/members",
        color: "text-secondary",
        bg: "bg-secondary/10",
        border: "border-secondary/20"
    },
    {
        title: "Student Manager",
        description: "Oversee active student profiles and credentials.",
        icon: Users,
        href: "/dashboard/admin/users",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    },
    {
        title: "News Editor",
        description: "Publish updates and stories to the student hub.",
        icon: Radio,
        href: "/dashboard/admin/news",
        color: "text-pink-500",
        bg: "bg-pink-500/10",
        border: "border-pink-500/20"
    },
    {
        title: "Challenge Forge",
        description: "Architect coding trials and technical excellence.",
        icon: BrainCircuit,
        href: "/dashboard/admin/code-challenges",
        color: "text-accent",
        bg: "bg-accent/10",
        border: "border-accent/20"
    },
    {
        title: "Site Core",
        description: "Control foundational data: Domains, Stats, Meetups.",
        icon: Settings,
        href: "/dashboard/admin/site-data",
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20"
    },
    {
        title: "Broadcast Center",
        description: "Send announcements and alerts to all users.",
        icon: Radio,
        href: "/dashboard/admin/broadcasts",
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20"
    },
    {
        title: "Hackathon Hub",
        description: "Curate and manage coding competitions.",
        icon: CalendarRange,
        href: "/dashboard/admin/hackathons",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20"
    },
    {
        title: "Learning Paths",
        description: "Design learning paths and resources.",
        icon: Settings,
        href: "/dashboard/admin/roadmaps",
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
        border: "border-indigo-500/20"
    },
    {
        title: "Feedback Hub",
        description: "Monitor student sentiment and suggestions.",
        icon: MessageSquare,
        href: "/dashboard/admin/feedback",
        color: "text-teal-500",
        bg: "bg-teal-500/10",
        border: "border-teal-500/20"
    },
    {
        title: "Ticket Scanner",
        description: "Scan event tickets and mark attendance.",
        icon: Scan,
        href: "/dashboard/admin/scanner",
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20"
    },
    {
        title: "Attendance Analysis",
        description: "Analyze event check-ins and verify participation.",
        icon: Activity,
        href: "/dashboard/admin/attendance",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeStudents: 0,
        totalEvents: 0,
        totalRegistrations: 0,
        totalCheckins: 0
    });

    useEffect(() => {
        fetch("http://localhost:8000/api/admin/stats")
            .then(res => {
                if (!res.ok) throw new Error("Stats fetch failed");
                return res.json();
            })
            .then(data => setStats(data))
            .catch(err => console.error("Failed to fetch admin stats:", err));
    }, []);

    return (
        <div className="space-y-12 py-8 relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-dim hover:text-white transition-colors group mb-6"
                    >
                        <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Back to Home</span>
                    </Link>
                    <h1 className="text-4xl font-bold mb-2 italic">Admin <span className="text-secondary">Insights</span></h1>
                    <p className="text-dim text-lg">Central command center. What are we managing today?</p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-6 px-6 py-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                    <div className="flex flex-col items-end border-r border-white/10 pr-6">
                        <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-1">Platform Status</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-lg font-bold text-white uppercase tracking-tighter">Operational</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-start min-w-[120px]">
                        <span className="text-[10px] font-black text-dim uppercase tracking-[0.2em] mb-1">Active Students</span>
                        <span className="text-2xl font-black text-white">{(stats?.activeStudents || 0).toLocaleString()}</span>
                    </div>
                </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminApps.map((app, i) => (
                    <motion.div
                        key={app.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="h-full"
                    >
                        <Link href={app.href} className="block h-full">
                            <TiltCard className={`h-full group p-8 rounded-3xl border ${app.border} bg-card/40 hover:bg-white/5 transition-all`}>
                                <div className={`w-14 h-14 rounded-2xl ${app.bg} ${app.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <app.icon className="w-7 h-7" />
                                </div>

                                <h3 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors capitalize">
                                    {app.title}
                                </h3>
                                <p className="text-sm text-dim mb-6 leading-relaxed">
                                    {app.description}
                                </p>

                                <div className={`flex items-center gap-2 font-semibold ${app.color} opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300`}>
                                    <span>Manage Section</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </TiltCard>
                        </Link>
                    </motion.div>
                ))}

                {/* System Logs Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="h-full"
                >
                    <div className="h-full p-8 rounded-3xl border border-white/5 bg-white/5 flex flex-col items-center justify-center text-center opacity-50 group">
                        <LayoutDashboard className="w-10 h-10 text-dim mb-4 group-hover:rotate-12 transition-transform" />
                        <h3 className="text-xl font-bold mb-1">System Logs</h3>
                        <p className="text-sm text-dim">Audit trails & logs coming soon</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
