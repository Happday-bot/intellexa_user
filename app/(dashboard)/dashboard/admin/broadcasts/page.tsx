"use client";

import { GlassCard } from "@/app/components/ui/GlassCard";
import { Radio, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/app/config/api";

export default function BroadcastPage() {
    const [formData, setFormData] = useState({
        subject: "",
        target: "All Members",
        message: ""
    });
    const [broadcasts, setBroadcasts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchBroadcasts();
    }, []);

    const fetchBroadcasts = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/broadcasts`);
            const data = await res.json();
            setBroadcasts(data);
        } catch (err) {
            console.error("Failed to fetch broadcasts:", err);
        } finally {
            setFetching(false);
        }
    };

    const handleSendBroadcast = async () => {
        if (!formData.subject || !formData.message) return alert("Please fill all fields");
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/broadcasts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert("Broadcast sent successfully!");
                setFormData({ subject: "", target: "All Members", message: "" });
                fetchBroadcasts();
            }
        } catch (err) {
            console.error("Failed to send broadcast:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Broadcast Center</h1>
                <p className="text-dim">Send notifications to all relevant students.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <GlassCard>
                    <h3 className="font-bold flex items-center gap-2 mb-6">
                        <Radio className="w-5 h-5 text-red-500" /> New Announcement
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-dim block mb-2">Subject</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3"
                                placeholder="e.g. Hackathon Registration Open"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-dim block mb-2">Target Audience</label>
                            <select
                                value={formData.target}
                                onChange={e => setFormData({ ...formData, target: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3"
                            >
                                <option>All Members</option>
                                <option>AI Domain</option>
                                <option>Web Domain</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-dim block mb-2">Message</label>
                            <textarea
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 min-h-[100px]"
                                placeholder="..."
                            />
                        </div>

                        <button
                            onClick={handleSendBroadcast}
                            disabled={loading}
                            className="w-full py-3 bg-red-600 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" /> {loading ? "Sending..." : "Send Broadcast"}
                        </button>
                    </div>
                </GlassCard>

                <GlassCard>
                    <h3 className="font-bold mb-6">Recent Broadcasts</h3>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                        {fetching ? (
                            [1, 2].map(i => <div key={i} className="h-24 rounded-lg bg-white/5 animate-pulse" />)
                        ) : broadcasts.length === 0 ? (
                            <p className="text-dim text-center py-10 text-sm">No broadcasts sent yet.</p>
                        ) : (
                            broadcasts.map((b, i) => (
                                <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-red-500/20 transition-colors group">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`text-[10px] font-black tracking-widest px-2 py-0.5 rounded ${b.status === 'SENT' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-dim'}`}>
                                            {b.status}
                                        </span>
                                        <span className="text-[10px] text-dim">{new Date(b.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="font-bold text-sm mb-1 group-hover:text-red-500 transition-colors">{b.subject}</p>
                                    <p className="text-[10px] text-dim mb-2 line-clamp-2">{b.message}</p>
                                    <p className="text-[10px] text-red-500/50 font-medium">To: {b.target}</p>
                                </div>
                            ))
                        )}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
