import { z } from "zod";
import { zText, zTitle } from ".";
import { zImages } from "./image";

export const createPostValidationSchema = z.object({
  title: zTitle,
  content: zText("Content"),
  images: zImages.optional(),
});

export type CreatePostValidationSchema = z.infer<
  typeof createPostValidationSchema
>;

export const updatePostSchema = z.object({
  title: zTitle,
  content: zText("Content").optional(),
  images: zImages.optional(),
});

export type UpdatePostSchema = z.infer<typeof updatePostSchema>;
