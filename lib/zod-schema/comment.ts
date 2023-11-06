import { z } from "zod";
import { zText } from ".";
import { zImage } from "./image";

export const commentEditSchema = z.object({
  comment: zText("Comment"),
});

export type CommentEditSchema = z.infer<typeof commentEditSchema>;

export const createCommentSchema = z
  .object({
    comment: z.string(),
    image: zImage.optional(),
  })
  .refine(
    (arg) => {
      if (arg.image) return true;
      if ((arg.comment ?? "").length === 0) return false;
      return true;
    },
    { message: "Comment must not be empty.", path: ["comment"] }
  );

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
