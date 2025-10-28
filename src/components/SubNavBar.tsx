"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { Moon, Sun } from "@/assets/svg";
import { Link, Locale, usePathname, useRouter } from "@/i18n/routing";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import useLogout from "@/lib/hooks/useLogout";
import { Storefront } from "@/types";
import { useAppDispatch } from "@/lib/hooks";
import { useClearAuthMessage } from "@/lib/hooks/useClearAuthMessage";
import useGetUserInformation from "@/lib/hooks/useGetUserInformation";
import { setStorefrontDetails } from "@/lib/features/storefront/storefrontSlice";

const AuthButtons = () => {
  const pathname = usePathname();
  const tLogin = useTranslations("Login");
  const clearMessages = useClearAuthMessage();

  return (
    <>
      {pathname === "/login" ? (
        <Link
          href="/register"
          prefetch={false}
          onClick={clearMessages}
          className="hover:text-gray-200"
        >
          {tLogin("Register")}
        </Link>
      ) : (
        <Link
          href="/login"
          prefetch={false}
          onClick={clearMessages}
          className="hover:text-gray-200"
        >
          {tLogin("Login")}
        </Link>
      )}
    </>
  );
};

const SubNavBar = ({
  cookieValue,
  storefront,
}: {
  cookieValue: string | undefined;
  storefront: Storefront;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const tGlobal = useTranslations("Global");
  const searchParams = useSearchParams();
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const clearMessages = useClearAuthMessage();
  const user = useGetUserInformation(cookieValue);

  const updatedSearchParams = new URLSearchParams(searchParams);

  const isOnContactUs = pathname === "/contact-us";

  const userFirstname = user?.firstname;
  const displayName = userFirstname
    ? userFirstname[0].toUpperCase() + userFirstname.slice(1)
    : "Guest";

  const logout = useLogout();

  const [isLight, setIsLight] = useState<string | undefined>("");

  function handleUpdateLocale(e: ChangeEvent<HTMLSelectElement>) {
    const newLocale = e.target.value as Locale;

    router.replace(`${pathname}?${updatedSearchParams.toString()}`, {
      locale: newLocale,
    });
  }

  useEffect(() => {
    dispatch(setStorefrontDetails(storefront));
  }, []);

  useEffect(() => {
    setIsLight(theme);
  }, [theme]);

  return (
    <div
      className="hidden lg:block bg-brand h-[32px] lg:h-[42px] w-full"
      role="navigation"
    >
      <div className="container mx-auto px-4 h-full w-full">
        <div className="flex items-center justify-between gap-2 h-full text-xs text-white">
          <div className="flex items-center justify-center gap-2">
            {isLight === "light" ? (
              <Sun
                onClick={() => setTheme("dark")}
                className="size-4 cursor-pointer"
              />
            ) : (
              <Moon
                onClick={() => setTheme("light")}
                className="size-4 cursor-pointer"
              />
            )}
            <div className="h-4 w-1 text-white border-l">&nbsp;</div>
            <div className="flex items-center gap-3">
              <select
                name="lang"
                id="lang-select"
                defaultValue={locale}
                onChange={handleUpdateLocale}
                className="cursor-pointer"
                aria-label="Lang-Select"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="de">DE</option>
                <option value="fr">FR</option>
              </select>
            </div>
            <div className="h-4 w-1 text-white border-l">&nbsp;</div>
            <Link
              href={user && isOnContactUs ? "/" : "/contact-us"}
              className="hover:text-gray-200 mr-8"
              onClick={clearMessages}
              prefetch={false}
            >
              {tGlobal(user && isOnContactUs ? "Home" : "ContactUs")}
            </Link>
          </div>
          <div className={"flex gap-2"}>
            {user?.username ? (
              <>
                <p>
                  {tGlobal("Welcome")}, {displayName}
                  {user.customerNumber &&
                    ` (${user.customerNumber} - ${user.customerName})`}
                </p>
                <div className="h-4 w-1 text-white border-l">&nbsp;</div>
                <button className="hover:text-gray-200" onClick={logout}>
                  {tGlobal("LogOut")}
                </button>
              </>
            ) : (
              <>
                <p>
                  {tGlobal("Welcome")}, {tGlobal("Guest")}
                </p>
                <div className="h-4 w-1 text-white border-l">&nbsp;</div>
                <AuthButtons />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubNavBar;
