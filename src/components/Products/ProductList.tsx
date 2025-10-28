"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { usePagination } from "@storefront-ui/react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import ProductCard from "@/components/Products/ProductCard";
import { Pagination } from "@/components/ui/Pagination";
import Chip from "@/components/globalUI/Chip";
import SortOption from "@/components/ui/SortOption";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectGridSwitch } from "@/lib/features/global/globalSlice";
import {
  onRemoveHandSideChip,
  onSetLoftOption,
  selectCategoryName,
  selectIsFavoritesMessages,
  selectIsStatus,
  selectOptionHandText,
  selectOptionLoft,
} from "@/lib/features/products/productsSlice";

import {
  PAGINATION_CURRENT_PAGE,
  PAGINATION_MAX_PAGES,
  PAGINATION_PAGE_SIZE,
} from "@/utils/constants";

import { ProductTypes } from "@/types";

import { SvgXMark } from "@/assets/svg";
import { useDisplayToastMessage } from "@/lib/hooks/useDisplayToastMessage";
import EmptyPlaceholder from "@/components/EmptyPlaceholder";

export default function ProductList({
  productList,
  showCount,
}: {
  productList: ProductTypes[];
  showCount: string | undefined;
}) {
  const tProducts: any = useTranslations("Products");

  const searchParams = useSearchParams();

  const sortByQueryParams: any = searchParams.get("sortBy");

  const selectIsGrid = useAppSelector(selectGridSwitch);

  const handSideText = useAppSelector(selectOptionHandText);
  const selectOptionLoftData: any = useAppSelector(selectOptionLoft);
  const categoryName: any = useAppSelector(selectCategoryName);
  const selectIsFavoriteSuccessMessage = useAppSelector(
    selectIsFavoritesMessages,
  );
  const selectIsToastType = useAppSelector(selectIsStatus);

  useDisplayToastMessage({
    status: selectIsToastType,
    messages: selectIsFavoriteSuccessMessage,
  });

  const [newProductList, setNewProductList] = useState<ProductTypes[]>([]);
  const [sortBy, setSortBy] = useState<string | undefined>(sortByQueryParams);

  const filterProductList = productList.filter(
    (item: any) => item.LW3CATNAM === categoryName,
  );

  const filteredProducts = useMemo(() => {
    let filtered = [...newProductList];

    if (handSideText === "Left Hand") {
      filtered = filtered.filter((golf: any) => golf.W_LEFTHND === true);
    }
    if (handSideText === "Right Hand") {
      filtered = filtered.filter((golf: any) => golf.W_RGHTHND === true);
    }

    if (selectOptionLoftData.length > 0) {
      filtered = filtered.filter((item: any) =>
        selectOptionLoftData.includes(item.W_LOFT),
      );
    }

    return filtered;
  }, [newProductList, selectOptionLoftData, handSideText]);

  //sort functions
  const sortFunctions: any = {
    productID: (a: any, b: any) => a.LW3ITEMCD.localeCompare(b.LW3ITEMCD),
    "lowest-price": (a: any, b: any) => a.LW3LPRICE - b.LW3LPRICE,
    "highest-price": (a: any, b: any) => b.LW3LPRICE - a.LW3LPRICE,
    description: (a: any, b: any) => a.LW3IDESC.localeCompare(b.LW3IDESC),
  };
  // sorting
  const sortedProducts = useMemo(() => {
    const sortKey = sortBy || "productID";
    let sorted = [...filteredProducts];

    if (sortFunctions[sortKey]) {
      sorted.sort(sortFunctions[sortKey]);
    }
    return sorted;
  }, [sortBy, filteredProducts]);

  useEffect(() => {
    if (categoryName === "") {
      setNewProductList(productList);
      return;
    }
    setNewProductList(filterProductList);
  }, [categoryName, productList]);

  useEffect(() => {
    if (sortByQueryParams) {
      setSortBy(sortByQueryParams);
    }
  }, [sortByQueryParams]);

  const {
    totalPages,
    pages,
    selectedPage,
    startPage,
    endPage,
    next,
    prev,
    setPage,
    maxVisiblePages,
  } = usePagination({
    totalItems: filteredProducts.length,
    currentPage: PAGINATION_CURRENT_PAGE,
    pageSize: Number(showCount) || PAGINATION_PAGE_SIZE,
    maxPages: PAGINATION_MAX_PAGES,
  });

  const filterKey = useMemo(() => {
    return JSON.stringify({ handSideText, selectOptionLoftData, categoryName });
  }, [handSideText, selectOptionLoftData, categoryName]);

  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  const itemsPerPage = Number(showCount) || PAGINATION_PAGE_SIZE;

  const getVisibleItems = () => {
    const startIndex = (selectedPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, sortedProducts.length);
    return sortedProducts.slice(startIndex, endIndex);
  };

  const handleSortChange = (sortOption: string | undefined) => {
    setSortBy(sortOption);
  };

  useEffect(() => {
    setNewProductList(productList);
  }, [productList]);

  const handleFavoriteToggleInList = useCallback(
    (productId: string, isFavorite: boolean) => {
      setNewProductList((currentProducts) =>
        currentProducts.map((p) =>
          p.LW3ITEMCD === productId
            ? { ...p, W_FLAGP: isFavorite ? "N" : "Y" }
            : p,
        ),
      );
    },
    [],
  );

  return (
    <>
      <SortOption
        resultCount={filteredProducts.length}
        handleSortChange={handleSortChange}
        sortByValueFromURL={sortBy}
      />
      <RenderProductFilterChip
        handSideText={handSideText}
        selectOptionLoftData={selectOptionLoftData}
      />
      {productList.length > 0 ? (
        <>
          {getVisibleItems().length > 0 ? (
            <>
              <div
                className={classNames(
                  "text-center grid gap-3 md:gap-4 lg:gap-4",
                  !selectIsGrid ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3",
                )}
              >
                {getVisibleItems().map((product: ProductTypes, id: number) => (
                  <ProductCard
                    key={`${product.LW3ITEMCD}-${id}`}
                    product={product}
                    view={selectIsGrid}
                    onFavoriteToggle={handleFavoriteToggleInList}
                  />
                ))}
              </div>
              <div className="mt-10">
                <Pagination
                  pages={pages}
                  totalPages={totalPages}
                  selectedPage={selectedPage}
                  startPage={startPage}
                  endPage={endPage}
                  setPage={setPage}
                  maxVisiblePages={maxVisiblePages}
                  resultCount={2}
                  next={next}
                  prev={prev}
                />
              </div>
            </>
          ) : (
            <EmptyPlaceholder>
              <h5 className="text-sm lg:text-2xl text-center font-medium text-gray-600 tracking-wide">
                {tProducts("NoProductsFound")}
              </h5>
            </EmptyPlaceholder>
          )}
        </>
      ) : (
        <EmptyPlaceholder>
          <h5 className="text-sm lg:text-2xl text-center font-medium text-gray-600 tracking-wide">
            {tProducts("NoProductsFound")}
          </h5>
        </EmptyPlaceholder>
      )}
    </>
  );
}

