"use client";

import { useAuth } from "@/app/context/AuthContext";
import { motion } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/app/hooks/useTheme";

export function Hero() {
    const theme = useTheme();
    const { user } = useAuth();
    const dashboardLink = user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/student';

    // Festival greetings mapping
    const festivalGreetings: Record<string, string> = {
        "Pongal": "Happy Pongal! 🌾",
        "Holi": "Happy Holi! 🎨",
        "Independence Day": "Happy Independence Day! 🇮🇳",
        "Ganesh Chaturthi": "Happy Ganesh Chaturthi! 🙏",
        "Navratri": "Happy Navratri! 💃",
        "Diwali": "Happy Diwali! 🪔",
        "Children's Day": "Happy Children's Day! 🎈",
        "Christmas": "Merry Christmas! 🎄",
    };

    const greeting = theme && festivalGreetings[theme.name];

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
            </div>

            <div className="container px-4 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
                >
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-semibold tracking-wide text-dim uppercase">Official Tech Club of REC</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
                >
                    INTELLEXA
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl text-accent font-light tracking-widest uppercase mb-8"
                >
                    Innovate · Impact · Inspire
                </motion.p>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="max-w-2xl mx-auto text-dim text-lg mb-10 leading-relaxed"
                >
                    The epicenter of technical excellence at Rajalakshmi Engineering College.
                    Uniting minds in AI, Web Dev, IoT, and InfoSec to build the future.
                </motion.p>

                {/* Festival Greeting */}
                {greeting && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="mb-8"
                    >
                        <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                            {greeting}
                        </p>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: greeting ? 0.9 : 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    {user ? (
                        <Link href={dashboardLink} className="group relative px-8 py-4 bg-primary text-white font-bold rounded-xl overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] inline-block">
                            <span className="relative z-10 flex items-center gap-2">
                                Launch Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                    ) : (
                        <Link href="/signup" className="group relative px-8 py-4 bg-primary text-white font-bold rounded-xl overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] inline-block">
                            <span className="relative z-10 flex items-center gap-2">
                                Join The Revolution <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                    )}

                    <Link href="/events" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm inline-block">
                        Explore Events
                    </Link>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-dim/50 text-sm"
            >
                Scroll to discover
            </motion.div>
        </section>
    );
}
