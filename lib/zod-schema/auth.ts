import { z } from "zod";
import {
  zConfirmPassword,
  zEmail,
  zFirstName,
  zGender,
  zLastName,
  zPassword,
  zUsername,
} from ".";

const FAILED_CONFIRMATION_MESSAGE =
  "The password and confirm password do not match.";

export const passwordValidationSchemaBase = z.object({
  password: zPassword("Password"),
  confirmPassword: zConfirmPassword,
});

export const passwordValidationSchema = passwordValidationSchemaBase.refine(
  (arg) => {
    if (arg.confirmPassword !== arg.password) {
      return false;
    }
    return true;
  },
  {
    message: FAILED_CONFIRMATION_MESSAGE,
    path: ["confirmPassword"],
  }
);

export type PasswordValidationSchema = z.infer<typeof passwordValidationSchema>;

export const changePasswordValidationSchema = passwordValidationSchemaBase
  .extend({ currentPassword: zPassword("Current password") })
  .refine(
    (arg) => {
      if (arg.confirmPassword !== arg.password) {
        return false;
      }
      return true;
    },
    {
      message: FAILED_CONFIRMATION_MESSAGE,
      path: ["confirmPassword"],
    }
  );

export type ChangePasswordValidationSchema = z.infer<
  typeof changePasswordValidationSchema
>;

export const loginValidationSchema = z
  .object({
    password: zPassword("Password"),
    confirmPassword: zConfirmPassword,
    email: zEmail,
  })
  .refine(
    (arg) => {
      if (arg.confirmPassword !== arg.password) {
        return false;
      }
      return true;
    },
    {
      message: FAILED_CONFIRMATION_MESSAGE,
      path: ["confirmPassword"],
    }
  );

export type LoginValidationSchema = z.infer<typeof loginValidationSchema>;

export const signUpValidationSchema = z.object({
  lastName: zLastName,
  firstName: zFirstName,
  password: zPassword("Password"),
  username: zUsername,
  email: zEmail,
  gender: zGender,
});

export type SignUpValidationSchema = z.infer<typeof signUpValidationSchema>;
