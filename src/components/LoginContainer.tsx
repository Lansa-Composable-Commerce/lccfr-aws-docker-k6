"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { MainTitle } from "@/components/globalUI/Typography";
import LoginForm from "@/components/LoginForm";

import { fadeInBottom } from "@/lib/framer-motion/fade-in-bottom";

import { Link } from "@/i18n/routing";
import { AlertError, AlertSuccess } from "@/components/ui/Alert";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectAuthState,
  setForgotPasswordStatus,
  setIsRegisterSuccess,
  setVerifyAccount,
  setVerifyLink,
} from "@/lib/features/auth/authSlice";
import { useClearAuthMessage } from "@/lib/hooks/useClearAuthMessage";
import Logo from "@/components/Logo";
import { selectStorefrontState } from "@/lib/features/storefront/storefrontSlice";

const LoginContainer = () => {
  const tLogin = useTranslations("Login");
  const tRegister = useTranslations("Register");
  const tForgotPassword = useTranslations("ForgotPass");
  const tMessages = useTranslations("Messages");

  const {
    verifyLink,
    verifyAccount,
    isResetPasswordSuccess,
    forgotPasswordStatus,
    isRegisterSuccess,
  } = useAppSelector(selectAuthState);
  const { storefrontName } = useAppSelector(selectStorefrontState);
  const dispatch = useAppDispatch();

  const clearMessages = useClearAuthMessage();

  const handleCloseForgotPasswordAlert = () => {
    dispatch(
      setForgotPasswordStatus({
        ...forgotPasswordStatus,
        isSuccess: false,
        email: "",
      }),
    );
  };

  const handleCloseVerifyLinkAlert = () =>
    dispatch(setVerifyLink({ ...verifyLink, isFailed: false }));

  const handleCloseVerifyAccountAlert = () =>
    dispatch(setVerifyAccount({ ...verifyAccount, isSuccess: false }));

  const handleCloseResetPasswordAlert = () =>
    dispatch(setIsRegisterSuccess(false));

  return (
    <>
      {forgotPasswordStatus.isSuccess && (
        <AlertSuccess
          message={tMessages(forgotPasswordStatus.code, {
            email: forgotPasswordStatus.email,
          })}
          title={tForgotPassword("CheckYourEmail")}
          containerClass="max-w-full mt-10"
          hasCloseIcon={true}
          close={handleCloseForgotPasswordAlert}
        />
      )}
      {verifyLink.isFailed && (
        <AlertError
          message={tMessages(verifyLink.code)}
          containerClass="max-w-full mt-10"
          hasCloseIcon={true}
          close={handleCloseVerifyLinkAlert}
        />
      )}
      {isResetPasswordSuccess && (
        <AlertSuccess
          message={tMessages("MsgPasswordChangeSuccessful")}
          containerClass="max-w-full mt-10"
          hasCloseIcon={true}
          close={handleCloseResetPasswordAlert}
        />
      )}
      {isRegisterSuccess && (
        <AlertSuccess
          title={`${tRegister("WelcomeTo")} ${storefrontName}`}
          message={tRegister("MsgPostRegister1")}
          containerClass="max-w-full mt-10"
          hasCloseIcon={true}
          close={handleCloseResetPasswordAlert}
        />
      )}
      {verifyAccount.isSuccess && (
        <AlertSuccess
          title={"Your account is verified!"}
          message={tMessages("MsgUserVerifySuccessful")}
          containerClass="max-w-full mt-10"
          hasCloseIcon={true}
          close={handleCloseVerifyAccountAlert}
        />
      )}
      <AnimatePresence>
        <motion.div
          layout
          initial="exit"
          animate="enter"
          exit="exit"
          variants={fadeInBottom("easeIn", 0.25)}
        >
          <div
            className={`flex flex-col items-center justify-center w-full ${forgotPasswordStatus.isSuccess ? "my-10" : "my-20"}`}
          >
            <div className="rounded-4xl px-4 lg:px-20 py-6 w-full max-w-[637px] shadow-card dark:bg-light-dark">
              <div className="relative flex justify-center items-center w-full">
                <Logo />
              </div>

              <div className="flex flex-col gap-2 lg:gap-4">
                <div className="text-center">
                  <MainTitle content={tLogin("Login")} />
                </div>
                <p className="text-center text-gray03 text-sm lg:text-base dark:text-gray-200">
                  {tLogin("MsgWelcome")}
                </p>
              </div>
              <LoginForm />

              <div className="flex justify-center items-center gap-1 pb-5">
                <p className="typography-text-sm text-gray03 dark:text-gray-300">
                  {tLogin("MsgNoAccount")}
                </p>
                <Link href="/register" onClick={clearMessages}>
                  <p className="register-text translate-05 dark:text-gray-300">
                    {tLogin("Register")}
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default LoginContainer;
