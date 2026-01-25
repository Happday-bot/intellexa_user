"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { Layers, BarChart3, Camera, Plus, Trash2, Edit2, X, Globe, Save, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/app/config/api";

type Section = "domains" | "stats" | "meetups";

export default function SiteDataManagerPage() {
    const [activeSection, setActiveSection] = useState<Section>("domains");
    const [data, setData] = useState<{ domains: any[], stats: any[], meetups: any[] }>({
        domains: [],
        stats: [],
        meetups: []
    });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<{ type: Section, data: any, originalId?: string | number } | null>(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [domainsRes, statsRes, meetupsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/domains`),
                fetch(`${API_BASE_URL}/api/stats`),
                fetch(`${API_BASE_URL}/api/meetups`)
            ]);
            setData({
                domains: await domainsRes.json(),
                stats: await statsRes.json(),
                meetups: await meetupsRes.json()
            });
        } catch (err) {
            console.error("Failed to fetch site data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (type: Section, item?: any) => {
        setEditingItem({
            type,
            data: {
                ...(item || (
                    type === 'domains' ? { id: "", title: "", description: "", icon: "Globe", color: "from-blue-500 to-cyan-500", image: "" } :
                        type === 'stats' ? { label: "", value: "", icon: "BarChart3" } :
                            { id: Date.now(), title: "", description: "", image: "" }
                ))
            },
            originalId: item ? (type === 'stats' ? item.label : item.id) : undefined
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        const { type, data: itemData, originalId } = editingItem;
        const isEdit = originalId !== undefined;
        const method = isEdit ? "PUT" : "POST";

        let url = `${API_BASE_URL}/api/${type}`;
        if (isEdit) {
            url += `/${encodeURIComponent(String(originalId))}`;
        }

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(itemData)
            });
            if (res.ok) {
                fetchAllData();
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error(`Failed to save ${type}:`, err);
        }
    };

    const handleDelete = async (type: Section, id: string | number) => {
        if (!confirm(`Delete this ${type.slice(0, -1)}?`)) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/${type}/${id}`, { method: "DELETE" });
            if (res.ok) fetchAllData();
        } catch (err) {
            console.error(`Failed to delete ${type}:`, err);
        }
    };

    const renderHeader = () => (
        <div className="flex flex-col gap-6 mb-12">
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
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent italic">Site <span className="text-secondary">Core</span></h1>
                    <p className="text-dim text-lg">Control the foundational data of the Happday experience.</p>
                </div>

                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl">
                    {(["domains", "stats", "meetups"] as Section[]).map((s) => (
                        <button
                            key={s}
                            onClick={() => setActiveSection(s)}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeSection === s ? 'bg-secondary text-black shadow-lg shadow-secondary/20' : 'text-dim hover:text-white hover:bg-white/5'}`}
                        >
                            {s === 'domains' && <Layers className="w-4 h-4" />}
                            {s === 'stats' && <BarChart3 className="w-4 h-4" />}
                            {s === 'meetups' && <Camera className="w-4 h-4" />}
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[1, 2, 3].map(i => <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse" />)}</div>;

        switch (activeSection) {
            case "domains":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.domains.map((domain) => (
                            <GlassCard key={domain.id} className="p-6 group relative">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${domain.color} flex items-center justify-center mb-4 shadow-xl`}>
                                    <Globe className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{domain.title}</h3>
                                <p className="text-sm text-dim mb-6 line-clamp-2">{domain.description}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenModal('domains', domain)} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete('domains', domain.id)} className="p-3 rounded-xl bg-red-500/5 hover:bg-red-500/20 text-red-500/50 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </GlassCard>
                        ))}
                        <button onClick={() => handleOpenModal('domains')} className="border-2 border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 hover:border-secondary/50 hover:bg-secondary/5 transition-all group">
                            <Plus className="w-10 h-10 text-dim group-hover:text-secondary group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-dim group-hover:text-secondary">Add New Domain</span>
                        </button>
                    </div>
                );
            case "stats":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {data.stats.map((stat, i) => (
                            <GlassCard key={i} className="p-6 text-center group">
                                <div className="text-3xl font-black text-secondary mb-1">{stat.value}</div>
                                <div className="text-xs uppercase tracking-widest font-bold text-dim mb-4">{stat.label}</div>
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => handleOpenModal('stats', stat)} className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                );
            case "meetups":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.meetups.map((meetup) => (
                            <GlassCard key={meetup.id} className="flex gap-6 p-4">
                                <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                                    <img src={meetup.image} alt={meetup.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 py-2">
                                    <h3 className="text-lg font-bold mb-2">{meetup.title}</h3>
                                    <p className="text-sm text-dim line-clamp-2">{meetup.description}</p>
                                    <div className="flex gap-2 mt-4">
                                        <button onClick={() => handleOpenModal('meetups', meetup)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete('meetups', meetup.id)} className="p-2.5 rounded-xl bg-red-500/5 hover:bg-red-500/20 text-red-500/50 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                        <button onClick={() => handleOpenModal('meetups')} className="border-2 border-dashed border-white/10 rounded-3xl p-6 flex items-center justify-center gap-4 hover:border-secondary/50 hover:bg-secondary/5 transition-all text-dim font-bold">
                            <Plus className="w-6 h-6" /> Add Past Meetup
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {renderHeader()}
            {renderContent()}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && editingItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 text-left">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg">
                            <GlassCard className="p-8 border-white/20">
                                <h2 className="text-2xl font-bold mb-8">Manage {editingItem.type.slice(0, -1)}</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {editingItem.type === 'domains' && (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Unique ID</label>
                                                <input disabled={!!editingItem.data.id} required type="text" value={editingItem.data.id} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, id: e.target.value } })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 outline-none transition-all disabled:opacity-50" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Title</label>
                                                <input required type="text" value={editingItem.data.title} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:border-secondary/50 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Gradient (Tailwind classes)</label>
                                                <input required type="text" value={editingItem.data.color} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, color: e.target.value } })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:border-secondary/50 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Description</label>
                                                <textarea required rows={3} value={editingItem.data.description} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: e.target.value } })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:border-secondary/50 outline-none transition-all resize-none" />
                                            </div>
                                        </>
                                    )}

                                    {editingItem.type === 'stats' && (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Stat Label</label>
                                                <input required type="text" value={editingItem.data.label} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, label: e.target.value } })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:border-secondary/50 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Stat Value</label>
                                                <input required type="text" value={editingItem.data.value} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, value: e.target.value } })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:border-secondary/50 outline-none transition-all" />
                                            </div>
                                        </>
                                    )}

                                    {editingItem.type === 'meetups' && (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Meetup Title</label>
                                                <input required type="text" value={editingItem.data.title} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:border-secondary/50 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Image URL</label>
                                                <input required type="text" value={editingItem.data.image} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, image: e.target.value } })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:border-secondary/50 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Description</label>
                                                <textarea required rows={3} value={editingItem.data.description} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: e.target.value } })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:border-secondary/50 outline-none transition-all resize-none" />
                                            </div>
                                        </>
                                    )}

                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                                        <button type="submit" className="flex-1 py-4 rounded-xl font-bold bg-secondary text-black hover:bg-secondary/80 transition-all flex items-center justify-center gap-2">
                                            <Save className="w-5 h-5" /> Save Changes
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

