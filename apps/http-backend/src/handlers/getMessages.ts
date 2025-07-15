import { Request, Response } from "express";
import { GetMessagesSchema } from "@repo/common/types";
import prisma from "@repo/db";

export const getMessagesHandler = async (req: Request, res: Response) => {
  const parsed = GetMessagesSchema.safeParse(req.params);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { id: roomId } = parsed.data;

  try {
    const messages = await prisma.chat.findMany({
      where: { roomId },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return res.status(200).json({ messages });
  } catch (err: any) {
    console.error("Error fetching messages:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
