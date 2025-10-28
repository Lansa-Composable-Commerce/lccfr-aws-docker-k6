"use client";

import CardAddress from "@/components/checkout/CardAddress";
import PaymentOptions from "@/components/PaymentOptions";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  resetCheckout,
  selectCheckoutState,
  setFormErrors,
  setModalOpen,
} from "@/lib/features/checkout/checkoutSlice";
import {
  useGetCheckoutDetailsQuery,
  usePlaceOrderMutation,
} from "@/services/checkoutApi";
import CartSummary from "@/components/cart/CartSummary";
import SkeletonCartSummary from "@/components/loading/SkeletonCartSummary";
import { Fragment, useEffect, useState } from "react";
import { useGetCartQuery } from "@/services/cartApi";
import { resetCart, selectCartState } from "@/lib/features/cart/cartSlice";
import SkeletonAddress from "@/components/loading/SkeletonAddress";
import OrderSummary from "@/components/OrderSummary";
import SkeletonDiscountForm from "@/components/loading/SkeletonDiscountForm";
import SkeletonOrderSummary from "@/components/loading/SkeletonOrderSummary";
import CartEmpty from "@/components/cart/CartEmpty";
import { useTranslations } from "next-intl";
import { showToast } from "@/components/globalUI/CustomToast";
import { useWindowDimensions } from "@/lib/hooks/useWindowDimensions";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Message } from "@/types";
import { setTokens } from "@/lib/features/auth/authSlice";
import CartHeader from "@/components/cart/CartHeader";
import { isExpirationDateExpired } from "@/utils";
import { useRouter } from "@/i18n/routing";
import { setPostOrderDetails } from "@/lib/features/global/globalSlice";
import usePromoCodeHandler from "@/lib/hooks/usePromoCodeHandler";

export default function Checkout() {
  const router = useRouter();
  const tCheckout = useTranslations("Checkout");
  const tValidation = useTranslations("Validation");

  const isMobile = useWindowDimensions(1550, null);
  const { refetch: refetchCart, isLoading: isCartLoading } =
    useGetCartQuery(undefined);
  const { refetch: refetchCheckoutDetails, isLoading: isInitLoading } =
    useGetCheckoutDetailsQuery({});

  const [placeOrder, { isLoading: isOrderProcessing }] =
    usePlaceOrderMutation();

  const {
    cartId,
    items,
    cartDiscount,
    cartTotalPrice,
    cartSubTotalPrice,
    orderTotal,
    message,
  } = useAppSelector(selectCartState);
  const { placeOrderPayload, billingDetails, shippingDetails, isOpen } =
    useAppSelector(selectCheckoutState);

  const [cartFetched, setCartFetched] = useState(false);
  usePromoCodeHandler(cartFetched, message);

  const dispatch = useAppDispatch();

  const handleOpenModal = () => {
    dispatch(setModalOpen(!isOpen));
  };

  const handlePlaceOrder = async () => {
    const errors: { [key: string]: string } = {};

    if (placeOrderPayload.paymentType === "CD") {
      const { cardHolderName, cardNumber, cardExpiryYear, cardExpiryMonth } =
        placeOrderPayload;

      if (!cardHolderName)
        errors.cardHolderName = tValidation("MsgCardHolderNameIsRequired");
      if (!cardNumber)
        errors.cardNumber = tValidation("MsgCardNumberIsRequired");
      if (!cardExpiryMonth || !cardExpiryYear)
        errors.cardExpiration = tValidation("MsgCardExpirationIsRequired");
      if (cardExpiryMonth && cardExpiryYear) {
        const isDateExpired = isExpirationDateExpired(
          cardExpiryMonth,
          cardExpiryYear,
        );
        if (isDateExpired)
          errors.cardExpiration = tValidation("MsgCardExpirationPassed");
      }
    }

    if (placeOrderPayload.paymentType === "PO" && !placeOrderPayload.poNumber) {
      errors.poNumber = tValidation("MsgOrderNumberIsRequired");
    }

    if (Object.keys(errors).length > 0) {
      dispatch(setFormErrors(errors));
      return;
    }

    const response = await placeOrder(placeOrderPayload);

    if (response.error) {
      const error = response.error as FetchBaseQueryError;
      const data = error.data as unknown as { messages: Message[] };
      const errorCode = data.messages[1].code || "MsgDefaultError";

      return showToast("error", tValidation(errorCode));
    }

    dispatch(
      setPostOrderDetails({
        emailStatus: response.data.emailStatus,
        isSuccess: true,
      }),
    );

    router.replace(`/order-confirmation?cartId=${cartId}`);

    setTimeout(() => {
      dispatch(resetCart());
      dispatch(resetCheckout());
      dispatch(
        setTokens({
          accessToken: response.data.LW3ACSTKN,
          csrfToken: response.data.LW3CSRFTK,
        }),
      );
    }, 1000);
  };

  useEffect(() => {
    refetchCart().then(() => setCartFetched(true));
    refetchCheckoutDetails();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {isCartLoading || isInitLoading || items.length > 0 ? (
        <Fragment>
          <div className="flex flex-col w-full gap-8 lg:w-[70%]">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex flex-col gap-4 w-full">
                {!isInitLoading ? (
                  <Fragment>
                    <CardAddress
                      title={tCheckout("ShippingAddress")}
                      contactName={shippingDetails.contactName}
                      address1={shippingDetails.address1}
                      regionInformation={shippingDetails.regionDetails}
                      country={shippingDetails.country}
                      change={handleOpenModal}
                    />
                    <CardAddress
                      title={tCheckout("BillingAddress")}
                      contactName={billingDetails.contactName}
                      address1={billingDetails.address1}
                      regionInformation={billingDetails.regionDetails}
                      country={billingDetails.country}
                    />
                  </Fragment>
                ) : (
                  <Fragment>
                    <SkeletonAddress />
                    <SkeletonAddress />
                  </Fragment>
                )}
              </div>
              <div className="w-full">
                <PaymentOptions />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <CartHeader />
              <div className="flex flex-col gap-2 max-h-[49em] overflow-y-auto no-scrollbar">
                {!isCartLoading ? (
                  items.map((item) => (
                    <CartSummary
                      key={item.productCode}
                      cartItem={item}
                      mode={isMobile ? "order-confirmation" : "checkout"}
                    />
                  ))
                ) : (
                  <SkeletonCartSummary />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full gap-4 lg:w-[30%]">
            {isCartLoading || isInitLoading ? (
              <Fragment>
                <SkeletonDiscountForm />
                <SkeletonOrderSummary />
              </Fragment>
            ) : (
              <Fragment>
                <OrderSummary
                  subTotal={cartSubTotalPrice}
                  orderTotal={orderTotal}
                  discount={cartDiscount}
                  total={cartTotalPrice}
                  mode={"checkout"}
                  placeOrder={handlePlaceOrder}
                  isLoading={isOrderProcessing}
                />
              </Fragment>
            )}
          </div>
        </Fragment>
      ) : (
        <CartEmpty hasLink={true} />
      )}
    </div>
  );
}
