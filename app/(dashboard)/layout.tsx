import BroadcastNotification from "@/app/components/ui/BroadcastNotification";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen">
            <BroadcastNotification />
            <main>
                {children}
            </main>
        </div>
    );
}
