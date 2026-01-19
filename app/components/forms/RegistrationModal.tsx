"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { X, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    eventId: number;
    eventTitle: string;
}

export function RegistrationModal({ isOpen, onClose, eventId, eventTitle }: Props) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError("You must be logged in to register.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("http://localhost:8000/api/events/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    eventId: eventId
                })
            });

            if (res.ok) {
                setStep(2);
            } else {
                const data = await res.json();
                setError(data.detail || "Registration failed. Please try again.");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Show signup prompt if user is not logged in
    if (!user) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-md"
                >
                    <GlassCard className="p-0 overflow-hidden relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-dim hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8 text-center">
                            <div className="w-20 h-20 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Account Required</h2>
                            <p className="text-dim mb-8">
                                You need to create an account or sign in to register for <span className="text-primary font-semibold">{eventTitle}</span>.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <Link href="/signup">
                                    <button className="px-6 py-3 rounded-xl bg-primary text-black font-bold hover:bg-primary/80 transition-colors flex items-center gap-2">
                                        Create Account <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                            <p className="text-xs text-dim mt-6">
                                Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in here</Link>
                            </p>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-md"
            >
                <GlassCard className="p-0 overflow-hidden relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-dim hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8">
                        {step === 1 ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">Register for Event</h2>
                                    <p className="text-dim text-sm">You are registering for <span className="text-primary">{eventTitle}</span></p>
                                </div>

                                {error && (
                                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-dim uppercase mb-2">Full Name</label>
                                        <input required type="text" defaultValue={user?.name} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none transition-colors" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-dim uppercase mb-2">Roll Number</label>
                                        <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none transition-colors" placeholder="210701..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-dim uppercase mb-2">Department</label>
                                            <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none transition-colors [&>option]:bg-slate-900">
                                                <option>CSE</option>
                                                <option>IT</option>
                                                <option>AIDS</option>
                                                <option>CSBS</option>
                                                <option>ECE</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-dim uppercase mb-2">Year</label>
                                            <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none transition-colors [&>option]:bg-slate-900">
                                                <option>I</option>
                                                <option>II</option>
                                                <option>III</option>
                                                <option>IV</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Processing..." : "Confirm Registration"}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-10 h-10" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
                                <p className="text-dim mb-8">Your ticket has been generated. Check your dashboard.</p>
                                <div className="flex gap-4 justify-center">
                                    <button onClick={onClose} className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">Close</button>
                                    <Link href="/dashboard/student/tickets">
                                        <button className="px-6 py-2 rounded-lg bg-primary text-black font-bold hover:bg-primary/80 transition-colors flex items-center gap-2">
                                            View Ticket <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
}
