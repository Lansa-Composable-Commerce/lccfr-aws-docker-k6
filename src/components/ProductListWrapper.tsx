"use client";

import React from "react";
import classNames from "classnames";
import { usePagination } from "@storefront-ui/react";
import { useTranslations } from "next-intl";

import ProductCard from "@/components/Products/ProductCard";
import { Pagination } from "@/components/ui/Pagination";
import EmptyPlaceholder from "@/components/EmptyPlaceholder";
import GridList from "@/components/GridList";

import { useAppSelector } from "@/lib/hooks";
import { selectGridSwitch } from "@/lib/features/global/globalSlice";

import {
  ITEM_PER_PAGE,
  PAGINATION_CURRENT_PAGE,
  PAGINATION_MAX_PAGES,
  PAGINATION_PAGE_SIZE,
} from "@/utils/constants";

import { ProductTypes } from "@/types";

interface ProductListWrapperProps {
  products: ProductTypes[];
  showTopPagination?: boolean;
}

const ProductListWrapper: React.FC<ProductListWrapperProps> = ({
  products,
  showTopPagination = true,
}) => {
  const tMyProducts = useTranslations("MyProducts");
  const isGridView = useAppSelector(selectGridSwitch);

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
    totalItems: products.length,
    currentPage: PAGINATION_CURRENT_PAGE,
    pageSize: Number(ITEM_PER_PAGE) || PAGINATION_PAGE_SIZE,
    maxPages: PAGINATION_MAX_PAGES,
  });

  const productsPerPage = Number(ITEM_PER_PAGE) || PAGINATION_PAGE_SIZE;

  const getVisibleProducts = () => {
    const startIndex = (selectedPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, products.length);
    return products.slice(startIndex, endIndex);
  };
  const hasProducts = products.length > 0;

  return (
    <>
      {/* Top pagination*/}
      {showTopPagination && hasProducts && (
        <>
          <div className="my-4 w-full flex flex-col items-center justify-center">
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
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs sm:text-sm lg:text-base">
              {products.length > ITEM_PER_PAGE
                ? ITEM_PER_PAGE
                : products.length}{" "}
              {tMyProducts("Out")}{" "}
              <span className="font-medium">{products.length}</span>{" "}
              {tMyProducts("Products")}
            </p>
            <GridList />
          </div>
        </>
      )}
      {/* Product List */}
      {hasProducts ? (
        <section
          className={classNames(
            "text-center grid gap-4",
            !isGridView
              ? "grid-cols-1 xl:grid-cols-2"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
          )}
        >
          {getVisibleProducts &&
            getVisibleProducts().map((product: ProductTypes) => (
              <ProductCard
                product={product}
                key={product.LW3ITEMCD}
                view={isGridView}
                hideFavBtn={true}
                removeFavBtn={true}
              />
            ))}
        </section>
      ) : (
        <div className="w-full grid place-items-center">
          <EmptyPlaceholder>
            <p className="text-sm lg:text-2xl text-center font-medium text-gray-600 tracking-wide">
              {tMyProducts("NoProductsFound")}
            </p>
          </EmptyPlaceholder>
        </div>
      )}
      {/* Bottom pagination*/}
      {hasProducts && (
        <div className="my-6 w-full flex flex-col items-center justify-center">
          <Pagination
            pages={pages}
            totalPages={totalPages}
            selectedPage={selectedPage}
            startPage={startPage}
            endPage={endPage}
            setPage={setPage}
            maxVisiblePages={maxVisiblePages}
            next={next}
            prev={prev}
          />
        </div>
      )}
    </>
  );
};

export default ProductListWrapper;
