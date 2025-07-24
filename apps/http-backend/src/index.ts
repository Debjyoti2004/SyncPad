import express from "express";
import cors from "cors";
import middleware from "./middleware.js";
import { signupHandler } from "./controllers/auth/signup.js";
import { signinHandler } from "./controllers/auth/signin.js";
import { createRoomHandler } from "./handlers/createRoom.js";
import { getMessagesHandler } from "./handlers/getMessages.js";
import { getRoomBySlugHandler } from "./handlers/getRoomBySlug.js";
import { getRoomsByOwnerHandler } from "./handlers/getRoomsByOwner.js";
import { FRONTEND_URL } from "@repo/backend-common-file/config"
import {clearRoomShapesHandler} from "./handlers/clearRoomShapesHandler.js"

const app = express();

app.use(express.json());

app.use(cors({
origin: FRONTEND_URL, 
methods: ["GET", "POST", "PUT", "DELETE"],
allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true                
}));

app.get("/status", (req, res) => {
  res.status(200).json({ message: "HTTP Backend is running" })
});

app.post("/signup", signupHandler);
app.post("/signin", signinHandler);
app.post("/rooms", middleware, createRoomHandler);

// Get messages by room ID
app.get("/messages/:id", middleware, getMessagesHandler);
// Get room by slug
app.get("/rooms/:slug", middleware,getRoomBySlugHandler);
// Get rooms by owner ID
app.get("/owners/:ownerId/rooms", middleware, getRoomsByOwnerHandler);
// Delete the Shaps
app.delete("/rooms/:id/shapes", middleware, clearRoomShapesHandler);
  


app.listen(4001, () => {
  console.log("HTTP Backend is running on port 4001");
});
