import ReturnExchangeWrapper from "@/components/content/ReturnExchangeWrapper";
import { LocalePropsType } from "@/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: LocalePropsType): Promise<Metadata> {
  const locale = params.locale;

  const t = await getTranslations({ locale, namespace: "CstmSrvc" });

  return {
    title: `${t("ReturnExchange")}`,
    description: `${t("ReturnExchange")}`,
  };
}

export default function ReturnAndExchangePage() {
  return <ReturnExchangeWrapper />;
}
