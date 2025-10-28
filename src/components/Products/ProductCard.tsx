"use client";

import React, { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { SfTooltip } from "@storefront-ui/react";
import { useRouter, usePathname } from "@/i18n/routing";
import { useMediaQuery } from "react-responsive";
import { useSearchParams } from "next/navigation";

import { showToast } from "@/components/globalUI/CustomToast";
import FavoriteHeartButton from "@/components/FavoriteHeartButton";
import ProductCardQuantitySelector from "@/components/Products/ProductQuantitySelector";
import Button from "@/components/globalUI/Button";
import HTMLServerParser from "@/components/HTMLServerParser";

import { createSlug } from "@/lib/helpers/createSlug";
import { useAppDispatch } from "@/lib/hooks";
import {
  addProductToFavorite,
  removeProductToFavorite,
  removeSuccessMessage,
  setItemCode,
} from "@/lib/features/products/productsSlice";

import { BASE_IMAGE_URL, BUYER_TYPE, GTM_EVENTS } from "@/utils/constants";

import { useAddToCartMutation } from "@/services/cartApi";

import { SvgBin, SvgCart, SvgSpinner } from "@/assets/svg";
import SvgNoImage from "@/assets/svg/No-Image-Placeholder.svg";
import { ProductTypes } from "@/types";
import useImageSrc from "@/lib/hooks/useImageSrc";
import { sendGTMEvent } from "@next/third-parties/google";

interface ProductCardProps {
  product: ProductTypes;
  view?: boolean;
  hideFavBtn?: boolean;
  removeFavBtn?: boolean;
  sectionName?: string;
  onFavoriteToggle?: (productId: string, isNowFavorite: boolean) => void;
}

const ProductCard = ({
  product,
  view = true,
  hideFavBtn,
  removeFavBtn,
  onFavoriteToggle,
  sectionName,
}: ProductCardProps) => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const tMessages = useTranslations("Messages");
  const tMyProducts = useTranslations("MyProducts");
  const tProducts = useTranslations("Products");
  const categoryQueryParams = searchParams.get("category");
  const subCategoryQueryParams = searchParams.get("subCategory");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [addToCart] = useAddToCartMutation();

  const [isRemovingFromFavorites, setIsRemovingFromFavorites] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsFavorite(product.W_FLAGP === "N");
  }, [product.W_FLAGP]);

  const productImage = product.LW3IMAGE || null;
  const productImageUrl = useImageSrc(
    productImage,
    BASE_IMAGE_URL || "",
    SvgNoImage,
  );

  const isAddToCartButtonDisabled =
    product?.buyerType === BUYER_TYPE ? false : !product?.W_AVLQTY;

  const handleQuantityChange = useCallback((newValue: number) => {
    setQuantity(newValue);
  }, []);

  const handleNavigateToProductDetails = useCallback(() => {
    const isPathRoot = pathName === "/";
    let productDetailsUrl = `${isPathRoot ? "/products" : pathName}/${createSlug(product?.LW3ITEMCD)}?`;
    if (categoryQueryParams) {
      productDetailsUrl += `&category=${categoryQueryParams}`;
    }
    if (subCategoryQueryParams) {
      productDetailsUrl += `&subCategory=${subCategoryQueryParams}`;
    }

    if (sectionName === "Featured" || sectionName === "Best Seller") {
      sendGTMEvent({
        event:
          sectionName === "Featured"
            ? GTM_EVENTS.CLICK_FEATURED_PRODUCT
            : GTM_EVENTS.CLICK_BEST_SELLER_PRODUCT,
        product_id: product?.LW3ITEMCD,
        product_name: product?.LW3IDESC,
        category: product?.LW3CATNAM,
      });
    }

    router.push(productDetailsUrl);
    dispatch(setItemCode(product?.LW3ITEMCD));
    dispatch(removeSuccessMessage());
  }, [
    product?.LW3ITEMCD,
    categoryQueryParams,
    subCategoryQueryParams,
    router,
    dispatch,
  ]);

  const handleAddToCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await addToCart([
        {
          productCode: product.LW3ITEMCD,
          quantity: quantity,
        },
      ]);
      if (response?.data) {
        showToast("success", tMessages(response.data.messages[0].code));

        // add to cart
        sendGTMEvent({
          event: GTM_EVENTS.ADD_TO_CART,
          currency: "USD",
          items: [
            {
              item_name: product?.LW3IDESC,
              item_id: product?.LW3ITEMCD,
              item_category: product?.LW3CATNAM || "",
              quantity: quantity,
              price: product?.LW3LPRICE,
            },
          ],
        });
      } else {
        showToast("error", "Failed to add to cart");
      }
    } catch (error) {
      showToast("error", "Failed to add to cart.");
    } finally {
      setIsLoading(false);
      setQuantity(1);
    }
  }, [addToCart, product.LW3ITEMCD, quantity, tMessages]);

  const handleToggleFavorite = useCallback(
    async (productId: string) => {
      const newIsFavoriteState = !isFavorite;
      setIsFavoriteLoading(true);
      setIsFavorite(newIsFavoriteState);

      try {
        if (newIsFavoriteState) {
          await dispatch(addProductToFavorite([productId])).unwrap();
        } else {
          await dispatch(removeProductToFavorite(productId)).unwrap();
        }

        if (typeof onFavoriteToggle === "function") {
          onFavoriteToggle(productId, newIsFavoriteState);
        } else {
          console.warn(
            "ProductCard: 'onFavoriteToggle' prop not provided. Falling back to page refetch.",
          );
        }
      } catch (error) {
        setIsFavorite(!newIsFavoriteState);
        showToast("error", "Failed to toggle favorite.");
      } finally {
        setIsFavoriteLoading(false);
      }
    },
    [dispatch, isFavorite, onFavoriteToggle, product.LW3ITEMCD],
  );

  const handleRemoveFromMyProducts = useCallback(async () => {
    try {
      setIsRemovingFromFavorites(true);
      await dispatch(removeProductToFavorite(product.LW3ITEMCD));
      // Also use the callback here if available to update the list instantly
      if (typeof onFavoriteToggle === "function") {
        onFavoriteToggle(product.LW3ITEMCD, false);
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
    } finally {
      setIsRemovingFromFavorites(false);
    }
  }, [dispatch, product.LW3ITEMCD, onFavoriteToggle]);

  return (
    <div className="product-card hover:shadow-large dark:bg-light-dark">
      <div
        className={classNames(
          "grid w-full h-full",
          !view ? "flex-row gap-3 grid-cols-3" : "grid-cols-2 flex-col gap-3",
        )}
      >
        <div
          className={classNames(
            "w-full h-full group relative",
            !view ? "max-w-[300px]" : "w-full col-span-2",
          )}
        >
          <div
            onClick={handleNavigateToProductDetails}
            className={classNames(
              "relative h-full max-h-[280px]",
              !view ? "" : "w-full",
            )}
          >
            <Image
              src={productImageUrl}
              width={280}
              height={210}
              className={classNames(
                "h-full w-full",
                !view ? "lg:max-w-[280px]" : "",
              )}
              style={{ objectFit: "contain" }}
              alt={product?.LW3IDESC}
            />
          </div>
        </div>
        <div className="col-span-2 w-full flex flex-col justify-start gap-2.5 md:gap-5 md:flex-row">
          <div className="w-full flex flex-col gap-3">
            <div className="w-full flex flex-col gap-0.5 justify-start lg:justify-center text-left dark:text-white03">
              <div
                className="w-full min-h-16"
                onClick={handleNavigateToProductDetails}
              >
                <div className="w-full flex flex-col gap-1 text-sm text-left font-medium text-black01 line-clamp-2 md:text-base dark:text-white03">
                  <span className="leading-tight line-clamp-2">
                    {product?.LW3IDESC || <p className="text-medium">(- -)</p>}
                  </span>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                    {product?.LW3ITEMCD}
                  </p>
                </div>
              </div>
              <div className="w-full grid grid-cols-3 md:grid-cols-2 gap-1.5 md:gap-2 pt-3 place-items-center">
                <p className="w-full text-sm md:text-lg font-medium text-brand dark:text-primary-300 col-auto">
                  {product?.D_LPRICE}
                </p>
                {view && (
                  <>
                    <div className="pl-1 md:pl-0 w-full col-span-2 md:col-auto">
                      <div className="w-full max-w-[8rem] ml-auto">
                        <ProductCardQuantitySelector
                          min={1}
                          max={99999}
                          value={quantity}
                          onValueChange={handleQuantityChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-3 md:w-full md:col-span-2">
                      <div className="w-full h-full flex items-center justify-between gap-2">
                        <Button
                          className="w-full rounded-md md:rounded-lg uppercase p-0"
                          onClick={handleAddToCart}
                          disabled={isLoading || isAddToCartButtonDisabled}
                        >
                          <SvgCart className="size-5 block md:hidden" />
                          <p className="text-base tracking-wide font-medium hidden md:block">
                            {isLoading
                              ? `${tMyProducts("Adding")}...`
                              : tMyProducts("AddToCart")}
                          </p>
                        </Button>
                        {removeFavBtn && (
                          <SfTooltip label={tMyProducts("RmvFromFavorites")}>
                            <div
                              className="my-product-remove-btn"
                              onClick={handleRemoveFromMyProducts}
                            >
                              {isRemovingFromFavorites ? (
                                <SvgSpinner className="red-spinner" />
                              ) : (
                                <SvgBin className="size-5 md:size-6" />
                              )}
                            </div>
                          </SfTooltip>
                        )}
                        {!hideFavBtn && (
                          <FavoriteHeartButton
                            onClick={() =>
                              handleToggleFavorite(product.LW3ITEMCD)
                            }
                            isLoading={isFavoriteLoading}
                            productData={{
                              ...product,
                              W_FLAGP: isFavorite ? "N" : "Y",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              {!isMobile && !view && (
                <div className="mt-2 flex flex-row gap-4 w-full">
                  <div className="w-full flex flex-col">
                    <p className="flex flex-col w-full text-sm text-left text-slate-500 md:text-base dark:text-white03">
                      {tProducts("Availability")}
                      <span className="text-black01">{product?.LW3STKAVL}</span>
                    </p>
                    <p className="flex flex-col w-full text-sm text-left text-slate-500 md:text-base dark:text-white03">
                      {tProducts("UnitOfMeasure")}
                      <span className="text-black01">
                        {product?.unitOfMeasure || `- -`}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col w-full text-sm text-left text-slate-500 md:text-base dark:text-white03">
                    {tProducts("Specification")}
                    <span className="text-black01">
                      {product?.specification ? (
                        <HTMLServerParser content={product?.specification} />
                      ) : (
                        "- -"
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {!view && (
            <div className="h-full md:max-w-[9rem] relative group w-full flex flex-row gap-3 md:flex-col gap-y-2.5 lg:gap-x-0 items-center justify-center">
              <div className="max-w-[9rem] w-full h-full md:h-auto flex items-center">
                <ProductCardQuantitySelector
                  min={1}
                  max={99999}
                  value={quantity}
                  onValueChange={handleQuantityChange}
                />
              </div>
              <div className="w-full h-full md:h-auto flex md:flex-col items-center justify-items-start md:justify-center gap-3">
                <Button
                  className="md:w-full rounded-md md:rounded-lg uppercase"
                  onClick={handleAddToCart}
                  disabled={isLoading || isAddToCartButtonDisabled}
                >
                  <SvgCart className="size-5 block md:hidden" />
                  <p className="font-medium uppercase hidden md:block">
                    {isLoading
                      ? `${tMyProducts("Adding")}...`
                      : tMyProducts("AddToCart")}
                  </p>
                </Button>
                {removeFavBtn && (
                  <SfTooltip label={tMyProducts("RmvFromFavorites")}>
                    <div
                      className="my-product-remove-btn"
                      onClick={handleRemoveFromMyProducts}
                    >
                      {isRemovingFromFavorites ? (
                        <SvgSpinner className="red-spinner" />
                      ) : (
                        <SvgBin className="size-5 md:size-6" />
                      )}
                    </div>
                  </SfTooltip>
                )}

                {!hideFavBtn && (
                  <FavoriteHeartButton
                    onClick={() => handleToggleFavorite(product.LW3ITEMCD)}
                    isLoading={isFavoriteLoading}
                    productData={{
                      ...product,
                      W_FLAGP: isFavorite ? "N" : "Y",
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
