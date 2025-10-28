import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import AccountSettingContainer from "@/components/accountSettings/AccountSettingContainer";
import { getUserProfile } from "@/api/account-settings/getUserProfile";

import { LocalePropsType } from "@/types";
import { getCountries } from "@/api/getCountries";
import { getCookieValue } from "@/utils/cookies";
import { COOKIE_ACCESS_TOKEN } from "@/lib/auth/session";

export async function generateMetadata({
  params,
}: LocalePropsType): Promise<Metadata> {
  const locale = params.locale;

  const t = await getTranslations({ locale, namespace: "UsrSetting" });

  return {
    title: t("AccountSettings"),
    description: t("AccountSettings"),
  };
}

export default async function AccountSettingsPage() {
  const accessCookieValue = getCookieValue(COOKIE_ACCESS_TOKEN.name);

  const user: any = await getUserProfile();
  const countries: any = await getCountries();

  return (
    <div className="page">
      <AccountSettingContainer
        user={user}
        countries={countries}
        accessCookieValue={accessCookieValue}
      />
    </div>
  );
}
