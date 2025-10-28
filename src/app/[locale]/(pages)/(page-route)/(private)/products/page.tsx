import { Suspense } from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import ProductsWrapper from "@/components/Products/ProductsWrapper";
import Drawer from "@/components/Drawer";

// apis
import { getProductsByCategory } from "@/api/products/getProductsByCategory";

import { DEFAULT_SHOW_COUNT } from "@/utils/constants";
import { SvgSpinner } from "@/assets/svg";
import { LocalePropsType } from "@/types";
import PageTitle from "@/components/ui/PageTitle";
import { useTranslations } from "next-intl";

type SearchParams = {
  subCategory?: string;
  show?: string;
  sortBy: string | null;
  url: string;
};

export async function generateMetadata({
  params,
}: LocalePropsType): Promise<Metadata> {
  const locale = params.locale;

  const tProducts = await getTranslations({ locale, namespace: "Products" });

  return {
    title: `${tProducts("Products")}`,
    description: `${tProducts("Products")}`,
  };
}

const RenderSpinner = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <SvgSpinner />
    </div>
  );
};

async function ProductsByCategory({ url, sortBy, show }: SearchParams) {
  const productByCategory = await getProductsByCategory(url, sortBy);

  return (
    <>
      <ProductsWrapper productByCategory={productByCategory} showCount={show} />
      <Drawer categoryData={productByCategory} />
    </>
  );
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const tProducts = useTranslations("Products");
  const urlParams = searchParams?.url;
  const showCount = searchParams?.show || DEFAULT_SHOW_COUNT.toString();
  const sort = searchParams?.sortBy || null;

  return (
    <>
      <section className="container mx-auto px-4 pb-10 min-h-screen">
        <PageTitle withTitle content={tProducts("Products")} />
        <Suspense fallback={<RenderSpinner />}>
          <ProductsByCategory sortBy={sort} url={urlParams} show={showCount} />
        </Suspense>
      </section>
    </>
  );
}
