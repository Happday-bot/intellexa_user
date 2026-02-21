"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "News", href: "/news" },
    { name: "Hackathons", href: "/hackathons" },
    { name: "Team", href: "/#team" },
    { name: "Roadmaps", href: "/roadmaps" },
];

import { useAuth } from "@/app/context/AuthContext";

// ... (imports remain)

export function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentHash, setCurrentHash] = useState("");
    const { user, logout, isLoading } = useAuth();

    const dashboardLink = user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/student';

    useEffect(() => {
        const updateHash = () => setCurrentHash(window.location.hash || "");
        updateHash();
        window.addEventListener("hashchange", updateHash);
        return () => window.removeEventListener("hashchange", updateHash);
    }, []);

    const isActive = (href: string) => {
        const [hrefPath = "/", hrefHash] = href.split("#");
        const currentPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
        const targetPath = hrefPath === "/" ? "/" : hrefPath.replace(/\/+$/, "");

        if (hrefHash) return currentPath === targetPath && currentHash === `#${hrefHash}`;
        if (targetPath === "/") return currentPath === "/";

        return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between p-4 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/10 shadow-lg relative">
                <Link href="/" className="text-xl font-bold tracking-tight">
                    Intellexa <span className="text-accent">REC</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors",
                                isActive(link.href) ? "text-accent hover:text-accent" : "text-dim hover:text-white"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {isLoading ? (
                        <div className="h-8 w-20 bg-white/5 rounded-full animate-pulse" />
                    ) : user ? (
                        <>
                            <Link
                                href={dashboardLink}
                                className="px-5 py-2 rounded-full bg-primary/20 text-primary border border-primary/50 text-sm font-semibold hover:bg-primary hover:text-white transition-all"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={logout}
                                className="text-sm font-medium text-dim hover:text-red-400 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="px-5 py-2 rounded-full bg-white/10 text-white border border-white/20 text-sm font-semibold hover:bg-white/20 transition-all"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-white/70 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="absolute top-20 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col gap-4 md:hidden"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "px-4 py-3 rounded-xl font-medium transition-colors",
                                    isActive(link.href)
                                        ? "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
                                        : "text-dim hover:bg-white/5"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="h-px bg-white/10 my-1" />

                        {user ? (
                            <>
                                <Link
                                    href={dashboardLink}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-3 rounded-xl bg-primary/20 text-primary border border-primary/50 text-center font-bold hover:bg-primary hover:text-white transition-all"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="px-4 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-center font-bold hover:bg-red-500 hover:text-white transition-all w-full"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 text-center font-bold hover:bg-white/20 transition-all"
                            >
                                Login
                            </Link>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
