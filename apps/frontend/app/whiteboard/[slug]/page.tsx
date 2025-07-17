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

  // websocket
  const socketRef = useRef<WebSocket | null>(null);

  // undo spam guard
  const undoInFlightRef = useRef(false);
  const [undoInFlight, setUndoInFlight] = useState(false);

  // Fetch Room ID  
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
        setRoomId(data.room.id);
        console.log("[WB] Room details:", data.room);
      } catch (err) {
        console.error("[WB] Error fetching roomId:", err);
      }
    };
    fetchRoomId();
  }, [slug]);

  // Load Historical Shapes  
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
        const loaded: Shape[] = [];
        for (const msg of data.messages || []) {
          try {
            const parsed = JSON.parse(msg.content);
            if (parsed?.type) loaded.push(parsed as Shape);
          } catch {
            console.warn("[WB] Skipped invalid message:", msg.content);
          }
        }
        setShapes(loaded.reverse()); // draw oldest first
      } catch (err) {
        console.error("[WB] Error loading shapes:", err);
      }
    };

    fetchShapes();
  }, [roomId]);

  // WebSocket for Live Updates  
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
          // New shape broadcast
          try {
            const parsed = JSON.parse(data.message);
            if (parsed?.type) {
              setShapes((prev) => [...prev, parsed as Shape]);
            }
          } catch {
            console.warn("[WB] WS message not JSON shape:", data.message);
          }
        }

        if (data.type === "deleteShape") {
          // Another client deleted last shape
          setShapes((prev) => (prev.length ? prev.slice(0, -1) : prev));
        }
      } catch {
        // ignore non-JSON greetings
      }
    };

    socket.onerror = (event) => console.error("[WB] WS error:", event);
    socket.onclose = () => console.log("[WB] WS closed");

    return () => socket.close();
  }, [roomId]);

  //  Handle Shape Draw  
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

  // Undo (Guarded) 
  const handleUndoClick = async () => {
    if (!roomId) return;
    if (!shapes.length) return;
    if (undoInFlightRef.current) return; // ignore while previous undo running

    undoInFlightRef.current = true;
    setUndoInFlight(true);

    // Optimistic local removal
    setShapes((prev) => prev.slice(0, -1));

    // Broadcast to other clients immediately (they also pop last)
    if (socketRef.current) {
      sendMessage({
        type: "deleteShape",
        room: roomId,
      });
    }

    // Sync to backend
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      try {
        const res = await fetch(`${BACKEND_URL}/rooms/${roomId}/shapes`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        const raw = await res.text();
        console.log("[WB] Undo response:", res.status, raw);

        if (!res.ok) {
          let msg = `Undo failed (status ${res.status})`;
          try {
            const parsed = JSON.parse(raw);
            if (parsed?.message) msg = parsed.message;
          } catch {}
          alert(msg);

        }
      } catch (err) {
        console.error("[WB] Undo error:", err);
        alert("Undo failed. Please refresh and try again.");
      }
    }

    // allow the next undo (immediately)
    undoInFlightRef.current = false;
    setUndoInFlight(false);
  };

  // Toolbar  
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
            onClick={handleUndoClick}
            disabled={!roomId || !shapes.length || undoInFlight}
            className={`px-3 py-1 text-sm rounded ${
              !roomId || !shapes.length || undoInFlight
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-500 cursor-pointer"
            }`}
            title="Undo the most recent shape. If others don't see it yet, try refreshing."
          >
            Undo Last
          </button>
        </div>
      </div>

      <Canvas
        shape={selectedShape}
        shapes={shapes}
        onShapeDraw={handleShapeDraw}
      />
    </div>
  );
}
