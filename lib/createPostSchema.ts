// import { z } from "zod";
// import { formatBytes } from "./formatBytes";

// export const MAX_FILE_SIZE = 300000;
// export const ACCEPTED_IMAGE_TYPES = [
//   "image/jpeg",
//   "image/jpg",
//   "image/png",
//   "image/webp",
// ];

// export const createPostValidationSchema = z.object({
//   title: z.string().max(40, { message: "Title is to long" }).optional(),
//   content: z.string().nonempty({ message: "Post content is required" }),
//   images: z
//     .any()
//     .refine(
//       (files) => files instanceof FileList || files instanceof Array,
//       "Invalid field value."
//     )
//     .refine(
//       (files) =>
//         Array.from((files as FileList) ?? []).every(
//           (file: File) => file.size <= MAX_FILE_SIZE
//         ),
//       `Max file size of each images is ${formatBytes(MAX_FILE_SIZE, "mb")}Mb.`
//     )
//     .refine(
//       (files) =>
//         Array.from((files as FileList) ?? []).every((file: File) =>
//           ACCEPTED_IMAGE_TYPES.includes(file?.type)
//         ),
//       ".jpg, .jpeg, .png files are accepted."
//     )
//     .optional(),
// });

// export type CreatePostValidationSchema = z.infer<
//   typeof createPostValidationSchema
// >;
