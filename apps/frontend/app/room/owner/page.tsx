"use client";

import { useEffect, useState } from "react";
import { getWithAuthJSON } from "../../../lib/api";
import { BACKEND_URL } from "../../config";
import { Folder, Loader2, AlertCircle } from "lucide-react";
import RoomCard from "../../components/ui/RoomCard";
import { useRouter } from "next/navigation";

interface Room {
  id: string;
  name: string;
  description?: string;
  slug: string;
  isPublic: boolean;
  createdAt: string;
}

export default function OwnerRoomsSection() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const route = useRouter()

  useEffect(() => {
    const fetchRooms = async () => {
      const token = localStorage.getItem("token");
      const ownerId = localStorage.getItem("ownerId");

      if (!token || !ownerId) {
        setError("Missing auth token or owner ID");
        route.push("/auth/signup")
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-slate-400">Loading your rooms...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-2 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 bg-slate-700/30 rounded-xl mb-4">
          <Folder className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-xl font-medium text-slate-300 mb-2">No rooms yet</h3>
        <p className="text-slate-500">Create your first room to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
