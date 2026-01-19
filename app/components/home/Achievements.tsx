"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Trophy, Users, Calendar, ArrowRight } from "lucide-react";
import { GlassCard } from "@/app/components/ui/GlassCard";
import Image from "next/image";

const stats = [
    { label: "Hackathons Hosted", value: "12+", icon: Trophy },
    { label: "Workshops Conducted", value: "45+", icon: Calendar },
    { label: "Active Community", value: "2K+", icon: Users },
];

const meetups = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1000&auto=format&fit=crop",
        title: "GenAI Summit 2024",
        description: "Over 200 registered teams competing to build the future of AI."
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop",
        title: "Web3 Workshop",
        description: "Hands-on session on Smart Contracts and Ethereum basics."
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000&auto=format&fit=crop",
        title: "Tech Talk: Cloud Native",
        description: "Industry experts sharing insights on Kubernetes and Docker."
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop",
        title: "Annual Hackathon",
        description: "24-hour coding marathon with amazing prizes and mentors."
    }
];

import * as Icons from "lucide-react";

export function Achievements() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [statsData, setStatsData] = useState<any[]>(stats);
    const [meetupsData, setMeetupsData] = useState<any[]>(meetups);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const fetchStats = fetch(`${API_URL}/api/stats`).then(res => res.json());
        const fetchMeetups = fetch(`${API_URL}/api/meetups`).then(res => res.json());

        Promise.all([fetchStats, fetchMeetups])
            .then(([s, m]) => {
                setStatsData(s);
                setMeetupsData(m);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch achievements data:", err);
                setLoading(false); // Fallback to initial state (local data)
            });
    }, []);

    useEffect(() => {
        if (meetupsData.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % meetupsData.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [meetupsData.length]);

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-12 items-center">

                    {/* Left Side: Stats & Info */}
                    <div className="w-full md:w-1/2 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                                Recent Meetups
                            </h2>
                            <p className="text-dim text-lg leading-relaxed mb-8">
                                We believe in learning by doing. From intense 24-hour hackathons to casual weekend meetups,
                                we provide the platform for students to innovate and collaborate.
                            </p>

                            <div className="flex flex-col gap-4">
                                {loading ? (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
                                    ))
                                ) : (
                                    statsData.map((stat, i) => {
                                        const IconComponent = (Icons as any)[stat.icon] || Trophy;
                                        return (
                                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                                <div className="p-3 rounded-full bg-primary/10 text-primary">
                                                    <IconComponent className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                                                    <p className="text-sm text-dim uppercase tracking-wider">{stat.label}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Image Carousel */}
                    <div className="w-full md:w-1/2">
                        <div className="relative h-[400px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/10">
                            {loading ? (
                                <div className="absolute inset-0 bg-white/5 animate-pulse" />
                            ) : (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentIndex}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.7 }}
                                        className="absolute inset-0"
                                    >
                                        <Image
                                            src={meetupsData[currentIndex].image}
                                            alt={meetupsData[currentIndex].title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="absolute bottom-0 left-0 p-8"
                                        >
                                            <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-3 inline-block">
                                                Highlight #{currentIndex + 1}
                                            </span>
                                            <h3 className="text-2xl font-bold mb-2">{meetupsData[currentIndex].title}</h3>
                                            <p className="text-dim max-w-sm">{meetupsData[currentIndex].description}</p>
                                        </motion.div>
                                    </motion.div>
                                </AnimatePresence>
                            )}

                            {/* Indicators */}
                            <div className="absolute top-4 right-4 flex gap-2">
                                {meetupsData.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentIndex(i)}
                                        className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? "bg-white w-6" : "bg-white/30 hover:bg-white/50"}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