const RenderProductFilterChip = ({
  handSideText,
  selectOptionLoftData,
}: {
  handSideText: string;
  selectOptionLoftData: any;
}) => {
  const dispatch = useAppDispatch();

  const handleRemoveChip = (val: string) => {
    // @ts-ignore
    dispatch(
      onSetLoftOption(selectOptionLoftData.filter((item: any) => item !== val)),
    );
  };

  const handleRemoveHandSideChip = () => {
    // @ts-ignore
    dispatch(onRemoveHandSideChip());
  };

  return (
    <div className="m-3">
      <div className="flex flex-wrap gap-2">
        {handSideText.length > 0 && (
          <Chip
            inputProps={{
              checked: true,
              onChange: () => handleRemoveHandSideChip(),
            }}
            slotSuffix={
              <SvgXMark className="size-4 text-neutral-500 hover:text-primary-800 active:text-primary-900 disabled:opacity-20 dark:hover:text-gray-400" />
            }
          >
            <p className="text-sm font-medium capitalize">{handSideText}</p>
          </Chip>
        )}
        {selectOptionLoftData.map((item: any, index: number) => (
          <Chip
            key={index}
            inputProps={{
              checked: true,
              onChange: () => handleRemoveChip(item),
            }}
            slotSuffix={
              <SvgXMark className="size-4 text-neutral-500 hover:text-primary-800 active:text-primary-900 disabled:opacity-20 dark:hover:text-gray-400" />
            }
          >
            <h5 className="text-sm font-medium capitalize">{item}</h5>
          </Chip>
        ))}
      </div>
    </div>
  );
};
