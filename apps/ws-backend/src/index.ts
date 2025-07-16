import { WebSocketServer, WebSocket } from "ws";
import Jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common-file/config";
import prismaClient from "@repo/db";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

wss.on("connection", (ws, request) => {
  try {
    const url = request.url;
    if (!url) {
      ws.close(1008, "Invalid URL");
      return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token");
    if (!token) {
      ws.close(1008, "Token missing");
      return;
    }

    const decoded = Jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    console.log(`[WS] New connection: userId=${userId}`);

    users.push({ userId, ws, rooms: [] });

    ws.on("message", async (data) => {
      let parsedData: any;

      try {
        parsedData = JSON.parse(data.toString());
      } catch {
        ws.send(JSON.stringify({ error: "Invalid JSON format" }));
        return;
      }

      const user = users.find((u) => u.ws === ws);
      if (!user) {
        ws.send(JSON.stringify({ error: "User not found" }));
        return;
      }

      const { type, room, message } = parsedData;

      // Handle Join Room
      if (type === "joinRoom") {
        console.log(`[WS] User ${user.userId} joining room: ${room}`);

        if (!room || typeof room !== "string") {
          ws.send(JSON.stringify({ error: "Invalid or missing room ID" }));
          return;
        }

        if (!user.rooms.includes(room)) {
          user.rooms.push(room);
        }

        ws.send(JSON.stringify({ type: "joinedRoom", room }));
        return;
      }

      // Handle Leave Room
      if (type === "leaveRoom") {
        user.rooms = user.rooms.filter((r) => r !== room);
        ws.send(JSON.stringify({ type: "leftRoom", room }));
        return;
      }

      // Handle Shape Message
      if (type === "message") {
        console.log("[WS] Incoming shape message:", { room, message });

        if (!room || typeof room !== "string") {
          ws.send(JSON.stringify({ error: "Room ID is required and must be a string" }));
          return;
        }

        if (!message || typeof message !== "string") {
          ws.send(JSON.stringify({ error: "Message content is required and must be a string" }));
          return;
        }

        try {
          // Check if Room exists in DB
          const existingRoom = await prismaClient.room.findUnique({ where: { id: room } });
          console.log("[WS] Room check:", existingRoom);

          if (!existingRoom) {
            ws.send(JSON.stringify({ error: "Room not found" }));
            return;
          }

          // Save shape as chat message
          const chatEntry = await prismaClient.chat.create({
            data: {
              content: message, // Shape JSON string
              roomId: room,
              userId: user.userId,
            },
          });

          console.log("[WS] Shape stored in DB:", chatEntry);

          // Broadcast to all users in the room
          users.forEach((u) => {
            if (u.rooms.includes(room)) {
              u.ws.send(
                JSON.stringify({
                  type: "message",
                  room,
                  message,
                  sender: user.userId,
                })
              );
            }
          });
        } catch (err: any) {
          console.error("[WS] Error handling message:", err);
          ws.send(JSON.stringify({ error: "Failed to send message" }));
        }

        return;
      }

      // ✅ Unknown Type
      ws.send(JSON.stringify({ error: "Unknown message type" }));
    });

    ws.on("close", () => {
      console.log(`[WS] Connection closed: userId=${userId}`);
      const index = users.findIndex((u) => u.ws === ws);
      if (index !== -1) users.splice(index, 1);
    });

    ws.send("Connected to WebSocket server");
  } catch (err) {
    console.error("[WS] Connection error:", err);
    ws.close(1008, "Unauthorized or Internal Error");
  }
});
