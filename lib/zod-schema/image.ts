import { z } from "zod";
import { formatBytes } from "../formatBytes";

export const MAX_FILE_SIZE = 300000;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const getImageTypes = () =>
  ACCEPTED_IMAGE_TYPES.map((type) => `.${type.split("/")[1]}`).join(", ");

export const zImage = z
  .any()
  .refine(
    (file: File) => file instanceof File || file === null || file === undefined,
    "Image must be a file"
  )
  .refine(
    (file: File) =>
      file?.size < MAX_FILE_SIZE || file === null || file === undefined,
    `The image exceeds the maximum allowed size, image size must be equals to ${formatBytes(
      MAX_FILE_SIZE,
      "kb"
    )}kb or fewer. Please upload a smaller image.`
  )
  .refine(
    (file: File) =>
      ACCEPTED_IMAGE_TYPES.includes(file?.type) ||
      file === null ||
      file === undefined,
    `Invalid file mime types, accepted types: ${getImageTypes()}`
  );

export const zImages = z
  .any()
  .refine(
    (files) => files instanceof FileList || files instanceof Array,
    "Invalid field value."
  )
  .refine(
    (files) =>
      Array.from((files as FileList) ?? []).every(
        (file: File) => file.size <= MAX_FILE_SIZE
      ),
    `The image exceeds the maximum allowed size, each images size must be equals to ${formatBytes(
      MAX_FILE_SIZE,
      "kb"
    )}kb or fewer.`
  )
  .refine(
    (files) =>
      Array.from((files as FileList) ?? []).every((file: File) =>
        ACCEPTED_IMAGE_TYPES.includes(file?.type)
      ),
    `Invalid file mime types, accepted types: ${getImageTypes()}`
  );
