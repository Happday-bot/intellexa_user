"use client";

import { motion } from "framer-motion"; // Fixed import
import { events } from "@/app/data/clubData";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { Calendar, Clock, MapPin, ArrowLeft, ArrowRight, User, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { RegistrationModal } from "@/app/components/forms/RegistrationModal";
import { useAuth } from "@/app/context/AuthContext";
import { Ticket } from "lucide-react";
import { API_BASE_URL } from "@/app/config/api";

export default function EventDetailsPage() {
    const params = useParams();
    const eventId = Number(params.id);
    const { user } = useAuth();

    const [event, setEvent] = useState<any>(null);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch event details (with dynamic slotsFilled)
                const eventRes = await fetch(`${API_BASE_URL}/api/events/${eventId}`);
                if (eventRes.ok) {
                    const eventData = await eventRes.json();
                    setEvent(eventData);
                }

                // Check registration if user is logged in
                if (user) {
                    const ticketsRes = await fetch(`${API_BASE_URL}/api/tickets/${user.id}`);
                    const tickets = await ticketsRes.json();
                    setIsRegistered(tickets.some((t: any) => t.eventId === eventId));
                }
            } catch (err) {
                console.error("Error fetching event details:", err);
                const fallbackEvent = events.find(e => e.id === eventId);
                setEvent(fallbackEvent);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId, user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold">Event not found</h1>
            </div>
        )
    }

    return (
        <main className="min-h-screen pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-4xl">
                <Link href="/events" className="inline-flex items-center gap-2 text-dim hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Events
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="relative h-[400px] w-full rounded-3xl overflow-hidden mb-10 border border-white/10">
                        <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="px-3 py-1 bg-primary text-black text-xs font-black rounded-full uppercase tracking-wider">
                                    {event.category}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${event.status === 'Upcoming' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                    event.status === 'Today' ? 'bg-primary/20 text-primary border-primary/30 animate-pulse' :
                                        'bg-white/5 text-dim border-white/10'
                                    }`}>
                                    {event.status}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-4">{event.title}</h1>
                            <div className="flex flex-wrap gap-6 text-dim">
                                <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-lg backdrop-blur-md">
                                    <Calendar className="w-5 h-5 text-accent" /> {event.date}
                                </div>
                                <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-lg backdrop-blur-md">
                                    <Clock className="w-5 h-5 text-accent" /> {event.time}
                                </div>
                                <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-lg backdrop-blur-md">
                                    <MapPin className="w-5 h-5 text-accent" /> {event.venue}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            <section>
                                <h2 className="text-2xl font-bold mb-4">About the Event</h2>
                                <p className="text-dim leading-relaxed text-lg">
                                    Join us for {event.title}, an immersive experience designed to push your skills in {event.category}.
                                    Whether you are a beginner or a pro, this event offers hands-on learning, networking opportunities,
                                    and the chance to work on real-world problems.
                                </p>
                                <p className="text-dim leading-relaxed text-lg mt-4">
                                    Do not miss this opportunity to connect with fellow Intellexa members and industry experts.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">What to Expect</h2>
                                <ul className="grid gap-4">
                                    {["Hands-on Workshops", "Expert Mentorship", "Networking Sessions", "Swag & Prizes"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="p-2 bg-primary/20 rounded-full text-primary">
                                                <Globe className="w-4 h-4" />
                                            </div>
                                            <span className="font-semibold">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <GlassCard className="p-6 sticky top-24">
                                <h3 className="text-xl font-bold mb-6">Registration</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-dim">Status</span>
                                        <span className="text-green-400 font-bold">Open</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-dim">Slots Left</span>
                                        <span className="text-white font-bold">{100 - (event.slotsFilled || 0)} / 100</span>
                                    </div>
                                </div>

                                {isRegistered ? (
                                    <Link href={`/dashboard/student/tickets#ticket-${event.id}`} className="w-full">
                                        <button className="w-full py-4 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl font-bold hover:bg-green-500/20 transition-all flex items-center justify-center gap-2">
                                            View Your Ticket <Ticket className="w-5 h-5" />
                                        </button>
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => setIsRegisterOpen(true)}
                                        className="w-full py-4 bg-primary text-black font-bold hover:bg-primary/80 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
                                    >
                                        Register Now <ArrowRight className="w-5 h-5" />
                                    </button>
                                )}
                                <p className="text-xs text-center text-dim mt-4">
                                    Exclusive for Intellexa Members
                                </p>
                            </GlassCard>

                            <GlassCard className="p-6">
                                <h3 className="font-bold mb-4">Organizers</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Intellexa Core Team</p>
                                        <p className="text-xs text-dim">Coordinator</p>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </motion.div>

                <RegistrationModal
                    isOpen={isRegisterOpen}
                    onClose={() => setIsRegisterOpen(false)}
                    eventId={event.id}
                    eventTitle={event.title}
                />
            </div>
        </main>
    );
}
