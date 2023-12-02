import { z } from "zod";
import { zImage } from "./image";

export const createChatSchema = z
  .object({
    chat: z.string().optional(),
    image: zImage.optional(),
  })
  .refine(
    (arg) => {
      if (arg.image) return true;
      if (!arg.chat) return false;
      return true;
    },
    { message: "Chat must not be empty.", path: ["chat"] }
  );

export type CreateChatSchema = z.infer<typeof createChatSchema>;
