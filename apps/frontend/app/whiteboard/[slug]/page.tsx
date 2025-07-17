"use client";

import { use, useState, useEffect, useRef, useCallback } from "react";
import Canvas from "../../components/Canvas";
import type { Shape } from "../../../draw";
import { connectWebSocket, sendMessage } from "../../../lib/socket";
import { BACKEND_URL } from "../../config";


export default function WhiteboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [roomId, setRoomId] = useState<string | null>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShape, setSelectedShape] = useState<Shape["type"]>("rect");
  const socketRef = useRef<WebSocket | null>(null);

  // resolve roomId from slug 
  useEffect(() => {
    const fetchRoomId = async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token || !slug) return;

      try {
        const res = await fetch(`${BACKEND_URL}/rooms/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch roomId");

        const data = await res.json();
        console.log("[WB] Room details:", data.room);
        setRoomId(data.room.id);
      } catch (err) {
        console.error("[WB] Error fetching roomId:", err);
      }
    };

    fetchRoomId();
  }, [slug]);

  // load historical shapes
  useEffect(() => {
    if (!roomId) return;

    const fetchShapes = async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;

      try {
        const res = await fetch(`${BACKEND_URL}/messages/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load shapes");

        const data = await res.json();
        console.log("[WB] Old shapes from DB:", data);

        const loaded: Shape[] = [];
        for (const msg of data.messages || []) {
          try {
            const parsed = JSON.parse(msg.content);
            if (parsed?.type) loaded.push(parsed as Shape);
          } catch {
            console.warn("[WB] Skipped invalid message:", msg.content);
          }
        }

        // DB query is descending; reverse to draw oldest first
        setShapes(loaded.reverse());
      } catch (err) {
        console.error("[WB] Error loading shapes:", err);
      }
    };

    fetchShapes();
  }, [roomId]);

  // websocket live shapes 
  useEffect(() => {
    if (!roomId) return;
    const socket = connectWebSocket();
    if (!socket) return;

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("[WB] WS connected");
      socket.send(JSON.stringify({ type: "joinRoom", room: roomId }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "message") {
          try {
            const parsed = JSON.parse(data.message);
            if (parsed?.type) {
              setShapes((prev) => [...prev, parsed as Shape]);
            }
          } catch {
            console.warn("[WB] WS message not JSON shape:", data.message);
          }
        }
      } catch {
        // ignore non-JSON server greeting
      }
    };

    socket.onerror = (event) => console.error("[WB] WS error:", event);
    socket.onclose = () => console.log("[WB] WS closed");

    return () => socket.close();
  }, [roomId]);

  // send shape when user draws
  const handleShapeDraw = useCallback(
    (shape: Shape) => {
      setShapes((prev) => [...prev, shape]);

      if (socketRef.current && roomId) {
        sendMessage({
          type: "message",
          room: roomId,
          message: JSON.stringify(shape),
        });
      } else {
        console.error("[WB] Cannot send shape: no socket or roomId.");
      }
    },
    [roomId]
  );

  // undo last shape (DELETE)
  const handleUndoLast = async () => {
    if (!roomId) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    try {
      const res = await fetch(`${BACKEND_URL}/rooms/${roomId}/shapes`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const raw = await res.text();
      console.log("[WB] Undo response:", res.status, raw);

      if (!res.ok) {
        // Show server message
        let msg = `Undo failed (status ${res.status})`;
        try {
          const parsed = JSON.parse(raw);
          if (parsed?.message) msg = parsed.message;
        } catch {}
        throw new Error(msg);
      }

      const result = JSON.parse(raw);
      console.log("[WB] Deleted last shape:", result);

      // remove last shape locally
      setShapes((prev) => prev.slice(0, -1));
    } catch (err) {
      console.error("[WB] Undo last error:", err);
      alert((err as Error).message);
    }
  };

  // toolbar 
  const toolButtons = [
    "rect",
    "line",
    "ellipse",
    "triangle",
    "arrow",
    "star",
    "freehand",
  ] as const;

  return (
    <div className="w-screen h-screen bg-gray-900 text-white">
      <div className="flex gap-3 p-4 bg-gray-800 fixed top-0 left-0 z-10 w-full items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {toolButtons.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedShape(type)}
              className={`px-3 py-1 text-sm rounded ${
                selectedShape === type
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs sm:text-sm bg-gray-700 px-3 py-1 rounded">
            Room: <span className="text-blue-400 font-bold">{slug}</span>
          </div>
          <button
            onClick={handleUndoLast}
            disabled={!roomId}
            className="px-3 py-1 text-sm rounded bg-red-600 hover:bg-red-500 disabled:bg-gray-600"
            title="Delete the most recent shape in this room"
          >
            Undo Last
          </button>
        </div>
      </div>

      <Canvas shape={selectedShape} shapes={shapes} onShapeDraw={handleShapeDraw} />
    </div>
  );
}
