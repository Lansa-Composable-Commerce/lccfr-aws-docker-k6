import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import MyProductTitle from "@/components/MyProducts/MyProductTitle";
import MyProductListTable from "@/components/tables/myproducts/MyProductListTable";
import MyProductsAddItemModal from "@/components/MyProducts/MyProductsAddItemModal";

import { getMyProducts } from "@/api/myProducts/getMyProducts";

import { LocalePropsType } from "@/types";
import MyProductAddUpdate from "@/components/MyProducts/MyProductAddUpdate";

export async function generateMetadata({
  params,
}: LocalePropsType): Promise<Metadata> {
  const locale = params.locale;

  const tMyProducts = await getTranslations({
    locale,
    namespace: "MyProducts",
  });

  return {
    title: `${tMyProducts("MyProducts")}`,
    description: `${tMyProducts("MyProducts")}`,
  };
}

export default async function Page() {
  const myProducts = await getMyProducts();

  return (
    <div className="page">
      <MyProductTitle />
      <MyProductAddUpdate />
      <MyProductListTable products={myProducts?.data} />
      <MyProductsAddItemModal />
    </div>
  );
}
