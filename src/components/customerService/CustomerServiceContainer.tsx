"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import classNames from "classnames";
import { useTranslations } from "next-intl";

import AccountSettingCard from "@/components/accountSettings/AccountSettingCard";
import AboutUsWrapper from "@/components/content/AboutUsWrapper";
import EventInfoWrapper from "@/components/content/EventInfoWrapper";
import FaqWrapper from "@/components/content/FaqWrapper";
import PrivacyPolicyWrapper from "@/components/content/PrivacyPolicyWrapper";
import OrdersPaymentWrapper from "@/components/content/OrdersPaymentWrapper";
import ShippingInfoWrapper from "@/components/content/ShippingInfoWrapper";
import ReturnExchangeWrapper from "@/components/content/ReturnExchangeWrapper";

import {
  SvgArrowsLeftRight,
  SvgCalendarDateRange,
  SvgCart,
  SvgLock,
  SvgQuestionMarkCircle,
  SvgTruck,
  SvgUser,
} from "@/assets/svg";

import { AccountSettingNavigation } from "@/types";

const CustomerServiceContainer = () => {
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations("CstmSrvc");

  const leftNavigation: any = {
    aboutUs: {
      label: t("AboutUs"),
      icon: <SvgUser className="size-5 lg:size-6 mr-2" />,
    },
    privacyPolicy: {
      label: t("PrivacyPolicy"),
      icon: <SvgLock className="size-5 lg:size-6 mr-2" />,
    },
    returnExchange: {
      label: t("ReturnExchange"),
      icon: <SvgArrowsLeftRight className="size-5 lg:size-6 mr-2" />,
    },
    ordersAndPayment: {
      label: t("OrdersPayment"),
      icon: <SvgCart className="size-5 lg:size-6 mr-2" />,
    },
    shippingInformation: {
      label: t("ShippingInformation"),
      icon: <SvgTruck className="size-5 lg:size-6 mr-2" />,
    },
    faq: {
      label: t("Faq"),
      icon: <SvgQuestionMarkCircle className="size-5 lg:size-6 mr-2" />,
    },
    eventInformation: {
      label: t("EventInformation"),
      icon: <SvgCalendarDateRange className="size-5 lg:size-6 mr-2" />,
    },
  };

  const [activeNav, setActiveNav] =
    useState<keyof AccountSettingNavigation>("accountInformation");

  const leftNavigationRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleSectionNav = useCallback(
    (id: string) => {
      setActiveNav(id as keyof AccountSettingNavigation);

      // Update URL with shallow routing
      const newUrl = `${pathname.split("#")[0]}?section=${id}`;
      router.push(newUrl, { scroll: false });

      const targetElement = leftNavigationRefs.current[id];
      if (targetElement) {
        const navbarHeight = document.querySelector("nav")?.clientHeight || 0;

        window.scrollTo({
          top: targetElement.offsetTop - navbarHeight,
          behavior: "smooth",
        });
      }
    },
    [setActiveNav, leftNavigationRefs, router, pathname],
  );

  useEffect(() => {
    const determineSectionInView = () => {
      const navbarHeight = document.querySelector("nav")?.clientHeight || 0;
      let currentSection: keyof AccountSettingNavigation | null = null;

      for (const navKey in leftNavigationRefs.current) {
        const element = leftNavigationRefs.current[navKey];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (
            rect.top - navbarHeight <= 200 &&
            rect.bottom - navbarHeight > 200
          ) {
            currentSection = navKey as keyof AccountSettingNavigation;
            break;
          }
        }
      }

      if (currentSection && currentSection !== activeNav) {
        setActiveNav(currentSection);

        // Update URL when user scrolls
        const newUrl = `${pathname.split("?")[0]}?section=${currentSection}`;
        router.replace(newUrl, { scroll: false });
      }
    };

    window.addEventListener("scroll", determineSectionInView);
    return () => window.removeEventListener("scroll", determineSectionInView);
  }, [activeNav, pathname, router]);

  return (
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
                      activeNav === nav && "bg-brand/30 font-medium rounded-lg",
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
          <div ref={(el: any) => (leftNavigationRefs.current["aboutUs"] = el)}>
            <AccountSettingCard id="aboutUs">
              <AboutUsWrapper />
            </AccountSettingCard>
          </div>{" "}
          <div
            ref={(el: any) =>
              (leftNavigationRefs.current["privacyPolicy"] = el)
            }
            onClick={() =>
              router.push(
                `${process.env.NEXT_PUBLIC_APP_URL}/content/privacy-and-policy`,
              )
            }
          >
            <AccountSettingCard id="privacyPolicy">
              <PrivacyPolicyWrapper />
            </AccountSettingCard>
          </div>
          <div
            ref={(el: any) =>
              (leftNavigationRefs.current["returnExchange"] = el)
            }
            onClick={() =>
              router.push(
                `${process.env.NEXT_PUBLIC_APP_URL}/content/return-and-exchange`,
              )
            }
          >
            <AccountSettingCard id="returnExchange">
              <ReturnExchangeWrapper />
            </AccountSettingCard>
          </div>
          <div
            ref={(el: any) =>
              (leftNavigationRefs.current["ordersAndPayment"] = el)
            }
          >
            <AccountSettingCard id="ordersAndPayment">
              <OrdersPaymentWrapper />
            </AccountSettingCard>
          </div>
          <div
            ref={(el: any) =>
              (leftNavigationRefs.current["shippingInformation"] = el)
            }
          >
            <AccountSettingCard id="shippingInformation">
              <ShippingInfoWrapper />
            </AccountSettingCard>
          </div>
          <div ref={(el: any) => (leftNavigationRefs.current["faq"] = el)}>
            <AccountSettingCard id="faq">
              <FaqWrapper />
            </AccountSettingCard>
          </div>
          <div
            ref={(el: any) =>
              (leftNavigationRefs.current["eventInformation"] = el)
            }
          >
            <AccountSettingCard id="eventInformation">
              <EventInfoWrapper />
            </AccountSettingCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerServiceContainer;
