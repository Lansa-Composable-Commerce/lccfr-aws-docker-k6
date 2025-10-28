"use client";

import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { usePagination } from "@storefront-ui/react";
import { useTranslations } from "next-intl";

import ProductCard from "@/components/Products/ProductCard";
import { Pagination } from "@/components/ui/Pagination";

import { useAppSelector } from "@/lib/hooks";
import { selectGridSwitch } from "@/lib/features/global/globalSlice";
import { useDisplayToastMessage } from "@/lib/hooks/useDisplayToastMessage";
import {
  selectCategoryName,
  selectIsFavoritesMessages,
  selectIsStatus,
  selectOptionHand,
  selectOptionHandText,
  selectOptionLoft,
} from "@/lib/features/products/productsSlice";

import {
  PAGINATION_CURRENT_PAGE,
  PAGINATION_MAX_PAGES,
  PAGINATION_PAGE_SIZE,
} from "@/utils/constants";

import { ProductTypes } from "@/types";
import { useSearchParams } from "next/navigation";

interface ProductSearchListProps {
  productList: ProductTypes[]; // Make productList optional
  showCount: string;
}

const ProductSearchList: React.FC<ProductSearchListProps> = ({
  productList,
  showCount,
}) => {
  const tProducts: any = useTranslations("Products");

  const searchParams = useSearchParams();

  const categoryQueryParams: any = searchParams.get("category");
  const subCategoryQueryParams: any = searchParams.get("subCategory");
  const sortByQueryParams: any = searchParams.get("sortBy");

  const selectIsGrid = useAppSelector(selectGridSwitch);
  const selectOptionHandSide = useAppSelector(selectOptionHand);
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

  const filterProductList = productList.filter(
    (item: any) => item.LW3CATNAM === categoryName,
  );

  const filteredProducts = useMemo(() => {
    let filtered = [...newProductList];

    if (handSideText) {
      filtered = filtered.filter(
        (golf: any) => golf.W_LEFTHND === selectOptionHandSide,
      );
    }

    if (selectOptionLoftData.length > 0) {
      filtered = filtered.filter((item: any) =>
        selectOptionLoftData.includes(item.W_LOFT),
      );
    }

    return filtered;
  }, [
    newProductList,
    selectOptionHandSide,
    selectOptionLoftData,
    handSideText,
  ]);

  useEffect(() => {
    if (categoryName === "") {
      setNewProductList(productList);
      return;
    }

    setNewProductList(filterProductList);
  }, [
    categoryName,
    categoryQueryParams,
    subCategoryQueryParams,
    sortByQueryParams,
    productList,
  ]);

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
    totalItems: productList?.length || 0,
    currentPage: PAGINATION_CURRENT_PAGE,
    pageSize: Number(showCount) || PAGINATION_PAGE_SIZE,
    maxPages: PAGINATION_MAX_PAGES,
  });

  useEffect(() => {
    setPage(1);
  }, [productList]);

  const itemsPerPage = Number(showCount) || PAGINATION_PAGE_SIZE;

  const getVisibleItems = () => {
    if (!productList || productList.length === 0) return []; // Return empty array if no products

    const startIndex = (selectedPage - 1) * itemsPerPage;

    const endIndex = Math.min(startIndex + itemsPerPage, productList.length);

    return productList.slice(startIndex, endIndex);
  };

  if (!productList || productList.length === 0) {
    // Check for empty or undefined data

    return (
      <section>
        <h5 className="text-sm lg:text-2xl text-center font-medium text-gray-600 tracking-wide">
          {tProducts("NoProductsFound")}
        </h5>
      </section>
    );
  }

  return (
    <div className="flex flex-col">
      <section
        className={classNames(
          "mb-5 text-center grid gap-4 lg:gap-6",
          selectIsGrid
            ? "grid-cols-1 xl:grid-cols-2"
            : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        )}
      >
        {getVisibleItems &&
          getVisibleItems().map((product: ProductTypes, id: number) => (
            <ProductCard product={product} key={id} view={selectIsGrid} />
          ))}
      </section>
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
  );
};

export default ProductSearchList;
