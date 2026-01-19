"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { Users, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CreateTeamPostModal } from "@/app/components/forms/CreateTeamPostModal";

/* ----------------------------------------
   Smart time computation
----------------------------------------- */
function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);

  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

/* ----------------------------------------
   Types (explicit, scalable)
----------------------------------------- */
interface TeamPost {
  id: string;
  hackathon: string;
  title: string;
  description: string;
  skills: string[];
  createdAt: string;
  contact: {
    name: string;
    email: string;
  };
}

export default function TeamFinderPage() {
  const [posts, setPosts] = useState<TeamPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [requested, setRequested] = useState<Record<string, boolean>>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  /* ----------------------------------------
     Fetch from DB
  ----------------------------------------- */
  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/team-finder");
      const data = await res.json();
      // Ensure data is an array and clean up MongoDB _id fields
      const cleanedData = Array.isArray(data) 
        ? data.map((post: any) => {
            // Ensure skills is always an array
            let skills = post.skills || [];
            if (typeof skills === "string") {
              // If skills is a string, split it by comma
              skills = skills.split(",").map((s: string) => s.trim()).filter(Boolean);
            }
            
            return {
              ...post,
              skills,
              contact: post.contact || { name: "Unknown", email: "N/A" }
            };
          })
        : [];
      setPosts(cleanedData);
    } catch (err) {
      console.error("Failed to load team finder posts", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /* ----------------------------------------
     Join flow (real-world usable)
  ----------------------------------------- */
  const handleJoinRequest = (post: TeamPost) => {
    const subject = encodeURIComponent(
      `Hackathon Team Request – ${post.hackathon}`
    );
    const body = encodeURIComponent(
      `Hi ${post.contact.name},\n\nI saw your team post on Team Finder and would like to join your team.\n\nMy skills:\n- \n- \n\nThanks!`
    );

    window.location.href = `mailto:${post.contact.email}?subject=${subject}&body=${body}`;

    setRequested(prev => ({ ...prev, [post.id]: true }));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <Link
            href="/dashboard/student"
            className="inline-flex items-center gap-2 text-dim hover:text-white transition-colors group mb-6"
          >
            <div className="p-2 rounded-full bg-white/5 border border-white/10">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold">Team Finder</h1>
          <p className="text-dim">Connect with peers for upcoming hackathons.</p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-2 bg-primary rounded-lg font-bold hover:bg-primary/80 transition-colors"
        >
          + Create Post
        </button>
      </motion.div>

      {loading ? (
        <p className="text-dim">Loading team posts…</p>
      ) : (
        <div className="grid gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="flex flex-col md:flex-row gap-6 p-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-accent px-2 py-1 bg-accent/10 rounded">
                      {post.hackathon}
                    </span>
                    <span className="text-xs text-dim">
                      {timeAgo(post.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-dim mb-4">{post.description}</p>

                  <div className="flex gap-2 mb-3 flex-wrap">
                    {(post.skills || []).map((skill, idx) => (
                      <span
                        key={`${post.id}-skill-${idx}`}
                        className="text-xs px-2 py-1 rounded bg-white/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-dim">
                    Contact:{" "}
                    <span className="font-semibold text-white">
                      {post.contact?.name || "Unknown"}
                    </span>{" "}
                    · {post.contact?.email || "N/A"}
                  </p>
                </div>

                <div className="flex flex-col justify-end min-w-[160px]">
                  <button
                    onClick={() => handleJoinRequest(post)}
                    disabled={requested[post.id]}
                    className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold text-sm
                      ${
                        requested[post.id]
                          ? "bg-green-600/20 text-green-400 cursor-not-allowed"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                  >
                    <Users className="w-4 h-4" />
                    {requested[post.id] ? "Request Sent" : "Request to Join"}
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      <CreateTeamPostModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          fetchPosts(); // 🔁 refresh after post creation
        }}
      />
    </div>
  );
}
