"use client";

import { GlassCard } from "@/app/components/ui/GlassCard";
import { Mail, MapPin, Instagram, Linkedin, Github, Youtube } from "lucide-react";

export function Contact() {
    return (
        <footer className="py-20 bg-black/20 mt-20 border-t border-white/5">
            <div className="container px-4 mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Join The Revolution</h2>
                        <p className="text-dim mb-8 max-w-md">
                            Ready to innovate? Connect with us or visit our lab at Rajalakshmi Engineering College.
                        </p>

                        <div className="flex flex-col gap-4 text-dim">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary" />
                                <span>intellexa@rajalakshmi.edu.in</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-primary" />
                                <span>Tech Lounge, Rajalakshmi Engineering College</span>
                            </div>
                        </div>
                    </div>

                    <GlassCard className="p-8">
                        <h3 className="text-xl font-bold mb-6">Connect With Us</h3>
                        <div className="flex gap-6 justify-center md:justify-start">
                            <a href="https://www.instagram.com/intellexa.rec/?hl=en" className="p-3 bg-white/5 rounded-full hover:bg-cyan-600 hover:text-white transition-all"><Instagram className="w-6 h-6" /></a>
                            <a href="https://www.linkedin.com/company/intellexa-rec" className="p-3 bg-white/5 rounded-full hover:bg-blue-600 hover:text-white transition-all"><Linkedin className="w-6 h-6" /></a>
                            <a href="https://github.com/Intellexa-Rec" className="p-3 bg-white/5 rounded-full hover:bg-gray-700 hover:text-white transition-all"><Github className="w-6 h-6" /></a>
                            <a href="https://www.youtube.com/@INTELLEXAREC" className="p-3 bg-white/5 rounded-full hover:bg-red-600 hover:text-white transition-all"><Youtube className="w-6 h-6" /></a>
                        </div>
                    </GlassCard>
                </div>

                <div className="text-center text-dim/40 text-sm mt-20">
                    © {new Date().getFullYear()} Intellexa REC. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
