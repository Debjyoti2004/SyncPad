import { WebSocketServer, WebSocket } from 'ws';
import Jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common-file/config';
import prismaClient from '@repo/db';

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

wss.on('connection', (ws, request) => {
  try {
    const url = request.url;
    if (!url) {
      ws.close(1008, "Invalid URL");
      return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token');
    if (!token) {
      ws.close(1008, "Token missing");
      return;
    }

    const decoded = Jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    users.push({ userId, ws, rooms: [] });

    ws.on('message', async (data) => {
      let parsedData: any;

      try {
        parsedData = JSON.parse(data.toString());
      } catch {
        ws.send(JSON.stringify({ error: 'Invalid JSON format' }));
        return;
      }

      const user = users.find(u => u.ws === ws);
      if (!user) {
        ws.send(JSON.stringify({ error: 'User not found' }));
        return;
      }

      const { type, room, message } = parsedData;

      if (type === 'joinRoom') {
        if (!room || typeof room !== 'string') {
          ws.send(JSON.stringify({ error: 'Invalid or missing room ID' }));
          return;
        }

        if (!user.rooms.includes(room)) {
          user.rooms.push(room);
        }

        ws.send(JSON.stringify({ type: 'joinedRoom', room }));
      }

      else if (type === 'leaveRoom') {
        user.rooms = user.rooms.filter(r => r !== room);
        ws.send(JSON.stringify({ type: 'leftRoom', room }));
      }

      else if (type === 'message') {
        if (!room || typeof room !== 'string') {
          ws.send(JSON.stringify({ error: 'Room ID is required and must be a string' }));
          return;
        }

        if (!message || typeof message !== 'string') {
          ws.send(JSON.stringify({ error: 'Message content is required and must be a string' }));
          return;
        }

        try {
          const existingRoom = await prismaClient.room.findUnique({ where: { id: room } });
          if (!existingRoom) {
            ws.send(JSON.stringify({ error: 'Room not found' }));
            return;
          }

          await prismaClient.chat.create({
            data: {
              content: message,
              roomId: room,
              userId: user.userId,
            },
          });

          users.forEach(u => {
            if (u.rooms.includes(room)) {
              u.ws.send(JSON.stringify({
                type: 'message',
                room,
                message,
                sender: user.userId,
              }));
            }
          });
        } catch (err: any) {
          console.error("Error handling message:", err);
          ws.send(JSON.stringify({ error: 'Failed to send message' }));
        }
      }

      else {
        ws.send(JSON.stringify({ error: 'Unknown message type' }));
      }
    });

    ws.on('close', () => {
      const index = users.findIndex(u => u.ws === ws);
      if (index !== -1) users.splice(index, 1);
    });

    ws.send('Connected to WebSocket server');
  } catch (err) {
    console.error("Connection error:", err);
    ws.close(1008, "Unauthorized or Internal Error");
  }
});
