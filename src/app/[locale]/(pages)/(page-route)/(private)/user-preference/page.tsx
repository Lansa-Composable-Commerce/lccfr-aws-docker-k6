import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

import PageTitle from "@/components/ui/PageTitle";
import PreferenceList from "@/components/userPreferences/PreferenceList";
import RenderSpinner from "@/components/ui/RenderSpinner";

import { getPreferences } from "@/api/userPreferences/getPreferences";

import { LocalePropsType, UserPreferenceList } from "@/types";

export async function generateMetadata({
  params,
}: LocalePropsType): Promise<Metadata> {
  const locale = params.locale;

  const t = await getTranslations({ locale, namespace: "UsrPrefrnc" });

  return {
    title: t("UserPreferences"),
    description: t("UserPreferences"),
  };
}

async function PreferencesWrapper() {
  const preferencesData: UserPreferenceList[] = await getPreferences();

  return <PreferenceList preferencesData={preferencesData} />;
}

export default function UserPreferencePage() {
  const t = useTranslations("UsrPrefrnc");

  return (
    <div className="page">
      <PageTitle withTitle content={t("UserPreferences")} />
      <Suspense fallback={<RenderSpinner />}>
        <PreferencesWrapper />
      </Suspense>
    </div>
  );
}
