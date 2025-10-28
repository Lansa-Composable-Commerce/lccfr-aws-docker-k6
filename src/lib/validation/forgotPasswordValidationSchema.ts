import { z } from "zod";

export const forgotPasswordValidationSchema = (
  t: (key: string, params?: Record<string, any>) => string,
) => {
  return z.object({
    email: z
      .string()
      .min(1, t("MsgEmailIsRequired"))
      .email(t("MsgInvalidEmail")),
  });
};

export const resetPasswordValidationSchema = (
  t: (key: string, params?: Record<string, any>) => string,
) => {
  return z
    .object({
      password: z
        .string()
        .min(1, t("MsgPasswordIsRequired"))
        .min(8, t("MsgPasswordMinimum")),
      confirmPassword: z.string().min(1, t("MsgConfirmPasswordIsRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("MsgPasswordNotTheSame"),
      path: ["confirmPassword"],
    });
};
