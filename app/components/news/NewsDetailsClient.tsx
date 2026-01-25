"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { Calendar, Tag, ArrowLeft, Share2, MessageSquare, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/app/config/api";

export default function NewsDetailsClient({ newsId, initialNews }: { newsId: number; initialNews: any }) {
    const [news, setNews] = useState<any>(initialNews);
    const [loading, setLoading] = useState(!initialNews);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/news/${newsId}`);
                if (res.ok) {
                    const data = await res.json();
                    setNews(data);
                }
            } catch (err) {
                console.error("Error fetching news:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [newsId]);

    if (loading && !news) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-dark text-white">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!news) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-dark text-white">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4 text-primary">Article Not Found</h1>
                    <p className="text-dim mb-8">The news article you are looking for does not exist or has been moved.</p>
                    <Link href="/news" className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors">
                        Back to Chronicles
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-24 pb-20 px-4 bg-bg-dark text-white text-left">
            <div className="container mx-auto max-w-4xl">
                <Link href="/news" className="inline-flex items-center gap-2 text-dim hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Chronicles
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="relative h-[450px] w-full rounded-3xl overflow-hidden mb-10 border border-white/5 group">
                        <Image
                            src={news.image}
                            alt={news.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-black rounded-full uppercase tracking-wider border border-primary/20 flex items-center gap-2">
                                    <Tag className="w-3 h-3" /> {news.category}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight drop-shadow-2xl">
                                {news.title}
                            </h1>
                            <div className="flex flex-wrap gap-6 text-dim text-sm font-medium">
                                <div className="flex items-center gap-2 bg-white/5 py-1.5 px-4 rounded-full backdrop-blur-md border border-white/5">
                                    <Calendar className="w-4 h-4 text-primary" /> {news.date}
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 py-1.5 px-4 rounded-full backdrop-blur-md border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                                    <Share2 className="w-4 h-4" /> Share
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-10">
                            <section className="prose prose-invert max-w-none">
                                <p className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-8 border-l-4 border-primary pl-6 py-2 text-left">
                                    {news.summary}
                                </p>
                                <div className="text-dim leading-loose text-lg space-y-6 whitespace-pre-wrap text-left">
                                    {news.content || "Full article content is coming soon. Stay tuned for deeper insights and detailed analysis on this topic."}
                                </div>
                            </section>

                            {news.link && (
                                <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20">
                                    <h3 className="text-xl font-bold mb-4">Read from Source</h3>
                                    <p className="text-dim mb-6">This article was originally published on an external site. Check out the full version for more details.</p>
                                    <a
                                        href={news.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary/80 transition-all"
                                    >
                                        Visit Original Site <Share2 className="w-4 h-4" />
                                    </a>
                                </div>
                            )}

                            <div className="flex items-center gap-6 pt-10 border-t border-white/5">
                                <button className="flex items-center gap-2 text-dim hover:text-white transition-colors group">
                                    <MessageSquare className="w-5 h-5 group-hover:text-primary" />
                                    <span>24 Comments</span>
                                </button>
                                <button className="flex items-center gap-2 text-dim hover:text-white transition-colors group ml-auto">
                                    <Bookmark className="w-5 h-5 group-hover:text-primary" />
                                    <span>Save Article</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <GlassCard className="p-8 border-white/5 bg-card/20 sticky top-24">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-primary rounded-full" />
                                    Trending Now
                                </h3>
                                <div className="space-y-6">
                                    {[
                                        { title: "The Next AI Frontier", date: "Jan 10, 2026" },
                                        { title: "Future of Open Source", date: "Jan 08, 2026" },
                                        { title: "Web3 Sustainability", date: "Jan 05, 2026" }
                                    ].map((item, i) => (
                                        <div key={i} className="group cursor-pointer">
                                            <p className="text-sm text-dim group-hover:text-primary transition-colors font-medium mb-1">
                                                {item.date}
                                            </p>
                                            <h4 className="font-bold leading-tight group-hover:translate-x-1 transition-transform">
                                                {item.title}
                                            </h4>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
