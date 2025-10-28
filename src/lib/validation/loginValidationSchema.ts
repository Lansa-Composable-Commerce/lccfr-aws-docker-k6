import { z } from "zod";

export const loginValidationSchema = (
  t: (key: string, params?: Record<string, any>) => string,
) => {
  return z.object({
    email: z
      .string()
      .min(1, t("MsgEmailIsRequired"))
      .email(t("MsgInvalidEmail")),
    password: z.string(),
  });
};
