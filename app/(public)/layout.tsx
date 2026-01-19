import { Navbar } from "@/app/components/layout/Navbar";
import { FloatingJoinCTA } from "@/app/components/ui/FloatingJoinCTA";
import BroadcastNotification from "@/app/components/ui/BroadcastNotification";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="relative min-h-screen">
            <BroadcastNotification />
            <Navbar />
            {children}
            <FloatingJoinCTA />
        </div>
    );
}
