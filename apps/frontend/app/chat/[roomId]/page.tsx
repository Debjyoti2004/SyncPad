"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { BACKEND_URL } from "../../config";
import { connectWebSocket, sendMessage } from "../../../lib/socket";

interface Message {
  content: string;
}

export default function ChatRoomPage() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [slug, setSlug] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Get slug from localStorage
  useEffect(() => {
    const storedSlug = localStorage.getItem("latestSlug");
    setSlug(storedSlug);
  }, []);

  // Fetch existing messages once
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      if (!token || !roomId) return;

      try {
        const res = await fetch(`${BACKEND_URL}/messages/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load messages");

        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [roomId]);

  // Setup WebSocket
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
        setMessages((prev) => [...prev, { content: data.message }]);
      }
    };

    socket.onerror = (event) => console.error("WebSocket error", event);
    socket.onclose = () => console.log("WebSocket closed");

    return () => socket.close();
  }, [roomId]);

  const handleSendMessage = () => {
    const msg = newMessage.trim();
    if (!msg || !roomId) return;

    sendMessage({
      type: "message",
      room: roomId,
      message: msg,
    });

    setNewMessage("");
  };

  return (
    <div style={{ padding: 30, maxWidth: 800, margin: "auto" }}>
      <h2>Room ID: {slug || roomId}</h2>

      {loading ? (
        <p>Loading messages...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div
          style={{
            marginBottom: 20,
            background: "#1e1e1e",
            borderRadius: 8,
            padding: 20,
            maxHeight: 400,
            overflowY: "auto",
            color: "#fff",
          }}
        >
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>
      )}

      <textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
          borderRadius: 6,
          background: "#2a2a2a",
          color: "#fff",
          border: "1px solid #555",
        }}
      />
      <button
        onClick={handleSendMessage}
        style={{
          width: "100%",
          padding: 12,
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
}