"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import { GlassCard } from "@/app/components/ui/GlassCard";
import {
    UserCircle, Mail, Building2, GraduationCap, MapPin, Calendar,
    Edit2, Shield, FileUp, Plus, X, Download, Briefcase, Check, Palette, ChevronLeft
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Expanded Color Palette
const BANNER_THEMES = [
    // Cool Tones
    { id: "ocean", label: "Ocean", class: "from-blue-600/20 to-purple-600/20", preview: "from-blue-500 to-purple-500" },
    { id: "emerald", label: "Emerald", class: "from-emerald-600/20 to-teal-600/20", preview: "from-emerald-500 to-teal-500" },
    { id: "cyan", label: "Cyan", class: "from-cyan-500/20 to-blue-500/20", preview: "from-cyan-400 to-blue-400" },
    { id: "indigo", label: "Indigo", class: "from-indigo-600/20 to-violet-600/20", preview: "from-indigo-500 to-violet-500" },

    // Warm Tones
    { id: "sunset", label: "Sunset", class: "from-orange-600/20 to-red-600/20", preview: "from-orange-500 to-red-500" },
    { id: "amber", label: "Amber", class: "from-amber-500/20 to-orange-500/20", preview: "from-amber-400 to-orange-400" },
    { id: "rose", label: "Rose", class: "from-rose-500/20 to-pink-600/20", preview: "from-rose-400 to-pink-500" },
    { id: "berry", label: "Berry", class: "from-pink-600/20 to-purple-600/20", preview: "from-pink-500 to-purple-500" },

    // Dark/Neutral Tones
    { id: "midnight", label: "Midnight", class: "from-slate-800/60 to-gray-800/60", preview: "from-slate-700 to-gray-700" },
    { id: "obsidian", label: "Obsidian", class: "from-zinc-900/60 to-neutral-900/60", preview: "from-zinc-800 to-neutral-800" },

    // Special
    { id: "gold", label: "Gold", class: "from-yellow-500/20 to-amber-500/20", preview: "from-yellow-400 to-amber-400" },
    { id: "royal", label: "Royal", class: "from-violet-600/30 to-fuchsia-600/30", preview: "from-violet-500 to-fuchsia-500" },
];

const AVATAR_OPTIONS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Calvin",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Eliza",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Henry",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivy"
];

