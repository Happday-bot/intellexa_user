"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import {
    ChevronLeft,
    Users,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    UserCheck,
    ArrowRight,
    Loader2,
    RefreshCcw,
    Mail
} from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/app/config/api";

interface Event {
    id: number;
    title: string;
    date: string;
    venue: string;
}

interface AttendanceRecord {
    ticketId: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    status: "checked-in" | "pending";
    scannedAt: string | null;
    scannedBy: string | null;
}

export default function AttendanceAnalysisPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "checked-in" | "pending">("all");

    // Add Student Modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [allStudents, setAllStudents] = useState<any[]>([]);
    const [studentSearch, setStudentSearch] = useState("");
    const [addingStudent, setAddingStudent] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/events`)
            .then(res => res.json())
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch events:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (selectedEventId !== null) {
            fetchAttendance(selectedEventId);
        }
    }, [selectedEventId]);

    const fetchAttendance = (eventId: number) => {
        setDetailLoading(true);
        fetch(`${API_BASE_URL}/api/admin/attendance/${eventId}`)
            .then(res => res.json())
            .then(data => {
                setAttendance(data);
                setDetailLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch attendance:", err);
                setDetailLoading(false);
            });
    };

    const handleManualCheckin = async (studentId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/check-in/manual`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId,
                    eventId: selectedEventId
                })
            });

            if (response.ok) {
                // Refresh data
                if (selectedEventId) fetchAttendance(selectedEventId);
            } else {
                const err = await response.json();
                alert(err.detail || "Manual check-in failed");
            }
        } catch (error) {
            console.error("Manual check-in error:", error);
        }
    };

    const openAddStudentModal = async () => {
        setShowAddModal(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/users`);
            const users = await response.json();
            // Filter to only students
            const students = users.filter((u: any) => u.role === "student");
            setAllStudents(students);
        } catch (error) {
            console.error("Failed to fetch students:", error);
        }
    };

    const handleAddStudent = async (studentId: string) => {
        setAddingStudent(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/register-student`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId,
                    eventId: selectedEventId
                })
            });

            if (response.ok) {
                setShowAddModal(false);
                setStudentSearch("");
                if (selectedEventId) fetchAttendance(selectedEventId);
            } else {
                const err = await response.json();
                alert(err.detail || "Failed to register student");
            }
        } catch (error) {
            console.error("Add student error:", error);
        } finally {
            setAddingStudent(false);
        }
    };

    const filteredAttendance = attendance.filter(record => {
        const matchesSearch = record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.studentId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "all" || record.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: attendance.length,
        present: attendance.filter(r => r.status === "checked-in").length,
        absent: attendance.filter(r => r.status === "pending").length
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-dim">Loading events...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Link
                    href="/dashboard/admin"
                    className="inline-flex items-center gap-2 text-dim hover:text-white transition-colors group mb-6"
                >
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Back to HQ</span>
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold flex items-center gap-4 italic capitalize">
                            Attendance <span className="text-blue-500 text-5xl">Analysis</span>
                            <UserCheck className="w-10 h-10 text-blue-500" />
                        </h1>
                        <p className="text-dim text-lg">Monitor registrations and verify participation for your events.</p>
                    </div>
                    {selectedEventId && (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => selectedEventId && fetchAttendance(selectedEventId)}
                                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-dim hover:text-white hover:bg-white/10 transition-all"
                            >
                                <RefreshCcw className={`w-5 h-5 ${detailLoading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={openAddStudentModal}
                                className="px-6 py-2 rounded-2xl bg-blue-500 text-black font-black hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter text-sm flex items-center gap-2"
                            >
                                <Users className="w-4 h-4" />
                                Add Student
                            </button>
                            <button
                                onClick={() => setSelectedEventId(null)}
                                className="px-6 py-2 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all uppercase tracking-tighter text-sm"
                            >
                                Switch Event
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {!selectedEventId ? (
                    <motion.div
                        key="event-selector"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {events.map((event, i) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <GlassCard
                                    className="p-8 group hover:border-blue-500/50 transition-all cursor-pointer bg-white/5"
                                    onClick={() => setSelectedEventId(event.id)}
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-dim group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
                                        {event.title}
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-dim">
                                            <Clock className="w-4 h-4" />
                                            <span>{event.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-dim">
                                            <Users className="w-4 h-4" />
                                            <span>Manage Participants</span>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="attendance-detail"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="space-y-8"
                    >
                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <GlassCard className="p-6 bg-blue-500/10 border-blue-500/20">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 block mb-1">Total Registrations</span>
                                <span className="text-3xl font-black text-white">{stats.total}</span>
                            </GlassCard>
                            <GlassCard className="p-6 bg-green-500/10 border-green-500/20">
                                <span className="text-[10px] font-black uppercase tracking-widest text-green-500 block mb-1">Checked In</span>
                                <span className="text-3xl font-black text-white">{stats.present}</span>
                            </GlassCard>
                            <GlassCard className="p-6 bg-yellow-500/10 border-yellow-500/20">
                                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500 block mb-1">Attendance Rate</span>
                                <span className="text-3xl font-black text-white">{stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%</span>
                            </GlassCard>
                            <GlassCard className="p-6 bg-red-500/10 border-red-500/20">
                                <span className="text-[10px] font-black uppercase tracking-widest text-red-500 block mb-1">Pending</span>
                                <span className="text-3xl font-black text-white">{stats.absent}</span>
                            </GlassCard>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dim" />
                                <input
                                    type="text"
                                    placeholder="Search by Name or Student ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white"
                                />
                            </div>
                            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
                                {["all", "checked-in", "pending"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status as any)}
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterStatus === status
                                            ? 'bg-blue-500 text-black shadow-lg shadow-blue-500/20'
                                            : 'text-dim hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Participants Table */}
                        <GlassCard className="overflow-hidden border-white/5 bg-black/40">
                            {detailLoading ? (
                                <div className="p-20 flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                    <span className="text-dim font-medium italic">Synchronizing reports...</span>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="px-6 py-4 text-[10px] font-black text-dim uppercase tracking-[0.2em]">Student Details</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-dim uppercase tracking-[0.2em]">Status</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-dim uppercase tracking-[0.2em]">Method / Time</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-dim uppercase tracking-[0.2em]">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredAttendance.length > 0 ? (
                                                filteredAttendance.map((record, i) => (
                                                    <motion.tr
                                                        key={record.studentId}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: i * 0.02 }}
                                                        className="group hover:bg-white/[0.02] transition-colors"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                                                                    <span className="text-blue-500 font-black text-xs">{record.studentName.charAt(0)}</span>
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{record.studentName}</div>
                                                                    <div className="text-[10px] font-mono text-dim tracking-widest">{record.studentId}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${record.status === 'checked-in'
                                                                ? 'bg-green-500/10 text-green-500'
                                                                : 'bg-yellow-500/10 text-yellow-500'
                                                                }`}>
                                                                {record.status === 'checked-in' ? (
                                                                    <><CheckCircle2 className="w-3 h-3" /> Checked In</>
                                                                ) : (
                                                                    <><Clock className="w-3 h-3" /> Pending</>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {record.scannedAt ? (
                                                                <div className="space-y-1">
                                                                    <div className="text-xs font-medium text-white">{new Date(record.scannedAt).toLocaleTimeString()}</div>
                                                                    <div className="text-[10px] text-dim uppercase font-bold tracking-tighter">via {record.scannedBy}</div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-dim italic">Waiting arrival...</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {record.status === 'pending' ? (
                                                                <button
                                                                    onClick={() => handleManualCheckin(record.studentId)}
                                                                    className="px-4 py-2 rounded-xl bg-blue-500 text-black text-xs font-black uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all"
                                                                >
                                                                    Check In
                                                                </button>
                                                            ) : (
                                                                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-dim text-xs inline-flex items-center gap-2 font-medium">
                                                                    <Mail className="w-3 h-3" /> Send Reminder
                                                                </div>
                                                            )}
                                                        </td>
                                                    </motion.tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-20 text-center opacity-30 italic text-sm">
                                                        No participants found matching your criteria.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Student Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl"
                        >
                            <GlassCard className="p-8 bg-black/90 border-blue-500/20">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-black uppercase tracking-tight">
                                        Add Student to Event
                                    </h2>
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="relative mb-6">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dim" />
                                    <input
                                        type="text"
                                        placeholder="Search students by name or ID..."
                                        value={studentSearch}
                                        onChange={(e) => setStudentSearch(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white"
                                    />
                                </div>

                                <div className="max-h-96 overflow-y-auto space-y-2">
                                    {allStudents
                                        .filter(s =>
                                            s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                                            s.id.toLowerCase().includes(studentSearch.toLowerCase())
                                        )
                                        .map((student) => {
                                            const isRegistered = attendance.some(a => a.studentId === student.id);
                                            return (
                                                <div
                                                    key={student.id}
                                                    className={`p-4 rounded-2xl border transition-all ${isRegistered
                                                        ? 'bg-green-500/5 border-green-500/20 opacity-50'
                                                        : 'bg-white/5 border-white/10 hover:border-blue-500/50'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                                                <span className="text-blue-500 font-black text-xs">
                                                                    {student.name.charAt(0)}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-white uppercase tracking-tight">
                                                                    {student.name}
                                                                </div>
                                                                <div className="text-[10px] font-mono text-dim tracking-widest">
                                                                    {student.id}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {isRegistered ? (
                                                            <div className="px-4 py-2 rounded-xl bg-green-500/10 text-green-500 text-xs font-black uppercase tracking-tighter">
                                                                Already Registered
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleAddStudent(student.id)}
                                                                disabled={addingStudent}
                                                                className="px-4 py-2 rounded-xl bg-blue-500 text-black text-xs font-black uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {addingStudent ? 'Adding...' : 'Add'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </GlassCard>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
