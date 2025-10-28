"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import classNames from "classnames";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Transition } from "react-transition-group";
import { SfAccordionItem } from "@storefront-ui/react";
import { sendGTMEvent } from "@next/third-parties/google";

// components
import Badge from "@/components/globalUI/Badge";
import QuantitySelector from "@/components/QuantitySelector";
import Button from "@/components/globalUI/Button";
import { showToast } from "@/components/globalUI/CustomToast";
import PageTitle from "@/components/ui/PageTitle";
import ProductDetailsFavHeartButton from "@/components/Products/ProductDetailsFavHeartButton";
import HTMLServerParser from "@/components/HTMLServerParser";

import { removeDashesFromSlug } from "@/lib/helpers/removeDashesFromSlug";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addRecentlyViewedItems } from "@/lib/features/recentlyViewedProducts/recentlyViewedProductsSlice";

import { useAddToCartMutation } from "@/services/cartApi";

import {
  SvgChevronLeft,
  SvgHandCoins,
  SvgHeadSet,
  SvgPackage,
  SvgTruck,
} from "@/assets/svg";
import SvgNoImage from "@/assets/svg/No-Image-Placeholder.svg";

import { IProductDetails, TabsDataTypes } from "@/types";

import {
  addProductToFavorite,
  removeProductToFavorite,
  selectIsFavoritesMessages,
  selectIsStatus,
} from "@/lib/features/products/productsSlice";
import { useDisplayToastMessage } from "@/lib/hooks/useDisplayToastMessage";
import { BASE_IMAGE_URL, BUYER_TYPE, GTM_EVENTS } from "@/utils/constants";
import { reFetchProducts } from "@/lib/hooks/reFetchProducts";
import useImageSrc from "@/lib/hooks/useImageSrc";

