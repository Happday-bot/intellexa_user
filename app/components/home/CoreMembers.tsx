"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { API_BASE_URL } from "@/app/config/api";
import { coreMembers } from "@/app/data/clubData";
import Image from "next/image";
import { useState, useEffect } from "react";

export function CoreMembers() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/core-members`)
            .then(res => res.json())
            .then(data => {
                setMembers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch core members:", err);
                setMembers(coreMembers); // Fallback to local data
                setLoading(false);
            });
    }, []);

    return (
        <section id="team" className="py-20 relative">
            <div className="container px-4 mx-auto">
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold mb-12 text-center"
                >
                    Meet The <span className="text-secondary">Core Team</span>
                </motion.h2>

                <div className="flex flex-wrap justify-center gap-8">
                    {loading ? (
                        <div className="flex gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-72 h-80 rounded-3xl bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        members.map((member, i) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <GlassCard className="w-72 text-center hover:border-primary/50 transition-colors">
                                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary/20">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            width={96}
                                            height={96}
                                            className="object-cover"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold">{member.name}</h3>
                                    <p className="text-primary font-medium text-sm mb-2">{member.role}</p>
                                    <span className="inline-block px-3 py-1 bg-white/5 rounded-full text-xs text-dim border border-white/5">
                                        {member.domain}
                                    </span>
                                </GlassCard>
                            </motion.div>
                        ))
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16"
                >
                    <GlassCard className="p-4 border-primary/20 bg-primary/5">
                        <div className="relative w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden group">
                            <Image
                                src="/intellexa_user/assets/core.jpg"
                                alt="Intellexa Core Team Group Photo"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center p-8">
                                <div className="text-center">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">The Minds Behind Intellexa</h3>
                                    <p className="text-dim">Passionate, Dedicated, and Ready to Innovate.</p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </section>
    );
}
