"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TiltCard } from "@/app/components/ui/TiltCard";
import {
    Ticket,
    BrainCircuit,
    Users,
    FileText,
    Trophy,
    ArrowRight,
    Zap,
    UserCircle,
    Medal,
    Crown,
    Star,
    ChevronLeft,
    MessageSquareHeart,
    Code2,
    X
} from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { useAuth } from "@/app/context/AuthContext";

// Leaderboard data will be fetched from the backend

const dashboardApps = [
    {
        title: "My Tickets",
        description: "View your event passes and QR codes.",
        icon: Ticket,
        href: "/dashboard/student/tickets",
        color: "text-pink-500",
        bg: "bg-pink-500/10",
        border: "border-pink-500/20"
    },
    {
        title: "My Profile",
        description: "Manage your personal and academic details.",
        icon: UserCircle,
        href: "/dashboard/student/profile",
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20"
    },
    {
        title: "Team Finder",
        description: "Find teammates for upcoming hackathons.",
        icon: Users,
        href: "/dashboard/student/team",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    },
    {
        title: "Resume Analyzer",
        description: "AI-powered resume optimization.",
        icon: FileText,
        href: "/dashboard/student/resume",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20"
    },
    {
        title: "Code & Conquer",
        description: "Master algorithms in Java, C++, Python, and more.",
        icon: Code2,
        href: "/dashboard/student/code-and-conquer",
        color: "text-green-500",
        bg: "bg-green-500/10",
        border: "border-green-500/20"
    },
    {
        title: "Feedback Hub",
        description: "Rate events and share your suggestions.",
        icon: MessageSquareHeart,
        href: "/dashboard/student/feedback",
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20"
    },
];