const RenderStorePerk = () => {
  return (
    <div className="mt-4">
      <div className="flex flex-col gap-4 text-gray04 text-sm lg:text-base">
        <div className="flex items-center gap-4">
          <SvgPackage className="size-6 dark:text-gray-400" />
          <div>
            <h4 className="font-medium dark:text-gray-300">Bonus Plus</h4>
            <h5 className="text-gray01 dark:text-gray-400">
              Make fun of shopping and collect bonuses
            </h5>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SvgTruck className="size-6 text-gray04 dark:text-gray-400" />
          <div>
            <h4 className="font-medium dark:text-gray-300">Free Shipping</h4>
            <h5 className="text-gray01 dark:text-gray-400">
              Free shipping on all orders over $99
            </h5>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SvgHeadSet className="size-6 text-gray04 dark:text-gray-400" />
          <div>
            <h4 className="font-medium dark:text-gray-300">Online Support</h4>
            <h5 className="text-gray01 dark:text-gray-400">
              Call us: (+100) 123 456 7890
            </h5>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SvgHandCoins className="size-6 text-gray04 dark:text-gray-400" />
          <div>
            <h4 className="font-medium dark:text-gray-300">
              Money-Back Guarantee
            </h4>
            <h5 className="text-gray01 dark:text-gray-400">
              30 Days money return guarantee
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

const RenderProductInformation = ({ tabsData }: TabsDataTypes) => {
  const [isTransitioning, setTransitioning] = useState(false);
  const [opened, setOpened] = useState<string[]>([]);

  useEffect(() => {
    if (tabsData.length > 0) {
      setOpened(tabsData.map((tab) => tab.id));
    }
  }, [tabsData]);

  const isOpen = useCallback((id: string) => opened.includes(id), [opened]);

  const handleToggle = useCallback(
    (id: string) => (open: boolean) => {
      setTransitioning(true);
      if (open) {
        setOpened((current) => [...current, id]);
      } else {
        setOpened((current) => current.filter((item) => item !== id));
      }
    },
    [],
  );

  const handleStopTransition = useCallback(() => {
    setTransitioning(false);
  }, []);

  return (
    <div className="md:pt-4 mb-10">
      <div className="border-y border-neutral-200 divide-y dark:text-gray-200">
        {tabsData.map(({ id, caption, content }) => (
          <SfAccordionItem
            key={id}
            summary={
              <div
                className={classNames(
                  "flex justify-between px-2 py-4 sm:p-4 font-medium hover:bg-brand/20 active:bg-brand/20 rounded-lg",
                )}
              >
                <p className="font-semibold lg:text-xl tracking-wide">
                  {caption}
                </p>
                <SvgChevronLeft
                  className={classNames(
                    "text-neutral-500 dark:text-gray-200 size-6 transition-transform duration-300",
                    {
                      "rotate-90": isOpen(id),
                      "-rotate-90": !isOpen(id),
                    },
                  )}
                />
              </div>
            }
            onToggle={handleToggle(id)}
            open={isTransitioning || isOpen(id)}
          >
            <Transition
              in={isOpen(id)}
              timeout={300}
              onEntered={handleStopTransition}
              onExited={handleStopTransition}
              mountOnEnter
              unmountOnExit
            >
              {(state) => (
                <div
                  className={classNames(
                    "grid transition-[grid-template-rows] duration-300 grid-rows-[0fr]",
                    {
                      "!grid-rows-[1fr]":
                        state === "entering" || state === "entered",
                      "grid-rows-[0fr]": state === "exiting",
                    },
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="p-4">
                      <HTMLServerParser content={content} />
                    </p>
                  </div>
                </div>
              )}
            </Transition>
          </SfAccordionItem>
        ))}
      </div>
    </div>
  );
};

const ProductDetails = ({ productData }: { productData: IProductDetails }) => {
  const tProduct = useTranslations("Product");
  const tMessage = useTranslations("Messages");

  console.log("productData", productData);
  const dispatch = useAppDispatch();

  const [addToCart, { isLoading }] = useAddToCartMutation();

  const [count, setCount] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState(productData?.W_FLAGP === "N");

  const isAddToCartDisabled =
    productData?.buyerType === BUYER_TYPE ? false : !productData?.W_AVLQTY;

  const productImage = productData.LW3IMAGE || null;
  const productImageUrl = useImageSrc(
    productImage,
    BASE_IMAGE_URL || "",
    SvgNoImage,
  );

  const selectIsFavoritesMessageCode = useAppSelector(
    selectIsFavoritesMessages,
  );
  const selectIsToastType = useAppSelector(selectIsStatus);

  useDisplayToastMessage({
    status: selectIsToastType,
    messages: selectIsFavoritesMessageCode,
  });

  const tabsData = productData?.tabs || [];

  const handleValueChange = (newValue: number) => setCount(newValue);

  const handleAddToCart = async () => {
    const { LW3ITEMCD } = productData;

    const response = await addToCart([
      {
        productCode: LW3ITEMCD,
        quantity: count,
      },
    ]);

    if (response && response.data) {
      const { messages } = response.data;

      showToast("success", tMessage(messages[0].code));

      // add to cart
      sendGTMEvent({
        event: GTM_EVENTS.ADD_TO_CART,
        currency: "USD",
        items: [
          {
            item_id: LW3ITEMCD,
            item_name: productData?.LW3IDESC,
            item_category: productData?.LW3CATNAM || "",
            quantity: count,
            price: productData?.LW3LPRICE,
          },
        ],
      });
    }
  };

  const handleAddToFavorite = async (LW3ITEMCD: string) => {
    dispatch(addProductToFavorite([LW3ITEMCD]));
    await reFetchProducts();
    await setIsFavorite(true);
  };

  const handleRemoveToFavorite = async (LW3ITEMCD: string) => {
    dispatch(removeProductToFavorite(LW3ITEMCD));
    await reFetchProducts();
    setIsFavorite(false);
  };

  useEffect(() => {
    dispatch(addRecentlyViewedItems(productData));
  }, []);

  useEffect(() => {
    sendGTMEvent({
      event: GTM_EVENTS.VIEW_ITEM,
      currency: "USD",
      value: productData.LW3LPRICE,
      items: [
        {
          item_name: productData?.LW3IDESC,
          item_id: productData?.LW3ITEMCD,
          item_category: productData?.LW3CATNAM,
          price: productData.LW3LPRICE,
          quantity: count,
        },
      ],
    });
  }, []);
  return (
    <>
      <PageTitle withBackText backText={tProduct("Back")} />
      <div className="grid lg:grid-cols-5 h-full w-full mt-5 pb-4 lg:pb-6 gap-3 lg:gap-4 xl:gap-6">
        <div className="w-full flex items-start justify-center lg:col-span-2">
          <div className="w-full relative h-[400px] lg:h-[500px] xl:h-[600px] flex justify-center">
            <Image
              src={productImageUrl}
              fill
              alt="product-card"
              style={{ objectFit: "contain", width: "100%", height: "100%" }}
              priority
            />
          </div>
        </div>
        <div className="pt-2 lg:p-4 w-full lg:col-span-3">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col lg:flex-row justify-start lg:items-center gap-3">
              <div className=" lg:max-w-lg">
                <h2 className="text-black01 font-semibold text-xl lg:text-4xl dark:text-gray-300">
                  {productData?.LW3IDESC
                    ? removeDashesFromSlug(productData?.LW3IDESC)
                    : "- -"}
                </h2>
              </div>
              <div className="flex-none">
                <Badge
                  content={
                    productData?.W_AVLQTY
                      ? tProduct("InStock")
                      : tProduct("OutOfStock")
                  }
                />
              </div>
            </div>
            <h3 className="text-lg lg:text-2xl text-primary-500 font-medium">
              {productData?.D_LPRICE ? `${productData?.D_LPRICE}` : "- -"}
            </h3>
          </div>
          <div className="my-4 border-t border-t-white01 h-0 dark:border-t-gray-600">
            &nbsp;
          </div>
          <div className="flex flex-col gap-y-3 text-sm lg:text-base">
            <div className="flex gap-2">
              <p className="text-black01 font bold font-medium dark:text-gray-400">
                {tProduct("Category")}:
              </p>
              <p className="text-gray03 dark:text-gray-400">
                {productData?.LW3CATNAM || "- -"}
              </p>
            </div>
            <div className="flex gap-2">
              <p className="text-black01 font bold font-medium dark:text-gray-400">
                {tProduct("ItemCode")}:
              </p>
              <p className="text-gray03 dark:text-gray-400 capitalize">
                {productData?.LW3ITEMCD || "- -"}
              </p>
            </div>{" "}
            <div className="flex gap-2">
              <p className="text-black01 font bold font-medium dark:text-gray-400">
                {tProduct("Availability")}:
              </p>
              <p className="text-gray03 dark:text-gray-400">
                {productData?.W_AVLQTY || "- -"}
              </p>
            </div>
            {productData?.W_RGHTHND && (
              <div className="flex gap-2">
                <p className="text-black01 font bold font-medium dark:text-gray-400">
                  {tProduct("RightHand")}:
                </p>
                <p className="text-gray03 dark:text-gray-400">
                  {productData?.W_RGHTHND ? "YES" : "NO"}
                </p>
              </div>
            )}
            {productData?.W_LEFTHND && (
              <div className="flex gap-2">
                <p className="text-black01 font bold font-medium dark:text-gray-400">
                  {tProduct("LeftHand")}:
                </p>
                <p className="text-gray03 dark:text-gray-400">
                  {productData?.W_LEFTHND ? "YES" : "NO"}
                </p>
              </div>
            )}
            {productData?.W_BRAND && (
              <div className="flex gap-2">
                <p className="text-black01 font bold font-medium dark:text-gray-400">
                  {tProduct("Brand")}:
                </p>
                <p className="text-gray03 dark:text-gray-400">
                  {productData?.W_BRAND}
                </p>
              </div>
            )}
            {productData?.W_LOFT && (
              <div className="flex gap-2">
                <p className="text-black01 font bold font-medium dark:text-gray-400">
                  {tProduct("Loft")}:
                </p>
                <p className="text-gray03 dark:text-gray-400">
                  {productData?.W_LOFT}
                </p>
              </div>
            )}
          </div>
          <div className="my-4 border-t border-t-white01 h-0 dark:border-t-gray-600">
            &nbsp;
          </div>
          <div className="flex flex-row xl:flex-row items-center justify-between gap-4">
            <div className="w-full flex items-center gap-4">
              <QuantitySelector
                min={1}
                max={99999}
                value={count}
                onValueChange={handleValueChange}
                productInStock={isAddToCartDisabled}
              />

              <Button
                size="lg"
                className="w-full lg:py-4 translate-05 hover:shadow-lg rounded-lg md:rounded-[0.938rem]"
                onClick={handleAddToCart}
                disabled={isLoading || isAddToCartDisabled}
              >
                <p className="text-sm lg:text-lg xl:text-xl tracking-wider uppercase">
                  {isLoading
                    ? `${tProduct("Adding")}...`
                    : tProduct("AddToCart")}
                </p>
              </Button>
            </div>
            <ProductDetailsFavHeartButton
              onClick={() => {
                if (isFavorite) {
                  handleRemoveToFavorite(productData?.LW3ITEMCD);
                } else {
                  handleAddToFavorite(productData?.LW3ITEMCD);
                }
              }}
              productData={{
                W_FLAGP: isFavorite ? "N" : "Y",
              }}
            />
          </div>
          <div className="my-4 border-t border-t-white01 h-0 dark:border-t-gray-600">
            &nbsp;
          </div>
          {/* Hide for now , no functionality*/}
          {/*<SocialLinks />*/}
          {/*<RenderStorePerk />*/}
        </div>
      </div>
      {tabsData && <RenderProductInformation tabsData={tabsData} />}
    </>
  );
};

export default ProductDetails;
