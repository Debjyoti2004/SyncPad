let socket: WebSocket | null = null;
import {WEBSOCKET_URL} from "../app/config";

export function connectWebSocket() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Missing token in localStorage");
    return null;
  }

  socket = new WebSocket(`${WEBSOCKET_URL}?token=${token}`);
  return socket;
}

export function sendMessage(data: any) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    console.error("WebSocket is not open.");
  }
}

export function getSocket() {
  return socket;
}
