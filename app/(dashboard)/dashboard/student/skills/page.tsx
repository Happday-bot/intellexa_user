"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { useState } from "react";
import { cn } from "@/lib/utils";

const initialSkills = [
    { domain: "Artificial Intelligence", level: 65, color: "bg-blue-500" },
    { domain: "Web Development", level: 80, color: "bg-purple-500" },
    { domain: "Cybersecurity", level: 40, color: "bg-red-500" },
    { domain: "IoT & Robotics", level: 20, color: "bg-emerald-500" },
    { domain: "Cloud Computing", level: 50, color: "bg-orange-500" }
];

export default function SkillsPage() {
    const [skills, setSkills] = useState(initialSkills);

    const updateSkill = (index: number) => {
        // Dummy interaction: Increment skill by 5
        const newSkills = [...skills];
        if (newSkills[index].level < 100) {
            newSkills[index].level = Math.min(newSkills[index].level + 5, 100);
            setSkills(newSkills);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold">Skill Matrix</h1>
                <p className="text-dim">Visualize and track your technical proficiency.</p>
            </motion.div>

            <div className="grid gap-6">
                {skills.map((skill, i) => (
                    <motion.div
                        key={skill.domain}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <GlassCard className="p-6">
                            <div className="flex justify-between items-end mb-2">
                                <h3 className="font-bold text-lg">{skill.domain}</h3>
                                <span className="text-primary font-mono">{skill.level}%</span>
                            </div>

                            <div className="h-4 bg-white/5 rounded-full overflow-hidden relative" onClick={() => updateSkill(i)}>
                                <motion.div
                                    className={cn("h-full rounded-full cursor-pointer hover:brightness-125 transition-all", skill.color)}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.level}%` }}
                                    transition={{ duration: 1, type: "spring" }}
                                />
                            </div>
                            <p className="text-xs text-dim mt-2 text-right">Click bar to update (Demo)</p>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
