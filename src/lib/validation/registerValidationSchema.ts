import { z } from "zod";
import {
  validateOptionalPhone,
  validateRequiredPhone,
} from "@/lib/validation/phoneValidation";

export const registerValidationSchema = (
  t: (key: string, params?: Record<string, any>) => string,
) => {
  return z
    .object({
      companyName: z.string().min(1, t("MsgCompanyIsRequired")),
      userId: z.string().min(1, t("MsgUserIdIsRequired")),
      password: z
        .string()
        .min(1, t("MsgPasswordIsRequired"))
        .min(8, t("MsgPasswordMinimum")),
      confirmPassword: z.string().min(1, t("MsgConfirmPasswordIsRequired")),
      email: z
        .string()
        .min(1, t("MsgEmailIsRequired"))
        .email(t("MsgInvalidEmail")),
      firstName: z.string().min(1, t("MsgFirstNameIsRequired")),
      lastName: z.string().min(1, t("MsgLastNameIsRequired")),
      referral: z.string().nullable(),
      addressLine1: z.string().min(1, t("MsgAddress1IsRequired")),
      addressLine2: z.string(),
      country: z
        .string()
        .nullable()
        .refine((val) => val !== null && val !== "", t("MsgCountryIsRequired")),
      state: z
        .string()
        .nullable()
        .refine((val) => val !== null && val !== "", t("MsgStateIsRequired")),
      city: z.string().min(1, t("MsgCityIsRequired")),
      postalCode: z.string().min(1, t("MsgZipPostalCodeIsRequired")),
      workPhone: z
        .string()
        .min(1, t("MsgWorkPhoneIsRequired"))
        .refine(validateRequiredPhone, t("MsgInvalidPhoneNumber")),
      mobileNumber: z
        .string()
        .refine(validateOptionalPhone, t("MsgInvalidPhoneNumber")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("MsgPasswordNotTheSame"),
      path: ["confirmPassword"],
    });
};
