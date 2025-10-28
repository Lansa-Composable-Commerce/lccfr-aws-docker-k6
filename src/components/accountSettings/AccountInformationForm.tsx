"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Controller,
  FieldError,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/components/globalUI/Input";
import Button from "@/components/globalUI/Button";
import ErrorMessage from "@/components/ErrorMessage";
import InputPhone from "@/components/InputPhone";
import SelectDropdownWithPlaceholder from "@/components/globalUI/SelectDropdown";

import {
  removeMessageState,
  selectIsLoading,
  updateProfile,
} from "@/lib/features/accountSettings/accountSettingsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { accountInformationSchema } from "@/lib/validation/accountInformationSchema";
import useGetTokens from "@/lib/hooks/useGetTokens";

import { useStatesQuery } from "@/services/locationsApi";

import { primaryCountries } from "@/utils";
import { getUserFromToken } from "@/utils/token";

import { SelectOption, UserInfo } from "@/types";

const AccountInformationForm = ({
  userInfo,
  countries,
  cookie,
}: {
  userInfo: UserInfo;
  countries: SelectOption[];
  cookie: string | undefined;
}) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);

  const tUsrSetting = useTranslations("UsrSetting");
  const tRegister = useTranslations("Register");
  const tValidation = useTranslations("Validation");
  const tGlobal = useTranslations("Global");

  const accessToken = useGetTokens(cookie);
  // const user = getUserFromToken(accessToken);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<UserInfo>({
    defaultValues: {
      country: userInfo?.country,
      state: userInfo?.state,
      userEmail: userInfo?.userEmail,
      phoneNumber: userInfo?.phoneNumber,
      faxNumber: userInfo?.faxNumber,
    },
    resolver: zodResolver(accountInformationSchema(tValidation)),
  });

  const { data: statesData, error: statesError } = useStatesQuery(
    getValues("country") || "",
    {
      skip: !getValues("country"), // Only call if country is selected
    },
  );

  const [selectedCountry, setSelectedCountry] = useState<SelectOption | null>(
    countries.find((c) => c.value === userInfo?.country) || null,
  );

  const [selectedState, setSelectedState] = useState<SelectOption | null>(
    statesData?.states?.find(
      (s: SelectOption) => s.value === userInfo?.state,
    ) || null,
  );

  const onSubmit: SubmitHandler<UserInfo> = async (data) => {
    await dispatch(updateProfile(data));
    await dispatch(removeMessageState());
  };

  useEffect(() => {
    // When statesData changes, update selectedState
    if (statesData?.states && getValues("country")) {
      const newSelectedState = statesData.states.find(
        (s: SelectOption) => s.value === getValues("state"),
      );
      setSelectedState(newSelectedState || null);
    }
  }, [statesData, getValues]);

  const handleCountryChange = (option: SelectOption | null) => {
    setSelectedCountry(option);
    // @ts-ignore
    setValue("country", option?.value); // Update country value in form
    setSelectedState(null); // Reset selectedState
    // @ts-ignore
    setValue("state", null); // Reset state in form
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} role="form" autoComplete="off">
      <div className="mt-4 md:mt-7 grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-2 lg:gap-y-4 w-full text-base">
        <div className="flex flex-col gap-y-1.5 sm:gap-y-2 lg:gap-y-4">
          {/* Hide for now*/}
          {/*<div className="w-full flex flex-col gap-1 my-2">
            <label className="form-label">{tRegister("UserId")}</label>
            <div className="h-[50px] lg:h-[60px] flex items-center bg-gray02 rounded-large px-4.5 dark:text-gray-300 dark:bg-light-dark">
              <p className="lg:text-lg">{user?.userId || "- -"}</p>
            </div>
          </div>*/}
          <div className="w-full flex flex-col gap-1 my-2">
            <span className="form-label">{tRegister("EmailAddress")}</span>
            <div
              className="h-[50px] lg:h-[60px] flex items-center bg-gray02 rounded-lg lg:rounded-large px-4.5 dark:text-gray-300 dark:bg-light-dark cursor-not-allowed"
              {...register("userEmail")}
            >
              <p className="lg:text-lg">{userInfo?.userEmail}</p>
            </div>
          </div>

          <div className="w-full flex flex-col gap-1 my-2">
            <label htmlFor="firstName" className="form-label">
              {tRegister("FirstName")}
              <span className="asterisk-required"> *</span>
            </label>
            <Input
              id="firstName"
              type="text"
              defaultValue={userInfo?.firstName}
              className="py-3 lg:py-4 lg:text-lg border-none text-sm"
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
          <div className="w-full flex flex-col gap-1 my-2 lg:my-0">
            <label className="form-label" htmlFor="lastName">
              {tRegister("LastName")}
              <span className="asterisk-required"> *</span>
            </label>
            <Input
              id="lastName"
              type="text"
              defaultValue={userInfo?.lastName}
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
          <div className="w-full flex flex-col gap-1 my-2 lg:my-0">
            <label htmlFor="phoneNumber" className="form-label">
              {tRegister("WorkPhone")}
              <span className="asterisk-required"> *</span>
            </label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => {
                return (
                  <InputPhone
                    id="phoneNumber"
                    phoneNumber={userInfo?.phoneNumber}
                    onChange={(phone) => {
                      field.onChange(phone);
                    }}
                    hideDropdown={false}
                    countries={primaryCountries}
                    invalid={!!errors.phoneNumber}
                  />
                );
              }}
            />
            {errors.phoneNumber && (
              <ErrorMessage
                message={(errors.phoneNumber as FieldError)?.message}
              />
            )}
          </div>
          <div className="w-full flex flex-col gap-1 my-2 lg:my-0">
            <label htmlFor="faxNumber" className="form-label">
              {tRegister("MobileNumber")}
            </label>
            <Controller
              name="faxNumber"
              control={control}
              render={({ field }) => {
                return (
                  <InputPhone
                    id="faxNumber"
                    phoneNumber={userInfo?.faxNumber}
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
        </div>
        <div className="flex flex-col gap-y-1.5 sm:gap-y-2 lg:gap-y-4">
          <div className="w-full flex flex-col gap-1 my-2">
            <label className="form-label" htmlFor="address1">
              {tRegister("PrimaryAddress")}
              <span className="asterisk-required"> *</span>
            </label>
            <Input
              id="address1"
              type="text"
              defaultValue={userInfo?.address1}
              {...register("address1")}
              placeholder={tRegister("PlhPrimaryAdd")}
              className="py-3 lg:py-4 lg:text-lg border-none"
              aria-label={tRegister("PlhPrimaryAdd")}
              invalid={!!errors.address1}
              maxLength={40}
            />
            {errors.address1 && (
              <ErrorMessage
                message={(errors.address1 as FieldError)?.message}
              />
            )}
          </div>
          <div className="w-full flex flex-col gap-1 my-2">
            <label className="form-label" htmlFor="address2">
              {tRegister("SecondaryAddress")}
            </label>
            <Input
              id="address2"
              type="text"
              defaultValue={userInfo?.address2}
              {...register("address2")}
              placeholder={tRegister("PlhSecondaryAdd")}
              className="py-3 lg:py-4 lg:text-lg border-none"
              aria-label={tRegister("PlhSecondaryAdd")}
              maxLength={40}
            />
          </div>
          <div className="w-full flex flex-col gap-1 my-2 lg:my-0">
            <Controller
              name="country"
              control={control}
              render={() => {
                return (
                  <SelectDropdownWithPlaceholder
                    selectName={tRegister("Country")}
                    placeholder={tGlobal("SelectCountry")}
                    options={countries}
                    useUrl={false}
                    selectedOption={selectedCountry}
                    invalid={!!errors.country}
                    isRequired={true}
                    setSelectedOption={handleCountryChange}
                  />
                );
              }}
            />
          </div>
          <div className="w-full flex flex-col gap-1 my-2 lg:my-0">
            <Controller
              name="state"
              control={control}
              render={({ field }) => {
                return (
                  <SelectDropdownWithPlaceholder
                    selectName={tRegister("State")}
                    placeholder={tGlobal("SelectState")}
                    options={statesError ? [] : statesData?.states}
                    useUrl={false}
                    invalid={!!errors.state}
                    isRequired={true}
                    selectedOption={selectedState}
                    setSelectedOption={(option: SelectOption | null) => {
                      setSelectedState(option);
                      field.onChange(option ? option.value : null);
                    }}
                  />
                );
              }}
            />
            {errors.state && (
              <ErrorMessage message={(errors.state as FieldError)?.message} />
            )}
          </div>
          <div className="w-full flex flex-col gap-1 my-2 lg:my-0">
            <label className="form-label" htmlFor="city">
              {tRegister("City")}
              <span className="asterisk-required"> *</span>
            </label>
            <Input
              id="city"
              type="text"
              defaultValue={userInfo?.city}
              {...register("city")}
              placeholder={tRegister("PlhCity")}
              invalid={!!errors.city}
              maxLength={30}
            />
            {errors.city && (
              <ErrorMessage message={(errors.city as FieldError)?.message} />
            )}
          </div>
          <div className="w-full flex flex-col gap-1 my-2 lg:my-0">
            <label className="form-label" htmlFor="zip">
              {tRegister("PostalCode")}
              <span className="asterisk-required"> *</span>
            </label>
            <Input
              id="zip"
              type="text"
              defaultValue={userInfo?.zip}
              {...register("zip")}
              className="py-3 lg:py-4 lg:text-lg border-none"
              placeholder={tRegister("PlhPostalCode")}
              aria-label={tRegister("PlhPostalCode")}
              autoComplete="off"
              invalid={!!errors.zip}
              maxLength={50}
            />
            {errors.zip && (
              <ErrorMessage message={(errors.zip as FieldError)?.message} />
            )}
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-end mt-2 lg:mt-4">
        <div className="w-full mt-2.5 md:mt-5 md:max-w-xs flex justify-end">
          <Button
            size="lg"
            className="w-full lg:py-4.5"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <p className="btn-text">{tUsrSetting("Saving")}...</p>
            ) : (
              <p className="btn-text">{tUsrSetting("Save")}</p>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AccountInformationForm;
