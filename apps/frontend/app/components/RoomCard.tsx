"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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
    // ✅ Run only on client to avoid SSR mismatch
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
      className="bg-gray-900 rounded-xl shadow-md p-6 min-w-[280px] max-w-[360px] flex-1 cursor-pointer hover:scale-105 transition-transform text-white"
    >
      <h2 className="text-xl font-bold mb-3">
        Room Name: <span className="font-normal">{room.name}</span>
      </h2>
      <p className="text-gray-300 mb-2">
        <strong>Room Slug:</strong> {room.slug}
      </p>
      <p className="text-gray-300 mb-2">
        <strong>Description:</strong>{" "}
        {room.description ? room.description : "No description"}
      </p>
      <p
        className={`mb-2 font-semibold ${
          room.isPublic ? "text-green-500" : "text-red-500"
        }`}
      >
        Visibility: {room.isPublic ? "Public" : "Private"}
      </p>
      <p className="text-sm text-gray-500">
        <strong>Created:</strong> {createdAtText}
      </p>
    </div>
  );
}
