"use client";

import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { ChevronLeft, Scan, CheckCircle2, XCircle, Loader2, Camera, History, Power } from "lucide-react";
import Link from "next/link";

interface ScanResult {
    success: boolean;
    message: string;
    studentId?: string;
}

export default function TicketScannerPage() {
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const html5QrCode = useRef<Html5Qrcode | null>(null);
    const isMounted = useRef(true);

    const stopScanner = async () => {
        if (html5QrCode.current) {
            try {
                // @ts-ignore - reaching into internal state for reliability
                if (html5QrCode.current.isScanning) {
                    await html5QrCode.current.stop();
                    console.log("Scanner stopped.");
                }
                if (isMounted.current) setIsScanning(false);
            } catch (err) {
                console.warn("Stop scanner warning:", err);
            }
        }
    };

    const startScanner = async () => {
        if (!html5QrCode.current || !isMounted.current) return;

        // @ts-ignore
        if (html5QrCode.current.isScanning) return;

        try {
            const config = { fps: 15, qrbox: { width: 400, height: 400 } };
            await html5QrCode.current.start(
                { facingMode: "environment" },
                config,
                onScanSuccess,
                onScanFailure
            );
            if (isMounted.current) setIsScanning(true);
            console.log("Scanner started.");
        } catch (err) {
            console.error("Camera start error:", err);
            if (isMounted.current) setIsScanning(false);
        }
    };

    useEffect(() => {
        isMounted.current = true;
        console.log("Scanner component mounted.");

        // Fetch recent check-ins for history
        fetch("http://localhost:8000/api/admin/check-ins")
            .then(res => res.json())
            .then(data => {
                if (isMounted.current) setHistory(data.slice(-5).reverse());
            })
            .catch(err => console.error("Failed to fetch check-ins:", err));

        // Initialize Scanner Instance
        html5QrCode.current = new Html5Qrcode("reader");

        const handleVisibilityChange = () => {
            if (document.hidden) {
                console.log("Tab hidden, stopping camera...");
                stopScanner();
            } else {
                console.log("Tab visible, starting camera...");
                startScanner();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Try to start automatically after a short delay to ensure DOM is ready
        const startTimeout = setTimeout(() => {
            startScanner();
        }, 500);

        return () => {
            console.log("Scanner component unmounting...");
            isMounted.current = false;
            clearTimeout(startTimeout);
            document.removeEventListener("visibilitychange", handleVisibilityChange);

            // Force stop on unmount
            if (html5QrCode.current) {
                const scanner = html5QrCode.current;
                // @ts-ignore
                if (scanner.isScanning) {
                    scanner.stop()
                        .then(() => console.log("Final stop successful"))
                        .catch(err => console.warn("Final stop warning:", err));
                }
            }
        };
    }, []);

    async function onScanSuccess(decodedText: string) {
        if (!isMounted.current) return;

        try {
            // Stop scanning while processing
            if (isMounted.current) setIsScanning(false);

            const data = JSON.parse(decodedText);

            const response = await fetch("http://localhost:8000/api/check-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ticketId: data.ticketId || data.id,
                    studentId: data.studentId,
                    eventId: data.eventId
                })
            });

            const result = await response.json();

            if (isMounted.current) {
                if (response.ok) {
                    setScanResult({ success: true, message: result.message, studentId: data.studentId });
                    setHistory(prev => [{ studentId: data.studentId, scannedAt: new Date().toISOString() }, ...prev].slice(0, 5));
                } else {
                    // Safety check: ensure result.detail is a string
                    const errorMessage = typeof result.detail === 'string'
                        ? result.detail
                        : JSON.stringify(result.detail) || "Verification failed";
                    setScanResult({ success: false, message: errorMessage });
                }
            }
        } catch (error) {
            if (isMounted.current) {
                setScanResult({ success: false, message: "Invalid QR format or Network Error" });
            }
        }

        // Resume scanning after 5 seconds if still mounted
        setTimeout(() => {
            if (isMounted.current) {
                setScanResult(null);
                setIsScanning(true);
            }
        }, 5000);
    }

    function onScanFailure(error: any) {
        // Silently ignore scan failures
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-8">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Link
                    href="/dashboard/admin"
                    className="inline-flex items-center gap-2 text-dim hover:text-white transition-colors group mb-6"
                >
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Back to Home</span>
                </Link>
                <h1 className="text-4xl font-bold flex items-center gap-4 italic">
                    Ticket <span className="text-yellow-500">Scanner</span>
                    <Scan className="w-8 h-8 text-yellow-500 animate-pulse" />
                </h1>
                <p className="text-dim text-lg">Validate attendee tickets in real-time.</p>
            </motion.div>

            <div className="grid lg:grid-cols-5 gap-8">
                {/* Scanner Section */}
                <div className="lg:col-span-3 space-y-6">
                    <GlassCard className="overflow-hidden border-yellow-500/20 bg-black/40">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Camera className="w-5 h-5 text-yellow-500" />
                                <span className="font-bold uppercase tracking-widest text-xs">Live Viewfinder</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                <span className="text-[10px] uppercase font-black text-dim">{isScanning ? 'Scanning' : 'Processing'}</span>
                            </div>
                        </div>

                        <div className="relative aspect-square bg-black/60 flex items-center justify-center min-h-[400px]">
                            <div id="reader" className="w-full h-full" />

                            {!isScanning && !scanResult && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-4">
                                    <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                                        <Camera className="w-8 h-8 text-yellow-500" />
                                    </div>
                                    <button
                                        onClick={startScanner}
                                        className="px-6 py-2 bg-yellow-500 text-black font-black rounded-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter"
                                    >
                                        Activate Camera
                                    </button>
                                </div>
                            )}

                            <AnimatePresence>
                                {scanResult && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="absolute inset-0 flex items-center justify-center p-8 z-50 backdrop-blur-md bg-black/40"
                                    >
                                        <div className={`w-full max-w-sm p-8 rounded-3xl border-2 flex flex-col items-center text-center shadow-2xl ${scanResult.success
                                            ? 'bg-green-500/20 border-green-500 shadow-green-500/20'
                                            : 'bg-red-500/20 border-red-500 shadow-red-500/20'
                                            }`}>
                                            {scanResult.success ? (
                                                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                                            ) : (
                                                <XCircle className="w-16 h-16 text-red-500 mb-4" />
                                            )}
                                            <h2 className="text-2xl font-black mb-2 uppercase italic text-white">
                                                {scanResult.success ? 'Verified!' : 'Access Denied'}
                                            </h2>
                                            <p className="text-white/80 font-medium text-sm leading-relaxed">{scanResult.message}</p>
                                            {scanResult.studentId && (
                                                <div className="mt-4 px-4 py-2 rounded-full bg-white/10 font-mono text-sm border border-white/10">
                                                    ID: {scanResult.studentId}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </GlassCard>
                </div>

                {/* History Section */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassCard className="h-full border-white/5 bg-white/5">
                        <div className="p-6 border-b border-white/5 flex items-center gap-3">
                            <History className="w-5 h-5 text-dim" />
                            <span className="font-bold uppercase tracking-widest text-xs">Recent Scans</span>
                        </div>
                        <div className="p-6 space-y-4">
                            {history.length > 0 ? (
                                history.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm">{item.studentId}</div>
                                                <div className="text-[10px] text-dim uppercase">{new Date(item.scannedAt).toLocaleTimeString()}</div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded">OK</div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-20 opacity-30 italic text-sm">
                                    No scans recorded yet.
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>

        </div>
    );
}
