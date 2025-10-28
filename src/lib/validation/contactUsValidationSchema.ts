import { z } from "zod";
import { validateRequiredPhone } from "@/lib/validation/phoneValidation";

export const contactUsValidationSchema = (
  t: (key: string, params?: Record<string, any>) => string,
) => {
  return z.object({
    customerFirstName: z.string().min(1, t("MsgFirstNameIsRequired")),
    customerLastName: z.string().min(1, t("MsgLastNameIsRequired")),
    customerEmailAddress: z
      .string()
      .min(1, t("MsgEmailIsRequired"))
      .email(t("MsgInvalidEmail")),
    customerContactNumber: z
      .string()
      .min(1, t("MsgPhoneNoRequired"))
      .refine(validateRequiredPhone, t("MsgInvalidPhoneNumber")),
    topicEmailAddress: z
      .string()
      .nullable()
      .refine((val) => val !== null && val !== "", t("MsgTopicIsRequired")),
    topicEmailName: z.string(),
    emailBody: z.string().min(1, t("MsgMessageIsRequired")),
    orderNumber: z.string(),
    invoiceNumber: z.string(),
  });
};