export default function StudentDashboard() {
    const { user } = useAuth();
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [progress, setProgress] = useState<any>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loadingProgress, setLoadingProgress] = useState(true);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

    useEffect(() => {
        if (user) {
            // Fetch personal progress
            fetch(`http://localhost:8000/api/progress/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setProgress(data);
                    setLoadingProgress(false);
                })
                .catch(err => {
                    console.error("Failed to fetch progress:", err);
                    setLoadingProgress(false);
                });

            // Fetch global leaderboard
            fetch("http://localhost:8000/api/leaderboard")
                .then(res => res.json())
                .then(data => {
                    // Ensure data is an array before setting
                    setLeaderboard(Array.isArray(data) ? data : []);
                    setLoadingLeaderboard(false);
                })
                .catch(err => {
                    console.error("Failed to fetch leaderboard:", err);
                    setLeaderboard([]);
                    setLoadingLeaderboard(false);
                });
        }
    }, [user]);

    // Filter top 10 for the main list - safely handle potential non-array
    const topLeaderboard = Array.isArray(leaderboard) ? leaderboard.slice(0, 10) : [];
    // Use real stats if available
    const currentUserStats = Array.isArray(leaderboard) ? leaderboard.find(u => u.userId === user?.id) : null;

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
                    <h1 className="text-4xl font-bold mb-2">Welcome Back, <span className="text-primary">{user?.name || "Student"}</span></h1>
                    <p className="text-dim text-lg">Your central command center. What are we building today?</p>
                </div>

                {/* Reward Points Badge - Clickable */}
                <button
                    onClick={() => setShowLeaderboard(true)}
                    className="group relative flex items-center gap-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 hover:border-yellow-500/50 hover:from-yellow-500/20 hover:to-amber-500/20 transition-all duration-300"
                >
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-yellow-500/80 uppercase tracking-wider group-hover:text-yellow-400 transition-colors">Reward Points</span>
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-500 fill-current" />
                            <span className="text-2xl font-black text-white">{currentUserStats?.points || 0}</span>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-yellow-500/20" />
                    <div className="flex flex-col items-start">
                        <span className="text-xs font-bold text-dim uppercase tracking-wider group-hover:text-white transition-colors">Rank</span>
                        <div className="flex items-center gap-1">
                            <span className="text-xl font-bold text-white">#{currentUserStats?.rank || "-"}</span>
                        </div>
                    </div>

                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-yellow-500/5 blur-xl group-hover:bg-yellow-500/10 transition-colors opacity-0 group-hover:opacity-100" />
                </button>
            </motion.div>

            {/* Leaderboard Modal */}
            <AnimatePresence>
                {showLeaderboard && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLeaderboard(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 m-auto z-50 max-w-2xl h-[80vh] w-[90%] pointer-events-none flex items-center justify-center"
                        >
                            <GlassCard className="w-full h-full flex flex-col pointer-events-auto p-0 overflow-hidden border-yellow-500/20 shadow-2xl shadow-yellow-500/10">
                                {/* Header */}
                                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-yellow-500/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-xl bg-yellow-500/20 text-yellow-500">
                                            <Trophy className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
                                            <p className="text-dim text-sm">Top performing students this semester</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowLeaderboard(false)}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-dim hover:text-white" />
                                    </button>
                                </div>

                                {/* List */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
                                    {leaderboard.map((u, index) => {
                                        const isCurrentUser = u.userId === user?.id;
                                        const isTop3 = index < 3;
                                        const RankIcon = index === 0 ? Crown : index === 1 ? Medal : index === 2 ? Star : null;

                                        return (
                                            <div key={index} className={`flex items-center gap-4 p-4 rounded-2xl ${isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'bg-white/5 border border-white/10'}`}>
                                                <div className="w-8 text-center font-bold text-dim flex justify-center">
                                                    {isTop3 && RankIcon ? (
                                                        <RankIcon className={`w-6 h-6 ${index === 0 ? "text-yellow-400 fill-current" :
                                                            index === 1 ? "text-slate-300 fill-current" :
                                                                "text-amber-600 fill-current"
                                                            }`} />
                                                    ) : (
                                                        `#${u.leaderboardRank}`
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <img src={u.avatar} alt={u.username} className="w-10 h-10 rounded-full bg-slate-800" />
                                                    {u.leaderboardRank <= 3 && (
                                                        <div className="absolute -top-1 -right-1">
                                                            <Crown className={`w-4 h-4 ${u.leaderboardRank === 1 ? 'text-yellow-500' : u.leaderboardRank === 2 ? 'text-gray-400' : 'text-amber-600'}`} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold flex items-center gap-2">
                                                        {u.name}
                                                        {isCurrentUser && <span className="text-[10px] bg-primary text-black px-1.5 py-0.5 rounded font-black italic shadow-sm shadow-primary/20">YOU</span>}
                                                    </div>
                                                    <div className="text-xs text-dim italic">@{u.username} • {u.rank}</div>
                                                </div>
                                                <div className="text-right flex flex-col items-end">
                                                    <div className="font-bold text-primary flex items-center gap-1">
                                                        <Zap className="w-3 h-3 fill-current" />
                                                        {u.points}
                                                    </div>
                                                    <div className="text-[10px] text-dim font-black tracking-widest uppercase">XP</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Footer User Stats */}
                                {currentUserStats && (
                                    <div className="p-4 bg-primary/10 border-t border-primary/20 backdrop-blur-md">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-dim">Your Current Rank</span>
                                            <div className="flex items-center gap-6">
                                                <span className="font-bold text-white">#{currentUserStats.leaderboardRank}</span>
                                                <span className="font-bold text-yellow-500 flex items-center gap-1">
                                                    <Zap className="w-3 h-3 fill-current" />
                                                    {currentUserStats.points} pts
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </GlassCard>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardApps.map((app, i) => (
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
                                <p className="text-dim mb-6 leading-relaxed">
                                    {app.description}
                                </p>

                                <div className={`flex items-center gap-2 font-semibold ${app.color} opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300`}>
                                    <span>Open App</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </TiltCard>
                        </Link>
                    </motion.div>
                ))}

                {/* Coming Soon Tile */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="h-full"
                >
                    <div className="h-full p-8 rounded-3xl border border-white/5 bg-white/5 flex flex-col items-center justify-center text-center opacity-50">
                        <Trophy className="w-10 h-10 text-dim mb-4" />
                        <h3 className="text-xl font-bold mb-1">More Coming Soon</h3>
                        <p className="text-sm text-dim">Leaderboards & Challenges</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
