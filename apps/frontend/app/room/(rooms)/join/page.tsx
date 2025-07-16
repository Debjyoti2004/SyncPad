"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../../../config";

export default function JoinRoomPage() {
  const [roomSlug, setRoomSlug] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    setError("");
    setLoading(true);

    if (!roomSlug.trim()) {
      setError("Room slug is required.");
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

      // ✅ Save both ID and Slug in localStorage
      localStorage.setItem("latestRoomId", roomId);
      localStorage.setItem("latestSlug", slug);

      console.log("[JOIN ROOM] Saved:", { roomId, slug });

      // ✅ Navigate using slug for user-friendly URL
      router.push(`/whiteboard/${slug}`);
    } catch (err: any) {
      setError(err.message || "Failed to join room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h2 style={{ marginBottom: 10 }}>Join Room by Slug</h2>

      <input
        type="text"
        placeholder="Enter Room Slug"
        value={roomSlug}
        onChange={(e) => setRoomSlug(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
          borderRadius: 6,
          border: "1px solid #ccc",
          background: "#222",
          color: "#fff",
        }}
      />

      {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}

      <button
        onClick={handleJoin}
        disabled={loading}
        style={{
          width: "100%",
          padding: 12,
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Joining..." : "Join Room"}
      </button>
    </div>
  );
}
