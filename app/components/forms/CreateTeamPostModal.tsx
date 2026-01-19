"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { X } from "lucide-react";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTeamPostModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hackathon, setHackathon] = useState("");
  const [teamSize, setTeamSize] = useState("Any");
  const [skills, setSkills] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      hackathon,
      teamSize,
      skills: skills
        .split(",")
        .map(s => s.trim())
        .filter(Boolean),
      contact: {
        name: contactName,
        email: contactEmail
      }
    };

    try {
      await fetch("http://localhost:8000/api/team-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      onClose();
    } catch (err) {
      console.error("Failed to create post", err);
      alert("Failed to create post. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg"
      >
        <GlassCard className="p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-dim hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold mb-6">Find Teammates</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-dim mb-2">Heading / Pitch</label>
              <input
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                type="text"
                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none"
                placeholder="e.g. Need Backend Dev for GenAI Hackathon"
              />
            </div>

            <div>
              <label className="block text-sm text-dim mb-2">Description</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none resize-none"
                placeholder="Describe your idea and who you are looking for..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-dim mb-2">Team Size Needed</label>
                <select
                  value={teamSize}
                  onChange={e => setTeamSize(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-dim [&>option]:bg-slate-900"
                >
                  <option>1 Member</option>
                  <option>2 Members</option>
                  <option>3 Members</option>
                  <option>Any</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-dim mb-2">Hackathon Name</label>
                <input
                  required
                  value={hackathon}
                  onChange={e => setHackathon(e.target.value)}
                  type="text"
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none"
                  placeholder="e.g. GenAI Hackathon 2026"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-dim mb-2">Skills Required (Comma separated)</label>
              <input
                value={skills}
                onChange={e => setSkills(e.target.value)}
                type="text"
                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none"
                placeholder="React, Node.js, Figma..."
              />
            </div>

            {/* ✅ Contact Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-dim mb-2">Your Name</label>
                <input
                  required
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  type="text"
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-sm text-dim mb-2">Email</label>
                <input
                  required
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  type="email"
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none"
                  placeholder="e.g. john.doe@example.com"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary rounded-lg font-bold hover:bg-primary/80 transition-colors"
              >
                Post Request
              </button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
