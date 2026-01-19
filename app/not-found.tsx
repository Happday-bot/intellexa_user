import Link from 'next/link'
import { GlassCard } from "@/app/components/ui/GlassCard";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
            <GlassCard className="text-center p-10 max-w-md">
                <h2 className="text-4xl font-bold mb-4 text-primary">404</h2>
                <h3 className="text-xl font-bold mb-4">Page Not Found</h3>
                <p className="text-dim mb-8">Could not find requested resource</p>
                <Link href="/" className="px-6 py-3 bg-primary rounded-xl font-bold hover:bg-primary/80 transition-all">
                    Return Home
                </Link>
            </GlassCard>
        </div>
    )
}
