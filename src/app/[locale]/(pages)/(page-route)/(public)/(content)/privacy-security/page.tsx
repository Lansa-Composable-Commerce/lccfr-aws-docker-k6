import PrivacyPolicyWrapper from "@/components/content/PrivacyPolicyWrapper";
import { LocalePropsType } from "@/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: LocalePropsType): Promise<Metadata> {
  const locale = params.locale;

  const t = await getTranslations({ locale, namespace: "CstmSrvc" });

  return {
    title: `${t("PrivacyPolicy")}`,
    description: `${t("PrivacyPolicy")}`,
  };
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyWrapper />;
}
