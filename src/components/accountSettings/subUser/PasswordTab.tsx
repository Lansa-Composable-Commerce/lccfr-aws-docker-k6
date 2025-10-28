import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SfIconVisibility, SfIconVisibilityOff } from "@storefront-ui/react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/components/globalUI/Input";
import Button from "@/components/globalUI/Button";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { changePasswordSchema } from "@/lib/validation/changePasswordSchema";
import { selectSelectedSubUser } from "@/lib/features/subUser/subUserSlice";
import {
  removeMessageState,
  selectIsLoading,
  updatePassword,
} from "@/lib/features/changePassword/changePasswordSlice";

import { ChangePasswordFormData } from "@/types";

const PasswordTab = () => {
  const tRegister = useTranslations("Register");
  const tValidation = useTranslations("Validation");
  const tUsrSetting = useTranslations("UsrSetting");

  const dispatch = useAppDispatch();
  const selectedSubUser = useAppSelector(selectSelectedSubUser);
  const isLoading = useAppSelector(selectIsLoading);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema(tValidation)),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    const payload = {
      LW3USRNPW: data.password,
      LW3USRPS2: data.password,
      LW3SUBUSR: selectedSubUser?.subUserId,
    };

    await dispatch(updatePassword(payload));
    dispatch(removeMessageState());
    reset();
  };

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-2">
      <h1 className="my-3 text-center text-xl font-medium capitalize">
        {tUsrSetting("ChangePassword")}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-2 flex flex-col md:flex-row md:gap-5 mt-4">
          <div className="w-full flex flex-col gap-1 my-2">
            <span className="capitalize form-label">
              {tRegister("Password")}
            </span>
            <div>
              <Input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                className="w-full"
                placeholder=""
                {...register("password")}
                aria-label="password"
                autoComplete="new-password"
                invalid={!!errors.password}
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
            </div>
            <div className="">
              {errors.password && (
                <span className=" text-red-500 text-xs md:text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col gap-1 my-2">
            <span className="capitalize form-label">
              {tRegister("ConfirmPassword")}
            </span>
            <div>
              <Input
                id="confirm-password"
                type={isConfirmPasswordVisible ? "text" : "password"}
                className="w-full"
                placeholder=""
                {...register("confirmPassword")}
                aria-label="confirm-password"
                invalid={!!errors.confirmPassword}
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
            </div>
            <div className="">
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs md:text-sm">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-end mt-4 gap-5">
          <div className="hidden lg:block w-full">&nbsp;</div>
          <Button
            size="lg"
            className="w-full lg:py-4.5 lg:max-w-xs "
            type="submit"
            disabled={isLoading}
            aria-label="save"
          >
            {isLoading ? (
              <p className="btn-text">{tUsrSetting("Saving")}...</p>
            ) : (
              <p className="btn-text">{tUsrSetting("Save")}</p>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PasswordTab;
