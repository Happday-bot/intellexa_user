"use client";

import { motion } from "framer-motion";
import { TiltCard } from "@/app/components/ui/TiltCard";
import { Calendar, Tag, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { newsItems } from "@/app/data/newsData";

import { useState, useEffect } from "react";

import { API_BASE_URL } from "@/app/config/api";

export default function NewsPage() {
    const [newsData, setNewsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/news`)
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

                                        {news.link ? (
                                            <a href={news.link} target="_blank" rel="noopener noreferrer" className="w-full">
                                                <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 font-semibold text-sm group/btn border border-white/5">
                                                    Read Full Article
                                                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                                </button>
                                            </a>
                                        ) : (
                                            <Link href={`/news/${news.id}`} className="w-full">
                                                <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 font-semibold text-sm group/btn border border-white/5">
                                                    Read Full Story
                                                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                                </button>
                                            </Link>
                                        )}
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
