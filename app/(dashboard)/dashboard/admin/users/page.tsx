"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { Trash2, Search, User, Edit2, UserPlus, X, ChevronLeft, Mail, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Student {
    id: string;
    username: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    password?: string;
    college?: string;
    department?: string;
    year?: string;
    location?: string;
}

export default function ManageStudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Student>>({
        name: "",
        username: "",
        email: "",
        password: "password123",
        role: "student",
        college: "Rajalakshmi Engineering College",
        department: "Information Technology",
        year: "Final Year",
        location: "Chennai, India"
    });

    const fetchStudents = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${API_URL}/api/users?role=student`);
            const data = await res.json();
            setStudents(data);
        } catch (err) {
            console.error("Failed to fetch students", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleOpenModal = (student?: Student) => {
        if (student) {
            setEditingStudent(student);
            setFormData(student);
        } else {
            setEditingStudent(null);
            setFormData({
                name: "",
                username: "",
                email: "",
                password: "password123",
                role: "student",
                college: "Rajalakshmi Engineering College",
                department: "Information Technology",
                year: "Final Year",
                location: "Chennai, India"
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const method = editingStudent ? "PUT" : "POST";
        const url = editingStudent
            ? `${API_URL}/api/users/${editingStudent.id}`
            : `${API_URL}/api/users`;

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                fetchStudents();
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error("Failed to save student:", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently remove this student?")) return;

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${API_URL}/api/users/${id}`, { method: "DELETE" });
            if (res.ok) fetchStudents();
        } catch (err) {
            console.error("Failed to delete user", err);
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.username.toLowerCase().includes(search.toLowerCase())
    );

    const YEAR_COLORS: Record<string, string> = {
        "First Year": "bg-blue-500/10 text-blue-400 border-blue-500/20",
        "Second Year": "bg-purple-500/10 text-purple-400 border-purple-500/20",
        "Third Year": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        "Final Year": "bg-orange-500/10 text-orange-400 border-orange-500/20",
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
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                            <User className="w-3.5 h-3.5" />
                            Student Management
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-white italic">
                            STUDENT <span className="text-emerald-500 not-italic uppercase">DIRECTORY</span>
                        </h1>
                        <p className="text-white/40 text-lg max-w-xl font-medium">
                            Oversee active student profiles, manage experimental access, and review technical progress.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative group flex-1 sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name, email or username..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all text-sm font-medium placeholder:text-white/20"
                            />
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="px-8 py-4 bg-emerald-500 text-black rounded-2xl font-black uppercase tracking-tighter hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] group"
                        >
                            <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Enroll Student
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Students Grid */}
            <div className="grid gap-4">
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-24 rounded-[2rem] bg-white/5 border border-white/10 animate-pulse" />
                    ))
                ) : filteredStudents.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                        {filteredStudents.map((student, index) => (
                            <motion.div
                                key={student.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: index * 0.03, ease: [0.23, 1, 0.32, 1] }}
                            >
                                <GlassCard className="group relative p-5 rounded-[2.5rem] border-white/10 hover:border-emerald-500/30 transition-all duration-500 flex flex-col lg:flex-row items-center justify-between gap-6 overflow-hidden">
                                    <div className="flex items-center gap-6 flex-1 min-w-0 w-full">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/5 group-hover:border-emerald-500/50 transition-all duration-500 bg-emerald-500/10 flex items-center justify-center">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.username}`}
                                                    alt={student.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-bg-dark" />
                                        </div>

                                        <div className="min-w-0 text-left">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-bold text-xl truncate tracking-tight text-white/90 group-hover:text-white transition-colors">{student.name}</h3>
                                                <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">@{student.username}</span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-white/40">
                                                <span className="flex items-center gap-2 group-hover:text-white/60 transition-colors">
                                                    <Mail className="w-3.5 h-3.5 text-emerald-500/50" />
                                                    {student.email}
                                                </span>
                                                {student.year && (
                                                    <span className={cn(
                                                        "px-2.5 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-tighter transition-all",
                                                        YEAR_COLORS[student.year] || "bg-white/5 text-white/30 border-white/10"
                                                    )}>
                                                        {student.year}
                                                    </span>
                                                )}
                                                {student.department && (
                                                    <span className="text-[10px] uppercase tracking-widest text-white/20 border-l border-white/10 pl-6 h-4 flex items-center">
                                                        {student.department}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full lg:w-auto justify-end border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                                        <span className="hidden lg:block text-[10px] font-bold text-white/10 uppercase tracking-[0.2em] mr-4">Enrolled {student.createdAt}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleOpenModal(student)}
                                                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/30 hover:text-white transition-all group/btn"
                                                title="Edit Credentials"
                                            >
                                                <Edit2 className="w-4.5 h-4.5 group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                className="p-3.5 rounded-2xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-500/30 hover:text-red-500 transition-all group/btn"
                                                title="Terminate Access"
                                            >
                                                <Trash2 className="w-4.5 h-4.5 group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="text-center py-24 px-4 rounded-[3rem] border-2 border-dashed border-white/5 bg-white/[0.01]">
                        <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/5">
                            <Search className="w-10 h-10 text-white/10" />
                        </div>
                        <h3 className="text-2xl font-black mb-2 tracking-tight">System match not found</h3>
                        <p className="text-white/30 text-lg">No students found matching the specified parameters.</p>
                        <button
                            onClick={() => setSearch("")}
                            className="mt-8 text-emerald-500 font-bold uppercase tracking-widest text-xs hover:text-emerald-400 transition-colors"
                        >
                            Reset Search Parameters
                        </button>
                    </div>
                )}
            </div>

            {/* Student Modal */}
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
                            className="relative w-full max-w-2xl"
                        >
                            <GlassCard className="p-10 rounded-[3rem] border-white/20 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8">
                                    <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/30 hover:text-white transition-all">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="mb-10 text-left">
                                    <div className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                                        <Shield className="w-3.5 h-3.5" />
                                        Encryption Key Required
                                    </div>
                                    <h2 className="text-4xl font-black text-white italic">{editingStudent ? "OVERRIDE" : "ENROLL"} <span className="text-emerald-500 uppercase not-italic">STUDENT</span></h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8 text-left">
                                    <div className="grid md:grid-cols-3 gap-8 items-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-2 border-emerald-500/30 bg-white/5 shadow-2xl relative">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username || 'default'}`}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Generated ID</div>
                                        </div>

                                        <div className="md:col-span-2 space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-1">Legal Designation</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all font-bold placeholder:text-white/10"
                                                    placeholder="e.g. Tony Stark"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-1">System Handle</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.username}
                                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all font-bold placeholder:text-white/10"
                                                    placeholder="e.g. ironman"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-1">Comms Endpoint</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all font-bold placeholder:text-white/10"
                                                    placeholder="tony@stark.com"
                                                />
                                            </div>
                                        </div>
                                        {!editingStudent && (
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-1">Access Credentials</label>
                                                <input
                                                    required
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all font-bold"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-1">Cohort Year</label>
                                            <select
                                                value={formData.year}
                                                onChange={e => setFormData({ ...formData, year: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all font-bold text-white/70 [&>option]:bg-bg-dark"
                                            >
                                                <option>First Year</option>
                                                <option>Second Year</option>
                                                <option>Third Year</option>
                                                <option>Final Year</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-1">Academic Department</label>
                                            <input
                                                type="text"
                                                value={formData.department}
                                                onChange={e => setFormData({ ...formData, department: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all font-bold placeholder:text-white/10"
                                                placeholder="Information Technology"
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
                                            className="flex-1 py-5 rounded-[1.5rem] font-black uppercase tracking-widest bg-emerald-500 text-black hover:scale-[1.02] active:scale-95 transition-all text-xs shadow-xl shadow-emerald-500/20"
                                        >
                                            {editingStudent ? "Save Override" : "Finalize Enrollment"}
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
