import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import SelectDropdownWithPlaceholder from "@/components/globalUI/SelectDropdown";
import Input from "@/components/globalUI/Input";
import InputPhone from "@/components/InputPhone";
import SfCheckbox from "@/components/ui/Checkbox";
import Button from "@/components/globalUI/Button";
import ErrorMessage from "@/components/ErrorMessage";
import { showToast } from "@/components/globalUI/CustomToast";
import Spinner from "@/components/loading/Spinner";

import { updateUserInformationSchema } from "@/lib/validation/accountInformationSchema";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getSubUserInformation,
  removeSubUser,
  selectIsLoadingInformation,
  selectIsLoadingRemoveSubUser,
  selectIsLoadingUpdateInformation,
  selectSelectedSubUser,
  selectSubUserInformation,
  setNewSubUserInformation,
  setSubUserInfoModalVisible,
  updateSubUserInformation,
} from "@/lib/features/subUser/subUserSlice";
import { reFetchAccountSettings } from "@/lib/hooks/refetchAccountSettings";

import { primaryCountries } from "@/utils";

import { SelectOption, SubUserInfo } from "@/types";

const InformationTab = () => {
  const tValidation = useTranslations("Validation");
  const tRegister = useTranslations("Register");
  const tUsrSetting = useTranslations("UsrSetting");

  const dispatch = useAppDispatch();
  const selectedSubUser = useAppSelector(selectSelectedSubUser);
  const isLoadingDetails = useAppSelector(selectIsLoadingInformation);
  const subUserInformation = useAppSelector(selectSubUserInformation);
  const isRemovingLoading = useAppSelector(selectIsLoadingRemoveSubUser);
  const isUpdatingLoading = useAppSelector(selectIsLoadingUpdateInformation);

  const accountStatusOption: SelectOption[] = [
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

  const [info, setInfo] = useState<SubUserInfo>({
    mode: "Edit",
    accountStatus: "",
    userId: "",
    email: "",
    firstName: "",
    lastName: "",
    workPhone: "",
    fax: "",
    inheritsSuperUserAccounts: "N",
    password: "",
    verifyPassword: "",
  });

  useEffect(() => {
    if (selectedSubUser?.subUserId) {
      dispatch(getSubUserInformation(selectedSubUser.subUserId));
    }
  }, [selectedSubUser?.subUserId, dispatch]);

  useEffect(() => {
    if (subUserInformation) {
      setInfo((prev) => ({
        ...prev,
        ...subUserInformation,
      }));
    }
  }, [subUserInformation]);

  useEffect(() => {
    if (selectedSubUser) {
      setInfo((prev) => ({
        ...prev,
        userId: selectedSubUser.subUserId,
      }));
    }
  }, [selectedSubUser]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SubUserInfo>({
    defaultValues: {
      mode: "Edit",
      accountStatus: info.accountStatus,
    },
    resolver: zodResolver(updateUserInformationSchema(tValidation)),
  });

  const [selectedAccountStatus, setSelectedAccountStatus] =
    useState<SelectOption | null>(
      accountStatusOption.find((c) => c.value === info.accountStatus) || null,
    );

  useEffect(() => {
    const initialAccountStatus = accountStatusOption.find(
      (option) => option.value === info.accountStatus,
    );
    setSelectedAccountStatus(initialAccountStatus || null);
  }, [info.accountStatus]);

  useEffect(() => {
    setValue("accountStatus", info.accountStatus);
    setValue("userId", info.userId);
    setValue("email", info.email);
    setValue("firstName", info.firstName);
    setValue("lastName", info.lastName);
    setValue("workPhone", info.workPhone);
    setValue("fax", info.fax);
    setValue("inheritsSuperUserAccounts", info.inheritsSuperUserAccounts);
  }, [info, setValue]);

  const onSubmit = async (data: SubUserInfo) => {
    const MODE_DATA = "Edit";

    const payload = {
      ...data,
      mode: MODE_DATA,
      accountStatus: selectedAccountStatus?.value || "A",
      password: "",
      verifyPassword: "",
    };

    const res = await dispatch(updateSubUserInformation(payload));

    if (res.meta.requestStatus === "fulfilled") {
      dispatch(setNewSubUserInformation(payload));
      await reFetchAccountSettings();
      showToast("success", tValidation(res?.payload.messages));

      return;
    }
    if (res.meta.requestStatus === "rejected") {
      await reFetchAccountSettings();
      showToast("error", tValidation(res?.payload.messages));

      return;
    }
  };

  const handleRemoveSubUser = async () => {
    const res = await dispatch(removeSubUser(info?.userId));

    if (res.meta.requestStatus === "fulfilled") {
      showToast("success", tValidation(res?.payload.messages));
      await reFetchAccountSettings();
      dispatch(setSubUserInfoModalVisible(""));
    } else {
      showToast("error", tValidation(res?.payload.messages));
    }
  };

  return (
    <div className="flex-1 pb-2">
      <h1 className="my-3 text-center text-xl font-medium capitalize">
        {tUsrSetting("AccountDetails")}
      </h1>
      {isLoadingDetails ? (
        <div className="w-full h-24 flex flex-col items-center justify-center text-center">
          <Spinner className="fill-brand" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} role="form" autoComplete="off">
          <div
            className="flex-1  overflow-y-auto"
            style={{ maxHeight: "52vh" }}
          >
            <div className="px-1 pb-3 mx-1 space-y-3 lg:space-y-5 mt-4">
              <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-5">
                <div className="w-full flex flex-col gap-1">
                  <span className="form-label">{tUsrSetting("UserId")}</span>
                  <div className="h-[50px] lg:h-[60px] flex items-center bg-gray02 rounded-lg lg:rounded-large px-4.5 dark:text-gray-300 dark:bg-light-dark cursor-not-allowed">
                    <p className="lg:text-lg">{info.userId}</p>
                  </div>
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
                          setSelectedOption={(option: SelectOption | null) => {
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
                  <label htmlFor="email" className="form-label">
                    {tRegister("EmailAddress")}
                    <span className="asterisk-required"> *</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={info.email}
                    {...register("email")}
                    className="py-3 lg:py-4 lg:text-lg border-none"
                    placeholder={tRegister("EmailAddress")}
                    aria-label={tRegister("EmailAddress")}
                    invalid={!!errors.email}
                    maxLength={50}
                  />
                  {errors.email && (
                    <ErrorMessage
                      message={(errors.email as FieldError)?.message}
                    />
                  )}
                </div>
                <div className="w-full flex flex-col gap-1 lg:my-0">
                  <label htmlFor="firstName" className="form-label">
                    {tRegister("FirstName")}
                    <span className="asterisk-required"> *</span>
                  </label>
                  <Input
                    type="text"
                    defaultValue={info.firstName}
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
                  <label className="form-label" htmlFor="lastName">
                    {tRegister("LastName")}
                    <span className="asterisk-required"> *</span>
                  </label>
                  <Input
                    type="text"
                    defaultValue={info.lastName}
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
                <div className="w-full flex flex-col gap-1 ">
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
                          phoneNumber={info.workPhone}
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
                  <label htmlFor="fax" className="form-label">
                    {tRegister("MobileNumber")}
                  </label>
                  <Controller
                    name="fax"
                    control={control}
                    render={({ field }) => {
                      return (
                        <InputPhone
                          id="fax"
                          phoneNumber={info?.fax}
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
              <div className="w-full flex flex-col items-center justify-center mt-4">
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
          </div>
          <footer className="mt-4">
            <div className="mt-3 w-full flex items-center justify-end gap-2 md:gap-4">
              <Button
                size="lg"
                className="w-full px-4 lg:py-4.5 lg:max-w-xs "
                variant="secondary"
                disabled={isRemovingLoading}
                onClick={handleRemoveSubUser}
                aria-label="delete sub-user"
              >
                {isRemovingLoading ? (
                  <p className="btn-text">{tUsrSetting("DltngSubUser")}...</p>
                ) : (
                  <p className="btn-text truncate">
                    {tUsrSetting("DltSubUser")}
                  </p>
                )}
              </Button>
              <Button
                size="lg"
                className="w-full lg:py-4.5 lg:max-w-xs "
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={isUpdatingLoading}
                aria-label="save sub-user"
              >
                {isUpdatingLoading ? (
                  <p className="btn-text">{tUsrSetting("Saving")}...</p>
                ) : (
                  <p className="btn-text">{tUsrSetting("Save")}</p>
                )}
              </Button>
            </div>
          </footer>
        </form>
      )}
    </div>
  );
};

export default InformationTab;
