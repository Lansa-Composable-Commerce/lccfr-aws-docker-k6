"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { useTranslations } from "next-intl";

import PageTitle from "@/components/ui/PageTitle";
import ChangePasswordForm from "@/components/accountSettings/ChangePasswordForm";
import AssociatedAccountList from "@/components/accountSettings/AssociatedAccountList";
import AccountSettingCard from "@/components/accountSettings/AccountSettingCard";
import AccountInformationForm from "@/components/accountSettings/AccountInformationForm";
import SubUserList from "@/components/accountSettings/SubUserList";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getPaymentOptionsState,
  selectMessages,
} from "@/lib/features/accountSettings/accountSettingsSlice";

import { useDisplayToastMessage } from "@/lib/hooks/useDisplayToastMessage";

import { selectChangePasswordMessages } from "@/lib/features/changePassword/changePasswordSlice";

import { SvgLockClosed, SvgUser, SvgUserPlus, SvgUsers } from "@/assets/svg";

import {
  AccountSettingContainerProps,
  AccountSettingNavigation,
} from "@/types";

const AccountSettingContainer = ({
  user,
  countries,
  accessCookieValue,
}: AccountSettingContainerProps) => {
  const usrSettings = useTranslations("UsrSetting");

  const dispatch = useAppDispatch();
  const changesPasswordMessages = useAppSelector(selectChangePasswordMessages);
  const messages = useAppSelector(selectMessages);

  const userInfo = user?.data?.userInfo;
  const payOpt = user?.data?.payOpt;
  const accounts = user?.data?.accounts;
  const subUsersInfo = user?.data?.subusers;

  useEffect(() => {
    dispatch(getPaymentOptionsState(payOpt));
  }, [dispatch, payOpt]);

  const userType: "S" | "N" | undefined | any = userInfo?.userType;
  // let userType: "S" | "N" | undefined | any = "S";

  const leftNavigation: any = {
    accountInformation: {
      label: usrSettings("AccountInformation"),
      icon: <SvgUser className="size-5 lg:size-6 mr-2" />,
    },
    changePassword: {
      label: usrSettings("ChangePassword"),
      icon: <SvgLockClosed className="size-5 lg:size-6 mr-2" />,
    },
    associatedAccounts: {
      label: usrSettings("AssociatedAccounts"),
      icon: <SvgUsers className="size-5 lg:size-6 mr-2" />,
    },
    ...(userType === "S" && {
      subUserInformation: {
        label: usrSettings("SubUserInfo"),
        icon: <SvgUserPlus className="size-5 lg:size-6 mr-2" />,
      },
    }),
  };

  const [activeNav, setActiveNav] =
    useState<keyof AccountSettingNavigation>("accountInformation");

  // @ts-ignore
  const changePasswordType = changesPasswordMessages[0]?.type;
  // @ts-ignore
  useDisplayToastMessage({ status: messages[0]?.type, messages: messages });
  useDisplayToastMessage({
    status: changePasswordType,
    messages: changesPasswordMessages,
  });

  const leftNavigationRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const contentRef = useRef<HTMLDivElement | null>(null);

  const transformCountries = countries?.map(
    (country: { LW3CTRYD: string; LW3CTRY: string }) => {
      return {
        label: country?.LW3CTRYD,
        value: country?.LW3CTRY,
      };
    },
  );

  const handleSectionNav = useCallback(
    (id: string) => {
      // useCallback added here
      setActiveNav(id as keyof AccountSettingNavigation);
      const targetElement = leftNavigationRefs.current[id];
      if (targetElement) {
        const navbarHeight = document.querySelector("nav")?.clientHeight || 0;

        window.scrollTo({
          top: targetElement.offsetTop - navbarHeight,
          behavior: "smooth",
        });
      }
    },
    [setActiveNav, leftNavigationRefs],
  ); // Dependencies added

  useEffect(() => {
    // Function to determine the section in view
    const determineSectionInView = () => {
      const navbarHeight = document.querySelector("nav")?.clientHeight || 0;
      let currentSection: keyof AccountSettingNavigation | null = null;

      for (const navKey in leftNavigationRefs.current) {
        const element = leftNavigationRefs.current[navKey];
        if (element) {
          const { top } = element.getBoundingClientRect();
          if (top >= navbarHeight && top <= window.innerHeight / 2) {
            currentSection = navKey as keyof AccountSettingNavigation;
            break;
          }
        }
      }
      if (currentSection) {
        setActiveNav(currentSection);
      }
    };

    determineSectionInView(); // Call on mount

    window.addEventListener("scroll", determineSectionInView); // Add scroll event listener
    return () => {
      window.removeEventListener("scroll", determineSectionInView); // Clean up listener on unmount
    };
  }, []);

  return (
    <section className="relative w-full h-full top-0">
      <PageTitle content={usrSettings("AccountSettings")} withTitle />
      <div className="h-full w-full ">
        <div ref={contentRef} className="mt-7 flex flex-row gap-6">
          {/* Left Section */}
          <div className="hidden pr-6 border-r border-dashed w-full flex-none max-w-[200px] xl:block xl:max-w-[310px] dark:border-slate-700">
            <div
              className="sticky top-[var(--navbar-height)]"
              style={{ top: "var(--navbar-height)" }}
            >
              <AccountSettingCard>
                <div className="flex flex-col gap-y-3">
                  {Object.keys(leftNavigation).map((nav: any) => (
                    <div
                      key={nav}
                      className={classNames(
                        "px-2 py-3 hover:bg-brand/30 cursor-pointer flex items-center rounded-lg",
                        activeNav === nav &&
                          "bg-brand/30 font-medium rounded-lg",
                      )}
                      onClick={() => handleSectionNav(nav)}
                    >
                      <div className="flex-none">
                        {
                          leftNavigation[nav as keyof AccountSettingNavigation]
                            .icon
                        }
                      </div>
                      <div className="grow">
                        {
                          leftNavigation[nav as keyof AccountSettingNavigation]
                            .label
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </AccountSettingCard>
            </div>
          </div>
          {/* Right Section */}
          <div className="grow w-full h-full flex flex-col gap-y-4 lg:gap-y-5">
            <div
              ref={(el: any) =>
                (leftNavigationRefs.current["accountInformation"] = el)
              }
            >
              <AccountSettingCard
                title={usrSettings("AccountInformation")}
                id="accountInformation"
              >
                <AccountInformationForm
                  userInfo={userInfo}
                  countries={transformCountries}
                  cookie={accessCookieValue}
                />
              </AccountSettingCard>
            </div>
            <div
              ref={(el: any) =>
                (leftNavigationRefs.current["changePassword"] = el)
              }
            >
              <AccountSettingCard
                title={usrSettings("ChangePassword")}
                id="changePassword"
              >
                <ChangePasswordForm />
              </AccountSettingCard>
            </div>
            <div
              ref={(el: any) =>
                (leftNavigationRefs.current["associatedAccounts"] = el)
              }
            >
              <AccountSettingCard
                title={usrSettings("AssociatedAccounts")}
                id="associatedAccounts"
              >
                <AssociatedAccountList accounts={accounts} />
              </AccountSettingCard>
            </div>
            <div
              ref={(el: any) =>
                (leftNavigationRefs.current["subUserInformation"] = el)
              }
            >
              <SubUserList userInfo={userInfo} subUsersInfo={subUsersInfo} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountSettingContainer;
