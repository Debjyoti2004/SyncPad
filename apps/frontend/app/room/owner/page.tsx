"use client";
// It fetches the rooms from the backend and displays them in a grid format

import { useEffect, useState } from "react";
import { getWithAuthJSON } from "../../../lib/api";
import { BACKEND_URL } from "../../config";
import RoomCard from "../../components/RoomCard";

interface Room {
  id: string;
  name: string;
  description?: string;
  slug: string;
  isPublic: boolean;
  createdAt: string;
}

export default function OwnerRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      const token = localStorage.getItem("token");
      const ownerId = localStorage.getItem("ownerId");

      if (!token || !ownerId) {
        setError("Missing auth token or owner ID");
        setLoading(false);
        return;
      }

      try {
        const res = await getWithAuthJSON(
          `${BACKEND_URL}/owners/${ownerId}/rooms`,
          token
        );
        setRooms(res.rooms);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "1200px",
        margin: "auto",
        color: "#f1f1f1",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h2 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 30 }}>
        My Rooms
      </h2>

      {loading ? (
        <p>Loading rooms...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : rooms.length === 0 ? (
        <p>No rooms found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}