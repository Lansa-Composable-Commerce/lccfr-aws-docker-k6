import OrdersPaymentWrapper from "@/components/content/OrdersPaymentWrapper";
import { LocalePropsType } from "@/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: LocalePropsType): Promise<Metadata> {
  const locale = params.locale;

  const t = await getTranslations({ locale, namespace: "CstmSrvc" });

  return {
    title: `${t("OrdersPayment")}`,
    description: `${t("OrdersPayment")}`,
  };
}

export default function OrdersAndPaymentPage() {
  return <OrdersPaymentWrapper />;
}
