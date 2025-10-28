import { z } from "zod";
import { validateRequiredPhone } from "@/lib/validation/phoneValidation";

export const accountInformationSchema = (
  t: (key: string, params?: Record<string, any>) => string,
) => {
  return z.object({
    userEmail: z
      .string()
      .min(1, t("MsgEmailIsRequired"))
      .email(t("MsgInvalidEmail")),
    firstName: z.string().min(1, t("MsgFirstNameIsRequired")),
    lastName: z.string().min(1, t("MsgLastNameIsRequired")),
    address1: z.string().min(1, t("MsgAddress1IsRequired")),
    address2: z.string(),
    country: z
      .string()
      .nullable()
      .refine((val) => val !== null && val !== "", t("MsgCountryIsRequired")),
    state: z
      .string()
      .nullable()
      .refine((val) => val !== null && val !== "", t("MsgStateIsRequired")),
    city: z.string().min(1, t("MsgCityIsRequired")),
    zip: z.string().min(1, t("MsgZipPostalCodeIsRequired")),
    phoneNumber: z
      .string()
      .min(1, t("MsgWorkPhoneIsRequired"))
      .refine(validateRequiredPhone, t("MsgInvalidPhoneNumber")),
    faxNumber: z.string(),
  });
};

export const subUserInformationSchema = (
  t: (key: string, params?: Record<string, any>) => string,
) => {
  return z
    .object({
      mode: z.string(),
      accountStatus: z.string().min(1, t("MsgAccountStatusIsRequired")),
      userId: z.string().min(1, t("MsgUserIdIsRequired")),
      email: z
        .string()
        .min(1, t("MsgEmailIsRequired"))
        .email(t("MsgInvalidEmail")),
      firstName: z.string().min(1, t("MsgFirstNameIsRequired")),
      lastName: z.string().min(1, t("MsgLastNameIsRequired")),
      workPhone: z
        .string()
        .min(1, t("MsgWorkPhoneIsRequired"))
        .refine(validateRequiredPhone, t("MsgInvalidPhoneNumber")),
      fax: z.string(),
      password: z
        .string()
        .min(1, t("MsgPasswordIsRequired"))
        .min(8, t("MsgPasswordMinimum")),
      verifyPassword: z.string(),
      inheritsSuperUserAccounts: z.string(),
    })
    .superRefine(({ password, verifyPassword }, ctx) => {
      if (verifyPassword !== password) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: t("MsgPasswordNotTheSame"),
        });
      }
    });
};

export const updateUserInformationSchema = (
  t: (key: string, params?: Record<string, any>) => string,
) => {
  return z.object({
    mode: z.string(),
    accountStatus: z.string().min(1, t("MsgAccountStatusIsRequired")),
    userId: z.string().min(1, t("MsgUserIdIsRequired")),
    email: z
      .string()
      .min(1, t("MsgEmailIsRequired"))
      .email(t("MsgInvalidEmail")),
    firstName: z.string().min(1, t("MsgFirstNameIsRequired")),
    lastName: z.string().min(1, t("MsgLastNameIsRequired")),
    workPhone: z
      .string()
      .min(1, t("MsgWorkPhoneIsRequired"))
      .refine(validateRequiredPhone, t("MsgInvalidPhoneNumber")),
    fax: z.string(),
    inheritsSuperUserAccounts: z.string(),
  });
};
