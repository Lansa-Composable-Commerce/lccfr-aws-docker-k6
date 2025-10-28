import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import ProductDetails from "@/components/Products/ProductDetails";

import { getProductsDetails } from "@/api/products/getProductDetails";

type Props = {
  params: { locale: string; slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale;

  const tSearch = await getTranslations({ locale, namespace: "Search" });

  return {
    title: `${tSearch("SearchResult")} - ${params.slug}`,
    description: `${tSearch("SearchResult")} - ${params.slug}`,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const productData = await getProductsDetails(params.slug);

  return (
    <div className="md:container mx-auto px-4">
      <ProductDetails productData={productData?.data} />
    </div>
  );
}
