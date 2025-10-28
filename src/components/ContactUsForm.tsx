"use client";

import { fadeInBottom } from "@/lib/framer-motion/fade-in-bottom";
import { AnimatePresence, motion } from "framer-motion";
import Input from "@/components/globalUI/Input";
import ErrorMessage from "@/components/ErrorMessage";
import {
  Controller,
  FieldError,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import React, { useEffect, useState } from "react";
import SelectDropdownWithPlaceholder from "@/components/globalUI/SelectDropdown";
import TextArea from "@/components/globalUI/TextArea";
import Button from "@/components/globalUI/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactUsInformation } from "@/types/ContactUs";
import { contactUsValidationSchema } from "@/lib/validation/contactUsValidationSchema";
import { useTranslations } from "next-intl";
import { SelectOption } from "@/types";
import { contactUs } from "@/app/[locale]/(pages)/(page-route)/(public)/contact-us/actions";
import { showToast } from "@/components/globalUI/CustomToast";
import { SvgArrowPath } from "@/assets/svg";
import { AlertSuccess } from "@/components/ui/Alert";
import { useAppSelector } from "@/lib/hooks";
import { selectAuthState } from "@/lib/features/auth/authSlice";
import InputPhone from "@/components/InputPhone";
import { primaryCountries } from "@/utils";

export default function ContactUsForm({ topics }: { topics: SelectOption[] }) {
  const tContactUs = useTranslations("ContactUs");
  const tMessage = useTranslations("Messages");
  const tValidation = useTranslations("Validation");
  const tRegister = useTranslations("Register");

  const { user } = useAppSelector(selectAuthState);

  const [selectedTopic, setSelectedTopic] = useState<SelectOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ContactUsInformation>({
    defaultValues: {
      customerContactNumber: "+1",
    },
    resolver: zodResolver(contactUsValidationSchema(tValidation)),
  });

  const onSubmit: SubmitHandler<ContactUsInformation> = async (data) => {
    setIsLoading(true);

    const response = await contactUs(data);

    if (response && response.statusCode !== 200) {
      const errorMessage: { code: string } = response.data.messages[0];

      showToast("error", tValidation(errorMessage.code || "MsgDefaultError"));
    } else {
      const successMessage: { code: string } = response?.data.messages[0];

      setSuccessMessage(successMessage.code || "MsgDefaultSuccess");
      setOpenToast(true);
      setSelectedTopic(null);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      setValue("customerFirstName", user.firstname);
      setValue("customerLastName", user.lastname);
      setValue("customerEmailAddress", user.email);
    }
  }, [user]);

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({
        customerFirstName: user?.firstname ?? "",
        customerLastName: user?.lastname ?? "",
        customerEmailAddress: user?.email ?? "",
        customerContactNumber: "+1",
        topicEmailAddress: "",
        invoiceNumber: "",
        orderNumber: "",
        emailBody: "",
      });
    }
  }, [formState.isSubmitSuccessful, reset, user]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="exit"
        animate="enter"
        exit="exit"
        variants={fadeInBottom("easeIn", 0.25)}
        className="w-full"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          role="form"
          className="flex flex-col gap-6 shadow-md rounded-xl border p-8"
        >
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="w-full flex flex-col gap-1">
              <label htmlFor="firstName" className="form-label">
                {tContactUs("FirstName")}
                <span className="asterisk-required"> *</span>
              </label>
              <div className="flex flex-col gap-1">
                <Input
                  id="firstName"
                  type="text"
                  {...register("customerFirstName")}
                  placeholder={tContactUs("PlhFirstName")}
                  invalid={!!errors.customerFirstName}
                  autoComplete="off"
                />
                {errors.customerFirstName && (
                  <ErrorMessage
                    message={(errors.customerFirstName as FieldError)?.message}
                  />
                )}
              </div>
            </div>
            <div className="w-full flex flex-col gap-1">
              <label htmlFor="lastName" className="form-label">
                {tContactUs("LastName")}
                <span className="asterisk-required"> *</span>
              </label>
              <div className="flex flex-col gap-1">
                <Input
                  id="lastName"
                  type="text"
                  {...register("customerLastName")}
                  placeholder={tContactUs("PlhLastName")}
                  invalid={!!errors.customerLastName}
                  autoComplete="off"
                />
                {errors.customerLastName && (
                  <ErrorMessage
                    message={(errors.customerLastName as FieldError)?.message}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="w-full flex flex-col gap-1">
              <label htmlFor="customerContactNumber" className="form-label">
                {tRegister("WorkPhone")}
                <span className="asterisk-required"> *</span>
              </label>
              <div className="flex flex-col gap-1">
                <Controller
                  name="customerContactNumber"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <InputPhone
                        id="customerContactNumber"
                        phoneNumber={value}
                        onChange={onChange}
                        hideDropdown={false}
                        countries={primaryCountries}
                        invalid={!!errors.customerContactNumber}
                      />
                    );
                  }}
                />
                {/*  <Input
                  id="phoneNumber"
                  type="text"
                  {...register("customerContactNumber")}
                  placeholder={tContactUs("PlhPhone")}
                  invalid={!!errors.customerContactNumber}
                  autoComplete="off"
                />*/}
                {errors.customerContactNumber && (
                  <ErrorMessage
                    message={
                      (errors.customerContactNumber as FieldError)?.message
                    }
                  />
                )}
              </div>
            </div>
            <div className="w-full flex flex-col gap-1">
              <label htmlFor="email" className="form-label">
                {tContactUs("Email")}
                <span className="asterisk-required"> *</span>
              </label>
              <div className="flex flex-col gap-1">
                <Input
                  id="email"
                  type="email"
                  {...register("customerEmailAddress")}
                  placeholder={tContactUs("PlhEmail")}
                  invalid={!!errors.customerEmailAddress}
                  autoComplete="off"
                />
                {errors.customerEmailAddress && (
                  <ErrorMessage
                    message={
                      (errors.customerEmailAddress as FieldError)?.message
                    }
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="w-full flex flex-col gap-1">
              <label htmlFor="orderNumber" className="form-label">
                {tContactUs("OrderNumber")}
              </label>
              <Input
                id="orderNumber"
                type="text"
                {...register("orderNumber")}
                placeholder={tContactUs("PlhContactOrderNumber")}
                autoComplete="off"
              />
            </div>
            <div className="w-full flex flex-col gap-1">
              <label htmlFor="invoiceNumber" className="form-label">
                {tContactUs("InvoiceNumber")}
              </label>
              <Input
                id="invoiceNumber"
                type="text"
                {...register("invoiceNumber")}
                placeholder={tContactUs("PlhInvoiceNumber")}
                autoComplete="off"
              />
            </div>
          </div>
          <div>
            <Controller
              name="topicEmailAddress"
              control={control}
              render={({ field }) => {
                return (
                  <SelectDropdownWithPlaceholder
                    selectName={tContactUs("Topic")}
                    placeholder={tContactUs("SelectTopic")}
                    options={topics}
                    useUrl={false}
                    selectedOption={selectedTopic}
                    invalid={!!errors.topicEmailAddress}
                    isRequired={true}
                    setSelectedOption={(option: SelectOption) => {
                      setSelectedTopic(option);
                      field.onChange(option ? option.value : null);
                      setValue("topicEmailName", option.label);
                    }}
                  />
                );
              }}
            />
            {errors.topicEmailAddress && (
              <ErrorMessage
                message={(errors.topicEmailAddress as FieldError)?.message}
              />
            )}
          </div>
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="message" className="form-label">
              {tContactUs("Message")}
              <span className="asterisk-required"> *</span>
            </label>
            <TextArea
              id="message"
              aria-label="Additional Notes"
              {...register("emailBody")}
              placeholder={tContactUs("PlhMessage")}
              className="min-h-32 w-full"
              invalid={!!errors.emailBody}
            />
            {errors.emailBody && (
              <ErrorMessage
                message={(errors.emailBody as FieldError)?.message}
              />
            )}
          </div>
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? (
              <SvgArrowPath className="animate-spin size-6" />
            ) : (
              <p className="uppercase tracking-wider">{tContactUs("Send")}</p>
            )}
          </Button>
          {openToast && (
            <AlertSuccess
              message={tMessage(successMessage)}
              hasCloseIcon={true}
              containerClass="max-w-full"
              close={() => setOpenToast(false)}
            />
          )}
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
