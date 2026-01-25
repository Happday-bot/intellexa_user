"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TiltCard } from "@/app/components/ui/TiltCard";
import { Calendar, MapPin, Trophy, ExternalLink, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/app/config/api";

export default function HackathonsPage() {
    const [hackathons, setHackathons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/hackathons`)
            .then(res => res.json())
            .then(data => {
                setHackathons(data);
                setLoading(false);
            })
            .catch(err => console.error("Failed to fetch hackathons:", err));
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-bg-dark">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );
    return (
        <main className="min-h-screen pt-24 pb-20 px-4 bg-bg-dark">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold mb-4">Hackathon <span className="text-primary">Central</span></h1>
                    <p className="text-dim text-lg">Curated list of the best coding battles happening around you.</p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {hackathons.map((hack: any, i: number) => (
                        <motion.div
                            key={hack.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="perspective-1000 h-full"
                        >
                            <TiltCard className="h-full w-full rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl overflow-hidden group flex flex-col">
                                <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                                    <Image
                                        src={hack.image}
                                        alt={hack.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

                                    <div className="absolute top-4 right-4 px-3 py-1 bg-primary/80 backdrop-blur-md rounded-full text-xs font-bold border border-white/20 shadow-lg shadow-primary/20">
                                        {hack.prize} Pool
                                    </div>

                                    <div className="absolute bottom-4 left-4">
                                        <p className="text-xs text-white/80 uppercase tracking-widest font-semibold mb-1">{hack.organizer}</p>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                                        {hack.title}
                                    </h3>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {hack.tags.map((tag: string) => (
                                            <span key={tag} className="text-[10px] font-bold px-2 py-1 rounded bg-white/5 border border-white/5 text-dim">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="space-y-3 mb-6 flex-1">
                                        <div className="flex items-center gap-3 text-sm text-dim">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span>{hack.date}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-dim">
                                            <Globe className="w-4 h-4 text-primary" />
                                            <span>{hack.mode}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-dim">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            <span>{hack.location}</span>
                                        </div>
                                    </div>

                                    <Link href={hack.link} target="_blank" className="block">
                                        <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 font-bold text-sm group/btn border border-white/5 hover:border-primary/30 hover:text-primary">
                                            Apply Now
                                            <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                        </button>
                                    </Link>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
