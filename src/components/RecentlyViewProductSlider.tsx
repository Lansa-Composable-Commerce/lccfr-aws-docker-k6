"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SfLink } from "@storefront-ui/react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

// components
import ProductSlider from "@/components/globalUI/ProductSlider";

// lib, utils
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectRecentlyViewedProducts } from "@/lib/features/recentlyViewedProducts/recentlyViewedProductsSlice";
import {
  onRemoveCateg,
  onRemoveSubCateg,
} from "@/lib/features/breadcrumbs/breadcrumbsSlice";
import { BASE_IMAGE_URL, STOREFRONT_ROUTES } from "@/utils/constants";

// assets
import SvgNoImage from "@/assets/svg/No-Image-Placeholder.svg";

interface Product {
  LW3ITEMCD: string;
  D_LPRICE: string;
  LW3IDESC: string;
  LW3IMAGE: string | null;
}

interface RecentlyViewProductSliderProps {
  close: () => void;
}

const RecentlyViewProductSlider: React.FC<RecentlyViewProductSliderProps> = ({
  close,
}) => {
  const tHome = useTranslations("Home");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const recentlyViewProductsData = useAppSelector(
    selectRecentlyViewedProducts,
  ) as Product[];

  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const newImageUrls: { [key: string]: string } = {};

    recentlyViewProductsData.forEach((product) => {
      const productImage = product?.LW3IMAGE || null;
      const imageUrl = productImage
        ? productImage.startsWith("https://")
          ? productImage
          : `${BASE_IMAGE_URL || ""}${productImage}`
        : SvgNoImage;

      newImageUrls[product.LW3ITEMCD] = imageUrl;
    });

    setImageUrls(newImageUrls);
  }, [recentlyViewProductsData]);

  const goToProductDetails = (LW3ITEMCD: string) => {
    dispatch(onRemoveSubCateg());
    dispatch(onRemoveCateg());
    close();
    router.push(`${STOREFRONT_ROUTES.PRODUCTS}/${LW3ITEMCD}`);
  };

  return (
    <ProductSlider>
      {recentlyViewProductsData.length > 0 ? (
        recentlyViewProductsData.map(
          ({ LW3ITEMCD, D_LPRICE, LW3IDESC }: Product) => {
            const productImageUrl = imageUrls[LW3ITEMCD];

            return (
              <div
                key={LW3ITEMCD}
                className="first:ms-left last:me-auto shadow-card shrink-0 rounded-md hover:shadow-lg w-[148px] lg:max-w-[192px] cursor-pointer"
                onClick={() => goToProductDetails(LW3ITEMCD)}
              >
                <div className="relative w-full py-4">
                  <div className="w-full flex items-center justify-center max-h-[80px]">
                    <Image
                      src={productImageUrl}
                      alt={LW3IDESC}
                      className="flex items-center h-auto rounded-md aspect-square"
                      width={80}
                      height={80}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>
                <div className="p-2 typography-text-sm">
                  <SfLink
                    href="#"
                    variant="secondary"
                    className="no-underline line-clamp-2 h-10"
                  >
                    {LW3IDESC || "- -"}
                  </SfLink>
                  <span className="block mt-2 font-medium text-brand dark:text-gray-200">
                    {D_LPRICE}
                  </span>
                </div>
              </div>
            );
          },
        )
      ) : (
        <div className="w-full bg-gray-100 p-2 rounded-md dark:bg-light-dark">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-200">
            {tHome("NoRecentlyViewed")}
          </p>
        </div>
      )}
    </ProductSlider>
  );
};

export default RecentlyViewProductSlider;
