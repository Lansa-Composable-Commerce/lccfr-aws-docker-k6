import Button from "@/components/globalUI/Button";
import { Link, useRouter } from "@/i18n/routing";
import classNames from "classnames";
import TextArea from "@/components/globalUI/TextArea";
import { ChangeEvent, ReactNode, RefObject } from "react";
import { useDispatch } from "react-redux";
import {
  selectCartCommentLength,
  setAdditionalNotes,
} from "@/lib/features/checkout/checkoutSlice";
import { useAppSelector } from "@/lib/hooks";
import Spinner from "@/components/loading/Spinner";
import { useTranslations } from "next-intl";
import DiscountForm from "@/components/DiscountForm";
import { SvgPrint } from "@/assets/svg";
import { setSaveOrderModalVisible } from "@/lib/features/orderTemplate/orderTemplateSlice";
import { sendGTMEvent } from "@next/third-parties/google";
import { GTM_EVENTS } from "@/utils/constants";
import { CartItem } from "@/types/Cart";

type OrderSummaryPropType = {
  subTotal: string;
  orderTotal?: number;
  discount: string;
  total: string;
  children?: ReactNode;
  mode?: "default" | "checkout" | "order-confirmation";
  placeOrder?: () => void;
  print?: () => void;
  isLoading?: boolean;
  items?: CartItem[];
};

export default function OrderSummary({
  subTotal,
  orderTotal,
  discount,
  total,
  children,
  mode = "default",
  placeOrder,
  print,
  isLoading,
  items,
}: OrderSummaryPropType) {
  const tCart = useTranslations("Cart");

  const cartCommentLength = useAppSelector(selectCartCommentLength);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleProceedToCheckout = () => {
    sendGTMEvent({
      event: GTM_EVENTS.BEGIN_CHECKOUT,
      currency: "USD",
      value: orderTotal,
      items:
        items &&
        items.map((item: CartItem) => ({
          item_name: item.productDesc,
          item_id: item.productCode,
          item_category: item?.categoryName || "",
          quantity: item.quantity,
          price: item.unitPrice,
        })),
    });

    router.push("/checkout");
  };

  const handleAdditionalNotes = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setAdditionalNotes(e.target.value));
  };

  const handleSaveOrderModal = () => {
    dispatch(setSaveOrderModalVisible());
  };

  return (
    <div
      className={classNames(
        "flex flex-col gap-4 border border-gray-200 p-6 shadow-md",
        {
          "rounded-lg": mode === "default",
          "rounded-sm": mode === "checkout" || mode === "order-confirmation",
        },
      )}
    >
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">{tCart("OrderSummary")}</div>
        {mode === "order-confirmation" && (
          <div
            className="cursor-pointer text-primary-700 hover:text-primary-500"
            onClick={print}
          >
            <SvgPrint />
          </div>
        )}
      </div>
      {mode === "order-confirmation" && children}
      <div className="flex justify-between items-center border-b pb-2">
        <p>{tCart("Subtotal")}:</p>
        <p className="font-semibold">{subTotal || "$0.00"}</p>
      </div>
      <div className="flex justify-between items-center border-b pb-2">
        <p>{tCart("Discount")}:</p>
        <p className="font-semibold">
          {discount === "$.00" ? "$0.00" : `${discount}`}
        </p>
      </div>
      {(mode === "checkout" || mode === "default") && (
        <div
          className={classNames("flex border-b pb-2", {
            "flex-col gap-2": mode === "default",
            "flex-row justify-between items-center": mode === "checkout",
          })}
        >
          <p>{tCart("Promotions")}:</p>
          <DiscountForm mode={mode === "default" ? "default" : "checkout"} />
        </div>
      )}
      <div className="flex justify-between items-center">
        <span className="text-2xl font-semibold">{tCart("Total")}:</span>
        <span className="text-2xl text-brand font-semibold dark:text-gray-200">
          {total || "$0.00"}
        </span>
      </div>
      {mode === "checkout" && (
        <div className="w-full">
          <TextArea
            aria-label="Additional Notes"
            placeholder={tCart("PlhCartComments")}
            className="min-h-32 w-full"
            onChange={handleAdditionalNotes}
            maxLength={250}
          />
          <p className="text-end text-xs text-slate-500 leading-none">
            {tCart("PlhCartComments")} ({cartCommentLength}/250)
          </p>
        </div>
      )}
      {(mode === "default" || mode === "checkout") && (
        <Button
          onClick={mode === "default" ? handleProceedToCheckout : placeOrder}
          className="lg:py-4"
          disabled={isLoading}
          aria-label={tCart("ProceedPlaceOrder")}
        >
          {!isLoading ? (
            mode === "default" ? (
              tCart("ProceedPlaceOrder")
            ) : (
              tCart("PlaceOrder")
            )
          ) : (
            <Spinner className="fill-primary-700" />
          )}
        </Button>
      )}
      <div className="w-full gap-y-4 gap-x-4 flex flex-col 2xl:flex-row justify-center">
        {/*  {(mode === "default" || mode === "checkout") && (
          <Button
            onClick={handleSaveOrderModal}
            className="w-full lg:py-4"
            disabled={isLoading}
            variant="secondary"
          >
            {tCart("ContinueShopping")}
          </Button>
        )}*/}
        {mode === "default" && (
          <Button
            onClick={handleSaveOrderModal}
            className="w-full lg:py-4 dark:text-primary-300"
            disabled={isLoading}
            variant="secondary"
            aria-label={tCart("SaveOrderTemplate")}
          >
            {tCart("SaveOrderTemplate")}
          </Button>
        )}
      </div>
      {(mode === "default" || mode === "checkout") && (
        <Link
          href="/"
          className="text-center text-primary-700 font-semi-bold my-2 underline underline-offset-8 hover:text-primary-800 dark:text-gray-200 dark:hover:text-gray-300"
        >
          {tCart("ContinueShopping")}
        </Link>
      )}
    </div>
  );
}
