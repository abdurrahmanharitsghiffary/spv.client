import { z } from "zod";
import { zImage } from "./image";

export const zChatMessage = z
  .string({ required_error: "Message must not be empty." })
  .min(1, { message: "Message must be at least 1 characters long." });

export const createChatSchema = z
  .object({
    chat: z.string().optional(),
    images: zImage.array().optional(),
  })
  .refine(
    (arg) => {
      if ((arg.images ?? []).length > 0) return true;
      if (!arg.chat) return false;
      return true;
    },
    { message: "Chat must not be empty.", path: ["chat"] }
  );

export type CreateChatSchema = z.infer<typeof createChatSchema>;
