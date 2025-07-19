"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Calendar, Globe, Lock, ExternalLink, User } from "lucide-react";

type Room = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
};

export default function RoomCard({ room }: { room: Room }) {
  const router = useRouter();
  const [createdAtText, setCreatedAtText] = useState("");

  useEffect(() => {
    setCreatedAtText(new Date(room.createdAt).toLocaleString());
  }, [room.createdAt]);

  const handleClick = () => {
    if (!room.slug) {
      console.error("Room slug is missing");
      return;
    }
    localStorage.setItem("latestSlug", room.slug);
    router.push(`/whiteboard/${room.slug}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 cursor-pointer hover:bg-slate-800/70 hover:border-slate-600/50 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {room.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <User className="w-4 h-4" />
            <span className="font-mono bg-slate-700/50 px-2 py-1 rounded text-xs">
              {room.slug}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {room.isPublic ? (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-900/30 border border-green-500/30 rounded-lg">
              <Globe className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400 font-medium">Public</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-900/30 border border-orange-500/30 rounded-lg">
              <Lock className="w-3 h-3 text-orange-400" />
              <span className="text-xs text-orange-400 font-medium">Private</span>
            </div>
          )}
          <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
        </div>
      </div>

      <p className="text-slate-300 text-sm mb-4 line-clamp-2">
        {room.description || "No description provided"}
      </p>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Calendar className="w-3 h-3" />
        <span>Created {createdAtText}</span>
      </div>
    </div>
  );
}