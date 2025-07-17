import { WebSocketServer, WebSocket } from "ws";
import Jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common-file/config";
import prismaClient from "@repo/db";

const wss = new WebSocketServer({ port: 8080 });

interface UserConn {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: UserConn[] = [];

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

    ws.on("message", async (raw) => {
      let parsed: any;
      try {
        parsed = JSON.parse(raw.toString());
      } catch {
        ws.send(JSON.stringify({ error: "Invalid JSON format" }));
        return;
      }

      const user = users.find((u) => u.ws === ws);
      if (!user) {
        ws.send(JSON.stringify({ error: "User not found" }));
        return;
      }

      const { type, room } = parsed;

      // join
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

      // leave 
      if (type === "leaveRoom") {
        user.rooms = user.rooms.filter((r) => r !== room);
        ws.send(JSON.stringify({ type: "leftRoom", room }));
        return;
      }

      // deleteShape  
      if (type === "deleteShape") {
        const { shapeId } = parsed;
        console.log(`[WS] Delete shape request room=${room} shapeId=${shapeId}`);

        if (!room || typeof room !== "string" || !shapeId || typeof shapeId !== "string") {
          ws.send(JSON.stringify({ error: "Invalid deleteShape payload" }));
          return;
        }

        users.forEach((u) => {
          if (u.rooms.includes(room)) {
            u.ws.send(
              JSON.stringify({
                type: "deleteShape",
                room,
                shapeId,
                sender: user.userId,
              })
            );
          }
        });
        return;
      }

      // message (new shape)  
      if (type === "message") {
        const { message } = parsed;
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
          // ensure room exists
          const existingRoom = await prismaClient.room.findUnique({ where: { id: room } });
          if (!existingRoom) {
            ws.send(JSON.stringify({ error: "Room not found" }));
            return;
          }

          // persist shape JSON as chat row
          const chatEntry = await prismaClient.chat.create({
            data: {
              content: message,
              roomId: room,
              userId: user.userId,
            },
          });

          console.log("[WS] Shape stored in DB:", chatEntry.id);

          // broadcast new shape
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
        } catch (err) {
          console.error("[WS] Error handling message:", err);
          ws.send(JSON.stringify({ error: "Failed to send message" }));
        }
        return;
      }

      // unknown 
      ws.send(JSON.stringify({ error: "Unknown message type" }));
    });

    ws.on("close", () => {
      console.log(`[WS] Connection closed: userId=${userId}`);
      const idx = users.findIndex((u) => u.ws === ws);
      if (idx !== -1) users.splice(idx, 1);
    });

    // initial greeting (string, not JSON) — clients must ignore.
    ws.send("Connected to WebSocket server");
  } catch (err) {
    console.error("[WS] Connection error:", err);
    ws.close(1008, "Unauthorized or Internal Error");
  }
});
