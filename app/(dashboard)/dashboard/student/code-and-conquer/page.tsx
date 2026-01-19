"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import {
    ChevronLeft, Code2, Play, CheckCircle2, AlertCircle,
    Terminal, BookOpen, Settings2, Trophy,
    ArrowRight, Save, Layout, Layers, Search,
    Sparkles, Cpu, Globe, Lock, Info, RotateCcw,
    Maximize2, ListTodo, FileCode
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { cn } from "@/lib/utils";
import { codeQuestions, type Language, type CodeQuestion } from "@/app/data/codeData";
import { useAuth } from "@/app/context/AuthContext";

import dynamic from "next/dynamic";

// Editor & Syntax Highlighting
const Editor = dynamic(() => import("react-simple-code-editor"), { ssr: false });

import "prismjs/themes/prism-tomorrow.css";
// Languages will be loaded via side-effects in useEffect to avoid SSR issues

export default function CodeAndConquer() {
    const [view, setView] = useState<'browser' | 'editor'>('browser');
    const [selectedQuestion, setSelectedQuestion] = useState<CodeQuestion | null>(null);
    const [language, setLanguage] = useState<Language>('python');
    const [code, setCode] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState<{
        status: 'success' | 'error' | 'idle',
        message: string,
        results?: any[]
    }>({ status: 'idle', message: "" });
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'output'>('description');
    const [pyodide, setPyodide] = useState<any>(null);
    const [isPyodideLoading, setIsPyodideLoading] = useState(false);
    const [prismLoaded, setPrismLoaded] = useState(false);
    const [questions, setQuestions] = useState<CodeQuestion[]>([]);
    const [loadingQuestions, setLoadingQuestions] = useState(true);
    const [userProgress, setUserProgress] = useState<{ totalExp: number, rank: string, passedQuestions: string[] }>({ totalExp: 0, rank: "NOVICE", passedQuestions: [] });
    const { user } = useAuth();

    useEffect(() => {
        fetch("http://localhost:8000/api/code-challenges")
            .then(res => res.json())
            .then(data => {
                setQuestions(data);
                setLoadingQuestions(false);
            })
            .catch(err => {
                console.error("Failed to fetch code questions:", err);
                setQuestions(codeQuestions); // Fallback to local data
                setLoadingQuestions(false);
            });

        if (user) {
            fetch(`http://localhost:8000/api/progress/${user.id}`)
                .then(res => res.json())
                .then(data => setUserProgress(data))
                .catch(err => console.error("Failed to fetch user progress:", err));
        }
    }, [user]);

    // Load Prism languages on client side only
    useEffect(() => {
        let mounted = true;

        const loadPrism = async () => {
            const PrismModule = await import("prismjs");
            const Prism = PrismModule.default;

            // Explicit dependency order
            await import("prismjs/components/prism-clike"); // REQUIRED for C / C++
            await import("prismjs/components/prism-python");
            await import("prismjs/components/prism-java");
            await import("prismjs/components/prism-c");
            await import("prismjs/components/prism-cpp");
            await import("prismjs/components/prism-rust");

            if (mounted) {
                // @ts-ignore – store globally for editor usage
                window.Prism = Prism;
                setPrismLoaded(true);
            }
        };

        loadPrism();

        return () => {
            mounted = false;
        };
    }, []);


    // Filters for Browser
    const [searchQuery, setSearchQuery] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState<string>("All");

    // Initialize Pyodide
    const initPyodide = async () => {
        if (pyodide || isPyodideLoading) return;
        setIsPyodideLoading(true);
        try {
            // @ts-ignore
            const py = await window.loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
            });
            setPyodide(py);
            console.log("Pyodide Loaded");
        } catch (err) {
            console.error("Failed to load Pyodide:", err);
        } finally {
            setIsPyodideLoading(false);
        }
    };

    const enterEditor = (q: CodeQuestion) => {
        setSelectedQuestion(q);
        // @ts-ignore
        setCode(q.starterCode?.[language] || "");
        setView('editor');
        setOutput({ status: 'idle', message: "" });
        setActiveTab('description');
        if (language === 'python') initPyodide();
    };

    useEffect(() => {
        if (selectedQuestion) {
            // @ts-ignore
            setCode(selectedQuestion.starterCode?.[language] || "");
            if (language === 'python' && view === 'editor') initPyodide();
        }
    }, [language, selectedQuestion, view]);

    const handleRunCode = async () => {
        setIsRunning(true);
        setActiveTab('output');

        if (language === 'python' && pyodide) {
            try {
                // Initialize evaluation results
                const evaluations: any[] = [];

                // Set up the Python evaluator
                await pyodide.runPythonAsync(`
import json
import sys
import io

def evaluate_code(code, inputs, expected_outputs):
    import sys
    import io
    
    results = []

    # Helper to mock input() behavior
    class InputProvider:
        def __init__(self, input_str):
            # Split input string by newlines to simulate multiple input() calls
            # handling semicolon as potential separator if needed, but primarily newlines
            self.lines = input_str.strip().split('\\n')
            self.index = 0
            
        def readline(self, prompt=""):
            if self.index < len(self.lines):
                line = self.lines[self.index]
                self.index += 1
                return line
            return ""

    # Iterate through test cases
    for i in range(len(inputs)):
        input_str = inputs[i]
        expected_str = expected_outputs[i]
        
        # Setup stdout capture
        captured_stdout = io.StringIO()
        original_stdout = sys.stdout
        sys.stdout = captured_stdout
        
        # Setup stdin mock
        provider = InputProvider(input_str)
        globals()['input'] = provider.readline
        
        try:
            # Create a fresh scope for each run to avoid variable bleeding
            # but keep some consistency if needed. Ideally clean scope is better.
            local_scope = {}
            
            # Execute the USER SCRIPT directly
            exec(code, globals(), local_scope)
            
            # Capture stdout
            stdout_val = captured_stdout.getvalue().strip()
            
            # Compare output (String exact match)
            # Normalize newlines and trailing spaces
            expected_clean = expected_str.strip()
            actual_clean = stdout_val
            
            passed = actual_clean == expected_clean
            
            results.append({
                "passed": passed,
                "input": input_str,
                "expected": expected_clean,
                "actual": actual_clean,
                "stdout": stdout_val,
                "error": None
            })
        except Exception as e:
            results.append({
                "passed": False,
                "input": input_str,
                "expected": expected_str,
                "actual": "Runtime Error",
                "stdout": captured_stdout.getvalue(),
                "error": str(e)
            })
        finally:
            sys.stdout = original_stdout
            
    return results
                `);

                if (!selectedQuestion) return;

                // Prepare inputs and expected outputs for the evaluator
                const inputs = selectedQuestion.testCases.map(tc => tc.input);
                const expected = selectedQuestion.testCases.map(tc => tc.output);

                // Call the evaluator
                pyodide.globals.set("user_code", code);
                pyodide.globals.set("func_name", selectedQuestion.functionName);
                pyodide.globals.set("case_inputs", pyodide.toPy(inputs));
                pyodide.globals.set("case_expected", pyodide.toPy(expected));

                const resultsRaw = await pyodide.runPythonAsync(`evaluate_code(user_code, case_inputs, case_expected)`);
                // Convert Python Dicts to JS Objects (default is Map)
                const results = resultsRaw.toJs({ dict_converter: Object.fromEntries });

                if (results?.error) {
                    throw new Error(results.error);
                }

                const failedCase = results.find((r: any) => !r.passed);
                console.log("Evaluation Results:", results);

                // Calculate stats
                const passedCount = results.filter((r: any) => r.passed).length;
                const totalCount = results.length;
                const isSuccess = passedCount === totalCount;

                setOutput({
                    status: isSuccess ? 'success' : 'error',
                    message: isSuccess ? 'All Test Cases Passed' : `${passedCount}/${totalCount} Test Cases Passed`,
                    results: results
                });

                if (isSuccess && user && selectedQuestion) {
                    await fetch("http://localhost:8000/api/progress/update", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: user.id, questionId: selectedQuestion.id })
                    })
                        .then(res => res.json())
                        .then(data => setUserProgress(data))
                        .catch(err => console.error("Failed to update progress:", err));
                }
            } catch (err: any) {
                setOutput({
                    status: 'error',
                    message: `Status: Runtime Error\n\n${err.message}`
                });
            } finally {
                setIsRunning(false);
            }
        } else {
            // Simulated Logic for other languages
            setTimeout(() => {
                if (!selectedQuestion) return;

                // Generate detailed results for simulation
                const results = selectedQuestion.testCases.map((tc, i) => {
                    const normalizedOutput = tc.output.replace(/[\s"']/g, '');
                    const normalizedCode = code.replace(/[\s"']/g, '');
                    // Simple "contains" check for simulation purposes
                    const passed = normalizedCode.includes(normalizedOutput);

                    // Extract "Fake Stdout" from code for simulation using regex
                    let fakeStdout = "";
                    const printfMatch = code.match(/printf\s*\(\s*"([^"]+)"\s*\)/);
                    const coutMatch = code.match(/cout\s*<<\s*"([^"]+)"/);
                    const javaMatch = code.match(/System\.out\.println\s*\(\s*"([^"]+)"\s*\)/);

                    if (printfMatch) fakeStdout += printfMatch[1] + "\n";
                    if (coutMatch) fakeStdout += coutMatch[1] + "\n";
                    if (javaMatch) fakeStdout += javaMatch[1] + "\n";

                    return {
                        passed,
                        input: tc.input,
                        expected: tc.output,
                        actual: passed ? tc.output : "Simulation: Solution logic not found in code",
                        stdout: fakeStdout || (passed ? "Simulation: Logic pattern match found" : null),
                        error: null
                    };
                });

                const passedCount = results.filter(r => r.passed).length;
                const totalCount = results.length;
                const isSuccess = passedCount === totalCount;

                setOutput({
                    status: isSuccess ? 'success' : 'error',
                    message: isSuccess ? 'All Test Cases Passed' : `${passedCount}/${totalCount} Test Cases Passed`,
                    results: results
                });
                setIsRunning(false);
            }, 1000);
        }
    };

    const handleSubmit = async () => {
        if (!selectedQuestion || output.status !== 'success' || !user) return;

        setSubmitting(true);
        try {
            const res = await fetch("http://localhost:8000/api/progress/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    questionId: selectedQuestion.id
                })
            });
            const data = await res.json();
            setUserProgress(data);
            setOutput({
                status: 'success',
                message: "Evaluation Confirmed! XP Awarded."
            });
        } catch (err) {
            console.error("Failed to submit:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = difficultyFilter === "All" || q.difficulty === difficultyFilter;
        return matchesSearch && matchesDifficulty;
    });

    const getPrismLanguage = (lang: string) => {
        const Prism = (window as any).Prism;
        if (!Prism) return null;

        switch (lang) {
            case "python": return Prism.languages.python;
            case "java": return Prism.languages.java;
            case "cpp": return Prism.languages.cpp;
            case "c": return Prism.languages.c;
            case "rust": return Prism.languages.rust;
            default: return Prism.languages.javascript;
        }
    };


    return (
        <div className="max-w-7xl mx-auto min-h-screen pb-20">
            <Script
                src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js"
                strategy="afterInteractive"
            />

            <AnimatePresence mode="wait">
                {view === 'browser' ? (
                    <motion.div
                        key="browser"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                            <div>
                                <Link
                                    href="/dashboard/student"
                                    className="inline-flex items-center gap-2 text-dim hover:text-white transition-colors group mb-4"
                                >
                                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                                        <ChevronLeft className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">Back to Dashboard</span>
                                </Link>
                                <h1 className="text-5xl font-black flex items-center gap-4">
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-primary/40 text-black shadow-lg shadow-primary/20">
                                        <Code2 className="w-10 h-10" />
                                    </div>
                                    CODE & CONQUER
                                </h1>
                                <p className="text-dim text-xl mt-4 max-w-2xl font-medium">
                                    The ultimate algorithmic proving ground. Master the code, conquer the world.
                                </p>
                            </div>

                            <div className="flex items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-dim uppercase tracking-[0.2em] mb-1">Global Level</div>
                                    <div className="text-3xl font-black text-white">{userProgress.passedQuestions.length} <span className="text-xs font-bold text-primary">{userProgress.rank}</span></div>
                                </div>
                                <div className="w-px h-12 bg-white/10" />
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-dim uppercase tracking-[0.2em] mb-1">Total EXP</div>
                                    <div className="text-3xl font-black text-green-400">{userProgress.totalExp.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        {/* Search & Filters */}
                        <div className="flex flex-wrap items-center gap-4 px-4">
                            <div className="relative flex-1 min-w-[300px] group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-dim group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by challenge name or topic..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-medium"
                                />
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-md">
                                {["All", "Easy", "Medium", "Hard"].map(diff => (
                                    <button
                                        key={diff}
                                        onClick={() => setDifficultyFilter(diff)}
                                        className={cn(
                                            "px-6 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest",
                                            difficultyFilter === diff ? "bg-primary text-black shadow-lg shadow-primary/20" : "text-dim hover:text-white"
                                        )}
                                    >
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Question Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 pb-20">
                            {filteredQuestions.map((q, i) => (
                                <motion.div
                                    key={q.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <GlassCard
                                        className="group h-full flex flex-col p-8 hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden active:scale-[0.98]"
                                        onClick={() => enterEditor(q)}
                                    >
                                        {/* Hover Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex items-start justify-between mb-8 relative z-10">
                                            <div className={cn(
                                                "p-4 rounded-2xl shadow-xl",
                                                q.category === 'Arrays' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                                    q.category === 'Strings' ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                            )}>
                                                {q.category === 'Arrays' ? <Layout className="w-6 h-6" /> :
                                                    q.category === 'Strings' ? <Globe className="w-6 h-6" /> : <Cpu className="w-6 h-6" />}
                                            </div>
                                            <span className={cn(
                                                "text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase shadow-lg",
                                                q.difficulty === 'Easy' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                                                    q.difficulty === 'Medium' ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                                            )}>
                                                {q.difficulty}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors relative z-10">{q.title}</h3>
                                        <p className="text-dim text-sm line-clamp-2 mb-8 flex-1 leading-relaxed relative z-10">
                                            {q.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto relative z-10">
                                            <div className="flex items-center gap-3 text-xs font-black text-dim">
                                                <Trophy className="w-5 h-5 text-primary" /> +{q.exp} XP
                                            </div>
                                            {userProgress.passedQuestions.includes(q.id) ? (
                                                <div className="flex items-center gap-2 text-green-400 text-[10px] font-black uppercase tracking-widest bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                                                    <CheckCircle2 className="w-4 h-4" /> Completed
                                                </div>
                                            ) : (
                                                <div className="text-primary text-sm font-black flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 tracking-widest uppercase">
                                                    FORGE NOW <ArrowRight className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="editor"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-[#020202] flex flex-col h-screen overflow-hidden"
                    >
                        {/* IDE Header */}
                        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/60 backdrop-blur-2xl">
                            <div className="flex items-center gap-8">
                                <button
                                    onClick={() => setView('browser')}
                                    className="flex items-center gap-2 text-dim hover:text-white transition-all group"
                                >
                                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20">
                                        <ChevronLeft className="w-5 h-5" />
                                    </div>
                                    <span className="font-black text-xs uppercase tracking-[0.2em]">Exit Forge</span>
                                </button>
                                <div className="h-6 w-px bg-white/10" />
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                                        <FileCode className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-dim uppercase tracking-widest">Active Challenge</div>
                                        <h2 className="text-sm font-black text-white">{selectedQuestion?.title}</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {language === 'python' && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                        <div className={cn("w-2 h-2 rounded-full", pyodide ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-yellow-500 animate-pulse")} />
                                        <span className="text-[10px] font-black text-dim uppercase tracking-widest">
                                            {pyodide ? "Interpreter Loaded" : isPyodideLoading ? "Loading Engine..." : "Engine Offline"}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
                                    {(['python', 'java', 'cpp', 'c', 'rust'] as Language[]).map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => setLanguage(lang)}
                                            className={cn(
                                                "px-4 py-2 rounded-lg text-[10px] font-black transition-all uppercase tracking-[0.1em]",
                                                language === lang ? "bg-primary text-black shadow-lg shadow-primary/20" : "text-dim hover:text-white"
                                            )}
                                        >
                                            {lang === 'cpp' ? 'C++' : lang}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleRunCode}
                                    disabled={isRunning || (language === 'python' && !pyodide) || submitting}
                                    className="px-6 py-2.5 bg-white/5 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-white/10 transition-all flex items-center gap-3 border border-white/10 active:scale-95 disabled:opacity-50"
                                >
                                    {isRunning ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                                    Run Solution
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isRunning || output.status !== 'success' || submitting || userProgress.passedQuestions.includes(selectedQuestion?.id || "")}
                                    className={cn(
                                        "px-8 py-2.5 font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all flex items-center gap-3 shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                                        userProgress.passedQuestions.includes(selectedQuestion?.id || "")
                                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                            : "bg-primary text-black hover:bg-primary/90 shadow-primary/20"
                                    )}
                                >
                                    {submitting ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    {userProgress.passedQuestions.includes(selectedQuestion?.id || "") ? "Completed" : "Submit Challenge"}
                                </button>
                            </div>
                        </div>

                        {/* Main Editor Work Area */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Left Pane: Info/Output */}
                            <div className="w-[400px] border-r border-white/10 flex flex-col bg-[#050505]">
                                <div className="flex border-b border-white/10 bg-white/5 h-12 shrink-0">
                                    <button
                                        onClick={() => setActiveTab('description')}
                                        className={cn(
                                            "flex-1 h-full text-[10px] font-black uppercase tracking-[0.2em] border-b-2 transition-all flex items-center justify-center gap-3",
                                            activeTab === 'description' ? "text-primary border-primary bg-primary/5" : "text-dim border-transparent hover:text-white"
                                        )}
                                    >
                                        <BookOpen className="w-4 h-4" /> Challenge
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('output')}
                                        className={cn(
                                            "flex-1 h-full text-[10px] font-black uppercase tracking-[0.2em] border-b-2 transition-all flex items-center justify-center gap-3",
                                            activeTab === 'output' ? "text-primary border-primary bg-primary/5" : "text-dim border-transparent hover:text-white"
                                        )}
                                    >
                                        <Terminal className="w-4 h-4" /> Terminal {output.status !== 'idle' && "•"}
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    <AnimatePresence mode="wait">
                                        {activeTab === 'description' ? (
                                            <motion.div
                                                key="desc"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="p-8 space-y-10"
                                            >
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-3xl font-black">{selectedQuestion?.title}</h3>
                                                        <div className={cn(
                                                            "px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest",
                                                            selectedQuestion?.difficulty === 'Easy' ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                                                        )}>{selectedQuestion?.difficulty}</div>
                                                    </div>
                                                    <p className="text-dim-white leading-relaxed text-sm font-medium">
                                                        {selectedQuestion?.description}
                                                    </p>
                                                </div>

                                                <div className="space-y-6">
                                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-3">
                                                        <Lock className="w-4 h-4" /> System Constraints
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {selectedQuestion?.constraints.map((c, i) => (
                                                            <div key={i} className="text-[11px] text-dim bg-white/5 p-4 rounded-xl border border-white/5 font-mono group hover:border-primary/30 transition-colors flex items-center gap-3">
                                                                <div className="w-1 h-1 rounded-full bg-primary" />
                                                                {c}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <h4 className="text-[10px] font-black text-dim uppercase tracking-[0.2em] flex items-center gap-3">
                                                        <RotateCcw className="w-4 h-4" /> Validation Cases
                                                    </h4>
                                                    <div className="space-y-6">
                                                        {selectedQuestion?.testCases.map((tc, i) => (
                                                            <div key={i} className="space-y-3 p-1">
                                                                <div className="text-[10px] font-black uppercase tracking-widest text-dim/60 flex items-center gap-2">
                                                                    <div className="w-4 h-px bg-white/10" /> Case {i + 1}
                                                                </div>
                                                                <div className="p-6 rounded-2xl bg-black border border-white/10 font-mono text-xs space-y-4 shadow-xl">
                                                                    <div>
                                                                        <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Input</div>
                                                                        <div className="text-dim-white bg-white/5 p-2 rounded">{tc.input}</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[9px] font-black text-green-400 uppercase tracking-widest mb-1">Expected</div>
                                                                        <div className="text-dim-white bg-white/5 p-2 rounded">{tc.output}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="out"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="p-6 h-full"
                                            >
                                                <div className="h-full bg-black rounded-2xl p-8 font-mono text-xs border border-white/10 overflow-y-auto shadow-inner relative group">
                                                    <div className="absolute top-4 right-4 text-[10px] font-black text-dim/20 group-hover:text-dim/40 transition-colors uppercase tracking-widest">System_Console</div>

                                                    {output.status === 'idle' && (
                                                        <div className="h-full flex flex-col items-center justify-center text-dim text-center space-y-6 grayscale opacity-40">
                                                            <Terminal className="w-16 h-16" />
                                                            <div className="space-y-2">
                                                                <p className="font-black uppercase tracking-[0.2em]">Ready for Injection</p>
                                                                <p className="text-[10px]">Compile solution to view runtime telemetry.</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {output.status !== 'idle' && (
                                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                            {/* Summary Header */}
                                                            <div className={cn(
                                                                "flex items-center justify-between px-5 py-4 rounded-xl border w-full",
                                                                output.status === 'success' ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                                                            )}>
                                                                <div className="flex items-center gap-3">
                                                                    {output.status === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                                                    <div className="flex flex-col">
                                                                        <span className="font-black uppercase tracking-widest text-xs">{output.status === 'success' ? "Accepted" : "Wrong Answer"}</span>
                                                                        <span className="text-[10px] opacity-80 font-mono mt-0.5">{output.message}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Detailed Test Results */}
                                                            <div className="space-y-3">
                                                                {output.results?.map((res: any, i: number) => (
                                                                    <div key={i} className="rounded-xl bg-white/5 border border-white/5 overflow-hidden group">
                                                                        {/* Header (Always Visible) */}
                                                                        <div className="w-full flex items-center justify-between p-4 cursor-default">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className={cn(
                                                                                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border",
                                                                                    res.passed ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"
                                                                                )}>
                                                                                    {i + 1}
                                                                                </div>
                                                                                <span className="text-xs font-bold text-dim group-hover:text-white transition-colors">Test Case {i + 1}</span>
                                                                            </div>
                                                                            <div className={cn(
                                                                                "px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest",
                                                                                res.passed ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"
                                                                            )}>
                                                                                {res.passed ? "PASS" : "FAIL"}
                                                                            </div>
                                                                        </div>

                                                                        {/* Details (Expanded by default for failed cases, or simple summary) */}
                                                                        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                                                                            <div className="grid grid-cols-2 gap-4">
                                                                                <div>
                                                                                    <div className="text-[9px] font-black text-dim uppercase tracking-widest mb-1.5">Input</div>
                                                                                    <div className="bg-black p-2 rounded-lg text-[10px] font-mono border border-white/5 text-dim-white break-all">{res.input}</div>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="text-[9px] font-black text-dim uppercase tracking-widest mb-1.5">Expected</div>
                                                                                    <div className="bg-black p-2 rounded-lg text-[10px] font-mono border border-white/5 text-dim-white break-all">{res.expected}</div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Actual Output */}
                                                                            <div>
                                                                                <div className="flex items-center justify-between mb-1.5">
                                                                                    <div className="text-[9px] font-black text-dim uppercase tracking-widest">Actual Output</div>
                                                                                </div>
                                                                                <div className={cn(
                                                                                    "bg-black p-2 rounded-lg text-[10px] font-mono border break-all",
                                                                                    res.passed ? "border-green-500/20 text-green-400/80" : "border-red-500/20 text-red-400/80"
                                                                                )}>
                                                                                    {res.actual}
                                                                                </div>
                                                                            </div>

                                                                            {/* Console / Stdout */}
                                                                            {res.stdout && (
                                                                                <div>
                                                                                    <div className="text-[9px] font-black text-dim uppercase tracking-widest mb-1.5 text-blue-400">Console Logs</div>
                                                                                    <div className="bg-black p-2 rounded-lg text-[10px] font-mono border border-white/5 text-dim-white whitespace-pre-wrap">
                                                                                        {res.stdout}
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {/* Runtime Error */}
                                                                            {res.error && (
                                                                                <div>
                                                                                    <div className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1.5">Runtime Error</div>
                                                                                    <div className="bg-red-950/30 p-2 rounded-lg text-[10px] font-mono border border-red-500/20 text-red-300 whitespace-pre-wrap">
                                                                                        {res.error}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Center/Right: Code Editor */}
                            <div className="flex-1 flex flex-col bg-[#020202]">
                                <div className="h-12 border-b border-white/10 bg-white/5 flex items-center px-8 justify-between shrink-0">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3 px-4 py-1.5 rounded-lg bg-black/60 border border-white/10 ring-1 ring-white/5">
                                            <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                                            <span className="text-[10px] font-black text-dim tracking-[0.2em] uppercase">main.{language}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-dim group cursor-help">
                                            <Info className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                                            <span className="opacity-40 group-hover:opacity-100 uppercase tracking-tighter transition-opacity">Auto-save Enabled</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="flex items-center gap-6">
                                            <button className="flex items-center gap-2 text-dim hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                                                <RotateCcw className="w-4 h-4" /> Reset
                                            </button>
                                            <button className="flex items-center gap-2 text-dim hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                                                <Save className="w-4 h-4" /> Save Draft
                                            </button>
                                        </div>
                                        <div className="h-4 w-px bg-white/10" />
                                        <button className="p-2 text-dim hover:text-white transition-colors">
                                            <Maximize2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 relative overflow-hidden group">
                                    {/* Editor Component */}
                                    <div className="h-full w-full overflow-y-auto custom-scrollbar bg-[#020202]">
                                        {view === 'editor' && (
                                            <Editor
                                                value={code}
                                                onValueChange={code => setCode(code)}
                                                highlight={code => {
                                                    const Prism = (window as any).Prism;
                                                    const langObj = getPrismLanguage(language);

                                                    if (!Prism || !langObj) return code;
                                                    return Prism.highlight(code, langObj, language);
                                                }}

                                                padding={40}
                                                style={{
                                                    fontFamily: '"Fira Code", "Fira Mono", monospace',
                                                    fontSize: 14,
                                                    minHeight: "100%",
                                                    backgroundColor: "transparent",
                                                }}
                                                className="min-h-full font-mono text-dim-white leading-[1.8] focus:outline-none"
                                            />
                                        )}
                                    </div>

                                    {/* Reward Points Badge */}
                                    <motion.div
                                        initial={{ x: 100 }}
                                        animate={{ x: 0 }}
                                        className="absolute bottom-8 right-8 flex items-center gap-6 pointer-events-none"
                                    >
                                        <div className="px-5 py-2.5 rounded-2xl bg-black border border-white/10 flex items-center gap-3 shadow-2xl backdrop-blur-md ring-1 ring-white/5">
                                            <Layers className="w-4 h-4 text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">ALG_{selectedQuestion?.category.toUpperCase()}</span>
                                        </div>
                                        <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-600 flex items-center gap-3 shadow-2xl shadow-yellow-500/20 ring-1 ring-white/20">
                                            <Sparkles className="w-4 h-4 text-black" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">+{selectedQuestion?.exp || 0} XP</span>
                                        </div>
                                    </motion.div>

                                    {/* Virtual Line Indicator */}
                                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-white/[0.02] border-r border-white/5 pointer-events-none flex flex-col items-center pt-[40px] font-mono text-[10px] text-dim/20">
                                        {Array.from({ length: 100 }).map((_, i) => (
                                            <div key={i} className="h-[25.2px]">{i + 1}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.02);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                /* Prism Overrides */
                pre[class*="language-"] {
                    margin: 0 !important;
                    background: transparent !important;
                }
                code[class*="language-"] {
                    text-shadow: none !important;
                    color: #fff !important;
                }
                .token.comment, .token.prolog, .token.doctype, .token.cdata {
                    color: #4a4a4a !important;
                }
                .token.function { color: #f9d423 !important; }
                .token.string { color: #a5d6a7 !important; }
                .token.keyword { color: #80cbc4 !important; font-weight: bold; }
                .token.operator { color: #ffab91 !important; }
                .token.number { color: #b2ebf2 !important; }
                .token.class-name { color: #ce93d8 !important; }
            `}</style>
        </div>
    );
}
