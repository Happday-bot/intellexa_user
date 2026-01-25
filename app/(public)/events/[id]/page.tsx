import { events } from "@/app/data/clubData";
import EventDetailsClient from "@/app/components/events/EventDetailsClient";

export async function generateStaticParams() {
    return events.map((event) => ({
        id: event.id.toString(),
    }));
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const eventId = Number(id);
    const initialEvent = events.find(e => e.id === eventId);

    return <EventDetailsClient eventId={eventId} initialEvent={initialEvent} />;
}
