"use client";

import { useRouter } from "next/navigation";
import React from "react";

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

  const handleClick = () => {
    if (!room.slug) {
      console.error("Room slug is missing");
      return;
    }
    // Store slug for display purpose
    localStorage.setItem("latestSlug", room.slug);
    if (!room.id) {
      console.error("Room ID is missing");
      return;
    }
    // Navigate to the chat room page when we click on the card
    router.push(`/chat/${room.id}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        backgroundColor: "#1e1e1e",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(255, 255, 255, 0.05)",
        padding: "20px",
        minWidth: "280px",
        maxWidth: "360px",
        flex: "1 1 300px",
        transition: "transform 0.2s",
        cursor: "pointer",
        color: "#f1f1f1",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-2px)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "translateY(0)")
      }
    >
      <h2 style={{ fontSize: "20px", marginBottom: "10px", color: "#fff" }}>
        <strong>Room Name: </strong>{room.name}
      </h2>
      <p style={{ margin: "6px 0", color: "#ccc" }}>
        <strong>Room ID: </strong> {room.slug}
      </p>
      <p style={{ margin: "6px 0", color: "#ccc" }}>
        <strong>Description:</strong>{" "}
        {room.description ? room.description : "No description"}
      </p>

      <p
        style={{
          margin: "6px 0",
          color: room.isPublic ? "#4caf50" : "#e53935",
        }}
      >
        <strong>Visibility:</strong> {room.isPublic ? "Public" : "Private"}
      </p>

      <p style={{ margin: "6px 0", fontSize: "13px", color: "#888" }}>
        <strong>Created:</strong>{" "}
        {new Date(room.createdAt).toLocaleString()}
      </p>
    </div>
  );
}