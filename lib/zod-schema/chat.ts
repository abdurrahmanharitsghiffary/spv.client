import { z } from "zod";
import { zText } from ".";
import { zImage } from "./image";

export const createChatSchema = z
  .object({
    chat: zText("Chat"),
    image: zImage.optional(),
  })
  .refine((arg) => {
    if (!arg.image) return true;
    if (!arg.chat) return false;
    return true;
  });

export type CreateChatSchema = z.infer<typeof createChatSchema>;
