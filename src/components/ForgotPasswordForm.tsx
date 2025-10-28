"use client";

import { AnimatePresence, motion } from "framer-motion";
import { fadeInBottom } from "@/lib/framer-motion/fade-in-bottom";

import { MainTitle } from "@/components/globalUI/Typography";
import Input from "@/components/globalUI/Input";
import Button from "@/components/globalUI/Button";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { FieldError, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordValidationSchema } from "@/lib/validation/forgotPasswordValidationSchema";
import { useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import { forgotPassword } from "@/app/[locale]/(pages)/(auth)/forgot-password/actions";
import { SvgArrowPath } from "@/assets/svg";
import { useAppDispatch } from "@/lib/hooks";
import { setForgotPasswordStatus } from "@/lib/features/auth/authSlice";
import Logo from "@/components/Logo";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const tForgotPassword = useTranslations("ForgotPass");
  const tValidation = useTranslations("Validation");

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: zodResolver(forgotPasswordValidationSchema(tValidation)),
  });

  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    setIsLoading(true);

    const response = await forgotPassword(data);
    const messageCode =
      response?.data.messages[0].code || "MsgForgotPasswordSuccess";

    dispatch(
      setForgotPasswordStatus({
        isSuccess: true,
        code: messageCode,
        email: data.email,
      }),
    );

    router.push("/login");
    setIsLoading(false);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="exit"
        animate="enter"
        exit="exit"
        variants={fadeInBottom("easeIn", 0.25)}
        className="w-full max-w-[637px]"
      >
        <section className="border border-white02 rounded-4xl px-4 lg:px-20 py-6 w-full ">
          <div className="flex justify-center items-center w-full">
            <Logo />
          </div>
          <div className="text-center mb-8">
            <MainTitle content={tForgotPassword("ForgotPassword")} />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="flex flex-col gap-y-5">
              <div className="w-full flex flex-col gap-1">
                <label htmlFor="emailAddress" className="form-label">
                  {tForgotPassword("EmailAddress")}
                  <span className="asterisk-required"> *</span>
                </label>
                <Input
                  id="emailAddress"
                  type="email"
                  {...register("email")}
                  placeholder={tForgotPassword("PlhEmail")}
                  invalid={!!errors.email}
                  maxLength={50}
                />
                {errors.email && (
                  <ErrorMessage
                    message={(errors.email as FieldError)?.message}
                  />
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full lg:py-4.5 translate-05"
                disabled={isLoading}
              >
                {isLoading ? (
                  <SvgArrowPath className="animate-spin size-6" />
                ) : (
                  <span className="text-base lg:text-xl uppercase tracking-wider">
                    {tForgotPassword("ResetPassword")}
                  </span>
                )}
              </Button>
            </div>
          </form>
          <div className="flex justify-center items-center gap-1 mt-4 pb-5">
            <p className="typography-text-sm text-gray03 dark:text-gray-300">
              {tForgotPassword("MsgNoAccount")}
            </p>
            <Link href="/register">
              <p className="register-text">{tForgotPassword("Register")}</p>
            </Link>
          </div>
        </section>
      </motion.div>
    </AnimatePresence>
  );
}
