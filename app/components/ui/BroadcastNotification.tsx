"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Radio } from "lucide-react";

interface Broadcast {
    subject: string;
    target: string;
    message: string;
    createdAt: string;
    status: string;
}

export default function BroadcastNotification() {
    const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        fetchActiveBroadcasts();
    }, []);

    useEffect(() => {
        // Auto-cycle through broadcasts every 10 seconds if there are multiple
        if (broadcasts.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % broadcasts.length);
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [broadcasts.length]);

    const fetchActiveBroadcasts = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${API_URL}/api/broadcasts`);
            const data = await res.json();

            // Ensure data is an array
            const allBroadcasts = Array.isArray(data) ? data : [];

            // Filter out dismissed broadcasts
            const undismissed = allBroadcasts.filter((b: Broadcast) => !checkIfDismissed(b.createdAt));

            if (undismissed.length > 0) {
                setBroadcasts(undismissed);
                setIsVisible(true);
            }
        } catch (err) {
            console.error("Failed to fetch active broadcasts:", err);
        }
    };

    const checkIfDismissed = (broadcastId: string): boolean => {
        if (typeof window === "undefined") return false;

        const sessionId = getOrCreateSessionId();
        const dismissedData = localStorage.getItem("dismissedBroadcasts");

        if (!dismissedData) return false;

        try {
            const dismissed = JSON.parse(dismissedData);
            const broadcastDismissal = dismissed[broadcastId];

            // Check if dismissed in current session
            if (broadcastDismissal && broadcastDismissal.sessionId === sessionId) {
                return true;
            }
        } catch (e) {
            console.error("Error parsing dismissed broadcasts:", e);
        }

        return false;
    };

    const getOrCreateSessionId = (): string => {
        let sessionId = sessionStorage.getItem("sessionId");

        if (!sessionId) {
            sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            sessionStorage.setItem("sessionId", sessionId);
        }

        return sessionId;
    };

    const handleDismiss = () => {
        const currentBroadcast = broadcasts[currentIndex];
        if (!currentBroadcast) return;

        const sessionId = getOrCreateSessionId();
        const dismissedData = localStorage.getItem("dismissedBroadcasts");
        let dismissed: any = {};

        if (dismissedData) {
            try {
                dismissed = JSON.parse(dismissedData);
            } catch (e) {
                console.error("Error parsing dismissed broadcasts:", e);
            }
        }

        dismissed[currentBroadcast.createdAt] = {
            sessionId,
            dismissedAt: new Date().toISOString()
        };

        localStorage.setItem("dismissedBroadcasts", JSON.stringify(dismissed));

        // Remove dismissed broadcast from list
        const remaining = broadcasts.filter((_, i) => i !== currentIndex);

        if (remaining.length > 0) {
            setBroadcasts(remaining);
            setCurrentIndex(0); // Reset to first broadcast
        } else {
            setIsVisible(false);
        }
    };

    const activeBroadcast = broadcasts[currentIndex];

    if (!activeBroadcast || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-2xl px-4"
            >
                <div className="relative rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 backdrop-blur-xl shadow-2xl shadow-primary/20 p-6">
                    {/* Close Button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors group"
                        aria-label="Dismiss notification"
                    >
                        <X className="w-4 h-4 text-white/70 group-hover:text-white" />
                    </button>

                    {/* Icon */}
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-primary/20 border border-primary/30 flex-shrink-0">
                            <Radio className="w-6 h-6 text-primary animate-pulse" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pr-8">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                                    ANNOUNCEMENT
                                </span>
                                {broadcasts.length > 1 && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white/70">
                                        {currentIndex + 1} of {broadcasts.length}
                                    </span>
                                )}
                                <span className="text-[10px] text-white/50">
                                    To: {activeBroadcast.target}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">
                                {activeBroadcast.subject}
                            </h3>

                            <p className="text-sm text-white/80 leading-relaxed">
                                {activeBroadcast.message}
                            </p>
                        </div>
                    </div>

                    {/* Decorative gradient line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 rounded-b-2xl" />
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
