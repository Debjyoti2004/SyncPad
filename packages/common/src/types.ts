import { z } from "zod";

// Helper Regex for strong password 
const StrongPassword = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(100, { message: "Password must be under 100 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one digit" })
  .regex(/[\W_]/, { message: "Password must contain at least one special character" });

// Schema for user signup
export const CreateUserSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Please enter a valid email address" })
      .max(255, { message: "Email must be under 255 characters" })
      .toLowerCase()
      .trim(),

    password: StrongPassword.trim(),

    name: z
      .string()
      .max(100, { message: "Name must be under 100 characters" })
      .trim()
      .optional(),

    image: z
      .string()
      .url({ message: "Image must be a valid URL" })
      .max(300, { message: "Image URL must be under 300 characters" })
      .optional(),
  })
  .strict();

// Schema for user login
export const SigninSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Please enter a valid email address" })
      .toLowerCase()
      .trim(),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(100, { message: "Password must be under 100 characters" })
      .trim(),
  })
  .strict();

// Schema for creating a room
export const CreateRoomSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Room name is required" })
      .max(100, { message: "Room name must be under 100 characters" })
      .trim(),

    description: z
      .string()
      .max(300, { message: "Description must be under 300 characters" })
      .trim()
      .optional(),

    isPublic: z.boolean().default(true),
  })
  .strict();

// Schema for fetching messages from a room
export const GetMessagesSchema = z
  .object({
    id: z.string().uuid({ message: "Invalid room ID" }),
  })
  .strict();
