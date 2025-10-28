"use client";

import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";

import { fadeInBottom } from "@/lib/framer-motion/fade-in-bottom";

import { MainTitle } from "@/components/globalUI/Typography";
import Input from "@/components/globalUI/Input";
import Button from "@/components/globalUI/Button";
import { useEffect, useState } from "react";
import { FieldError, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordValidationSchema } from "@/lib/validation/forgotPasswordValidationSchema";
import { SfIconVisibility, SfIconVisibilityOff } from "@storefront-ui/react";
import ErrorMessage from "@/components/ErrorMessage";
import { SvgArrowPath } from "@/assets/svg";
import { useRouter } from "@/i18n/routing";
import { resetPassword } from "@/app/[locale]/(pages)/(auth)/reset-password/actions";
import { showToast } from "@/components/globalUI/CustomToast";
import { useAppDispatch } from "@/lib/hooks";
import {
  setIsResetPasswordSuccess,
  setVerifyLink,
} from "@/lib/features/auth/authSlice";
import Spinner from "@/components/loading/Spinner";
import { Message } from "@/types";
import Logo from "@/components/Logo";

type Response = {
  status: number;
  data: { messages: Message[] };
};

type ResetPasswordFormPropType = {
  response: Response;
};

export default function ResetPasswordForm({
  response,
}: ResetPasswordFormPropType) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const tForgotPassword = useTranslations("ForgotPass");
  const tValidation = useTranslations("Validation");

  const [isVerifying, setIsVerifying] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prevState) => !prevState);
  };

  const {
    register: resetPasswordRegister,
    handleSubmit: resetPasswordSubmit,
    formState: { errors: resetPasswordErrors },
    reset: resetResetPasswordForm,
  } = useForm<{ password: string; confirmPassword: string }>({
    resolver: zodResolver(resetPasswordValidationSchema(tValidation)),
  });

  const onResetPassword: SubmitHandler<{
    password: string;
    confirmPassword: string;
  }> = async (data) => {
    setIsLoading(true);

    const response = await resetPassword(data);

    if (response && response.status !== 200) {
      const errorMessage = response.data.messages[0];

      showToast("error", tValidation(errorMessage.code || "MsgDefaultError"));
    } else {
      dispatch(setIsResetPasswordSuccess(true));
      router.replace("/login");
    }

    resetResetPasswordForm();
    setIsLoading(false);
  };

  useEffect(() => {
    if (response && response.status !== 200) {
      dispatch(
        setVerifyLink({
          isFailed: true,
          code: response.data.messages[1].code || "MsgDefaultError",
        }),
      );
      router.replace("/login");
    }

    setTimeout(() => setIsVerifying(false), 1000);
  }, [response]);

  if (isVerifying) {
    return <Spinner />;
  }

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
            <MainTitle content={tForgotPassword("ResetPassword")} />
          </div>
          <form
            onSubmit={resetPasswordSubmit(onResetPassword)}
            autoComplete="off"
          >
            <div className="flex flex-col gap-y-5">
              <div className="w-full flex flex-col gap-1">
                <label htmlFor="password" className="form-label">
                  {tForgotPassword("Password")}
                  <span className="asterisk-required"> *</span>
                </label>
                <Input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  {...resetPasswordRegister("password")}
                  placeholder="********"
                  invalid={!!resetPasswordErrors.password}
                  autoComplete="new-password"
                  maxLength={20}
                  slotSuffix={
                    isPasswordVisible ? (
                      <SfIconVisibility
                        color="#808080"
                        onClick={handleTogglePasswordVisibility}
                        className="mx-4 cursor-pointer size-6"
                        data-testid="password-visibility-on"
                        aria-label="Show password"
                      />
                    ) : (
                      <SfIconVisibilityOff
                        color="#808080"
                        onClick={handleTogglePasswordVisibility}
                        className="mx-4 cursor-pointer size-6"
                        data-testid="password-visibility-off"
                        aria-label="Hide password"
                      />
                    )
                  }
                />
                {resetPasswordErrors.password && (
                  <ErrorMessage
                    message={
                      (resetPasswordErrors.password as FieldError)?.message
                    }
                  />
                )}
              </div>
              <div className="w-full flex flex-col gap-1">
                <label htmlFor="confirmPassword" className="form-label">
                  {tForgotPassword("ConfirmPassword")}
                  <span className="asterisk-required"> *</span>
                </label>
                <Input
                  id="confirmPassword"
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  {...resetPasswordRegister("confirmPassword")}
                  placeholder="********"
                  invalid={!!resetPasswordErrors.confirmPassword}
                  autoComplete="new-password"
                  maxLength={20}
                  slotSuffix={
                    isConfirmPasswordVisible ? (
                      <SfIconVisibility
                        color="#808080"
                        onClick={handleToggleConfirmPasswordVisibility}
                        className="mx-4 cursor-pointer size-6"
                        data-testid="confirm-password-visibility-on"
                        aria-label="Show confirm password"
                      />
                    ) : (
                      <SfIconVisibilityOff
                        color="#808080"
                        onClick={handleToggleConfirmPasswordVisibility}
                        className="mx-4 cursor-pointer size-6"
                        data-testid="confirm-password-visibility-off"
                        aria-label="Hide confirm password"
                      />
                    )
                  }
                />
                {resetPasswordErrors.confirmPassword && (
                  <ErrorMessage
                    message={
                      (resetPasswordErrors.confirmPassword as FieldError)
                        ?.message
                    }
                  />
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full lg:py-4.5 translate-05 mb-5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <SvgArrowPath className="animate-spin size-6" />
                ) : (
                  <h3 className="text-base lg:text-xl uppercase tracking-wider">
                    {tForgotPassword("UpdatePassword")}
                  </h3>
                )}
              </Button>
            </div>
          </form>
        </section>
      </motion.div>
    </AnimatePresence>
  );
}
