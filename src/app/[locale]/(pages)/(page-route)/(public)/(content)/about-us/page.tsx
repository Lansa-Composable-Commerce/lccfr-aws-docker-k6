import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import AboutUsWrapper from "@/components/content/AboutUsWrapper";

import { LocalePropsType } from "@/types";

export async function generateMetadata({
  params,
}: LocalePropsType): Promise<Metadata> {
  const locale = params.locale;

  const t = await getTranslations({ locale, namespace: "CstmSrvc" });

  return {
    title: `${t("AboutUs")}`,
    description: `${t("AboutUs")}`,
  };
}

export default function AboutUsPage() {
  return <AboutUsWrapper />;
}
