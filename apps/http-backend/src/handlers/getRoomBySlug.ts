import { Request, Response } from "express";
import prisma from "@repo/db";

export const getRoomBySlugHandler = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const room = await prisma.room.findUnique({
      where: { slug },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json({ room });
  } catch (err: any) {
    console.error("Error fetching room:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
