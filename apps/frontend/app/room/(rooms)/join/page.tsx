"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../../../config";
import { LogIn, Loader2, ArrowRight, Users, Clock } from "lucide-react";
import Button from "../../../components/ui/button";
import toast, { Toaster } from "react-hot-toast";

export default function JoinRoomSection() {
  const [roomSlug, setRoomSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    setLoading(true);

    if (!roomSlug.trim()) {
      toast.error("Room code is required.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token not found.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/rooms/${roomSlug.trim()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Room not found or unauthorized");

      const data = await res.json();
      const { id: roomId, slug } = data.room;

      localStorage.setItem("latestRoomId", roomId);
      localStorage.setItem("latestSlug", slug);

      toast.success("Successfully joined room!");
      router.push(`/whiteboard/${slug}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to join room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative">
      <Toaster position="top-right" />
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl blur opacity-20"></div>
      <div className="relative bg-zinc-900/90 backdrop-blur-xl rounded-3xl border border-zinc-700/50 p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
            <LogIn className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Join Existing Room</h2>
            <p className="text-slate-400 text-sm">Enter a room code to collaborate</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              Room Code
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter room code or slug"
                value={roomSlug}
                onChange={(e) => setRoomSlug(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleJoin()}
                className="w-full px-5 py-4 pr-12 bg-zinc-800/70 border border-zinc-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 hover:border-zinc-500/70"
              />
              <ArrowRight className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Ask the room owner for the access code
            </p>
          </div>

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-4 bg-zinc-800/40 border border-zinc-700/30 rounded-2xl">
              <Users className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-white">Instant Collaboration</p>
                <p className="text-xs text-slate-400">Join and start collaborating immediately</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-zinc-800/40 border border-zinc-700/30 rounded-2xl">
              <Clock className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-white">Real-time Sync</p>
                <p className="text-xs text-slate-400">See changes as they happen</p>
              </div>
            </div>
          </div>

          <Button
            label={loading ? "Joining..." : "Join Room"}
            onClick={handleJoin}
            loading={loading}
            loadingIcon={Loader2}
            icon={LogIn}
            variant="green"
            size="md"
            className="w-full py-4 font-semibold rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <div className="pt-4 border-t border-zinc-700/50">
            <div className="flex items-center justify-between text-xs text-slate-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
}