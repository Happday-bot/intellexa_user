"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { Plus, Edit2, Trash2, Globe, X, ChevronLeft, Save, ListTodo, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

interface RoadmapStep {
    title: string;
    desc: string;
}

interface Resource {
    title: string;
    type: string;
    desc: string;
    link: string;
    image: string;
}

interface Roadmap {
    id: string;
    label: string;
    description: string;
    icon: string;
    color: string;
    roadmap: RoadmapStep[];
    resources: Resource[];
}

export default function RoadmapManagerPage() {
    const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Roadmap | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Roadmap>>({
        id: "",
        label: "",
        description: "",
        icon: "Globe",
        color: "from-purple-500 to-pink-500",
        roadmap: [],
        resources: []
    });

    useEffect(() => {
        fetchRoadmaps();
    }, []);

    const fetchRoadmaps = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/roadmaps");
            const data = await res.json();
            setRoadmaps(data);
        } catch (err) {
            console.error("Failed to fetch roadmaps:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item?: Roadmap) => {
        if (item) {
            setEditingItem(item);
            setFormData(JSON.parse(JSON.stringify(item))); // Deep copy
        } else {
            setEditingItem(null);
            setFormData({
                id: "",
                label: "",
                description: "",
                icon: "Globe",
                color: "from-purple-500 to-pink-500",
                roadmap: [],
                resources: []
            });
        }
        setIsModalOpen(true);
    };

    const addStep = () => {
        setFormData({
            ...formData,
            roadmap: [...(formData.roadmap || []), { title: "", desc: "" }]
        });
    };

    const removeStep = (index: number) => {
        setFormData({
            ...formData,
            roadmap: formData.roadmap?.filter((_, i) => i !== index)
        });
    };

    const updateStep = (index: number, field: keyof RoadmapStep, value: string) => {
        const newSteps = [...(formData.roadmap || [])];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setFormData({ ...formData, roadmap: newSteps });
    };

    const addResource = () => {
        setFormData({
            ...formData,
            resources: [...(formData.resources || []), { title: "", type: "Documentation", desc: "", link: "", image: "" }]
        });
    };

    const removeResource = (index: number) => {
        setFormData({
            ...formData,
            resources: formData.resources?.filter((_, i) => i !== index)
        });
    };

    const updateResource = (index: number, field: keyof Resource, value: string) => {
        const newResources = [...(formData.resources || [])];
        newResources[index] = { ...newResources[index], [field]: value };
        setFormData({ ...formData, resources: newResources });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingItem ? "PUT" : "POST";
        const url = editingItem
            ? `http://localhost:8000/api/roadmaps/${editingItem.id}`
            : "http://localhost:8000/api/roadmaps";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                fetchRoadmaps();
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error("Failed to save roadmap:", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this roadmap?")) return;
        try {
            const res = await fetch(`http://localhost:8000/api/roadmaps/${id}`, { method: "DELETE" });
            if (res.ok) fetchRoadmaps();
        } catch (err) {
            console.error("Failed to delete roadmap:", err);
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
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent italic tracking-tight">Roadmap <span className="text-secondary">Architect</span></h1>
                        <p className="text-dim text-lg font-medium">Design learning paths and curated resources.</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="group px-8 py-4 bg-secondary text-white rounded-2xl font-bold hover:bg-secondary/80 transition-all flex items-center gap-3 shadow-xl shadow-secondary/20 scale-100 hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                        Create New Roadmap
                    </button>
                </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse" />)
                ) : (
                    <AnimatePresence>
                        {roadmaps.map((roadmap, index) => (
                            <motion.div
                                key={roadmap.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <GlassCard className="group flex flex-col h-full p-6 hover:border-secondary/50 transition-all">
                                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 text-secondary group-hover:scale-110 transition-transform`}>
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{roadmap.label}</h3>
                                    <p className="text-sm text-dim mb-6 line-clamp-2 flex-1">{roadmap.description}</p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenModal(roadmap)}
                                            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-secondary/20 text-dim hover:text-secondary transition-all border border-white/5 font-bold text-sm flex items-center justify-center gap-2"
                                        >
                                            <Edit2 className="w-4 h-4" /> Edit Path
                                        </button>
                                        <button
                                            onClick={() => handleDelete(roadmap.id)}
                                            className="px-4 py-3 rounded-xl bg-red-500/5 hover:bg-red-500/20 text-red-500/50 hover:text-red-500 transition-all border border-white/5"
                                        >
                                            <Trash2 className="w-4 h-4" />
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
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide">
                            <GlassCard className="p-8 border-white/20">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-3xl font-bold uppercase tracking-tighter italic">
                                        {editingItem ? "Refine Design" : "New Blueprint"}
                                    </h2>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                        <X className="w-6 h-6 text-dim" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-10 text-left">
                                    {/* Basic Info */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[10px] font-black text-dim uppercase tracking-[0.2em] mb-2 block">Path ID (Unique)</label>
                                            <input required type="text" disabled={!!editingItem} value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-secondary/50 outline-none transition-all disabled:opacity-50" placeholder="e.g. cloud-computing" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-dim uppercase tracking-[0.2em] mb-2 block">Display Label</label>
                                            <input required type="text" value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-secondary/50 outline-none transition-all" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-[10px] font-black text-dim uppercase tracking-[0.2em] mb-2 block">Description</label>
                                            <textarea required rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-secondary/50 outline-none transition-all" />
                                        </div>
                                    </div>

                                    {/* Roadmap Steps */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                            <h3 className="text-lg font-bold flex items-center gap-2"><ListTodo className="w-5 h-5 text-secondary" /> Roadmap Steps</h3>
                                            <button type="button" onClick={addStep} className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
                                                <Plus className="w-4 h-4" /> Add Step
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            {formData.roadmap?.map((step, i) => (
                                                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 relative group">
                                                    <div className="flex-1 space-y-4">
                                                        <input required type="text" placeholder="Step Title" value={step.title} onChange={e => updateStep(i, 'title', e.target.value)} className="w-full bg-transparent border-b border-white/10 p-2 focus:border-secondary transition-all font-bold placeholder:text-white/20" />
                                                        <input required type="text" placeholder="Short description" value={step.desc} onChange={e => updateStep(i, 'desc', e.target.value)} className="w-full bg-transparent border-b border-white/10 p-2 focus:border-secondary transition-all text-sm text-dim placeholder:text-white/20" />
                                                    </div>
                                                    <button type="button" onClick={() => removeStep(i)} className="p-2 h-fit rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Resources */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                            <h3 className="text-lg font-bold flex items-center gap-2"><LinkIcon className="w-5 h-5 text-secondary" /> Curated Resources</h3>
                                            <button type="button" onClick={addResource} className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
                                                <Plus className="w-4 h-4" /> Add Resource
                                            </button>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {formData.resources?.map((res, i) => (
                                                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 relative group space-y-3">
                                                    <input required type="text" placeholder="Resource Title" value={res.title} onChange={e => updateResource(i, 'title', e.target.value)} className="w-full bg-transparent border-b border-white/10 p-2 focus:border-secondary transition-all text-sm font-bold" />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <select value={res.type} onChange={e => updateResource(i, 'type', e.target.value)} className="bg-slate-900 text-xs p-2 rounded-lg border border-white/10 outline-none">
                                                            <option>Documentation</option>
                                                            <option>Video Course</option>
                                                            <option>YouTube</option>
                                                            <option>Interactive</option>
                                                        </select>
                                                        <input required type="text" placeholder="Link URL" value={res.link} onChange={e => updateResource(i, 'link', e.target.value)} className="bg-transparent border-b border-white/10 p-2 text-xs focus:border-secondary" />
                                                    </div>
                                                    <input type="text" placeholder="Image URL (Optional)" value={res.image} onChange={e => updateResource(i, 'image', e.target.value)} className="w-full bg-transparent border-b border-white/10 p-2 text-[10px] text-dim" />
                                                    <button type="button" onClick={() => removeResource(i)} className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-sm">Cancel</button>
                                        <button type="submit" className="flex-2 py-4 px-8 rounded-xl font-bold bg-secondary hover:bg-secondary/80 transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2">
                                            <Save className="w-5 h-5" />
                                            {editingItem ? "Commit Changes" : "Deploy Path"}
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
