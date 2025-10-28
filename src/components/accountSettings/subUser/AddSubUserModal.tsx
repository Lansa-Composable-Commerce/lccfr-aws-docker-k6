import React, { useState } from "react";
import {
  Controller,
  FieldError,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import {
  SfCheckbox,
  SfIconVisibility,
  SfIconVisibilityOff,
} from "@storefront-ui/react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/globalUI/Button";
import Input from "@/components/globalUI/Input";
import ErrorMessage from "@/components/ErrorMessage";
import InputPhone from "@/components/InputPhone";
import { showToast } from "@/components/globalUI/CustomToast";
import SelectDropdownWithPlaceholder from "@/components/globalUI/SelectDropdown";
import Modal from "@/components/globalUI/Modal";

import { subUserInformationSchema } from "@/lib/validation/accountInformationSchema";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectAddSubUserModalVisible,
  setAddSubUserModalVisible,
  updateSubUserInformation,
} from "@/lib/features/subUser/subUserSlice";
import { reFetchAccountSettings } from "@/lib/hooks/refetchAccountSettings";

import { primaryCountries } from "@/utils";

import { SelectOption, SubUserInfo } from "@/types";

const AddSubUserModal = () => {
  const dispatch = useAppDispatch();

  const tValidation = useTranslations("Validation");
  const tRegister = useTranslations("Register");
  const tUsrSetting = useTranslations("UsrSetting");

  const isAddSubUSerModalVisible = useAppSelector(selectAddSubUserModalVisible);

  const accountStatusOption = [
    {
      label: tUsrSetting("Active"),
      value: "A",
    },
    {
      label: tUsrSetting("InActive"),
      value: "I",
    },
    {
      label: tUsrSetting("Suspended"),
      value: "S",
    },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<SubUserInfo>({
    defaultValues: {
      mode: "Add",
      inheritsSuperUserAccounts: "N",
    },
    resolver: zodResolver(subUserInformationSchema(tValidation)),
  });

  const onSubmit: SubmitHandler<SubUserInfo> = async (data) => {
    const payload = {
      ...data,
      accountStatus: selectedAccountStatus?.value || "A",
    };
    try {
      setIsLoading(true);
      const res = await dispatch(updateSubUserInformation(payload));

      if (res.meta.requestStatus === "fulfilled") {
        showToast("success", tValidation(res?.payload.messages));
        await reFetchAccountSettings();
        dispatch(setAddSubUserModalVisible());
        reset();
      }
      if (res.meta.requestStatus === "rejected") {
        showToast("error", tValidation(res?.payload.messages));
      }
    } catch (error: any) {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const [selectedAccountStatus, setSelectedAccountStatus] =
    useState<SelectOption | null>();
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

  return (
    <Modal
      isOpen={isAddSubUSerModalVisible}
      close={() => dispatch(setAddSubUserModalVisible())}
      className="mx-3 my-8 lg:mx-auto lg:p-5 z-20 lg:max-w-[50rem] dark:bg-black01"
      title={
        <>
          {tUsrSetting("SubUserInfo")} <span className="capitalize"></span>
        </>
      }
    >
      <div className=" overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex-1 pb-2">
          <h1 className="my-3 text-center text-xl font-medium capitalize">
            {tUsrSetting("SubUserAccDetails")}
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            role="form"
            autoComplete="off"
            style={{ maxHeight: "calc(100vh - 100px)" }}
          >
            <div
              className="flex-1 overflow-y-auto pb-4"
              style={{ maxHeight: "60vh" }}
            >
              <div className="mx-1 space-y-3 lg:space-y-5 mt-4">
                <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-5">
                  <div className="w-full flex flex-col gap-1 lg:my-0">
                    <label htmlFor={tRegister("UserId")} className="form-label">
                      {tRegister("UserId")}
                      <span className="asterisk-required"> *</span>
                    </label>
                    <Input
                      id="userId"
                      type="text"
                      {...register("userId")}
                      className="py-3 lg:py-4 lg:text-lg border-none"
                      placeholder={tRegister("UserId")}
                      aria-label={tRegister("UserId")}
                      invalid={!!errors.userId}
                      autoComplete="new-text"
                      maxLength={10}
                    />
                    {errors.userId && (
                      <ErrorMessage
                        message={(errors.userId as FieldError)?.message}
                      />
                    )}
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <Controller
                      name="accountStatus"
                      control={control}
                      render={({ field }) => {
                        return (
                          <SelectDropdownWithPlaceholder
                            selectName={tUsrSetting("AccountStatus")}
                            placeholder={tUsrSetting("AccountStatus")}
                            options={accountStatusOption}
                            useUrl={false}
                            selectedOption={selectedAccountStatus}
                            setSelectedOption={(
                              option: SelectOption | null,
                            ) => {
                              setSelectedAccountStatus(option);
                              field.onChange(option ? option.value : null);
                            }}
                            invalid={!!errors.accountStatus}
                            isRequired={true}
                            aria-label={tUsrSetting("AccountStatus")}
                          />
                        );
                      }}
                    />
                    {errors.accountStatus && (
                      <ErrorMessage
                        message={(errors.accountStatus as FieldError)?.message}
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-5">
                  <div className="w-full flex flex-col gap-1 lg:my-0">
                    <label className="form-label">
                      {tRegister("EmailAddress")}
                      <span className="asterisk-required"> *</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="py-3 lg:py-4 lg:text-lg border-none"
                      placeholder={tRegister("EmailAddress")}
                      aria-label={tRegister("EmailAddress")}
                      invalid={!!errors.email}
                      autoComplete="off"
                      maxLength={50}
                    />
                    {errors.email && (
                      <ErrorMessage
                        message={(errors.email as FieldError)?.message}
                      />
                    )}
                  </div>
                  <div className="w-full flex flex-col gap-1 lg:my-0">
                    <span className="capitalize form-label">
                      {tRegister("Password")}
                      <span className="asterisk-required"> *</span>
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
                    {errors.password && (
                      <span className=" text-red-500 text-xs md:text-sm">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-5">
                  <div className="w-full flex flex-col gap-1 lg:my-0">
                    <span className="capitalize form-label">
                      {tRegister("ConfirmPassword")}
                      <span className="asterisk-required"> *</span>
                    </span>
                    <div>
                      <Input
                        id="confirm-password"
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        className="w-full"
                        placeholder=""
                        {...register("verifyPassword")}
                        aria-label="confirm-password"
                        invalid={!!errors.verifyPassword}
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
                    </div>
                    {errors.verifyPassword && (
                      <span className="text-red-500 text-xs md:text-sm">
                        {errors.verifyPassword.message}
                      </span>
                    )}
                  </div>
                  <div className="w-full flex flex-col gap-1 lg:my-0">
                    <label className="form-label">
                      {tRegister("FirstName")}
                      <span className="asterisk-required"> *</span>
                    </label>
                    <Input
                      id="firstName"
                      type="text"
                      className="py-3 lg:py-4 lg:text-lg border-none"
                      {...register("firstName")}
                      placeholder={tRegister("PlhFirstName")}
                      aria-label={tRegister("PlhFirstName")}
                      invalid={!!errors.firstName}
                      maxLength={15}
                    />
                    {errors.firstName && (
                      <ErrorMessage
                        message={(errors.firstName as FieldError)?.message}
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-5">
                  <div className="w-full flex flex-col gap-1 lg:my-0">
                    <label className="form-label">
                      {tRegister("LastName")}
                      <span className="asterisk-required"> *</span>
                    </label>
                    <Input
                      id="lastName"
                      type="text"
                      {...register("lastName")}
                      placeholder={tRegister("PlhLastName")}
                      className="py-3 lg:py-4 lg:text-lg border-none"
                      aria-label={tRegister("PlhLastName")}
                      invalid={!!errors.lastName}
                      maxLength={25}
                    />
                    {errors.lastName && (
                      <ErrorMessage
                        message={(errors.lastName as FieldError)?.message}
                      />
                    )}
                  </div>
                  <div className="w-full flex flex-col gap-1 lg:my-0 ">
                    <label htmlFor="workPhone" className="form-label">
                      {tRegister("WorkPhone")}
                      <span className="asterisk-required"> *</span>
                    </label>
                    <Controller
                      name="workPhone"
                      control={control}
                      render={({ field }) => {
                        return (
                          <InputPhone
                            id="workPhone"
                            onChange={(phone) => {
                              field.onChange(phone);
                            }}
                            invalid={!!errors.workPhone}
                            hideDropdown={false}
                            countries={primaryCountries}
                          />
                        );
                      }}
                    />
                    {errors.workPhone && (
                      <ErrorMessage
                        message={(errors.workPhone as FieldError)?.message}
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-5">
                  <div className="w-full flex flex-col gap-1 my-2 lg:my-0">
                    <label className="form-label">
                      {tRegister("MobileNumber")}
                    </label>
                    <Controller
                      name="fax"
                      control={control}
                      render={({ field }) => {
                        return (
                          <InputPhone
                            onChange={(faxNumber) => {
                              field.onChange(faxNumber);
                            }}
                            hideDropdown={false}
                            countries={primaryCountries}
                          />
                        );
                      }}
                    />
                  </div>
                  <div className="w-full">&nbsp;</div>
                </div>
              </div>
              <div className="w-full flex flex-col items-center justify-center mt-5">
                <span className="text-center text-xl font-medium capitalize">
                  {tUsrSetting("SubUserSettings")}
                </span>
                <label
                  htmlFor="inheritsSuperUserAccounts"
                  className="form-label flex items-center gap-2 my-2"
                >
                  <Controller
                    name="inheritsSuperUserAccounts"
                    control={control}
                    render={({ field }) => (
                      <SfCheckbox
                        id="inheritsSuperUserAccounts"
                        checked={field.value === "Y"}
                        onChange={() => {
                          field.onChange(field.value === "Y" ? "N" : "Y");
                        }}
                        aria-label={tUsrSetting("SubUserInheritSprUsrAcc")}
                      />
                    )}
                  />
                  <span>{tUsrSetting("SubUserInheritSprUsrAcc")}</span>
                </label>
              </div>
            </div>
            <div className="mt-3 w-full flex items-center justify-end gap-2 md:gap-4">
              <span>&nbsp;</span>
              <Button
                size="lg"
                className="w-full lg:py-4.5 lg:max-w-xs "
                type="submit"
                disabled={isLoading}
                aria-label="Add Sub-User"
              >
                {isLoading ? (
                  <p className="btn-text">{tUsrSetting("Adding")}...</p>
                ) : (
                  <p className="btn-text">{tUsrSetting("Add")}</p>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddSubUserModal;
