import ShippingInfoWrapper from "@/components/content/ShippingInfoWrapper";
import { LocalePropsType } from "@/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: LocalePropsType): Promise<Metadata> {
  const locale = params.locale;

  const t = await getTranslations({ locale, namespace: "CstmSrvc" });

  return {
    title: `${t("ShippingInformation")}`,
    description: `${t("ShippingInformation")}`,
  };
}

export default function ShippingInformationPage() {
  return <ShippingInfoWrapper />;
}
