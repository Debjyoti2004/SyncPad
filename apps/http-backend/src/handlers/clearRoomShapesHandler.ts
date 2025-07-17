import { Request, Response } from "express";
import prisma from "@repo/db";
import { z } from "zod";

const RoomIdSchema = z.object({
  id: z.string().uuid("Invalid room id"),
});

export async function clearRoomShapesHandler(req: Request, res: Response) {
  // Validate room ID from params
  const parsed = RoomIdSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
  }
  const { id: roomId } = parsed.data;

  try {
    // Check if room exists
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Find the last shape (latest chat) for this room
    const lastShape = await prisma.chat.findFirst({
      where: { roomId },
      orderBy: { createdAt: "desc" }, // latest first
    });

    if (!lastShape) {
      return res.status(200).json({
        message: "No shapes found to delete",
        deletedCount: 0,
      });
    }

    // Delete that last shape
    await prisma.chat.delete({
      where: { id: lastShape.id },
    });

    return res.status(200).json({
      message: "Deleted last shape",
      deletedShapeId: lastShape.id,
    });
  } catch (err: any) {
    console.error("[HTTP] clearRoomShapes error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
