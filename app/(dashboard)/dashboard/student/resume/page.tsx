"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import {
    UploadCloud, FileText, Check, AlertTriangle, XCircle,
    Briefcase, ChevronRight, BarChart3, Target, Zap,
    RefreshCcw, ChevronLeft, Download, Shield
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock Data for Roles
const TARGET_ROLES = [
    { id: "frontend", label: "Frontend Developer", icon: "🎨", keywords: ["React", "TypeScript", "Tailwind", "Next.js", "Redux", "Figma"] },
    { id: "backend", label: "Backend Engineer", icon: "⚙️", keywords: ["Node.js", "Python", "SQL", "Docker", "API Design", "Redis"] },
    { id: "datascience", label: "Data Scientist", icon: "📊", keywords: ["Python", "Pandas", "PyTorch", "SQL", "Data Viz", "Statistics"] },
    { id: "fullstack", label: "Full Stack Dev", icon: "⚡", keywords: ["React", "Node.js", "DB Management", "AWS", "CI/CD", "TypeScript"] },
    { id: "mobile", label: "Mobile Developer", icon: "📱", keywords: ["React Native", "Flutter", "iOS", "Android", "Firebase", "State Mgmt"] },
];

export default function ResumeAnalyzer() {
    // Pipeline State: 'setup' | 'analyzing' | 'results'
    const [gameState, setGameState] = useState<"setup" | "analyzing" | "results">("setup");

    // User Selections
    const [resumeSource, setResumeSource] = useState<"profile" | "upload" | "paste" | null>(null);
    const [targetRole, setTargetRole] = useState<string | null>(null);
    const [resumeText, setResumeText] = useState("");

    // Mock Analysis Results
    const [analysis, setAnalysis] = useState<any>(null);

    const startAnalysis = () => {
        if (!resumeSource || !targetRole) return;

        // If "Paste" mode, validate text
        if (resumeSource === 'paste' && resumeText.length < 50) {
            alert("Please paste your resume content (at least 50 chars)!");
            return;
        }

        setGameState("analyzing");

        // Real Keyword Matching Logic
        setTimeout(() => {
            const roleData = TARGET_ROLES.find(r => r.id === targetRole);
            if (!roleData) return;

            // Use pasted text or mock text for other modes
            const textToAnalyze = resumeSource === 'paste' ? resumeText.toLowerCase() :
                "react typescript node.js experience full stack developer sql python"; // Mock content for profile/upload modes

            const matched = roleData.keywords.filter(k => textToAnalyze.includes(k.toLowerCase()));
            const missing = roleData.keywords.filter(k => !textToAnalyze.includes(k.toLowerCase()));

            const matchPercentage = (matched.length / roleData.keywords.length) * 100;

            // Heuristic Scoring
            // Base score 60 + match bonus
            const calculatedScore = Math.min(98, Math.floor(60 + (matchPercentage * 0.4)));

            setAnalysis({
                overallScore: calculatedScore,
                atsScore: Math.min(95, 70 + (textToAnalyze.length > 500 ? 20 : 0)), // Dummy ATS check logic based on length
                impactScore: 75, // Placeholder
                roleRelevance: Math.floor(matchPercentage),
                matchedKeywords: matched,
                missingKeywords: missing,
                criticalIssues: missing.length > 0 ? [
                    { title: "Missing Key Skills", desc: `Your resume lacks core technologies: ${missing.join(", ")}.` },
                    { title: "Generic Descriptions", desc: "Try to quantify your achievements with numbers." },
                ] : [
                    { title: "Great Keyword Match", desc: "You have hit most of the major requirements for this role!" }
                ],
                role: roleData
            });
            setGameState("results");
        }, 2000);
    };

    const resetAnalyzer = () => {
        setGameState("setup");
        setResumeSource(null);
        setTargetRole(null);
        setAnalysis(null);
        setResumeText("");
    };

    return (
        <div className="max-w-6xl mx-auto min-h-screen pb-20">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <Link
                    href="/dashboard/student"
                    className="inline-flex items-center gap-2 text-dim hover:text-white transition-colors group mb-6"
                >
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Back to Dashboard</span>
                </Link>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    ATS Resume Architect
                </h1>
                <p className="text-dim text-lg mt-2 max-w-2xl">
                    Beat the bots. Optimize for impact. Paste your resume to see how well you match the job description.
                </p>
            </motion.div>

            <AnimatePresence mode="wait">
                {gameState === "setup" && (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-8"
                    >
                        {/* Step 1: Source */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-black text-sm font-bold">1</span>
                                Select Resume Source
                            </h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => setResumeSource("paste")}
                                    className={cn(
                                        "p-6 rounded-2xl border text-left transition-all hover:scale-[1.02]",
                                        resumeSource === "paste"
                                            ? "bg-primary/20 border-primary shadow-[0_0_30px_-5px_var(--primary)]"
                                            : "bg-white/5 border-white/10 hover:bg-white/10"
                                    )}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-xl bg-orange-500/20 text-orange-400">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        {resumeSource === "paste" && <Check className="w-6 h-6 text-primary" />}
                                    </div>
                                    <h3 className="font-bold text-lg">Paste Text</h3>
                                    <p className="text-sm text-dim mt-1">Directly analyze content</p>
                                </button>

                                <button
                                    onClick={() => setResumeSource("profile")}
                                    className={cn(
                                        "p-6 rounded-2xl border text-left transition-all hover:scale-[1.02]",
                                        resumeSource === "profile"
                                            ? "bg-primary/20 border-primary shadow-[0_0_30px_-5px_var(--primary)]"
                                            : "bg-white/5 border-white/10 hover:bg-white/10"
                                    )}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                                            <Briefcase className="w-6 h-6" />
                                        </div>
                                        {resumeSource === "profile" && <Check className="w-6 h-6 text-primary" />}
                                    </div>
                                    <h3 className="font-bold text-lg">Use Profile Resume</h3>
                                    <p className="text-sm text-dim mt-1">alfred_resume_v2.pdf</p>
                                </button>

                                <button
                                    onClick={() => setResumeSource("upload")}
                                    className={cn(
                                        "p-6 rounded-2xl border text-left transition-all hover:scale-[1.02]",
                                        resumeSource === "upload"
                                            ? "bg-primary/20 border-primary shadow-[0_0_30px_-5px_var(--primary)]"
                                            : "bg-white/5 border-white/10 hover:bg-white/10"
                                    )}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                                            <UploadCloud className="w-6 h-6" />
                                        </div>
                                        {resumeSource === "upload" && <Check className="w-6 h-6 text-primary" />}
                                    </div>
                                    <h3 className="font-bold text-lg">Upload New File</h3>
                                    <p className="text-sm text-dim mt-1">PDF or DOCX (Mock)</p>
                                </button>
                            </div>

                            {/* PASTE RESUME TEXT AREA */}
                            <AnimatePresence>
                                {resumeSource === 'paste' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="mt-4 overflow-hidden"
                                    >
                                        <textarea
                                            value={resumeText}
                                            onChange={e => setResumeText(e.target.value)}
                                            placeholder="Paste your resume content here..."
                                            className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary resize-none custom-scrollbar"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </section>

                        {/* Step 2: Role */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-black text-sm font-bold">2</span>
                                Target Role
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                {TARGET_ROLES.map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => setTargetRole(role.id)}
                                        className={cn(
                                            "p-4 rounded-xl border transition-all text-center group",
                                            targetRole === role.id
                                                ? "bg-primary/20 border-primary"
                                                : "bg-white/5 border-white/10 hover:bg-white/10"
                                        )}
                                    >
                                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{role.icon}</div>
                                        <div className="font-medium text-sm leading-tight">{role.label}</div>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Action */}
                        <div className="flex justify-end pt-4">
                            <button
                                disabled={!resumeSource || !targetRole || (resumeSource === 'paste' && !resumeText)}
                                onClick={startAnalysis}
                                className="px-8 py-4 bg-primary text-black font-bold text-lg rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-3 shadow-xl shadow-primary/20"
                            >
                                <Zap className="w-5 h-5 fill-black" />
                                Run Audit
                            </button>
                        </div>
                    </motion.div>
                )}

                {gameState === "analyzing" && (
                    <motion.div
                        key="analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Target className="w-8 h-8 text-primary animate-pulse" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Analyzing Resume DNA...</h2>
                        <p className="text-dim">Benchmarking against 50,000+ successful {TARGET_ROLES.find(t => t.id === targetRole)?.label} profiles.</p>
                    </motion.div>
                )}

                {gameState === "results" && analysis && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid lg:grid-cols-3 gap-8"
                    >
                        {/* LEFT COLUMN: Core Stats */}
                        <div className="lg:col-span-1 space-y-6">
                            <GlassCard className="text-center p-8 relative overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />

                                <h3 className="text-dim font-bold uppercase tracking-wider text-xs mb-4">Overall Match Score</h3>
                                <div className="relative w-40 h-40 mx-auto mb-4 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" className="stroke-white/10 fill-none stroke-[8]" />
                                        <circle
                                            cx="50" cy="50" r="45"
                                            className={cn("fill-none stroke-[8] transition-all duration-1000",
                                                analysis.overallScore > 80 ? "stroke-green-500" : "stroke-yellow-500"
                                            )}
                                            strokeDasharray="283"
                                            strokeDashoffset={283 - (283 * analysis.overallScore) / 100}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-5xl font-black">{analysis.overallScore}</span>
                                        <span className="text-sm font-bold text-dim">/100</span>
                                    </div>
                                </div>

                                <p className="text-sm font-medium">
                                    {analysis.overallScore > 85 ? "Excellent! Recruiters will love this." :
                                        analysis.overallScore > 70 ? "Good start, but needs polish." : "Needs significant improvement."}
                                </p>
                            </GlassCard>

                            <GlassCard className="p-0 overflow-hidden">
                                <div className="p-4 border-b border-white/10 bg-white/5">
                                    <h4 className="font-bold flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-primary" /> Metrics Breakdown
                                    </h4>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span>ATS Parse Rate</span>
                                            <span className="text-green-400">{analysis.atsScore}%</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${analysis.atsScore}%` }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span>Role Relevance</span>
                                            <span className="text-blue-400">{analysis.roleRelevance}%</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${analysis.roleRelevance}%` }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span>Impact (Quantifiable)</span>
                                            <span className="text-orange-400">{analysis.impactScore}%</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${analysis.impactScore}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>

                            <button
                                onClick={resetAnalyzer}
                                className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 flex items-center justify-center gap-2 font-bold transition-colors"
                            >
                                <RefreshCcw className="w-4 h-4" /> Analyze Another
                            </button>
                        </div>

                        {/* RIGHT COLUMN: Deep Dive */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Role Fit */}
                            <GlassCard>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 rounded-xl bg-primary/20 text-primary text-2xl">
                                        {analysis.role?.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Target: {analysis.role?.label}</h3>
                                        <p className="text-dim text-sm">Keyword analysis based on current job market data.</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                        <h4 className="flex items-center gap-2 font-bold text-green-400 mb-3">
                                            <Check className="w-4 h-4" /> Good Matches
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {analysis.matchedKeywords.map((k: string) => (
                                                <span key={k} className="px-2 py-1 rounded bg-green-500/20 text-green-200 text-xs font-medium">
                                                    {k}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                        <h4 className="flex items-center gap-2 font-bold text-red-400 mb-3">
                                            <XCircle className="w-4 h-4" /> Critical Missing Skills
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {analysis.missingKeywords.map((k: string) => (
                                                <span key={k} className="px-2 py-1 rounded bg-red-500/20 text-red-200 text-xs font-medium">
                                                    {k}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Action Plan */}
                            <div>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-yellow-500" />
                                    Optimization Action Plan
                                </h3>
                                <div className="space-y-4">
                                    {analysis.criticalIssues.map((issue: any, i: number) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * i }}
                                        >
                                            <GlassCard className="flex gap-4 border-l-4 border-l-yellow-500">
                                                <div className="shrink-0 mt-1">
                                                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white mb-1">{issue.title}</h4>
                                                    <p className="text-dim text-sm leading-relaxed">{issue.desc}</p>
                                                </div>
                                                <div className="ml-auto flex items-center">
                                                    <ChevronRight className="w-5 h-5 text-white/20" />
                                                </div>
                                            </GlassCard>
                                        </motion.div>
                                    ))}

                                    {/* Mock Positive Feedback */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <GlassCard className="flex gap-4 border-l-4 border-l-green-500 opacity-60">
                                            <div className="shrink-0 mt-1">
                                                <Check className="w-5 h-5 text-green-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white mb-1">Education Section is clean</h4>
                                                <p className="text-dim text-sm">Your formatting here is readable by ATS parsers.</p>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
