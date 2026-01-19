"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = false, ...props }: GlassCardProps) {
    return (
        <motion.div
            className={cn(
                "bg-card/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl",
                hoverEffect && "hover:bg-card/80 transition-colors duration-300",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
