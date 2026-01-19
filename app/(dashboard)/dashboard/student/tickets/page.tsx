"use client";

import { motion } from "framer-motion";
import { TicketCard } from "@/app/components/dashboard/TicketCard";
import { events } from "@/app/data/clubData";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function MyTicketsPage() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            // Fetch tickets for the student
            fetch(`http://localhost:8000/api/tickets/${user.id}`)
                .then(res => res.json())
                .then(async (ticketData) => {
                    // Fetch all events to map ticket eventId to event details
                    const eventsRes = await fetch("http://localhost:8000/api/events");
                    const allEvents = await eventsRes.json();

                    const enrichedTickets = ticketData.map((t: any) => ({
                        ...t,
                        event: allEvents.find((e: any) => e.id === t.eventId)
                    })).filter((t: any) => t.event); // Only show tickets for existing events

                    setTickets(enrichedTickets);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch tickets:", err);
                    setLoading(false);
                });
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-dim">Loading your tickets...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
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
                <h1 className="text-3xl font-bold">My Tickets</h1>
                <p className="text-dim">Access passes for your registered events.</p>
            </motion.div>

            <div className="space-y-6">
                {tickets.length > 0 ? (
                    tickets.map((ticket, i) => (
                        <motion.div
                            key={ticket.id}
                            id={`ticket-${ticket.event.id}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <TicketCard id={ticket.id} event={ticket.event} studentId={user?.id || "STUDENT"} />
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                        <p className="text-dim">You haven't registered for any events yet.</p>
                        <Link href="/events" className="text-primary hover:underline mt-2 inline-block">Browse Events</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
