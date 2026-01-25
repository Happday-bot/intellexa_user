"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { Trash2, UserPlus, ShieldAlert, Key } from "lucide-react";
import { API_BASE_URL } from "@/app/config/api";

interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function ManageAdminsPage() {
    const [admins, setAdmins] = useState<User[]>([]);
    const [showForm, setShowForm] = useState(false);

    // New Admin Form State
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: "",
        email: ""
    });

    const fetchAdmins = () => {
        fetch(`${API_BASE_URL}/api/users?role=admin`)
            .then(res => res.json())
            .then(data => setAdmins(data))
            .catch(err => console.error("Failed to fetch admins", err));
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this admin? They will lose access immediately.")) return;
        try {
            await fetch(`${API_BASE_URL}/api/users/${id}`, { method: "DELETE" });
            fetchAdmins();
        } catch (err) {
            console.error("Failed to delete user", err);
        }
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/api/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, role: "admin" })
            });

            if (res.ok) {
                setShowForm(false);
                setFormData({ username: "", password: "", name: "", email: "" });
                fetchAdmins();
            } else {
                alert("Failed to add admin. Username might exist.");
            }
        } catch (err) {
            console.error("Error adding admin", err);
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-red-500">Admin Command</h1>
                    <p className="text-dim">Manage high-level access and security.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
                >
                    <UserPlus className="w-4 h-4" /> Add Administrator
                </button>
            </header>

            {/* Add Admin Form */}
            {showForm && (
                <GlassCard className="p-6 border-red-500/30 bg-red-500/5 animate-in slide-in-from-top-4">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-400">
                        <Key className="w-5 h-5" /> New Admin Credentials
                    </h3>
                    <form onSubmit={handleAddAdmin} className="grid md:grid-cols-2 gap-4">
                        <input className="p-3 bg-black/40 border border-white/10 rounded-lg text-white"
                            placeholder="Full Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        <input className="p-3 bg-black/40 border border-white/10 rounded-lg text-white"
                            placeholder="Email" type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        <input className="p-3 bg-black/40 border border-white/10 rounded-lg text-white"
                            placeholder="Username" required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                        <input className="p-3 bg-black/40 border border-white/10 rounded-lg text-white"
                            placeholder="Password" type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />

                        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-dim hover:text-white">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg">Confirm Access</button>
                        </div>
                    </form>
                </GlassCard>
            )}

            {/* Admin List */}
            <div className="grid gap-4">
                {admins.map((admin) => (
                    <GlassCard key={admin.id} className="flex items-center justify-between p-6 border-red-500/10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{admin.name} <span className="text-xs ml-2 px-2 py-0.5 rounded bg-red-500 text-white">ADMIN</span></h3>
                                <div className="flex gap-4 text-sm text-dim">
                                    <span>@{admin.username}</span>
                                    <span>{admin.email}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-xs text-dim bg-white/5 px-2 py-1 rounded">
                                Joined: {admin.createdAt}
                            </div>
                            {/* Prevent deleting specific seed admin or self if needed, assuming admin-1 is immutable for safety in basics */}
                            {admin.id !== 'admin-1' && (
                                <button
                                    onClick={() => handleDelete(admin.id)}
                                    className="p-2 hover:bg-red-500/20 text-dim hover:text-red-500 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
