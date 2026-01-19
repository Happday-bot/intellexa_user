"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
// import { feedbackData } from "@/app/data/feedbackData"; // REMOVED MOCK
import { events } from "@/app/data/clubData";
import { Star, MessageSquare, TrendingUp, AlertCircle } from "lucide-react";

interface FeedbackItem {
    id: string;
    type: 'rating' | 'suggestion';
    eventId?: number;
    rating?: number;
    comment?: string;
    user: string;
    date: string;
}

export default function AdminFeedbackPage() {
    const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/feedback')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setFeedbackData(data);
                } else {
                    console.error("API returned non-array:", data);
                    setFeedbackData([]);
                }
            })
            .catch(err => console.error("Failed to fetch feedback", err));
    }, []);

    // Enrich feedback data with event details (for Ratings)
    const validData = Array.isArray(feedbackData) ? feedbackData : [];

    const enrichedFeedback = validData
        .filter(f => f.type === 'rating')
        .map(f => ({
            ...f,
            event: events.find(e => e.id === f.eventId)
        }))
        .filter(f => f.event);

    const suggestions = validData.filter(f => f.type === 'suggestion');

    // Calculate stats
    const totalRatings = enrichedFeedback.length;
    const avgRating = totalRatings > 0
        ? (enrichedFeedback.reduce((acc, curr) => acc + (curr.rating || 0), 0) / totalRatings).toFixed(1)
        : "0.0";

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold mb-2">Feedback Hub</h1>
                <p className="text-dim">Monitor student sentiment and collect suggestions.</p>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6 flex items-center gap-4">
                    <div className="p-4 rounded-full bg-yellow-500/10 text-yellow-500">
                        <Star className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold">{avgRating}</div>
                        <div className="text-sm text-dim">Average Event Rating</div>
                    </div>
                </GlassCard>
                <GlassCard className="p-6 flex items-center gap-4">
                    <div className="p-4 rounded-full bg-blue-500/10 text-blue-500">
                        <MessageSquare className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold">{suggestions.length}</div>
                        <div className="text-sm text-dim">New Suggestions</div>
                    </div>
                </GlassCard>
                <GlassCard className="p-6 flex items-center gap-4">
                    <div className="p-4 rounded-full bg-green-500/10 text-green-500">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold">+12%</div>
                        <div className="text-sm text-dim">Engagement vs Last Month</div>
                    </div>
                </GlassCard>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Ratings */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" /> Recent Ratings
                    </h2>
                    <div className="space-y-4">
                        {enrichedFeedback.length > 0 ? enrichedFeedback.map((item, i) => (
                            <GlassCard key={i} className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold">{item.event?.title}</h3>
                                    <div className="flex gap-1 my-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-3 h-3 ${star <= (item.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-white/20"}`}
                                            />
                                        ))}
                                    </div>
                                    {item.comment && <p className="text-sm text-dim italic">"{item.comment}"</p>}
                                </div>
                                <span className="text-xs text-dim bg-white/5 py-1 px-2 rounded">
                                    {item.event?.date}
                                </span>
                            </GlassCard>
                        )) : (
                            <p className="text-dim italic">No ratings yet.</p>
                        )}
                    </div>
                </section>

                {/* Suggestions Box */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-blue-500" /> Student Voice
                    </h2>
                    <div className="space-y-4">
                        {suggestions.length > 0 ? suggestions.map((s) => (
                            <GlassCard key={s.id} className="relative group hover:border-blue-500/30 transition-colors">
                                <p className="text-sm leading-relaxed mb-3">"{s.comment}"</p>
                                <div className="flex justify-between items-center text-xs text-dim border-t border-white/5 pt-3 mt-2">
                                    <span className="font-bold text-white/50 group-hover:text-white transition-colors">{s.user}</span>
                                    <span>{s.date}</span>
                                </div>
                            </GlassCard>
                        )) : (
                            <p className="text-dim italic">No suggestions yet.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
