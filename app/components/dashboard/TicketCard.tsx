"use client";

import QRCode from "react-qr-code";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { format } from "path";

interface TicketProps {
    id: string;
    event: {
        id: number;
        title: string;
        date: string;
        time: string;
        venue: string;
    };
    studentId: string;
}

export function TicketCard({ id, event, studentId }: TicketProps) {
    // Generate a unique string for the QR
    const qrData = JSON.stringify({
        ticketId: id,
        eventId: event.id,
        studentId: studentId,
        timestamp: new Date().toISOString()
    });

    return (
        <GlassCard className="flex flex-col md:flex-row gap-6 items-center p-8 bg-black/40 border-primary/20">
            <div className="bg-white p-4 rounded-xl">
                <QRCode value={qrData} size={150} />
            </div>

            <div className="flex-1 text-center md:text-left">
                <div className="text-xs font-bold text-accent uppercase tracking-widest mb-2">Admit One</div>
                <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                <p className="text-dim mb-4">Scan this QR code at the particular venue entrance.</p>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                    <div className="px-3 py-1 rounded bg-white/5 border border-white/10">
                        {event.date}
                    </div>
                    <div className="px-3 py-1 rounded bg-white/5 border border-white/10">
                        {event.time}
                    </div>
                    <div className="px-3 py-1 rounded bg-white/5 border border-white/10">
                        {event.venue}
                    </div>
                </div>
            </div>

            <div className="hidden md:block w-px h-32 bg-dashed border-l border-white/10 border-dashed" />

            <div className="text-center">
                <p className="text-xs text-dim uppercase">Ticket ID</p>
                <p className="font-mono text-lg tracking-widest text-primary">#{studentId}-{event.id}</p>
            </div>
        </GlassCard>
    );
}
