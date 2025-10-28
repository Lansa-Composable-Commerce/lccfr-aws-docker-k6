import { Suspense } from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import SearchResultWrapper from "@/components/searchResult/SearchResultWrapper";

import { getProducts } from "@/api/products/getProducts";

import { DEFAULT_SHOW_COUNT } from "@/utils/constants";

import { SvgSpinner } from "@/assets/svg";
import { useTranslations } from "next-intl";
import PageTitle from "@/components/ui/PageTitle";

type MetaProps = {
  params: { locale: string };
};

type Props = {
  searchParams: {
    search: string;
    show: string;
    sortBy: string | null;
  };
};

export async function generateMetadata({
  params,
}: MetaProps): Promise<Metadata> {
  const locale = params.locale;

  const tSearch = await getTranslations({ locale, namespace: "Search" });

  return {
    title: `${tSearch("SearchResult")}`,
    description: `${tSearch("SearchResult")}`,
  };
}

const RenderSpinner = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <SvgSpinner />
    </div>
  );
};

async function SearchProducts({ searchParams }: Props) {
  const { search, show, sortBy } = searchParams;

  const productSearchData = await getProducts(search, sortBy);

  return (
    <SearchResultWrapper
      productSearchData={productSearchData}
      showCount={show}
    />
  );
}

export default function SearchResultPage({ searchParams }: Props) {
  const tSearch = useTranslations("Search");
  const querySearch = searchParams?.search;
  const showCount = searchParams?.show || DEFAULT_SHOW_COUNT.toString();
  const sort = searchParams?.sortBy || null;

  return (
    <div className="container mx-auto px-4 pb-10 min-h-screen">
      <PageTitle
        withTitle
        content={
          querySearch && `${tSearch("SearchResultsFor")} “${querySearch}”`
        }
        backText={tSearch("Back")}
      />
      <Suspense fallback={<RenderSpinner />}>
        <SearchProducts
          searchParams={{ search: querySearch, show: showCount, sortBy: sort }}
        />
      </Suspense>
    </div>
  );
}
