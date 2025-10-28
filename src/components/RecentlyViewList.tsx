"use client";

import React from "react";
import classNames from "classnames";
import { usePagination } from "@storefront-ui/react";

import ProductCard from "@/components/Products/ProductCard";
import { Pagination } from "@/components/ui/Pagination";

import { useAppSelector } from "@/lib/hooks";
import { selectGridSwitch } from "@/lib/features/global/globalSlice";
import {
  PAGINATION_CURRENT_PAGE,
  PAGINATION_MAX_PAGES,
  PAGINATION_PAGE_SIZE,
} from "@/utils/constants";

import { ProductTypes } from "@/types";

const RecentlyViewList = ({ productList, showCount }: any) => {
  const selectIsGrid = useAppSelector(selectGridSwitch);
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
    totalItems: productList?.length,
    currentPage: PAGINATION_CURRENT_PAGE,
    pageSize: Number(showCount) || PAGINATION_PAGE_SIZE,
    maxPages: PAGINATION_MAX_PAGES,
  });

  const itemsPerPage = Number(showCount) || PAGINATION_PAGE_SIZE; // Convenience variable

  const getVisibleItems = () => {
    const startIndex = (selectedPage - PAGINATION_CURRENT_PAGE) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, productList?.length);
    return productList.slice(startIndex, endIndex);
  };
  return (
    <>
      <div
        className={classNames(
          "text-center grid gap-4 lg:gap-6",
          selectIsGrid
            ? "grid-cols-1 xl:grid-cols-2"
            : "xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4",
        )}
      >
        {getVisibleItems &&
          getVisibleItems().map((product: ProductTypes, id: number) => (
            <ProductCard product={product} key={id} view={selectIsGrid} />
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
  );
};

export default RecentlyViewList;
