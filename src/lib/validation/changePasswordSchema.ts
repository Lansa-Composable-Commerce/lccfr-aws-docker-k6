import { z } from "zod";

export const changePasswordSchema = (
  t: (key: string, params?: Record<string, any>) => string,
) =>
  z
    .object({
      password: z
        .string()
        .min(1, t("MsgPasswordIsRequired"))
        .min(8, t("MsgPasswordMinimum")),
      confirmPassword: z.string(),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: t("MsgPasswordNotTheSame"),
        });
      }
    });
