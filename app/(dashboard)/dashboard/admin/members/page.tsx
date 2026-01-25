"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { Plus, Search, UserPlus, Trash2, Edit2, Shield, X, Image as ImageIcon, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/app/config/api";

interface Member {
    name: string;
    role: string;
    image: string;
    domain: string;
}

export default function MemberDatabasePage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);

    // Form State
    const [formData, setFormData] = useState<Member>({
        name: "",
        role: "",
        domain: "AI",
        image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d"
    });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/core-members`);
            const data = await res.json();
            setMembers(data);
        } catch (err) {
            console.error("Failed to fetch members:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (member?: Member) => {
        if (member) {
            setEditingMember(member);
            setFormData(member);
        } else {
            setEditingMember(null);
            setFormData({
                name: "",
                role: "",
                domain: "AI",
                image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d"
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingMember ? "PUT" : "POST";
        const url = editingMember
            ? `${API_BASE_URL}/api/core-members/${encodeURIComponent(editingMember.name)}`
            : `${API_BASE_URL}/api/core-members`;

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                fetchMembers();
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error("Failed to save member:", err);
        }
    };

    const handleDelete = async (name: string) => {
        if (!confirm(`Remove ${name} from core team?`)) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/core-members/${encodeURIComponent(name)}`, { method: "DELETE" });
            if (res.ok) fetchMembers();
        } catch (err) {
            console.error("Failed to delete member:", err);
        }
    };

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(filter.toLowerCase()) ||
        m.role.toLowerCase().includes(filter.toLowerCase()) ||
        m.domain.toLowerCase().includes(filter.toLowerCase())
    );

    const DOMAIN_COLORS: Record<string, string> = {
        "AI": "bg-blue-500/10 text-blue-400 border-blue-500/20",
        "Full Stack": "bg-purple-500/10 text-purple-400 border-purple-500/20",
        "Security": "bg-red-500/10 text-red-400 border-red-500/20",
        "IoT": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        "Cloud": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 px-4">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-8 mb-16"
            >
                <Link
                    href="/dashboard/admin"
                    className="inline-flex items-center gap-3 text-white/50 hover:text-white transition-all group w-fit"
                >
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                        <ChevronLeft className="w-5 h-5" />
                    </div>
                    <span className="font-semibold tracking-wide uppercase text-xs">Back to Hub</span>
                </Link>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-widest">
                            <Shield className="w-3.5 h-3.5" />
                            Administrative Controls
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-white italic">
                            CORE <span className="text-secondary not-italic uppercase">TEAM</span>
                        </h1>
                        <p className="text-white/40 text-lg max-w-xl font-medium">
                            Manage the strategic leadership and technical contributors of the Intellexa ecosystem.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative group flex-1 sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-secondary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name, role or domain..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary/40 transition-all text-sm font-medium placeholder:text-white/20"
                            />
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="px-8 py-4 bg-[#FFB800] text-black rounded-2xl font-black uppercase tracking-tighter hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_10px_40px_-5px_rgba(255,184,0,0.4)] border-2 border-white/10 group"
                        >
                            <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Add Leader
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-[200px] rounded-[2.5rem] bg-white/5 border border-white/10 animate-pulse" />
                    ))
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredMembers.map((member, index) => (
                            <motion.div
                                key={member.name}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
                            >
                                <GlassCard className="group relative p-6 rounded-[2.5rem] border-white/10 hover:border-secondary/30 transition-all duration-500 overflow-hidden h-full flex flex-col justify-between">
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleOpenModal(member)}
                                                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 hover:text-white transition-all shadow-xl backdrop-blur-xl"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member.name)}
                                                className="p-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500/70 hover:text-red-500 transition-all shadow-xl backdrop-blur-xl"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-24 h-24 rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/5 group-hover:border-secondary/50 transition-all duration-500 rotate-3 group-hover:rotate-0">
                                                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-secondary text-black shadow-lg shadow-secondary/20 scale-0 group-hover:scale-100 transition-transform duration-500">
                                                <Shield className="w-4 h-4" />
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0 pt-2 text-left">
                                            <h3 className="font-bold text-2xl truncate mb-1 tracking-tight text-white/90 group-hover:text-white transition-colors">{member.name}</h3>
                                            <p className="text-secondary text-sm font-bold uppercase tracking-widest mb-3">{member.role}</p>

                                            <div className="flex flex-wrap gap-2">
                                                {member.domain.split(',').map(dom => (
                                                    <span
                                                        key={dom}
                                                        className={cn(
                                                            "px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tighter border",
                                                            DOMAIN_COLORS[dom.trim()] || "bg-white/5 text-white/50 border-white/10"
                                                        )}
                                                    >
                                                        {dom.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Verified Personnel</span>
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-5 h-5 rounded-full border border-bg-dark bg-white/5" />
                                            ))}
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}

                {!loading && filteredMembers.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-white/20" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No members found</h3>
                        <p className="text-white/40">Try adjusting your search filters.</p>
                    </div>
                )}
            </div>

            {/* Member Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-bg-dark/60 backdrop-blur-2xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl"
                        >
                            <GlassCard className="p-10 rounded-[3rem] border-white/20 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8">
                                    <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/30 hover:text-white transition-all">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="mb-10 text-left">
                                    <div className="text-secondary font-black text-xs uppercase tracking-[0.3em] mb-3">Core Credentials</div>
                                    <h2 className="text-4xl font-black text-white italic">{editingMember ? "ENHANCE" : "ENLIST"} <span className="text-secondary uppercase not-italic">PROFILE</span></h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8 text-left">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-1">Identity Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-secondary/20 focus:border-secondary/50 outline-none transition-all font-bold placeholder:text-white/10"
                                                    placeholder="e.g. Tony Stark"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-1">Leadership Role</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.role}
                                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-secondary/20 focus:border-secondary/50 outline-none transition-all font-bold placeholder:text-white/10"
                                                    placeholder="e.g. Chief Architect"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-2 border-secondary/30 bg-white/5 shadow-2xl">
                                                {formData.image ? (
                                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ImageIcon className="w-8 h-8 text-white/10" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Profile Preview</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-1">Technical Expertise</label>
                                        <select
                                            value={formData.domain}
                                            onChange={e => setFormData({ ...formData, domain: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-secondary/20 focus:border-secondary/50 outline-none transition-all font-bold text-white/70 [&>option]:bg-bg-dark"
                                        >
                                            <option value="AI">Artificial Intelligence</option>
                                            <option value="Full Stack">Full Stack Development</option>
                                            <option value="Security">Info Security</option>
                                            <option value="IoT">Internet of Things</option>
                                            <option value="Cloud">Cloud Architecture</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-1">Visual Asset URL</label>
                                        <div className="relative group">
                                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-secondary transition-colors" />
                                            <input
                                                type="text"
                                                value={formData.image}
                                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-secondary/20 focus:border-secondary/50 outline-none transition-all font-bold placeholder:text-white/10 truncate"
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 py-5 rounded-[1.5rem] font-black uppercase tracking-widest bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs"
                                        >
                                            Abort
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-5 rounded-[1.5rem] font-black uppercase tracking-widest bg-secondary text-black hover:scale-[1.02] active:scale-95 transition-all text-xs shadow-xl shadow-secondary/20"
                                        >
                                            {editingMember ? "Finalize Update" : "Confirm Enlistment"}
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
