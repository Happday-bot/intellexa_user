"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { Plus, Edit2, Trash2, Calendar, Newspaper, X, Image as ImageIcon, Search, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface NewsItem {
    id: number;
    title: string;
    category: string;
    date: string;
    image: string;
    summary: string;
}

export default function NewsManagerPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<NewsItem>>({
        title: "",
        category: "AI",
        date: "",
        image: "",
        summary: ""
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/news");
            const data = await res.json();
            setNews(data);
        } catch (err) {
            console.error("Failed to fetch news:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item?: NewsItem) => {
        if (item) {
            setEditingItem(item);
            setFormData(item);
        } else {
            setEditingItem(null);
            setFormData({
                id: Math.max(0, ...news.map(n => n.id)) + 1,
                title: "",
                category: "AI",
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c",
                summary: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingItem ? "PUT" : "POST";
        const url = editingItem
            ? `http://localhost:8000/api/news/${editingItem.id}`
            : "http://localhost:8000/api/news";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                fetchNews();
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error("Failed to save news:", err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this news item?")) return;
        try {
            const res = await fetch(`http://localhost:8000/api/news/${id}`, { method: "DELETE" });
            if (res.ok) fetchNews();
        } catch (err) {
            console.error("Failed to delete news:", err);
        }
    };

    const filteredNews = news.filter(n =>
        n.title.toLowerCase().includes(filter.toLowerCase()) ||
        n.category.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto pb-20 text-left">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6 mb-12"
            >
                <Link
                    href="/dashboard/admin"
                    className="inline-flex items-center gap-2 text-dim hover:text-white transition-colors group"
                >
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Back to Dashboard</span>
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent italic">News <span className="text-primary">Editor</span></h1>
                        <p className="text-dim text-lg">Publish updates and stories to the student hub.</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dim" />
                            <input
                                type="text"
                                placeholder="Filter news..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary/50 transition-all text-sm"
                            />
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/80 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                        >
                            <Plus className="w-6 h-6" />
                            Create Post
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="grid gap-6">
                {loading ? (
                    [1, 2].map(i => <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse" />)
                ) : (
                    <AnimatePresence>
                        {filteredNews.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <GlassCard className="group flex flex-col md:flex-row items-center gap-8 p-6 hover:border-primary/30 transition-all">
                                    <div className="w-full md:w-48 h-32 relative rounded-2xl overflow-hidden bg-white/5 flex-shrink-0">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black uppercase text-primary tracking-widest">{item.category}</span>
                                            <span className="text-xs text-dim flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {item.date}</span>
                                        </div>
                                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{item.title}</h3>
                                        <p className="text-sm text-dim line-clamp-2">{item.summary}</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleOpenModal(item)}
                                            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 text-dim hover:text-white transition-all border border-white/5"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-4 rounded-xl bg-red-500/5 hover:bg-red-500/20 text-red-500/50 hover:text-red-500 transition-all border border-white/5"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl">
                            <GlassCard className="p-8 border-white/20">
                                <h2 className="text-2xl font-bold mb-8">{editingItem ? "Edit News Post" : "Compose News Post"}</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Headline</label>
                                            <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:border-primary/50 outline-none transition-all" placeholder="Enter headline..." />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Category Tag</label>
                                            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:border-primary/50 outline-none transition-all text-dim [&>option]:bg-slate-900">
                                                <option>AI</option>
                                                <option>Web Dev</option>
                                                <option>Security</option>
                                                <option>AR/VR</option>
                                                <option>Hardware</option>
                                                <option>OS</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Header Image URL</label>
                                            <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:border-primary/50 outline-none transition-all" placeholder="https://..." />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Summary / Teaser</label>
                                            <textarea required rows={4} value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:border-primary/50 outline-none transition-all resize-none" placeholder="Provide a brief summary of the news story..." />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                                        <button type="submit" className="flex-1 py-3.5 rounded-xl font-bold bg-primary hover:bg-primary/80 transition-all">{editingItem ? "Update Story" : "Publish Story"}</button>
                                    </div>
                                </form>
                            </GlassCard>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

