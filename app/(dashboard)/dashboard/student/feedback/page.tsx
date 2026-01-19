"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { events } from "@/app/data/clubData";
import { Star, Send, ChevronLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function FeedbackPage() {
    const pastEvents = events.filter(e => e.status === 'Past');
    const [ratings, setRatings] = useState<Record<number, number>>({});
    const [suggestion, setSuggestion] = useState("");
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Fetch existing feedback to populate stars? (Optional, skipping complexity for now as user is anon in this view)

    const handleRate = async (eventId: number, rating: number) => {
        setRatings(prev => ({ ...prev, [eventId]: rating }));
        try {
            await fetch('http://localhost:8000/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'rating',
                    eventId: eventId,
                    rating: rating,
                    user: "Student", // Defaulting for simple demo
                    date: new Date().toISOString().split('T')[0]
                })
            });
        } catch (err) {
            console.error("Failed to submit rating", err);
        }
    };

    const handleSubmitSuggestion = async () => {
        if (!suggestion.trim()) return;

        try {
            await fetch('http://localhost:8000/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'suggestion',
                    comment: suggestion,
                    user: "Student",
                    date: new Date().toISOString().split('T')[0]
                })
            });

            setSuggestion("");
            setHasSubmitted(true);
            setTimeout(() => setHasSubmitted(false), 3000);
        } catch (err) {
            console.error("Failed to submit suggestion", err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <motion.div>
                <Link
                    href="/dashboard/student"
                    className="inline-flex items-center gap-2 text-dim hover:text-white transition-colors group mb-6"
                >
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Back to Dashboard</span>
                </Link>
                <h1 className="text-3xl font-bold mb-2">Feedback Hub</h1>
                <p className="text-dim">Your voice shapes the future of Intellexa.</p>
            </motion.div>

            {/* Event Ratings */}
            <section>
                <h2 className="text-xl font-bold mb-4">Rate Past Events</h2>
                <div className="grid gap-6">
                    {pastEvents.map((event) => {
                        const currentRating = ratings[event.id] || 0;
                        return (
                            <GlassCard key={event.id} className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h3 className="font-bold text-lg">{event.title}</h3>
                                    <p className="text-sm text-dim">{event.date}</p>
                                </div>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => handleRate(event.id, star)}
                                            className="hover:scale-110 transition-transform"
                                        >
                                            <Star
                                                className={`w-6 h-6 transition-colors ${star <= currentRating ? "text-yellow-400 fill-yellow-400" : "text-white/20 hover:text-yellow-400"}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </GlassCard>
                        );
                    })}
                    {pastEvents.length === 0 && <p className="text-dim/50 italic">No past events to rate yet.</p>}
                </div>
            </section>

            {/* General Suggestions */}
            <section>
                <h2 className="text-xl font-bold mb-4">Make a Wish</h2>
                <GlassCard className="p-6">
                    {!hasSubmitted ? (
                        <>
                            <textarea
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary min-h-[150px] resize-none"
                                placeholder="I wish we had a workshop on Quantum Computing..."
                                value={suggestion}
                                onChange={(e) => setSuggestion(e.target.value)}
                            />
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleSubmitSuggestion}
                                    disabled={!suggestion.trim()}
                                    className="flex items-center gap-2 px-6 py-2 bg-primary text-black rounded-lg font-bold hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4" /> Submit Suggestion
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                                <Send className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Suggestion Sent!</h3>
                            <p className="text-dim">Thanks for helping us improve.</p>
                        </div>
                    )}
                </GlassCard>
            </section>
        </div>
    );
}
