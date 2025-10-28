import EventInfoWrapper from "@/components/content/EventInfoWrapper";
import { LocalePropsType } from "@/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: LocalePropsType): Promise<Metadata> {
  const locale = params.locale;

  const t = await getTranslations({ locale, namespace: "CstmSrvc" });

  return {
    title: `${t("EventInformation")}`,
    description: `${t("EventInformation")}`,
  };
}

export default function EventInformationPage() {
  return <EventInfoWrapper />;
}
