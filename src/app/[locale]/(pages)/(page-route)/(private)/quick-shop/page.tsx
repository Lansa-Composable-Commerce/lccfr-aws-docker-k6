import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

// components
import QuickShopList from "@/components/QuickShop/QuickShopList";
import QuickShopTitle from "@/components/QuickShop/QuickShopTitle";
import QuickShopModal from "@/components/QuickShop/QuickShopModal";
import QuickShopImportDataModal from "@/components/QuickShop/QuickShopImportDataModal";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale;

  const tQuickShop = await getTranslations({ locale, namespace: "quickshop" });

  return {
    title: `${tQuickShop("QuickShop")}`,
    description: `${tQuickShop("QuickShop")}`,
  };
}

export default async function QuickShopPage() {
  return (
    <div className="page">
      <QuickShopTitle />
      <QuickShopList />
      <QuickShopModal />
      <QuickShopImportDataModal />
    </div>
  );
}
