"use client";

import { motion } from "framer-motion";
import { TiltCard } from "@/app/components/ui/TiltCard";
import { Calendar, Tag, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const newsItems = [
    {
        id: 1,
        title: "GPT-5 Rumors & What to Expect",
        category: "AI",
        date: "Jan 03, 2026",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
        summary: "As OpenAI gears up for its next big release, the tech world buzzes with speculation about multimodal capabilities and reasoning improvements."
    },
    {
        id: 2,
        title: "The Rise of Spatial Computing",
        category: "AR/VR",
        date: "Dec 28, 2025",
        image: "https://images.unsplash.com/photo-1626379953822-baec19c3accd?q=80&w=1000&auto=format&fit=crop",
        summary: "With new headsets hitting the market, we explore how spatial computing is transforming workflows beyond just gaming."
    },
    {
        id: 3,
        title: "Next.js 15: Server Actions 2.0",
        category: "Web Dev",
        date: "Dec 15, 2025",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
        summary: "Vercel's latest update promises even faster mutations and better type safety. Here is a deep dive into the changelog."
    },
    {
        id: 4,
        title: "Cybersecurity in the Age of Quantum",
        category: "Security",
        date: "Nov 30, 2025",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
        summary: "How post-quantum cryptography is becoming a necessity for modern enterprises."
    },
    {
        id: 5,
        title: "Green Tech: Sustainable Data Centers",
        category: "Hardware",
        date: "Nov 10, 2025",
        image: "https://images.unsplash.com/photo-1558494949-ef2a0198e716?q=80&w=1000&auto=format&fit=crop",
        summary: "Major cloud providers are committing to carbon-negative goals. What does this mean for the future of compute?"
    },
    {
        id: 6,
        title: "Rust for Linux Kernel Development",
        category: "OS",
        date: "Oct 25, 2025",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
        summary: "The integration of Rust into the Linux kernel is gaining momentum, promising memory safety for core components."
    }
];

import { useState, useEffect } from "react";

export default function NewsPage() {
    const [newsData, setNewsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/api/news")
            .then(res => res.json())
            .then(data => {
                setNewsData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch news:", err);
                setNewsData(newsItems); // Fallback to local data
                setLoading(false);
            });
    }, []);

    return (
        <main className="min-h-screen pt-24 pb-20 px-4 bg-bg-dark">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold mb-4">Tech <span className="text-primary">Chronicles</span></h1>
                    <p className="text-dim text-lg">Curated insights from the bleeding edge of technology.</p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse" />
                        ))
                    ) : (
                        newsData.map((news, i) => (
                            <motion.div
                                key={news.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="perspective-1000 h-full"
                            >
                                <TiltCard className="h-full w-full rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl overflow-hidden group">
                                    <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
                                        <Image
                                            src={news.image}
                                            alt={news.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                                        <div className="absolute bottom-4 left-4">
                                            <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full border border-white/10 flex items-center gap-2 w-fit">
                                                <Tag className="w-3 h-3" /> {news.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center text-dim text-xs mb-3 gap-2">
                                            <Calendar className="w-3 h-3" />
                                            <span>{news.date}</span>
                                        </div>

                                        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                                            {news.title}
                                        </h3>

                                        <p className="text-dim text-sm leading-relaxed mb-6 flex-1">
                                            {news.summary}
                                        </p>

                                        <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 font-semibold text-sm group/btn border border-white/5">
                                            Read Full Article
                                            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