export default function ProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [skills, setSkills] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);

    // User Profile State
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        if (user) {
            fetch(`http://localhost:8000/api/users/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data) {
                        setProfile({
                            ...data,
                            bio: data.description || "Passionate student at REC.",
                            avatar: data.avatar || AVATAR_OPTIONS[0],
                            college: data.college || "Rajalakshmi Engineering College",
                            department: data.department || "Information Technology",
                            year: data.year || "Final Year",
                            resumeUrl: data.resumeUrl,
                            resumeName: data.resumeName
                        });
                        setSkills(data.skills || []);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch profile:", err);
                    setLoading(false);
                });
        }
    }, [user]);

    const handleSave = async () => {
        if (!user || !profile) return;
        setSaving(true);
        try {
            const updatedUser = {
                ...profile,
                skills: skills,
                description: profile.bio
            };

            const res = await fetch(`http://localhost:8000/api/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser)
            });

            if (res.ok) {
                const raw = await res.json();
                setProfile({
                    ...raw,
                    bio: raw.description || profile.bio, // Keep bio sync with description
                    joinDate: raw.createdAt || profile.joinDate
                });
                setIsEditing(false);
            }
        } catch (err) {
            console.error("Failed to save profile:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleAddSkill = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleAvatarSelect = (url: string) => {
        setProfile({ ...profile, avatar: url });
        setShowAvatarPicker(false);
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploadingResume(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`http://localhost:8000/api/users/${user.id}/resume`, {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setProfile({ ...profile, resumeUrl: data.resumeUrl, resumeName: data.resumeName });
            }
        } catch (err) {
            console.error("Resume upload failed:", err);
        } finally {
            setUploadingResume(false);
        }
    };

    const handleThemeSelect = (themeId: string) => {
        setProfile({ ...profile, bannerTheme: themeId });
        setShowColorPicker(false);
    };

    if (loading || !profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-dim">Loading your profile...</p>
            </div>
        );
    }

    const currentTheme = BANNER_THEMES.find(t => t.id === profile.bannerTheme) || BANNER_THEMES[0];

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-8">
            <div className="flex items-center justify-between">
                <Link
                    href="/dashboard/student"
                    className="flex items-center gap-2 text-dim hover:text-white transition-colors group"
                >
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Back to Dashboard</span>
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-4 mb-2">
                    <UserCircle className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold">My <span className="text-primary">Profile</span></h1>
                </div>
                <p className="text-dim ml-12">Manage your account settings and customization.</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <GlassCard className="relative overflow-visible group z-10">
                    {/* Header Background */}
                    <div className={cn(
                        "absolute top-0 left-0 right-0 h-32 rounded-t-2xl bg-gradient-to-r transition-all duration-500",
                        currentTheme.class
                    )} />

                    {/* Banner Editor Controls - Moved to Bottom Right & Opens UP */}
                    {isEditing && (
                        <div className="absolute top-24 right-4 z-50">
                            <div className="relative">
                                <button
                                    onClick={() => setShowColorPicker(!showColorPicker)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-white hover:bg-black/80 transition-all shadow-lg"
                                >
                                    <Palette className="w-3 h-3" />
                                    <span>Theme</span>
                                </button>

                                <AnimatePresence>
                                    {showColorPicker && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute bottom-full right-0 mb-3 p-3 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl w-64 origin-bottom-right"
                                        >
                                            <div className="flex items-center justify-between mb-3 px-1">
                                                <span className="text-xs font-bold uppercase tracking-wider text-dim">Select Theme</span>
                                                <button onClick={() => setShowColorPicker(false)} className="text-dim hover:text-white">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-6 gap-2">
                                                {BANNER_THEMES.map((theme) => (
                                                    <button
                                                        key={theme.id}
                                                        onClick={() => handleThemeSelect(theme.id)}
                                                        className={cn(
                                                            "relative w-8 h-8 rounded-full transition-all duration-300 group/btn",
                                                            profile.bannerTheme === theme.id ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-black" : "hover:scale-110 opacity-70 hover:opacity-100"
                                                        )}
                                                        title={theme.label}
                                                    >
                                                        <div className={cn("w-full h-full rounded-full bg-gradient-to-br", theme.preview)} />
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}

                    <div className="relative pt-16 px-4 pb-4">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Avatar */}
                            <div className="relative w-32 h-32 rounded-full border-4 border-slate-900 overflow-visible shadow-2xl shrink-0 bg-slate-800">
                                <Image
                                    src={profile.avatar}
                                    alt={profile.name || "User Avatar"}
                                    fill
                                    className="object-cover rounded-full"
                                    unoptimized={profile.avatar?.includes("dicebear.com")}
                                />
                                {isEditing && (
                                    <button
                                        onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                                        className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors group/avatar z-10"
                                    >
                                        <Edit2 className="w-6 h-6 text-white group-hover/avatar:scale-110 transition-transform" />
                                    </button>
                                )}

                                {/* Avatar Selection Popover */}
                                <AnimatePresence>
                                    {showAvatarPicker && isEditing && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20, scale: 0.9 }}
                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                                            className="absolute top-0 left-full ml-4 p-4 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl w-64 z-[100]"
                                        >
                                            <div className="flex items-center justify-between mb-3 px-1">
                                                <span className="text-xs font-bold uppercase tracking-wider text-dim">Select Avatar</span>
                                                <button onClick={() => setShowAvatarPicker(false)} className="text-dim hover:text-white">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                                                {AVATAR_OPTIONS.map((url, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleAvatarSelect(url)}
                                                        className={cn(
                                                            "relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                                                            profile.avatar === url ? "border-primary shadow-[0_0_10px_rgba(234,179,8,0.3)]" : "border-transparent opacity-60 hover:opacity-100"
                                                        )}
                                                    >
                                                        <Image src={url} alt={`Avatar option ${i + 1}`} fill className="object-cover" unoptimized />
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Basic Info */}
                            <div className="flex-1 mt-2 w-full">
                                <div className="flex justify-between items-start">
                                    <div className="w-full mr-4">
                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={profile.name}
                                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xl font-bold focus:outline-none focus:border-primary/50 text-white placeholder:text-dim"
                                                    placeholder="Full Name"
                                                />
                                                <input
                                                    type="text"
                                                    value={profile.username}
                                                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-primary/50 text-primary placeholder:text-dim"
                                                    placeholder="@username"
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                                                <p className="text-primary font-medium">{profile.username}</p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                                        disabled={saving}
                                        className={cn(
                                            "px-4 py-2 rounded-full border transition-all flex items-center gap-2 text-sm font-semibold shrink-0 shadow-lg",
                                            isEditing
                                                ? "bg-green-500 text-white border-green-400 hover:bg-green-600"
                                                : "bg-white/5 text-white border-white/10 hover:bg-white/10",
                                            saving && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        {saving ? "Saving..." : (isEditing ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Save
                                            </>
                                        ) : (
                                            <>
                                                <Edit2 className="w-4 h-4" />
                                                Edit
                                            </>
                                        ))}
                                    </button>
                                </div>

                                {isEditing ? (
                                    <textarea
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        className="mt-4 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-dim focus:outline-none focus:border-primary/50 min-h-[80px] resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="mt-4 text-dim max-w-2xl leading-relaxed">{profile.bio}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <GlassCard className="h-full">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                            <GraduationCap className="w-5 h-5 text-blue-400" />
                            Academic Details
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-dim uppercase font-bold tracking-wider">College</p>
                                    {isEditing ? (
                                        <input
                                            value={profile.college}
                                            onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                                            className="w-full bg-white/5 border-b border-white/10 focus:border-primary px-0 py-1 text-white bg-transparent outline-none transition-colors"
                                        />
                                    ) : (
                                        <p className="font-medium text-white">{profile.college}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-dim uppercase font-bold tracking-wider">Department</p>
                                    {isEditing ? (
                                        <input
                                            value={profile.department}
                                            onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                                            className="w-full bg-white/5 border-b border-white/10 focus:border-primary px-0 py-1 text-white bg-transparent outline-none transition-colors"
                                        />
                                    ) : (
                                        <p className="font-medium text-white">{profile.department}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-dim uppercase font-bold tracking-wider">Year of Study</p>
                                    {isEditing ? (
                                        <input
                                            value={profile.year}
                                            onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                                            className="w-full bg-white/5 border-b border-white/10 focus:border-primary px-0 py-1 text-white bg-transparent outline-none transition-colors"
                                        />
                                    ) : (
                                        <p className="font-medium text-white">{profile.year}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <GlassCard className="h-full">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                            <Shield className="w-5 h-5 text-green-400" />
                            Account Information
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-dim uppercase font-bold tracking-wider">Email Address</p>
                                    {isEditing ? (
                                        <input
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="w-full bg-white/5 border-b border-white/10 focus:border-primary px-0 py-1 text-white bg-transparent outline-none transition-colors"
                                        />
                                    ) : (
                                        <p className="font-medium text-white">{profile.email}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-dim uppercase font-bold tracking-wider">Location</p>
                                    {isEditing ? (
                                        <input
                                            value={profile.location}
                                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                            className="w-full bg-white/5 border-b border-white/10 focus:border-primary px-0 py-1 text-white bg-transparent outline-none transition-colors"
                                        />
                                    ) : (
                                        <p className="font-medium text-white">{profile.location}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-dim uppercase font-bold tracking-wider">Joined On</p>
                                    <p className="font-medium text-white">{profile.joinDate}</p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>

            {/* Professional Portfolio Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    Professional Portfolio
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Resume Section */}
                    <GlassCard>
                        <h4 className="font-bold mb-4">Resume / CV</h4>
                        <label className={cn(
                            "block border-2 border-dashed border-white/10 rounded-xl p-8 text-center transition-all cursor-pointer group hover:bg-white/5",
                            uploadingResume && "opacity-50 cursor-wait"
                        )}>
                            <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeUpload}
                                disabled={uploadingResume}
                            />
                            <div className="w-12 h-12 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileUp className={cn("w-6 h-6 text-dim group-hover:text-white", uploadingResume && "animate-bounce text-primary")} />
                            </div>
                            <p className="font-medium mb-1">{uploadingResume ? "Uploading..." : "Upload your Resume"}</p>
                            <p className="text-xs text-dim">Only one resume allowed (PDF, DOCX)</p>
                        </label>

                        {/* Uploaded File */}
                        {profile.resumeUrl && (
                            <div className="mt-6 flex flex-col gap-4">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/10 mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded bg-green-500/10 text-green-400">
                                            <FileUp className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{profile.resumeName || "resume.pdf"}</p>
                                            <p className="text-[10px] text-green-400/60 flex items-center gap-1">
                                                <Check className="w-2 h-2" /> Stored & Optimized
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={`http://localhost:8000/api/users/${user?.id}/resume/download`}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-dim hover:text-white"
                                        title="Download Resume"
                                    >
                                        <Download className="w-4 h-4" />
                                    </a>
                                </div>

                                <a
                                    href={`http://localhost:8000/api/users/${user?.id}/resume/download`}
                                    className="w-full py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all flex items-center justify-center gap-2 font-bold group shadow-lg"
                                >
                                    <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Download Resume
                                </a>
                            </div>
                        )}
                    </GlassCard>

                    {/* Skills Section */}
                    <GlassCard>
                        <h4 className="font-bold mb-4">Skills & Expertise</h4>
                        <form onSubmit={handleAddSkill} className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Add a skill (e.g. Python)"
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!newSkill.trim()}
                                className="p-2 rounded-lg bg-primary/20 text-primary border border-primary/50 hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </form>

                        <div className="flex flex-wrap gap-2">
                            {skills.map(skill => (
                                <div key={skill} className="flex items-center gap-1 pl-3 pr-1 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium group hover:border-white/20 transition-colors">
                                    {skill}
                                    <button
                                        onClick={() => removeSkill(skill)}
                                        className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </motion.div>
        </div>
    );
}
