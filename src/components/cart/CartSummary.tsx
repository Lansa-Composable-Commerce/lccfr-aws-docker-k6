import Image from "next/image";
import { useRouter } from "@/i18n/routing";
import { SvgBin } from "@/assets/svg";
import React, { useEffect, useState } from "react";
import SvgNoImage from "@/assets/svg/No-Image-Placeholder.svg";
import QuantitySelector from "@/components/QuantitySelector";
import { CartItem } from "@/types/Cart";
import Spinner from "@/components/loading/Spinner";
import { useUpdateCartItemMutation } from "@/services/cartApi";
import { showToast } from "@/components/globalUI/CustomToast";
import { useTranslations } from "next-intl";
import classNames from "classnames";
import { BASE_IMAGE_URL } from "@/utils/constants";
import { useAppDispatch } from "@/lib/hooks";
import { setCartOpen } from "@/lib/features/cart/cartSlice";
import { SfTooltip } from "@storefront-ui/react";
import useImageSrc from "@/lib/hooks/useImageSrc";

type CartSummaryPropType = {
  cartItem: CartItem;
  remove?: (column: number) => void;
  isLoading?: boolean;
  mode?: "default" | "preview" | "checkout" | "order-confirmation";
};

export default function CartSummary({
  cartItem,
  remove,
  isLoading,
  mode = "default",
}: CartSummaryPropType) {
  const {
    productCode,
    productDesc,
    quantity,
    unitPrice,
    displayedLineTotal,
    lineNumber,
    productImage,
  } = cartItem;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const tCart = useTranslations("Cart");
  const tMessage = useTranslations("Messages");
  const [updateCartItem] = useUpdateCartItemMutation();

  const imgSrc = useImageSrc(productImage, BASE_IMAGE_URL || "", SvgNoImage);

  const [count, setCount] = useState<number>(quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleValueChange = (newValue: number) => setCount(newValue);

  const goToProductDetails = () => {
    router.push(`/products/${productCode}`);
    dispatch(setCartOpen(false));
  };

  useEffect(() => {
    setCount(quantity);
  }, [quantity]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (count !== quantity) {
        setIsUpdating(true);

        updateCartItem([{ productCode, quantity: count }])
          .then((response) => {
            const { messages } = response.data;
            showToast("success", tMessage(messages[0].code));
          })
          .catch((error) => {
            console.error("Error updating cart quantity:", error);
          })
          .finally(() => {
            setIsUpdating(false);
          });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [count, updateCartItem]);

  return (
    <div
      className={classNames("relative w-full", {
        "border border-gray-200 p-4 shadow-md dark:border-gray-700 dark:bg-gray-800 md:p-6":
          mode === "default" ||
          mode === "checkout" ||
          mode === "order-confirmation",
        "rounded-lg": mode === "default",
        "rounded-sm": mode === "checkout",
        "border-b pb-4": mode === "order-confirmation",
        "my-2 border-b pt-2 pb-4 last-of-type:border-none last-of-type:pb-2":
          mode === "preview",
      })}
    >
      {(isLoading || isUpdating) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-300 bg-opacity-40 z-10">
          <Spinner className="fill-primary-700" />
        </div>
      )}
      <div className="flex justify-evenly gap-4">
        <Image
          src={imgSrc}
          width={80}
          height={80}
          onClick={goToProductDetails}
          alt="" // remove alt text warning in wave
          className="cursor-pointer"
          priority={true}
        />
        <div
          className={classNames("flex gap-4 w-full", {
            "md:flex-col md:justify-between md:items-start lg:flex-row lg:items-center":
              mode === "default" || mode === "checkout",
            "justify-between items-center":
              mode === "preview" || mode === "order-confirmation",
          })}
        >
          <div
            className={classNames("flex", {
              "justify-between items-center w-[60%] gap-4": mode === "default",
              "flex-col justify-between items-start w-full h-full":
                mode === "preview" || mode === "order-confirmation",
            })}
          >
            <div>
              <div
                className="text-sm font-medium hover:underline dark:text-white md:text-md cursor-pointer"
                onClick={goToProductDetails}
              >
                {productDesc}
              </div>
              <p
                className="text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:font-medium"
                onClick={goToProductDetails}
              >
                {productCode}
              </p>
            </div>
            {(mode === "preview" || mode === "default") && (
              <div className="flex items-center gap-x-2.5">
                <QuantitySelector
                  min={1}
                  max={999}
                  value={count}
                  onValueChange={handleValueChange}
                  variant={mode === "preview" ? "small" : "default"}
                />
                {mode === "preview" && (
                  <SfTooltip label={tCart("RmvCartItem")}>
                    <SvgBin
                      className="size-5 cursor-pointer hover:text-red-700"
                      onClick={() => {
                        remove?.(lineNumber);
                      }}
                    />
                  </SfTooltip>
                )}
              </div>
            )}
            {mode === "order-confirmation" && (
              <div className="text-end">
                <p className="text-sm font-medium">
                  {tCart("Qty")}: {quantity} x ${unitPrice.toFixed(2)}
                </p>
              </div>
            )}
          </div>
          <div
            className={classNames("flex h-full", {
              "lg:w-[40%] justify-evenly items-center gap-20":
                mode === "default" || mode === "checkout",
              "flex-col-reverse justify-between items-end":
                mode === "preview" || mode === "order-confirmation",
            })}
          >
            {mode === "checkout" && (
              <div className="text-end">
                <p className="text-sm font-medium md:text-lg">x{quantity}</p>
              </div>
            )}
            {(mode === "default" || mode === "checkout") && (
              <div className="text-end">
                <p className="text-sm font-medium md:text-lg">
                  ${unitPrice.toFixed(2)}
                </p>
              </div>
            )}
            <div className="text-end">
              <p
                className={classNames(
                  "font-medium text-brand dark:text-gray-200",
                  {
                    "text-sm":
                      mode === "preview" || mode === "order-confirmation",
                    "text-lg": mode === "default" || mode === "checkout",
                  },
                )}
              >
                {displayedLineTotal}
              </p>
            </div>
            {mode === "default" && (
              <div className="text-end" onClick={() => remove?.(lineNumber)}>
                <SfTooltip label={tCart("RmvCartItem")}>
                  <SvgBin className="size-5 cursor-pointer hover:text-red-700" />
                </SfTooltip>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
