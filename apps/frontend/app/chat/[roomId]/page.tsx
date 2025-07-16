"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { BACKEND_URL } from "../../config";
import { connectWebSocket, sendMessage } from "../../../lib/socket";
import { Shape } from "../../../draw/index"; 
import Canvas from "../../components/Canvas";

export default function ChatRoomPage() {
  const { roomId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [slug, setSlug] = useState<string | null>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShape, setSelectedShape] = useState<Shape["type"]>("rect"); // Default shape
  const socketRef = useRef<WebSocket | null>(null);

  // Get slug from localStorage
  useEffect(() => {
    const storedSlug = localStorage.getItem("latestSlug");
    setSlug(storedSlug);
  }, []);

  // Fetch existing shapes from DB
  useEffect(() => {
    const fetchShapes = async () => {
      const token = localStorage.getItem("token");
      if (!token || !roomId) return;

      try {
        const res = await fetch(`${BACKEND_URL}/messages/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load shapes");

        const data = await res.json();
        const parsedShapes: Shape[] = [];

        for (const msg of data.messages || []) {
          try {
            const parsed = JSON.parse(msg.content);
            if (parsed.type) parsedShapes.push(parsed);
          } catch {}
        }

        setShapes(parsedShapes);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShapes();
  }, [roomId]);

  // Setup WebSocket for real-time updates
  useEffect(() => {
    const socket = connectWebSocket();
    if (!socket || !roomId) return;

    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "joinRoom", room: roomId }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        try {
          const parsed = JSON.parse(data.message);
          if (parsed.type) {
            setShapes((prev) => [...prev, parsed]);
          }
        } catch {}
      }
    };

    socket.onerror = (event) => console.error("WebSocket error", event);
    socket.onclose = () => console.log("WebSocket closed");

    return () => socket.close();
  }, [roomId]);

  // When user draws a new shape → send to backend + WebSocket
  const handleShapeDraw = useCallback(
    (shape: Shape) => {
      if (!roomId) return;
      sendMessage({
        type: "message",
        room: roomId,
        message: JSON.stringify(shape),
      });
    },
    [roomId]
  );

  return (
    <div className="w-full h-screen relative bg-black">
      {/* Shape Selection Toolbar */}
      <div className="absolute z-10 top-4 left-4 flex gap-2">
        {["rect", "line", "ellipse", "triangle", "arrow", "star", "freehand"].map((shape) => (
          <button
            key={shape}
            onClick={() => setSelectedShape(shape as Shape["type"])}
            className={`px-4 py-2 rounded ${
              selectedShape === shape ? "bg-yellow-400 text-black" : "bg-white text-black"
            }`}
          >
            {shape}
          </button>
        ))}
      </div>

      {/* Drawing Canvas */}
      <Canvas shape={selectedShape} shapes={shapes} onShapeDraw={handleShapeDraw} />

      {/* Shape Log */}
      {loading ? (
        <p className="absolute bottom-4 left-4 text-white">Loading shapes...</p>
      ) : error ? (
        <p className="absolute bottom-4 left-4 text-red-500">{error}</p>
      ) : (
        <div className="absolute bottom-4 left-4 bg-gray-900 text-white p-4 rounded max-h-40 overflow-y-auto">
          <h3 className="font-bold mb-2">Stored Shapes</h3>
          {shapes.map((shape, idx) => (
            <div key={idx}>{shape.type}</div>
          ))}
        </div>
      )}
    </div>
  );
}
