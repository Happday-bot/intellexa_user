"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/app/components/ui/GlassCard";

export function FloatingJoinCTA() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling down 300px
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (isDismissed) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-8 right-8 z-40 hidden md:block" // Hidden on mobile to avoid clutter
                >
                    <GlassCard className="p-4 flex items-center gap-4 border-primary/30 shadow-lg shadow-primary/20">
                        <div className="flex flex-col">
                            <span className="font-bold text-sm text-white">Join Intellexa</span>
                            <span className="text-xs text-dim">Be part of the revolution.</span>
                        </div>

                        <Link href="/dashboard/student" className="px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                            Join Now <ArrowRight className="w-4 h-4" />
                        </Link>

                        <button
                            onClick={() => setIsDismissed(true)}
                            className="p-1 rounded-full hover:bg-white/10 transition-colors text-dim"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </GlassCard>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
