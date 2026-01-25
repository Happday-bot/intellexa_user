"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { API_BASE_URL } from "@/app/config/api";
import { clubDomains } from "@/app/data/clubData";
import * as Icons from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export function Activities() {
    const [domains, setDomains] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/domains`)
            .then(res => res.json())
            .then(data => {
                setDomains(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch domains:", err);
                setDomains(clubDomains); // Fallback to local data
                setLoading(false);
            });
    }, []);

    return (
        <section id="activities" className="py-24 relative overflow-hidden">
            <div className="container px-4 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Explore Our <span className="text-primary">Domains</span></h2>
                    <p className="text-dim text-lg max-w-2xl mx-auto">
                        From coding lines to hardware wires, we cover every aspect of modern technology.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="h-[300px] rounded-3xl bg-white/5 animate-pulse" />
                        ))
                    ) : (
                        domains.map((domain, index) => {
                            // dynamic icon rendering
                            const IconComponent = (Icons as any)[domain.icon] || Icons.Code;

                            return (
                                <motion.div
                                    key={domain.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <GlassCard hoverEffect className="h-[300px] flex flex-col items-center justify-center text-center group cursor-pointer relative overflow-hidden p-6">
                                        {/* Background Image */}
                                        <div className="absolute inset-0">
                                            <Image
                                                src={domain.image}
                                                alt={domain.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-60"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10 flex flex-col items-center transform transition-transform duration-300 group-hover:-translate-y-2">
                                            <div className={`p-4 rounded-full mb-4 bg-gradient-to-br ${domain.color} bg-opacity-20 backdrop-blur-md border border-white/10 shadow-lg`}>
                                                <IconComponent className="w-8 h-8 text-white" />
                                            </div>

                                            <h3 className="text-2xl font-bold mb-2 text-white">{domain.title}</h3>
                                            <p className="text-sm text-dim group-hover:text-white/90 transition-colors max-w-[200px]">
                                                {domain.description}
                                            </p>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}
