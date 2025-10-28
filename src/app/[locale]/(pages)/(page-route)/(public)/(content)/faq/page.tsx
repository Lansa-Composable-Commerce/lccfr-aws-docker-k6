import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import FaqWrapper from "@/components/content/FaqWrapper";

import { LocalePropsType } from "@/types";

export async function generateMetadata({
  params,
}: LocalePropsType): Promise<Metadata> {
  const locale = params.locale;

  const t = await getTranslations({ locale, namespace: "CstmSrvc" });

  return {
    title: `${t("Faq")}`,
    description: `${t("Faq")}`,
  };
}

export default function FaqPage() {
  return <FaqWrapper />;
}
