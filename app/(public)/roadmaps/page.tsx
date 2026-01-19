"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TiltCard } from "@/app/components/ui/TiltCard";
import { CheckCircle2, ChevronRight, ExternalLink, PlayCircle, BookOpen, Layers } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function RoadmapsPage() {
    const [roadmaps, setRoadmaps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost:8000/api/roadmaps")
            .then(res => res.json())
            .then(data => {
                setRoadmaps(data);
                if (data.length > 0) setActiveTab(data[0].id);
                setLoading(false);
            })
            .catch(err => console.error("Failed to fetch roadmaps:", err));
    }, []);

    const activeData = roadmaps.find(r => r.id === activeTab) || roadmaps[0];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-bg-dark">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (roadmaps.length === 0) return (
        <div className="min-h-screen flex items-center justify-center bg-bg-dark text-dim">
            No roadmaps available at the moment.
        </div>
    );

    return (
        <main className="min-h-screen pt-24 pb-20 px-4 bg-bg-dark">
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl font-bold mb-4">Learning <span className="text-primary">Hub</span></h1>
                    <p className="text-dim text-lg max-w-2xl mx-auto">
                        Your guided path to mastery. Select a domain to see the roadmap and curated resources.
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {roadmaps.map((domain) => (
                        <button
                            key={domain.id}
                            onClick={() => setActiveTab(domain.id)}
                            className={cn(
                                "px-6 py-3 rounded-full border transition-all duration-300 flex items-center gap-2",
                                activeTab === domain.id
                                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-105"
                                    : "bg-white/5 text-dim border-white/10 hover:bg-white/10 hover:border-white/20"
                            )}
                        >
                            <span className="font-semibold">{domain.label}</span>
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid lg:grid-cols-12 gap-12"
                    >
                        {/* Left Column: Roadmap Timeline */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-24">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Layers className="w-6 h-6" />
                                    </div>
                                    Steps to Mastery
                                </h2>

                                <div className="relative border-l-2 border-primary/20 ml-6 space-y-10 pb-10">
                                    {activeData.roadmap.map((step: any, idx: number) => (
                                        <div key={idx} className="relative pl-8 group cursor-default">
                                            {/* Connector Dot */}
                                            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-bg-dark border-2 border-primary group-hover:scale-125 transition-transform duration-300 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>

                                            <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{step.title}</h3>
                                            <p className="text-dim text-sm">{step.desc}</p>
                                        </div>
                                    ))}
                                    {/* End Cap */}
                                    <div className="absolute -left-[9px] bottom-0 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary/50" />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Resources Grid */}
                        <div className="lg:col-span-7">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                Curated Resources
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {activeData.resources.map((resource: any, i: number) => (
                                    <Link key={i} href={resource.link} target="_blank">
                                        <TiltCard className="h-full group bg-card/40 border-white/10 overflow-hidden">
                                            <div className="relative h-40 w-full overflow-hidden">
                                                <Image
                                                    src={resource.image}
                                                    alt={resource.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                                />
                                                <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold border border-white/10 uppercase tracking-wider text-white">
                                                    {resource.type}
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-lg leading-tight group-hover:text-blue-400 transition-colors pr-2">
                                                        {resource.title}
                                                    </h3>
                                                    <ExternalLink className="w-4 h-4 text-dim group-hover:text-white transition-colors shrink-0 mt-1" />
                                                </div>
                                                <p className="text-sm text-dim">{resource.desc}</p>
                                            </div>
                                        </TiltCard>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </main>
    );
}

