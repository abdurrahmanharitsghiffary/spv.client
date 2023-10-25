import { z } from "zod";

export const password = z
  .string({ required_error: "Password is required" })
  .min(8, {
    message: "Password is must be at least 8 characters",
  })
  .max(22, { message: "Password is must not be higher than 22 chars" });

export const confirmPassword = z.string({
  required_error: "Password confirmation is required",
});

export const passwordValidationSchemaBase = z.object({
  password,
  confirmPassword,
});

export const passwordValidationSchema = passwordValidationSchemaBase.refine(
  (arg) => {
    if (arg.confirmPassword !== arg.password) {
      return false;
    }
    return true;
  },
  {
    message: "Confirm password and password does not match",
    path: ["confirmPassword"],
  }
);

export type PasswordValidationSchema = z.infer<typeof passwordValidationSchema>;

export const changePasswordValidationSchema = passwordValidationSchemaBase
  .extend({ currentPassword: password })
  .refine(
    (arg) => {
      if (arg.confirmPassword !== arg.password) {
        return false;
      }
      return true;
    },
    {
      message: "Confirm password and password does not match",
      path: ["confirmPassword"],
    }
  );

export type ChangePasswordValidationSchema = z.infer<
  typeof changePasswordValidationSchema
>;
