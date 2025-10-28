"use client";

import React, { useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { SfTooltip } from "@storefront-ui/react";
import { useRouter } from "@/i18n/routing";

import { showToast } from "@/components/globalUI/CustomToast";
import FavoriteHeartButton from "@/components/FavoriteHeartButton";
import ProductCardQuantitySelector from "@/components/Products/ProductQuantitySelector";
import Button from "@/components/globalUI/Button";

import { createSlug } from "@/lib/helpers/createSlug";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addProductToFavorite,
  removeProductToFavorite,
  removeSuccessMessage,
  setItemCode,
} from "@/lib/features/products/productsSlice";
import { selectGridSwitch } from "@/lib/features/global/globalSlice";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

import {
  BASE_IMAGE_URL,
  BUYER_TYPE,
  COOKIE_PREFIX,
  STOREFRONT_ROUTES,
} from "@/utils/constants";
import { useAddToCartMutation } from "@/services/cartApi";

import { SvgBin, SvgCart, SvgSpinner } from "@/assets/svg";

import SvgNoImage from "@/assets/svg/No-Image-Placeholder.svg";

import { ProductTypes } from "@/types";

const MyProductCard = ({
  product,
  view,
  hideFavBtn = false,
  removeFavBtn = false,
}: {
  product: ProductTypes;
  view?: boolean;
  hideFavBtn?: boolean;
  removeFavBtn?: boolean;
}) => {
  const tMessages = useTranslations("Messages");
  const tMyProducts = useTranslations("MyProducts");

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [addToCart] = useAddToCartMutation();

  const selectIsGrid = useAppSelector(selectGridSwitch);

  const [localStorageCateg, setLocalStorageCateg] = useLocalStorage<any>(
    `${COOKIE_PREFIX}product_category`,
  );
  const [localStorageSubCateg, setLocalStorageSubCateg] = useLocalStorage<any>(
    `${COOKIE_PREFIX}product_sub_category`,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isRemoveToFavLoading, setIsRemoveToFavLoading] = useState(false);
  const [count, setCount] = useState(1);
  const [isFavorite, setIsFavorite] = useState(product?.W_FLAGP === "N");

  const imgSrc = product?.LW3IMAGE
    ? `${BASE_IMAGE_URL}${product?.LW3IMAGE}`
    : SvgNoImage;

  const isAddToCartDisabled =
    product?.buyerType === BUYER_TYPE ? false : !product?.W_AVLQTY;

  // @ts-ignore
  const handleValueChange = (newValue: number) => setCount(newValue);

  const goToProductDetails = () => {
    router.push(
      `${STOREFRONT_ROUTES.PRODUCTS}/${createSlug(product?.LW3ITEMCD)}?category=${localStorageCateg || ""}&subCategory=${localStorageSubCateg || ""}`,
    );
    dispatch(setItemCode(product?.LW3ITEMCD));
    dispatch(removeSuccessMessage());
  };

  const handleUpdateCart = async (product: ProductTypes) => {
    setIsLoading(true);
    const { LW3ITEMCD } = product;
    const response = await addToCart([
      {
        productCode: LW3ITEMCD,
        quantity: count,
      },
    ]);

    setCount(1);
    if (response && response.data) {
      const { messages } = response.data;
      showToast("success", tMessages(messages[0].code));
      setIsLoading(false);
    }
  };

  const handleAddToFavorite = async (LW3ITEMCD: string) => {
    dispatch(addProductToFavorite([LW3ITEMCD]));
    setIsFavorite(true);
  };

  const handleRemoveToFavorite = async (LW3ITEMCD: string) => {
    dispatch(removeProductToFavorite(LW3ITEMCD));
    setIsFavorite(false);
  };

  const handleRemoveToMyProducts = async (LW3ITEMCD: string) => {
    try {
      setIsRemoveToFavLoading(true);
      dispatch(removeProductToFavorite(LW3ITEMCD)).then(() =>
        setIsRemoveToFavLoading(false),
      );
    } catch (error: any) {
      setIsRemoveToFavLoading(false);
    }
  };

  return (
    <>
      <div className="product-card hover:shadow-large dark:bg-light-dark">
        <div
          className={classNames(
            "grid  w-full h-full",
            view ? "flex-row gap-3 grid-cols-3" : "grid-cols-2 flex-col gap-3",
          )}
        >
          <div
            className={classNames(
              "w-full h-full group relative",
              view ? "max-w-[300px]" : "w-full col-span-2 ",
            )}
          >
            <div
              onClick={goToProductDetails}
              className={classNames(
                "relative h-full max-h-[210px]",
                view ? "" : "w-full",
              )}
            >
              <Image
                src={imgSrc}
                width={280}
                height={210}
                className={classNames(
                  "h-full w-full",
                  view ? " lg:max-w-[280px]" : "",
                )}
                style={{ objectFit: "contain" }}
                alt={product?.LW3IDESC}
                priority
              />
            </div>

            <div
              className={classNames(
                "absolute top-0 flex-none",
                selectIsGrid ? "right-0" : "right-12 lg:right-16 group",
              )}
            >
              <div
                className={classNames("", {
                  hidden: !isFavorite,
                  "absolute group-hover:block right-0": selectIsGrid,
                  "absolute group-hover:block": !selectIsGrid,
                })}
              >
                {!hideFavBtn && (
                  <FavoriteHeartButton
                    onClick={() => {
                      if (isFavorite) {
                        handleRemoveToFavorite(product?.LW3ITEMCD);
                      } else {
                        handleAddToFavorite(product?.LW3ITEMCD);
                      }
                    }}
                    productData={{
                      ...product,
                      W_FLAGP: isFavorite ? "N" : "Y",
                    }}
                    noBorder
                  />
                )}
                {/*{removeFavBtn && (
                  <SfTooltip label={tMyProducts("Remove")}>
                    <div
                      className={classNames(
                        `w-full flex items-center justify-center h-full p-2 md:p-2.5 lg:p-4 rounded-lg md:rounded-[0.938rem] text-red-500 hover:bg-red-500/20 hover:border hover:border-red-500 cursor-pointer`,
                      )}
                      onClick={() =>
                        handleRemoveToMyProducts(product?.LW3ITEMCD)
                      }
                    >
                      <SvgBin className="size-6 hover:text-red-500" />
                    </div>
                  </SfTooltip>
                )}*/}
              </div>
            </div>
          </div>
          <div className="col-span-2 w-full flex flex-col justify-start gap-2.5 md:gap-5 md:flex-row ">
            <div className="w-full flex flex-col gap-3">
              <div className="w-full flex flex-col gap-0.5 justify-start lg:justify-center text-left">
                <div className="w-full min-h-16" onClick={goToProductDetails}>
                  <div className="w-full flex flex-col gap-1 text-sm text-left font-medium text-black01 line-clamp-2 md:text-base dark:text-white03">
                    <span className="leading-tight line-clamp-2">
                      {product?.LW3IDESC || (
                        <p className="text-medium ">(- -)</p>
                      )}
                    </span>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                      {product?.LW3ITEMCD}
                    </p>
                  </div>
                </div>
                <div className="w-full grid grid-cols-3 md:grid-cols-2 gap-1 md:gap-2 pt-3 place-items-center">
                  <p
                    className={classNames(
                      "w-full text-sm md:text-lg font-medium text-brand dark:text-primary-300",
                      removeFavBtn ? "col-auto" : "col-span-3 md:col-auto",
                    )}
                  >
                    {product?.D_LPRICE}
                  </p>
                  {!selectIsGrid && (
                    <>
                      <div
                        className={classNames(
                          "pl-1 md:pl-0 w-full ",
                          removeFavBtn
                            ? "col-span-2  md:col-auto"
                            : "col-span-2 md:col-auto",
                        )}
                      >
                        <ProductCardQuantitySelector
                          min={1}
                          max={99999}
                          value={count}
                          onValueChange={handleValueChange}
                        />
                      </div>
                      <div
                        className={classNames(
                          "md:w-full  md:col-span-2",
                          removeFavBtn ? "col-span-3" : "col-auto",
                        )}
                      >
                        <div className="w-full flex items-center gap-2">
                          <Button
                            className="w-full rounded-md md:rounded-lg uppercase p-0"
                            onClick={() => handleUpdateCart(product)}
                            disabled={isLoading || isAddToCartDisabled}
                          >
                            <SvgCart className="size-5 block md:hidden" />
                            <p className="text-base tracking-wide font-medium  hidden md:block">
                              {isLoading
                                ? `${tMyProducts("Adding")}...`
                                : tMyProducts("AddToCart")}
                            </p>
                          </Button>
                          {removeFavBtn && (
                            <SfTooltip label={tMyProducts("RmvFromFavorites")}>
                              <div
                                className={classNames(
                                  `w-full flex items-center justify-center h-full p-1.5 border border-transparent rounded-md md:rounded-lg hover:text-red-500 hover:bg-red-500/20 hover:border cursor-pointer translate-05`,
                                )}
                                onClick={() =>
                                  handleRemoveToMyProducts(product?.LW3ITEMCD)
                                }
                              >
                                {isRemoveToFavLoading ? (
                                  <SvgSpinner className="red-spinner" />
                                ) : (
                                  <SvgBin className="size-5 md:size-6 " />
                                )}
                              </div>
                            </SfTooltip>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            {selectIsGrid && (
              <div className="h-full md:max-w-[9rem] relative group w-full flex flex-row gap-3 md:flex-col gap-y-2.5 lg:gap-x-0 items-center justify-center">
                <div className="max-w-[9rem] w-full h-full md:h-auto flex items-center">
                  <ProductCardQuantitySelector
                    min={1}
                    max={99999}
                    value={count}
                    onValueChange={handleValueChange}
                  />
                </div>
                <div className="w-full h-full md:h-auto flex md:flex-col items-center justify-items-start md:justify-center gap-3">
                  <Button
                    className="md:w-full rounded-md md:rounded-lg uppercase"
                    onClick={() => handleUpdateCart(product)}
                    disabled={isLoading || isAddToCartDisabled}
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
                        onClick={() =>
                          handleRemoveToMyProducts(product?.LW3ITEMCD)
                        }
                      >
                        {isRemoveToFavLoading ? (
                          <SvgSpinner className="red-spinner" />
                        ) : (
                          <SvgBin className="size-5 md:size-6" />
                        )}
                      </div>
                    </SfTooltip>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProductCard;
