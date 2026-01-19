"use client";

import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-bg-dark text-white">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="flex flex-col items-center gap-4"
            >
                <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="text-dim text-sm animate-pulse">Initializing Intellexa...</p>
            </motion.div>
        </div>
    );
}
