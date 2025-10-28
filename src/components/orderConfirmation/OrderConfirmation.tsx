"use client";

import { Fragment, useEffect, useMemo, useRef } from "react";
import { sendGTMEvent } from "@next/third-parties/google";

import OrderSummary from "@/components/OrderSummary";
import CartSummary from "@/components/cart/CartSummary";
import { OrderDetails } from "@/types/OrderConfirmation";
import CardAddress from "@/components/checkout/CardAddress";
import { useTranslations } from "next-intl";
import CartHeader from "@/components/cart/CartHeader";
import { useWindowDimensions } from "@/lib/hooks/useWindowDimensions";
import PaymentLogo from "@/components/PaymentLogo";
import classNames from "classnames";
import { AlertSuccess } from "@/components/ui/Alert";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectGlobalState,
  setPostOrderDetails,
} from "@/lib/features/global/globalSlice";
import { useReactToPrint } from "react-to-print";
import PrintOrderConfirmation from "@/components/orderConfirmation/PrintOrderConfirmation";
import { selectAuthState } from "@/lib/features/auth/authSlice";
import { GTM_EVENTS } from "@/utils/constants";

export default function OrderConfirmation({
  orderDetails,
}: {
  orderDetails: OrderDetails;
}) {
  const gtmEventFired = useRef(false);

  const { shipTo, billTo, products = [], order, payment } = orderDetails;
  const tOrderConfirmation = useTranslations("OrdConfirm");
  const tCheckout = useTranslations("Checkout");
  const isMobile = useWindowDimensions(1550, null);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const printOrderConfirmation = useReactToPrint({
    contentRef,
    documentTitle: `${tOrderConfirmation("OrderConfirmation")} - #${order.orderNumber}`,
    bodyClass: "p-4",
  });

  const { postOrderDetails } = useAppSelector(selectGlobalState);
  const { user } = useAppSelector(selectAuthState);
  const { isSuccess, emailStatus } = postOrderDetails;
  const dispatch = useAppDispatch();

  const totalItems = useMemo(() => products.length, [products]);
  const totalQuantity = useMemo(
    () =>
      products.reduce((total, { lineQuantity = 0 }) => total + lineQuantity, 0),
    [products],
  );

  const handleCloseAlert = () => {
    dispatch(setPostOrderDetails({ ...postOrderDetails, isSuccess: false }));
  };

  // GTM Event trigger
  useEffect(() => {
    if (isSuccess && !gtmEventFired.current) {
      gtmEventFired.current = true;

      // order tracking
      sendGTMEvent({
        event: GTM_EVENTS.USER_ORDER,
        username: `${user.firstname}${user.lastname}`,
        transaction_id: order.orderNumber,
        total: orderDetails.order.orderTotal,
        currency: "USD",
      });

      // purchase
      sendGTMEvent({
        event: GTM_EVENTS.PURCHASE,
        transaction_id: order.orderNumber,
        currency: "USD",
        username: `${user.firstname}${user.lastname}`,
        value: orderDetails.order.orderTotal,
        coupon: orderDetails?.promo?.code || "",
        items: products.map((item: any) => ({
          item_name: item.productDesc,
          item_id: item.productCode,
          item_category: item?.categoryName || "",
          quantity: item.lineQuantity,
          price: item.unitPrice,
        })),
      });
    }
  }, [
    isSuccess,
    order.orderNumber,
    orderDetails.order.displayedOrderTotal,
    products,
    user.firstname,
    user.lastname,
  ]);

  return (
    <Fragment>
      {isSuccess && (
        <section className="w-full bg-red-200 my-6">
          <AlertSuccess
            message={
              emailStatus === "OK"
                ? tCheckout("MsgPostOrder1")
                : tCheckout("MsgPostOrder2")
            }
            title={tCheckout("ThankYou")}
            containerClass="max-w-full"
            messageClass={emailStatus === "ER" ? "text-red-700" : ""}
            hasCloseIcon={false}
            close={handleCloseAlert}
          />
        </section>
      )}
      <section className="flex flex-col-reverse lg:flex-row gap-4">
        <section className="flex flex-col w-full gap-8 lg:w-[70%]">
          <section className="flex flex-col gap-4 lg:flex-row">
            <CardAddress
              title={tCheckout("ShippingAddress")}
              contactName={shipTo.name}
              address1={shipTo.address1}
              address2={shipTo.address2}
              regionInformation={`${shipTo.city} ${shipTo.state} ${shipTo.zip}`}
              country={shipTo.country}
            />
            <CardAddress
              title={tCheckout("BillingAddress")}
              contactName={billTo.name}
              address1={billTo.address1}
              address2={billTo.address2}
              regionInformation={`${billTo.city} ${billTo.state} ${billTo.zip}`}
              country={billTo.country}
            />
          </section>
          <section className="flex flex-col gap-4">
            <CartHeader totalItems={totalItems} totalQuantity={totalQuantity} />
            {products.map((product, index) => (
              <CartSummary
                key={product.productCode + index}
                cartItem={{
                  ...product,
                  quantity: product.lineQuantity,
                }}
                mode={isMobile ? "order-confirmation" : "checkout"}
              />
            ))}
          </section>
        </section>
        <aside className="flex flex-col w-full lg:w-[30%]">
          <OrderSummary
            subTotal={orderDetails.order.displayedSubTotal}
            discount={orderDetails.order.displayedOrderDiscount}
            total={orderDetails.order.displayedOrderTotal}
            print={() => printOrderConfirmation()}
            mode={"order-confirmation"}
          >
            <div className="flex justify-between items-center">
              <p>{tOrderConfirmation("OrderNumber")}:</p>
              <p className="font-semibold text-primary-700 text-xl">
                #{order.orderNumber}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p>{tOrderConfirmation("OrderedBy")}:</p>
              <p className="font-semibold">
                {user.firstname} {user.lastname}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p>{tOrderConfirmation("OrderDate")}:</p>
              <p className="font-semibold">{order.displayedOrderDate}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>{tOrderConfirmation("CustomerNumber")}:</p>
              <p className="font-semibold">{order.customerNumber}</p>
            </div>
            <div className="flex flex-col">
              <p>{tOrderConfirmation("PaymentOption")}:</p>
              <div
                className={classNames("flex items-center", {
                  "justify-between": order.paymentType === "PO",
                  "justify-start gap-4": order.paymentType === "CD",
                })}
              >
                {order.paymentType === "PO" ? (
                  <p className="text-sm">
                    {tOrderConfirmation("PurchaseOrderNumber")}
                  </p>
                ) : (
                  <PaymentLogo provider={payment.type} />
                )}
                {order.paymentType === "PO" ? (
                  <p className="text-sm font-semibold">{order.poNumber}</p>
                ) : (
                  <p className="text-sm">
                    {tOrderConfirmation("CardEnding")}{" "}
                    <span className="font-semibold">
                      {payment.number.replace(/\*/g, "")}
                    </span>
                  </p>
                )}
              </div>
            </div>
            {order.orderHeaderComment && (
              <div className="flex flex-col border-b pb-6">
                <p>{tOrderConfirmation("CartComments")}:</p>
                <p className="text-sm">{order.orderHeaderComment}</p>
              </div>
            )}
          </OrderSummary>
        </aside>
      </section>
      <div style={{ display: "none" }}>
        <PrintOrderConfirmation orderDetails={orderDetails} ref={contentRef} />
      </div>
    </Fragment>
  );
}
