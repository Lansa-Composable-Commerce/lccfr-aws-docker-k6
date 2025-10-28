"use client";

import CartSummary from "@/components/cart/CartSummary";
import OrderSummary from "@/components/OrderSummary";
import SaveOrderModal from "@/components/orderTemplate/SaveOrderModal";

import {
  useGetCartQuery,
  useRemoveAllCartItemsMutation,
} from "@/services/cartApi";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectCartState,
  setRemoveAllModalOpen,
} from "@/lib/features/cart/cartSlice";
import { Fragment, useEffect, useState } from "react";
import CartEmpty from "@/components/cart/CartEmpty";
import SkeletonViewCart from "@/components/loading/SkeletonViewCart";
import { useWindowDimensions } from "@/lib/hooks/useWindowDimensions";
import useRemoveCartItem from "@/lib/hooks/useRemoveCartItem";
import ConfirmationModal from "@/components/ConfirmationModal";
import { showToast } from "@/components/globalUI/CustomToast";
import { useTranslations } from "next-intl";
import CartHeader from "@/components/cart/CartHeader";
import usePromoCodeHandler from "@/lib/hooks/usePromoCodeHandler";

export default function ViewCartWrapper() {
  const tMessage = useTranslations("Messages");
  const tCart = useTranslations("Cart");
  const tGlobal = useTranslations("Global");

  const isMobile = useWindowDimensions(1550, null);

  const { refetch: refetchCart, isLoading } = useGetCartQuery({});

  const dispatch = useAppDispatch();
  const { items, isRemoveAllModalOpen, orderTotal } =
    useAppSelector(selectCartState);
  const { cartSubTotalPrice, cartTotalPrice, cartDiscount, message } =
    useAppSelector(selectCartState);

  const [cartFetched, setCartFetched] = useState(false);
  usePromoCodeHandler(cartFetched, message);

  const { handleRemoveItem, loadingItem } = useRemoveCartItem(refetchCart);
  const [removeAllCartItems] = useRemoveAllCartItemsMutation();

  const handleOpenRemoveAllModal = () => {
    dispatch(setRemoveAllModalOpen(!isRemoveAllModalOpen));
  };

  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveAllItems = async () => {
    setIsRemoving(true);

    const response = await removeAllCartItems({});

    if (response && response.data) {
      await refetchCart();
      showToast("success", tMessage("MsgCartItemRemoved"));
    }

    dispatch(setRemoveAllModalOpen(false));
    setIsRemoving(false);
  };

  useEffect(() => {
    refetchCart().then(() => setCartFetched(true));
  }, []);

  return (
    <Fragment>
      <CartHeader />
      <div className="flex flex-col lg:flex-row gap-4 my-2">
        {isLoading ? (
          <SkeletonViewCart />
        ) : items && items.length > 0 ? (
          <Fragment>
            <div className="w-full flex flex-col gap-8 lg:w-[70%]">
              <div className="w-full space-y-4 overflow-y-auto max-h-[35em] no-scrollbar lg:max-h-[100vh]">
                {items.map((item) => (
                  <CartSummary
                    key={item.productCode}
                    cartItem={item}
                    remove={handleRemoveItem}
                    isLoading={loadingItem === item.lineNumber}
                    mode={isMobile ? "preview" : "default"}
                  />
                ))}
              </div>
              <p
                className="self-end font-medium cursor-pointer hover:text-primary-700 hover:underline"
                onClick={handleOpenRemoveAllModal}
              >
                {tCart("RemoveAll")}
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full lg:w-[30%]">
              <OrderSummary
                subTotal={cartSubTotalPrice}
                orderTotal={orderTotal}
                discount={cartDiscount}
                total={cartTotalPrice}
                items={items}
              />
            </div>
          </Fragment>
        ) : (
          <CartEmpty hasLink={true} />
        )}
        <ConfirmationModal
          isOpen={isRemoveAllModalOpen}
          isLoading={isRemoving}
          close={handleOpenRemoveAllModal}
          title={tCart("RemoveAllItems")}
          description={tCart("RemoveAllItemsDescription")}
          confirmText={tCart("RemoveAll")}
          cancelText={tGlobal("Cancel")}
          onConfirm={handleRemoveAllItems}
        />
      </div>
      <SaveOrderModal />
    </Fragment>
  );
}
