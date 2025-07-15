import { Request, Response } from "express";
import prisma from "@repo/db";

export const getRoomsByOwnerHandler = async (req: Request, res: Response) => {
  const { ownerId } = req.params;

  if (!ownerId) {
    return res.status(400).json({ message: "Owner ID is required" });
  }

  try {
    const rooms = await prisma.room.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ rooms });
  } catch (err: any) {
    console.error("Error fetching rooms by owner:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
