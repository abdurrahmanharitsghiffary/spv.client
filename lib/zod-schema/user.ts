import { z } from "zod";
import { zFirstName, zGender, zLastName, zUsername } from ".";
import { zImage } from "./image";

export const editProfileValidationSchema = z.object({
  username: zUsername.optional(),
  firstName: zFirstName.optional(),
  lastName: zLastName.optional(),
  bio: z.string().optional(),
  profileImage: zImage.optional(),
  coverImage: zImage.optional(),
  gender: zGender,
});
export type EditProfileValidationSchema = z.infer<
  typeof editProfileValidationSchema
>;
