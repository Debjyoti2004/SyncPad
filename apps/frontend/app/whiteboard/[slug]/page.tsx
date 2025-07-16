"use client";

import { use, useState, useEffect, useRef } from "react";
import Canvas from "../../components/Canvas";
import { Shape } from "../../../draw";
import { connectWebSocket, sendMessage } from "../../../lib/socket";
import { BACKEND_URL } from "../../config";

export default function WhiteboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShape, setSelectedShape] = useState<Shape["type"]>("rect");
  const socketRef = useRef<WebSocket | null>(null);

  // ✅ Fetch roomId from slug using API
  useEffect(() => {
    const fetchRoomId = async () => {
      const token = localStorage.getItem("token");
      if (!token || !slug) return;

      try {
        const res = await fetch(`${BACKEND_URL}/rooms/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch roomId");

        const data = await res.json();
        console.log("[Frontend] Room details:", data.room);
        setRoomId(data.room.id);
      } catch (err) {
        console.error("[Frontend] Error fetching roomId:", err);
      }
    };

    fetchRoomId();
  }, [slug]);

  // ✅ Fetch old shapes from DB (via messages API)
  useEffect(() => {
    if (!roomId) return;

    const fetchShapes = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${BACKEND_URL}/messages/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load shapes");

        const data = await res.json();
        console.log("[Frontend] Old shapes from DB:", data);

        const oldShapes: Shape[] = [];
        for (const msg of data.messages || []) {
          try {
            const parsed = JSON.parse(msg.content);
            if (parsed.type) oldShapes.push(parsed);
          } catch {
            console.warn("[Frontend] Skipped invalid message:", msg.content);
          }
        }

        setShapes(oldShapes);
      } catch (err) {
        console.error("[Frontend] Error loading shapes:", err);
      }
    };

    fetchShapes();
  }, [roomId]);

  // ✅ WebSocket setup
  useEffect(() => {
    if (!roomId) return;

    const socket = connectWebSocket();
    if (!socket) return;
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("[Frontend] WebSocket connected");
      socket.send(JSON.stringify({ type: "joinRoom", room: roomId }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "message") {
          const parsed = JSON.parse(data.message);
          if (parsed.type) {
            setShapes((prev) => [...prev, parsed]);
          }
        }
      } catch (err) {
        console.log("[Frontend] Invalid WS message:", event.data);
      }
    };

    socket.onerror = (event) => console.error("[Frontend] WS Error:", event);
    socket.onclose = () => console.log("[Frontend] WS Closed");

    return () => socket.close();
  }, [roomId]);

  // ✅ Send shape to WS & DB
  const handleShapeDraw = (shape: Shape) => {
    setShapes((prev) => [...prev, shape]);
    if (socketRef.current && roomId) {
      sendMessage({
        type: "message",
        room: roomId,
        message: JSON.stringify(shape),
      });
    } else {
      console.error("[Frontend] Cannot send shape: socket or roomId missing");
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-900 text-white">
      {/* Toolbar */}
      <div className="flex gap-3 p-4 bg-gray-800 fixed top-0 left-0 z-10">
        {["rect", "line", "ellipse", "triangle", "arrow", "star", "freehand"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedShape(type as Shape["type"])}
            className={`px-4 py-2 rounded ${
              selectedShape === type ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <Canvas shape={selectedShape} shapes={shapes} onShapeDraw={handleShapeDraw} />
    </div>
  );
}
