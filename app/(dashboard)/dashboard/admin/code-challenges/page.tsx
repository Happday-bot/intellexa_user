"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { Plus, Edit2, Trash2, Code2, X, Search, ChevronDown, ChevronUp, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface CodeQuestion {
    id: string;
    title: string;
    functionName: string;
    difficulty: string;
    category: string;
    tags: string[];
    description: string;
    constraints: string[];
    starterCode: Record<string, string>;
    testCases: Array<{ input: string; output: string }>;
}

export default function CodeChallengesManagerPage() {
    const [challenges, setChallenges] = useState<CodeQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CodeQuestion | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [activeLang, setActiveLang] = useState('python');

    // Form State (Simplified for basic info, JSON for complex objects)
    const [formData, setFormData] = useState<Partial<CodeQuestion>>({
        id: "",
        title: "",
        functionName: "",
        difficulty: "Easy",
        category: "Algorithms",
        tags: [],
        description: "",
        constraints: [],
        starterCode: { python: "# Start coding here", javascript: "// Start coding here" },
        testCases: [{ input: "", output: "" }]
    });

    useEffect(() => {
        fetchChallenges();
    }, []);

    const fetchChallenges = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/code-challenges");
            const data = await res.json();
            setChallenges(data);
        } catch (err) {
            console.error("Failed to fetch challenges:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item?: CodeQuestion) => {
        if (item) {
            setEditingItem(item);
            setFormData(item);
        } else {
            setEditingItem(null);
            setFormData({
                id: `q${challenges.length + 1}`,
                title: "",
                functionName: "",
                difficulty: "Easy",
                category: "Algorithms",
                tags: ["Core"],
                description: "",
                constraints: ["Standard constraints apply"],
                starterCode: { python: "# Start coding here", javascript: "// Start coding here", cpp: "// Start coding here" },
                testCases: [{ input: "", output: "" }]
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingItem ? "PUT" : "POST";
        const url = editingItem
            ? `http://localhost:8000/api/code-challenges/${editingItem.id}`
            : "http://localhost:8000/api/code-challenges";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                fetchChallenges();
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error("Failed to save challenge:", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this challenge?")) return;
        try {
            const res = await fetch(`http://localhost:8000/api/code-challenges/${id}`, { method: "DELETE" });
            if (res.ok) fetchChallenges();
        } catch (err) {
            console.error("Failed to delete challenge:", err);
        }
    };

    const filteredChallenges = challenges.filter(c =>
        c.title.toLowerCase().includes(filter.toLowerCase()) ||
        c.category.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto pb-20 text-left">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6 mb-12"
            >
                <Link
                    href="/dashboard/admin"
                    className="inline-flex items-center gap-2 text-dim hover:text-white transition-colors group"
                >
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Back to Dashboard</span>
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent italic">Challenge <span className="text-accent">Forge</span></h1>
                        <p className="text-dim text-lg">Architect coding trials and maintain technical excellence.</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dim" />
                            <input
                                type="text"
                                placeholder="Find challenge..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-accent/50 transition-all text-sm"
                            />
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="px-8 py-4 bg-accent text-white rounded-2xl font-bold hover:bg-accent/80 transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent/20"
                        >
                            <Plus className="w-6 h-6" />
                            New Challenge
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="space-y-4">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-24 rounded-3xl bg-white/5 animate-pulse" />)
                ) : (
                    <AnimatePresence>
                        {filteredChallenges.map((challenge, index) => (
                            <motion.div
                                key={challenge.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                <GlassCard className="group overflow-hidden">
                                    <div className="p-5 flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                            <Code2 className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-bold text-lg">{challenge.title}</h3>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest ${challenge.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                                                    challenge.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-400' :
                                                        'bg-red-500/10 text-red-400'
                                                    }`}>
                                                    {challenge.difficulty}
                                                </span>
                                            </div>
                                            <div className="flex gap-4 text-xs text-dim">
                                                <span>{challenge.category}</span>
                                                <span>•</span>
                                                <span>{challenge.tags?.join(", ") || "No tags"}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setExpandedId(expandedId === challenge.id ? null : challenge.id)}
                                                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-dim transition-colors"
                                            >
                                                {expandedId === challenge.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(challenge)}
                                                className="p-3 rounded-xl bg-white/5 hover:bg-accent/20 text-dim hover:text-accent transition-all"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(challenge.id)}
                                                className="p-3 rounded-xl bg-red-500/5 hover:bg-red-500/20 text-red-500/50 hover:text-red-500 transition-all border border-white/5"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {expandedId === challenge.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            className="px-5 pb-5 border-t border-white/5 pt-5 bg-white/5"
                                        >
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div>
                                                    <h4 className="text-xs font-black uppercase text-accent mb-3 tracking-widest">Description</h4>
                                                    <p className="text-sm text-dim leading-relaxed">{challenge.description}</p>

                                                    <h4 className="text-xs font-black uppercase text-accent mt-6 mb-3 tracking-widest">Constraints</h4>
                                                    <ul className="text-sm text-dim list-disc list-inside space-y-1">
                                                        {challenge.constraints.map((c, i) => <li key={i}>{c}</li>)}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-black uppercase text-accent mb-3 tracking-widest">Test Cases</h4>
                                                    <div className="space-y-2">
                                                        {challenge.testCases.map((tc, i) => (
                                                            <div key={i} className="p-3 rounded-lg bg-black/40 border border-white/5 text-[10px] font-mono">
                                                                <div className="mb-1"><span className="text-dim">Input:</span> {tc.input}</div>
                                                                <div><span className="text-dim">Output:</span> {tc.output}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </GlassCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-4xl h-[85vh] overflow-hidden">
                            <GlassCard className="flex flex-col h-full border-white/20 !p-0">
                                <div className="p-8 pb-4 flex justify-between items-center bg-white/[0.02]">
                                    <h2 className="text-2xl font-bold">{editingItem ? "Refine Challenge" : "Forge New Challenge"}</h2>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                        <X className="w-5 h-5 text-dim" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Title</label>
                                            <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:border-accent/50 outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Unique ID</label>
                                            <input disabled={!!editingItem} required type="text" value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:border-accent/50 outline-none transition-all disabled:opacity-50" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Function Name</label>
                                            <input required type="text" value={formData.functionName} onChange={e => setFormData({ ...formData, functionName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:border-accent/50 outline-none transition-all" placeholder="e.g. solve_problem" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Difficulty</label>
                                            <select value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:border-accent/50 outline-none transition-all text-dim [&>option]:bg-slate-900">
                                                <option>Easy</option>
                                                <option>Medium</option>
                                                <option>Hard</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Category</label>
                                            <input required type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:border-accent/50 outline-none transition-all" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Tags (Comma separated)</label>
                                            <input type="text" value={formData.tags?.join(", ")} onChange={e => setFormData({ ...formData, tags: e.target.value.split(",").map(t => t.trim()) })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:border-accent/50 outline-none transition-all" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-1.5 block">Description</label>
                                        <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:border-accent/50 outline-none transition-all resize-none" />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* Test Cases Manager */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-bold flex items-center justify-between">
                                                Validation Cases
                                                <span className="text-[10px] font-normal text-dim opacity-60">
                                                    {formData.testCases?.length || 0} Cases Added
                                                </span>
                                            </h3>

                                            {/* List of Logic Cases */}
                                            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar bg-black/20 p-2 rounded-xl border border-white/5">
                                                {formData.testCases?.map((tc, i) => (
                                                    <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 group relative transition-all">
                                                        <div className="grid gap-2 text-[11px] font-mono">
                                                            <div>
                                                                <span className="text-dim uppercase tracking-widest text-[9px] font-bold block mb-1">Input</span>
                                                                <div className="bg-black/40 p-2 rounded border border-white/5 truncate" title={tc.input}>{tc.input}</div>
                                                            </div>
                                                            <div>
                                                                <span className="text-dim uppercase tracking-widest text-[9px] font-bold block mb-1">Expected Output</span>
                                                                <div className="bg-black/40 p-2 rounded border border-white/5 truncate" title={tc.output}>{tc.output}</div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newCases = [...(formData.testCases || [])];
                                                                newCases.splice(i, 1);
                                                                setFormData({ ...formData, testCases: newCases });
                                                            }}
                                                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {(!formData.testCases || formData.testCases.length === 0) && (
                                                    <div className="text-center py-8 text-dim text-xs italic">
                                                        No validation cases yet.
                                                    </div>
                                                )}
                                            </div>

                                            {/* Add New Case */}
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                                <div className="text-[10px] font-black text-dim uppercase tracking-widest">New Test Case</div>
                                                <input
                                                    placeholder="Input (e.g. nums=[2,7], target=9)"
                                                    id="new-case-input"
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs font-mono focus:border-accent/50 outline-none transition-all placeholder:text-dim/30"
                                                />
                                                <input
                                                    placeholder="Expected Output (e.g. [0,1])"
                                                    id="new-case-output"
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs font-mono focus:border-accent/50 outline-none transition-all placeholder:text-dim/30"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const inputEl = document.getElementById('new-case-input') as HTMLInputElement;
                                                        const outputEl = document.getElementById('new-case-output') as HTMLInputElement;
                                                        if (inputEl.value && outputEl.value) {
                                                            setFormData({
                                                                ...formData,
                                                                testCases: [...(formData.testCases || []), { input: inputEl.value, output: outputEl.value }]
                                                            });
                                                            inputEl.value = "";
                                                            outputEl.value = "";
                                                        }
                                                    }}
                                                    className="w-full py-2.5 rounded-lg bg-accent/20 text-accent font-bold text-xs uppercase tracking-wider hover:bg-accent hover:text-white transition-all border border-accent/20"
                                                >
                                                    <Plus className="w-4 h-4 inline-block mr-2" />
                                                    Add Case
                                                </button>
                                            </div>
                                        </div>

                                        {/* Starter Code Manager */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-bold flex items-center justify-between">
                                                Starter Templates
                                                <div className="flex bg-white/5 rounded-lg p-1 gap-1">
                                                    {['python', 'java', 'cpp'].map(lang => (
                                                        <button
                                                            key={lang}
                                                            type="button"
                                                            // @ts-ignore
                                                            onClick={() => setActiveLang(lang)}
                                                            // @ts-ignore
                                                            className={`px-3 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider transition-all ${activeLang === lang ? 'bg-accent text-white shadow-lg' : 'text-dim hover:text-white'}`}
                                                        >
                                                            {lang}
                                                        </button>
                                                    ))}
                                                </div>
                                            </h3>

                                            <div className="relative h-[400px] bg-[#0c0c0c] rounded-xl border border-white/10 overflow-hidden flex flex-col group">
                                                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                                                    <span className="text-[10px] font-mono text-dim opacity-50">main.{// @ts-ignore
                                                        activeLang}</span>
                                                    <Code2 className="w-3 h-3 text-dim opacity-30" />
                                                </div>
                                                <textarea
                                                    className="flex-1 w-full p-4 bg-transparent text-xs font-mono text-dim-white resize-none focus:outline-none leading-relaxed"
                                                    // @ts-ignore
                                                    value={formData.starterCode?.[activeLang] || ""}
                                                    onChange={e => setFormData({
                                                        ...formData,
                                                        starterCode: {
                                                            ...formData.starterCode,
                                                            // @ts-ignore
                                                            [activeLang]: e.target.value
                                                        }
                                                    })}
                                                    placeholder={`// Enter execution entrypoint for ${// @ts-ignore
                                                        activeLang}...`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4 sticky bottom-0 bg-transparent">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-colors border border-white/10">Cancel</button>
                                        <button type="submit" className="flex-1 py-4 rounded-xl font-bold bg-accent hover:bg-accent/80 transition-all shadow-xl shadow-accent/20">Save Challenge</button>
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

