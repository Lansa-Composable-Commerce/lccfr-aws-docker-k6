"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import SearchModal from "@/components/SearchModal";
import CategoryFilter from "@/components/searchResult/FiltersSearch";
import ProductList from "@/components/Products/ProductList";

import { useAppDispatch } from "@/lib/hooks";
import {
  onRemoveHandSideChip,
  onRemoveOptionLoft,
  removeFilterCategory,
} from "@/lib/features/products/productsSlice";

const SearchResultWrapper = ({
  productSearchData,
  showCount,
}: {
  productSearchData: any;
  showCount: string;
}) => {
  const dispatch = useAppDispatch();
  const tSearch = useTranslations("Search");

  const searchResultData = productSearchData?.data?.products;

  useEffect(() => {
    dispatch(onRemoveHandSideChip());
    dispatch(removeFilterCategory());
    dispatch(onRemoveOptionLoft());
  }, []);

  return (
    <>
      <div>
        <div className="grow w-full h-full">
          {searchResultData && (
            <div className="mt-7 flex flex-row gap-6">
              <div className="hidden pr-3 border-r border-dashed w-full flex-none max-w-[200px] xl:block xl:max-w-[300px] dark:border-slate-700">
                <CategoryFilter
                  label={tSearch("Categories")}
                  categoryData={productSearchData}
                />
              </div>
              <div className="grow w-full h-full">
                <ProductList
                  productList={searchResultData}
                  showCount={showCount}
                />
              </div>
            </div>
          )}
        </div>
        <SearchModal />
      </div>
    </>
  );
};

export default SearchResultWrapper;
