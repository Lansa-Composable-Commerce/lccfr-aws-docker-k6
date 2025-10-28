"use client";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SfIconVisibility, SfIconVisibilityOff } from "@storefront-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/components/globalUI/Input";
import Button from "@/components/globalUI/Button";
import ErrorMessage from "@/components/ErrorMessage";

import { SvgSpinner } from "@/assets/svg";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { loginValidationSchema } from "@/lib/validation/loginValidationSchema";
import { showToast } from "@/components/globalUI/CustomToast";
import { useLoginMutation } from "@/services/authApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Message } from "@/types";
import { useClearAuthMessage } from "@/lib/hooks/useClearAuthMessage";
import { useSearchParams } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tLogin = useTranslations("Login");
  const tValidation = useTranslations("Validation");
  const tMessage = useTranslations("Messages");

  const clearMessages = useClearAuthMessage();
  const [login, { isLoading }] = useLoginMutation();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl");

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  type Inputs = {
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(loginValidationSchema(tValidation)),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const payload = {
      Email: data.email.toLowerCase(),
      Password: data.password,
    };

    const response = await login(payload);

    if (response.error) {
      const error = response.error as FetchBaseQueryError;
      const data = error.data as unknown as { messages: Message[] };
      const errorCode = data.messages[0].code || "MsgDefaultError";

      return showToast("error", tValidation(errorCode));
    }

    const redirectTo = callbackUrl
      ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/";

    router.replace(`/accounts${redirectTo}`);
    clearMessages();
    showToast("success", tMessage("MsgLoginSuccessful"));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1 w-full my-6">
        <div className="w-full flex flex-col gap-1 my-2">
          <span className="form-label">{tLogin("EmailAddress")}</span>
          <Input
            id="email"
            type="text"
            {...register("email")}
            className="py-3 lg:py-4 lg:text-lg"
            placeholder={tLogin("PlhEmail")}
            aria-label="email address"
          />
          {errors.email && <ErrorMessage message={errors.email?.message} />}
        </div>
        <div className="flex flex-col">
          <div className="w-full flex flex-col gap-1 my-2">
            <span className="capitalize form-label">{tLogin("Password")}</span>
            <Input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              {...register("password")}
              className="py-3 lg:py-4 lg:text-lg"
              slotSuffix={
                isPasswordVisible ? (
                  <SfIconVisibility
                    color="#808080"
                    onClick={handleTogglePasswordVisibility}
                    className="mx-4 cursor-pointer size-6 dark:text-gray-400"
                  />
                ) : (
                  <SfIconVisibilityOff
                    color="#808080"
                    onClick={handleTogglePasswordVisibility}
                    className="mx-4 cursor-pointer size-6 dark:text-gray-400"
                  />
                )
              }
              placeholder="*********"
              aria-label="password"
            />
          </div>
          <Link href="/forgot-password" onClick={clearMessages}>
            <p className="text-gray03 form-label text-right hover:text-black01 cursor-pointer text-sm dark:text-gray-400">
              {tLogin("ForgotPassword")}?
            </p>
          </Link>
        </div>
        <div className="mt-6 w-full">
          <Button
            type="submit"
            size="lg"
            className="w-full lg:py-4.5 translate-05"
            disabled={isLoading}
          >
            {isLoading ? (
              <SvgSpinner />
            ) : (
              <p className="text-base lg:text-xl uppercase tracking-wider">
                {tLogin("Login")}
              </p>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
