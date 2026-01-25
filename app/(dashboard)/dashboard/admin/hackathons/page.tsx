"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { Plus, Edit2, Trash2, Calendar, MapPin, Globe, Trophy, ExternalLink, X, Image as ImageIcon, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/app/config/api";

interface Hackathon {
    id: number;
    title: string;
    organizer: string;
    date: string;
    mode: string;
    location: string;
    prize: string;
    image: string;
    tags: string[];
    link: string;
}

export default function HackathonManagerPage() {
    const [hackathons, setHackathons] = useState<Hackathon[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Hackathon | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Hackathon>>({
        title: "",
        organizer: "",
        date: "",
        mode: "Online",
        location: "",
        prize: "",
        image: "",
        tags: [],
        link: ""
    });

    useEffect(() => {
        fetchHackathons();
    }, []);

    const fetchHackathons = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/hackathons`);
            const data = await res.json();
            setHackathons(data);
        } catch (err) {
            console.error("Failed to fetch hackathons:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item?: Hackathon) => {
        if (item) {
            setEditingItem(item);
            setFormData(item);
        } else {
            setEditingItem(null);
            setFormData({
                id: Math.max(0, ...hackathons.map(h => h.id)) + 1,
                title: "",
                organizer: "",
                date: "",
                mode: "Online",
                location: "Remote",
                prize: "",
                image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
                tags: [],
                link: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingItem ? "PUT" : "POST";
        const url = editingItem
            ? `${API_BASE_URL}/api/hackathons/${editingItem.id}`
            : `${API_BASE_URL}/api/hackathons`;

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                fetchHackathons();
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error("Failed to save hackathon:", err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Remove this hackathon?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/hackathons/${id}`, { method: "DELETE" });
            if (res.ok) fetchHackathons();
        } catch (err) {
            console.error("Failed to delete hackathon:", err);
        }
    };

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
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent italic tracking-tight">Hackathon <span className="text-primary">Central</span></h1>
                        <p className="text-dim text-lg font-medium">Curate coding battles and track opportunities.</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="group px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/80 transition-all flex items-center gap-3 shadow-xl shadow-primary/20 scale-100 hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                        Host New Hackathon
                    </button>
                </div>
            </motion.div>

            <div className="grid gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-40 rounded-3xl bg-white/5 animate-pulse transition-all duration-300" />)
                ) : (
                    <AnimatePresence>
                        {hackathons.map((hack, index) => (
                            <motion.div
                                key={hack.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <GlassCard className="group flex flex-col md:flex-row items-center gap-8 p-6 hover:border-primary/50 transition-all">
                                    <div className="w-full md:w-48 h-32 relative rounded-2xl overflow-hidden bg-white/5 flex-shrink-0 shadow-2xl">
                                        <img src={hack.image} alt={hack.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">{hack.organizer}</span>
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold">{hack.prize}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{hack.title}</h3>
                                        <div className="flex flex-wrap gap-4 text-xs text-dim">
                                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {hack.date}</span>
                                            <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> {hack.mode}</span>
                                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {hack.location}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleOpenModal(hack)}
                                            className="p-4 rounded-xl bg-white/5 hover:bg-primary/20 text-dim hover:text-primary transition-all border border-white/5 hover:border-primary/30"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(hack.id)}
                                            className="p-4 rounded-xl bg-red-500/5 hover:bg-red-500/20 text-red-500/50 hover:text-red-500 transition-all border border-white/5 hover:border-red-500/30"
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
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-2xl">
                            <GlassCard className="p-8 border-white/20">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                        {editingItem ? "Refine Hackathon" : "Plan New Hackathon"}
                                    </h2>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                        <X className="w-6 h-6 text-dim" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-dim uppercase tracking-widest mb-2 block">Hackathon Title</label>
                                            <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary/50 outline-none transition-all font-medium" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-dim uppercase tracking-widest mb-2 block">Organizer</label>
                                            <input required type="text" value={formData.organizer} onChange={e => setFormData({ ...formData, organizer: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary/50 outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-dim uppercase tracking-widest mb-2 block">Prize Pool</label>
                                            <input required type="text" value={formData.prize} onChange={e => setFormData({ ...formData, prize: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary/50 outline-none transition-all" placeholder="e.g. $50,000" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-dim uppercase tracking-widest mb-2 block">Date</label>
                                            <input required type="text" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary/50 outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-dim uppercase tracking-widest mb-2 block">Mode</label>
                                            <select value={formData.mode} onChange={e => setFormData({ ...formData, mode: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary/50 outline-none transition-all text-dim [&>option]:bg-slate-900">
                                                <option>Online</option>
                                                <option>Offline</option>
                                                <option>Hybrid</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-dim uppercase tracking-widest mb-2 block">Image URL</label>
                                            <input required type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary/50 outline-none transition-all" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-dim uppercase tracking-widest mb-2 block">Registration Link</label>
                                            <input required type="text" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary/50 outline-none transition-all" />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-colors border border-white/10">Cancel</button>
                                        <button type="submit" className="flex-1 py-4 rounded-xl font-bold bg-primary hover:bg-primary/80 transition-all shadow-lg shadow-primary/20">
                                            {editingItem ? "Update Record" : "Launch Hackathon"}
                                        </button>
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
