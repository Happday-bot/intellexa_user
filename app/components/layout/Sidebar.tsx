import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Ticket, BrainCircuit, Users, Settings, LogOut } from "lucide-react";

const links = [
    { name: "Overview", href: "/dashboard/student", icon: LayoutDashboard },
    { name: "My Tickets", href: "/dashboard/student/tickets", icon: Ticket },
    { name: "Skill Matrix", href: "/dashboard/student/skills", icon: BrainCircuit },
    { name: "Team Finder", href: "/dashboard/student/team", icon: Users },
    { name: "Resume Analyzer", href: "/dashboard/student/resume", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-slate-900/80 backdrop-blur-xl border-r border-white/10 flex flex-col p-6 z-40">
            <div className="mb-10 text-xl font-bold tracking-tight">
                Intellexa <span className="text-accent">Nexus</span>
            </div>

            <nav className="flex-1 flex flex-col gap-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                                isActive
                                    ? "bg-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                                    : "text-dim hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 transition-colors w-full text-left"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
