"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../../../config";
import { LogIn, Loader2, AlertCircle } from "lucide-react";
import Button from "../../../components/ui/button";

export default function JoinRoomSection() {
  const [roomSlug, setRoomSlug] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    setError("");
    setLoading(true);

    if (!roomSlug.trim()) {
      setError("Room code is required.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
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

      console.log("[JOIN ROOM] Saved:", { roomId, slug });

      router.push(`/whiteboard/${slug}`);
    } catch (err: any) {
      setError(err.message || "Failed to join room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
          <LogIn className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Join Existing Room</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Room Code
          </label>
          <input
            type="text"
            placeholder="Enter room code or slug"
            value={roomSlug}
            onChange={(e) => setRoomSlug(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleJoin()}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <Button
          label={loading ? "Joining..." : "Join Room"}
          onClick={handleJoin}
          disabled={loading || !roomSlug.trim()}
          loading={loading}
          loadingIcon={Loader2}
          icon={LogIn}
          variant="primary"
          size="md"
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}
