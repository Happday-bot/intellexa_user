"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { Plus, Edit2, Trash2, Calendar, MapPin, Clock, X, Image as ImageIcon, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    venue: string;
    category: string;
    image: string;
    status: string;
}

export default function EventManagerPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Event>>({
        title: "",
        date: "",
        time: "",
        venue: "",
        category: "General",
        image: "",
        status: "Upcoming"
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/events");
            const data = await res.json();
            setEvents(data);
        } catch (err) {
            console.error("Failed to fetch events:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (event?: Event) => {
        if (event) {
            setEditingEvent(event);
            setFormData(event);
        } else {
            setEditingEvent(null);
            setFormData({
                id: Math.max(0, ...events.map(e => e.id)) + 1,
                title: "",
                date: "",
                time: "",
                venue: "",
                category: "General",
                image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
                status: "Upcoming"
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingEvent ? "PUT" : "POST";
        const url = editingEvent
            ? `http://localhost:8000/api/events/${editingEvent.id}`
            : "http://localhost:8000/api/events";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                fetchEvents();
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error("Failed to save event:", err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            const res = await fetch(`http://localhost:8000/api/events/${id}`, { method: "DELETE" });
            if (res.ok) fetchEvents();
        } catch (err) {
            console.error("Failed to delete event:", err);
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
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent italic">Event <span className="text-primary">Manager</span></h1>
                        <p className="text-dim text-lg">Create, edit, and orchestrate club activities.</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="group px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/80 transition-all flex items-center gap-3 shadow-xl shadow-primary/20 scale-100 hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                        Create New Event
                    </button>
                </div>
            </motion.div>

            <div className="grid gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-40 rounded-3xl bg-white/5 animate-pulse" />)
                ) : (
                    <AnimatePresence>
                        {events.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <GlassCard className="group flex flex-col md:flex-row items-center gap-8 p-6 hover:border-primary/50 transition-all">
                                    <div className="w-full md:w-40 h-40 relative rounded-2xl overflow-hidden bg-white/5 flex-shrink-0 shadow-2xl">
                                        <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>

                                    <div className="flex-1 text-center md:text-left space-y-4">
                                        <div className="flex items-center justify-center md:justify-start gap-3">
                                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest ${event.status === 'Upcoming' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-white/5 text-dim border border-white/10'}`}>
                                                {event.status}
                                            </span>
                                            <span className="text-xs font-bold text-secondary">{event.category}</span>
                                        </div>

                                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{event.title}</h3>

                                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-dim">
                                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {event.date}</span>
                                            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {event.time}</span>
                                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {event.venue}</span>
                                        </div>
                                    </div>

                                    <div className="flex md:flex-col gap-3">
                                        <button
                                            onClick={() => handleOpenModal(event)}
                                            className="p-4 rounded-2xl bg-white/5 hover:bg-primary/20 text-dim hover:text-primary transition-all border border-white/5 hover:border-primary/30"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event.id)}
                                            className="p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/20 text-red-500/50 hover:text-red-500 transition-all border border-white/5 hover:border-red-500/30"
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

            {/* Premium Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl"
                        >
                            <GlassCard className="p-8 shadow-2xl border-white/20">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                        {editingEvent ? "Edit Event" : "Initialize New Event"}
                                    </h2>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                        <X className="w-6 h-6 text-dim" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-dim uppercase tracking-tighter mb-2 block">Event Title</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary/50 outline-none transition-all font-medium"
                                                placeholder="e.g. Quantum Computing 101"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-dim uppercase tracking-tighter mb-2 block">Date</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.date}
                                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary/50 outline-none transition-all"
                                                placeholder="March 15, 2026"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-dim uppercase tracking-tighter mb-2 block">Time</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.time}
                                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary/50 outline-none transition-all"
                                                placeholder="09:00 AM"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-dim uppercase tracking-tighter mb-2 block">Venue</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.venue}
                                                onChange={e => setFormData({ ...formData, venue: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary/50 outline-none transition-all"
                                                placeholder="Main Auditorium"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-dim uppercase tracking-tighter mb-2 block">Category</label>
                                            <select
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary/50 outline-none transition-all text-dim [&>option]:bg-slate-900"
                                            >
                                                <option>AI</option>
                                                <option>Web</option>
                                                <option>Security</option>
                                                <option>IoT</option>
                                                <option>General</option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-dim uppercase tracking-tighter mb-2 block">Cover Image URL</label>
                                            <div className="relative">
                                                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dim" />
                                                <input
                                                    type="text"
                                                    value={formData.image}
                                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:border-primary/50 outline-none transition-all"
                                                    placeholder="https://images.unsplash.com/..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-4 rounded-xl font-bold bg-primary hover:bg-primary/80 transition-all shadow-lg shadow-primary/20"
                                        >
                                            {editingEvent ? "Update Event" : "Launch Event"}
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
