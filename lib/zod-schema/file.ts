import { z } from "zod";
import { formatBytes } from "../formatBytes";
import { MimeType } from "@/types/mime";

export const MAX_FILE_SIZE = 300000;

const getImageTypes = (t: MimeType[]) =>
  t.map((type) => `.${type.split("/")[1]}`).join(", ");

const getMaxSizes = (mx?: number) => mx ?? MAX_FILE_SIZE;

export const zFile = (accept: MimeType[], mx?: number) =>
  z
    .any()
    .refine(
      (file: File) =>
        file instanceof File || file === null || file === undefined,
      "Invalid File"
    )
    .refine(
      (file: File) =>
        file?.size < getMaxSizes(mx) || file === null || file === undefined,
      `The file exceeds the maximum allowed size, file size must be equals to ${formatBytes(
        getMaxSizes(mx),
        "kb"
      )}kb or fewer. Please upload a smaller image.`
    )
    .refine(
      (file: File) =>
        accept.includes(file?.type as any) ||
        file === null ||
        file === undefined,
      `Invalid file mime types, accepted types: ${getImageTypes(accept)}`
    );

export const zFiles = (accept: MimeType[], mx?: number) =>
  z
    .any()
    .refine(
      (files) => files instanceof FileList || files instanceof Array,
      "Invalid field value."
    )
    .refine(
      (files) =>
        Array.from((files as FileList) ?? []).every(
          (file: File) => file.size <= getMaxSizes(mx)
        ),
      `The file exceeds the maximum allowed size, each files size must be equals to ${formatBytes(
        getMaxSizes(mx),
        "kb"
      )}kb or fewer.`
    )
    .refine(
      (files) =>
        Array.from((files as FileList) ?? []).every((file: File) =>
          accept.includes(file?.type as any)
        ),
      `Invalid file mime types, accepted types: ${getImageTypes(accept)}`
    );
