import { Request, Response } from "express";
import { CreateRoomSchema } from "@repo/common/types";
import prisma from "@repo/db";
import { nanoid } from "nanoid";

export const createRoomHandler = async (req: Request, res: Response) => {
  const parsed = CreateRoomSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { name, description, isPublic } = parsed.data;

  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const baseSlug = name.toLowerCase().replace(/\s+/g, "-").slice(0, 80);
    const slug = `${baseSlug}-${nanoid(6)}`;

    const room = await prisma.room.create({
      data: {
        name,
        slug,
        description,
        isPublic: isPublic ?? true,
        ownerId: userId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        isPublic: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};