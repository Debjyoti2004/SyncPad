"use client";

import { use, useState, useEffect, useRef, useCallback } from "react";
import type { Shape } from "../../../draw/shapes"; 
import { connectWebSocket, sendMessage } from "../../../lib/socket";
import { BACKEND_URL } from "../../config";

interface UseWhiteboardParams {
  params: Promise<{ slug: string }>; 
}

export function useWhiteboard({ params }: UseWhiteboardParams) {
  // unwrap params (same as original)
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

  // Handle Shape Draw (unchanged logic)
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
    if (undoInFlightRef.current) return;

    undoInFlightRef.current = true;
    setUndoInFlight(true);

    // Optimistic local removal
    setShapes((prev) => prev.slice(0, -1));

    // Broadcast to others
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

    undoInFlightRef.current = false;
    setUndoInFlight(false);
  };

  // Static tool list (same order)
  const toolButtons = [
    "rect",
    "line",
    "ellipse",
    "triangle",
    "arrow",
    "star",
    "freehand",
  ] as const;

  return {
    slug,
    roomId,
    shapes,
    setShapes,
    selectedShape,
    setSelectedShape,
    handleShapeDraw,
    handleUndoClick,
    undoInFlight,
    toolButtons,
  };
}
