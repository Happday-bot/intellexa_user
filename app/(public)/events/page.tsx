"use client";

import { motion } from "framer-motion";
import { TiltCard } from "@/app/components/ui/TiltCard";
import { events } from "@/app/data/clubData";
import { Calendar, MapPin, Clock, ArrowRight, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/app/config/api";

export default function EventsPage() {
    const { user } = useAuth();
    const [eventsData, setEventsData] = useState<any[]>([]);
    const [userTickets, setUserTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/events`);
                const data = await res.json();
                setEventsData(data);

                if (user) {
                    const ticketsRes = await fetch(`${API_BASE_URL}/api/tickets/${user.id}`);
                    const ticketsData = await ticketsRes.json();
                    setUserTickets(ticketsData);
                }
            } catch (err) {
                console.error("Failed to fetch event data:", err);
                setEventsData(events); // Fallback to local data
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user]);

    return (
        <main className="min-h-screen pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold mb-4">Event <span className="text-primary">Hub</span></h1>
                    <p className="text-dim text-lg mb-8">Workshops, Hackathons, and Tech Talks.</p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse" />
                        ))
                    ) : (
                        eventsData.map((event, i) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="perspective-1000 h-full"
                            >
                                <TiltCard className="h-full w-full rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl overflow-hidden group">
                                    <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold border border-white/10 z-10">
                                            {event.category}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${event.status === 'Upcoming' ? 'bg-green-500/20 text-green-400' :
                                                event.status === 'Today' ? 'bg-primary/20 text-primary animate-pulse' :
                                                    'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {event.status}
                                            </span>
                                            <span className="text-xs text-dim flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {event.date}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>

                                        <div className="flex flex-col gap-2 mt-auto text-sm text-dim">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" /> {event.time}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" /> {event.venue}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-6">
                                            {userTickets.some(t => t.eventId === event.id) ? (
                                                <Link href={`/dashboard/student/tickets#ticket-${event.id}`} className="w-full">
                                                    <button className="w-full py-3 rounded-xl bg-green-500/10 hover:bg-green-500/20 transition-all flex items-center justify-center gap-2 font-bold text-green-400 text-sm z-10 relative border border-green-500/20">
                                                        View Ticket <Ticket className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                            ) : (
                                                <Link href={`/events/${event.id}`} className="w-full">
                                                    <button className="w-full py-3 rounded-xl bg-primary hover:bg-primary/80 transition-all flex items-center justify-center gap-2 font-semibold text-black text-sm z-10 relative shadow-lg shadow-primary/20">
                                                        View Details <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
