import { z } from "zod";
import { zText, zTitle } from ".";
import { zPostImages } from "./image";

export const createPostValidationSchema = z.object({
  title: zTitle,
  content: zText("Content"),
  images: zPostImages.optional(),
});

export type CreatePostValidationSchema = z.infer<
  typeof createPostValidationSchema
>;

export const updatePostSchema = z.object({
  title: zTitle,
  content: zText("Content").optional(),
  images: zPostImages.optional(),
});

export type UpdatePostSchema = z.infer<typeof updatePostSchema>;
