"use client";

import { motion, AnimatePresence } from "framer-motion";
import { fadeInBottom } from "@/lib/framer-motion/fade-in-bottom";
import { useTranslations } from "next-intl";
import Input from "@/components/globalUI/Input";
import {
  Controller,
  FieldError,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import Button from "@/components/globalUI/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerValidationSchema } from "@/lib/validation/registerValidationSchema";
import ErrorMessage from "@/components/ErrorMessage";
import { useEffect, useState } from "react";
import { SfIconVisibility, SfIconVisibilityOff } from "@storefront-ui/react";
import { Link, useRouter } from "@/i18n/routing";
import SelectDropdownWithPlaceholder from "@/components/globalUI/SelectDropdown";
import { SelectOption, UserRegisterInput } from "@/types";
import { useStatesQuery } from "@/services/locationsApi";
import { showToast } from "@/components/globalUI/CustomToast";
import { mapRegisterInputToRequest } from "@/utils/mapInputToRequest";
import { register as signup } from "@/app/[locale]/(pages)/(auth)/register/actions";
import { SvgArrowPath } from "@/assets/svg";
import { primaryCountries } from "@/utils";
import { useAppDispatch } from "@/lib/hooks";
import { setIsRegisterSuccess } from "@/lib/features/auth/authSlice";
import dynamic from "next/dynamic";
import { STOREFRONT_ROUTES } from "@/utils/constants";

const InputPhone = dynamic(() => import("@/components/InputPhone"), {
  ssr: false,
});

type RegisterFormPropType = {
  referrals: SelectOption[];
  countries: SelectOption[];
};

export default function RegisterForm({
  referrals,
  countries,
}: RegisterFormPropType) {
  const router = useRouter();

  const tRegister = useTranslations("Register");
  const tValidation = useTranslations("Validation");
  const tGlobal = useTranslations("Global");

  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [selectedReferral, setSelectedReferral] = useState<
    SelectOption | string
  >("");
  const [selectedCountry, setSelectedCountry] = useState<SelectOption | null>(
    null,
  );
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);

  const { data, error } = useStatesQuery(selectedCountry?.value || "", {
    skip: !selectedCountry?.value,
  });

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prevState) => !prevState);
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<UserRegisterInput>({
    resolver: zodResolver(registerValidationSchema(tValidation)),
  });

  const onSubmit: SubmitHandler<UserRegisterInput> = async (data) => {
    const payload = mapRegisterInputToRequest(data);

    setIsLoading(true);

    const response = await signup(payload);

    if (response && response.statusCode !== 200) {
      const errorMessage = response.data.messages[0];

      showToast("error", tValidation(errorMessage.code || "MsgDefaultError"));
    } else {
      dispatch(setIsRegisterSuccess(true));
      router.push("/login");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    setSelectedState(null);
  }, [selectedCountry]);

  useEffect(() => {
    setValue("referral", "");
    setValue("country", null);
    setValue("state", null);
  }, [setValue]);

  const goToLogin = () => {
    router.push(STOREFRONT_ROUTES.LOGIN);
  };

  return (
    <>
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
            autoComplete="off"
          >
            <div className="grid md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-y-6">
                <div className="typography-headline-3 font-medium">
                  {tRegister("UserDetails")}
                </div>
                <div className="w-full flex flex-col gap-1">
                  <label htmlFor="companyName" className="form-label">
                    {tRegister("CompanyName")}
                    <span className="asterisk-required"> *</span>
                  </label>
                  <Input
                    id="companyName"
                    type="text"
                    {...register("companyName")}
                    placeholder={tRegister("PlhCompany")}
                    invalid={!!errors.companyName}
                    maxLength={40}
                  />
                  {errors.companyName && (
                    <ErrorMessage
                      message={(errors.companyName as FieldError)?.message}
                    />
                  )}
                </div>
                <div className="w-full flex flex-col gap-1">
                  <label htmlFor="userId" className="form-label">
                    {tRegister("UserId")}
                    <span className="asterisk-required"> *</span>
                  </label>
                  <Input
                    id="userId"
                    type="text"
                    {...register("userId")}
                    placeholder={tRegister("PlhUserId")}
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
                  <label htmlFor="emailAddress" className="form-label">
                    {tRegister("EmailAddress")}
                    <span className="asterisk-required"> *</span>
                  </label>
                  <Input
                    id="emailAddress"
                    type="email"
                    {...register("email")}
                    placeholder={tRegister("PlhEmailExample")}
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
                <div className="w-full flex flex-col gap-1">
                  <label htmlFor="password" className="form-label">
                    {tRegister("Password")}
                    <span className="asterisk-required"> *</span>
                  </label>
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    {...register("password")}
                    placeholder="********"
                    invalid={!!errors.password}
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
                  {errors.password && (
                    <ErrorMessage
                      message={(errors.password as FieldError)?.message}
                    />
                  )}
                </div>
                <div className="w-full flex flex-col gap-1">
                  <label htmlFor="confirmPassword" className="form-label">
                    {tRegister("ConfirmPassword")}
                    <span className="asterisk-required"> *</span>
                  </label>
                  <Input
                    id="confirmPassword"
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    {...register("confirmPassword")}
                    placeholder="********"
                    invalid={!!errors.confirmPassword}
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
                  {errors.confirmPassword && (
                    <ErrorMessage
                      message={(errors.confirmPassword as FieldError)?.message}
                    />
                  )}
                </div>
                <div className="w-full flex flex-col gap-1">
                  <label htmlFor="firstName" className="form-label">
                    {tRegister("FirstName")}
                    <span className="asterisk-required"> *</span>
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    {...register("firstName")}
                    placeholder={tRegister("PlhFirstName")}
                    invalid={!!errors.firstName}
                    maxLength={15}
                  />
                  {errors.firstName && (
                    <ErrorMessage
                      message={(errors.firstName as FieldError)?.message}
                    />
                  )}
                </div>
                <div className="w-full flex flex-col gap-1">
                  <label htmlFor="lastName" className="form-label">
                    {tRegister("LastName")}
                    <span className="asterisk-required"> *</span>
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    {...register("lastName")}
                    placeholder={tRegister("PlhLastName")}
                    invalid={!!errors.lastName}
                    maxLength={25}
                  />
                  {errors.lastName && (
                    <ErrorMessage
                      message={(errors.lastName as FieldError)?.message}
                    />
                  )}
                </div>
                <div className="w-full flex flex-col">
                  <Controller
                    name="referral"
                    control={control}
                    render={({ field }) => {
                      return (
                        <SelectDropdownWithPlaceholder
                          selectName={tRegister("Referral")}
                          placeholder={tGlobal("SelectReferral")}
                          options={referrals}
                          useUrl={false}
                          invalid={!!errors.referral}
                          selectedOption={selectedReferral}
                          setSelectedOption={(option: SelectOption) => {
                            setSelectedReferral(option);
                            field.onChange(option ? option.value : null);
                          }}
                        />
                      );
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-y-6">
                <div className="typography-headline-3 font-medium">
                  {tRegister("LocationDetails")}
                </div>
                <div className="w-full flex flex-col gap-1">
                  <label htmlFor="addressLine1" className="form-label">
                    {tRegister("PrimaryAddress")}
                    <span className="asterisk-required"> *</span>
                  </label>
                  <Input
                    id="addressLine1"
                    type="text"
                    {...register("addressLine1")}
                    placeholder={tRegister("PlhPrimaryAdd")}
                    invalid={!!errors.addressLine1}
                    maxLength={40}
                  />
                  {errors.addressLine1 && (
                    <ErrorMessage
                      message={(errors.addressLine1 as FieldError)?.message}
                    />
                  )}
                </div>
                <div className="w-full flex flex-col gap-1">
                  <label htmlFor="addressLine2" className="form-label">
                    {tRegister("SecondaryAddress")}
                  </label>
                  <Input
                    id="addressLine2"
                    type="text"
                    {...register("addressLine2")}
                    placeholder={tRegister("PlhSecondaryAdd")}
                    maxLength={40}
                  />
                </div>
                <div className="w-full flex flex-col">
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => {
                      return (
                        <SelectDropdownWithPlaceholder
                          selectName={tRegister("Country")}
                          placeholder={tGlobal("SelectCountry")}
                          options={countries}
                          useUrl={false}
                          selectedOption={selectedCountry}
                          invalid={!!errors.country}
                          isRequired={true}
                          setSelectedOption={(option: SelectOption) => {
                            setSelectedCountry(option);
                            field.onChange(option ? option.value : null);
                          }}
                        />
                      );
                    }}
                  />
                  {errors.country && (
                    <ErrorMessage
                      message={(errors.country as FieldError)?.message}
                    />
                  )}
                </div>
                <div className="w-full flex flex-col">
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => {
                      return (
                        <SelectDropdownWithPlaceholder
                          selectName={tRegister("State")}
                          placeholder={tGlobal("SelectState")}
                          options={error ? [] : data?.states}
                          useUrl={false}
                          invalid={!!errors.state}
                          isRequired={true}
                          selectedOption={selectedState}
                          setSelectedOption={(option: SelectOption) => {
                            setSelectedState(option);
                            field.onChange(option ? option.value : null);
                          }}
                        />
                      );
                    }}
                  />
                  {errors.state && (
                    <ErrorMessage
                      message={(errors.state as FieldError)?.message}
                    />
                  )}
                </div>
                <div className="w-full flex flex-col gap-1">
                  <label htmlFor="city" className="form-label">
                    {tRegister("City")}
                    <span className="asterisk-required"> *</span>
                  </label>
                  <Input
                    id="city"
                    type="text"
                    {...register("city")}
                    placeholder={tRegister("PlhCity")}
                    invalid={!!errors.city}
                    maxLength={30}
                  />
                  {errors.city && (
                    <ErrorMessage
                      message={(errors.city as FieldError)?.message}
                    />
                  )}
                </div>
                <div className="w-full flex flex-col gap-1">
                  <label htmlFor="postalCode" className="form-label">
                    {tRegister("PostalCode")}
                    <span className="asterisk-required"> *</span>
                  </label>
                  <Input
                    id="postalCode"
                    type="text"
                    {...register("postalCode")}
                    placeholder={tRegister("PlhPostalCode")}
                    invalid={!!errors.postalCode}
                    maxLength={10}
                  />
                  {errors.postalCode && (
                    <ErrorMessage
                      message={(errors.postalCode as FieldError)?.message}
                    />
                  )}
                </div>
                <div className="w-full flex flex-col gap-1">
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
                          hideDropdown={false}
                          countries={primaryCountries}
                          invalid={!!errors.workPhone}
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
                <div className="w-full flex flex-col gap-1">
                  <label htmlFor="mobileNumber" className="form-label">
                    {tRegister("MobileNumber")}
                  </label>
                  <Controller
                    name="mobileNumber"
                    control={control}
                    render={({ field }) => {
                      return (
                        <InputPhone
                          id="mobileNumber"
                          onChange={(phone) => {
                            field.onChange(phone);
                          }}
                          hideDropdown={false}
                          countries={primaryCountries}
                          invalid={!!errors.mobileNumber}
                        />
                      );
                    }}
                  />
                  {errors.mobileNumber && (
                    <ErrorMessage
                      message={(errors.mobileNumber as FieldError)?.message}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="mt-14 mx-auto w-full sm:w-1/2 xl:w-1/3">
              <Button
                type="submit"
                size="lg"
                className="w-full lg:py-4.5 translate-05"
                disabled={isLoading}
              >
                {isLoading ? (
                  <SvgArrowPath className="animate-spin size-6" />
                ) : (
                  <div className="text-base lg:text-xl uppercase tracking-wider">
                    {tRegister("MsgCreateAccount")}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center items-center gap-1 pb-5 mt-4">
        <span className="typography-text-sm text-gray03 dark:text-gray-300">
          {tRegister("MsgHasAccount")}
        </span>

        <span className="register-text translate-05" onClick={goToLogin}>
          {tRegister("Login")}
        </span>
      </div>
    </>
  );
}
