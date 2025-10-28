"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

import Button from "@/components/globalUI/Button";
import { showToast } from "@/components/globalUI/CustomToast";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  onOpenAddItemModal,
  onRemoveSelectItem,
  selectIsItems,
} from "@/lib/features/myProducts/myProductsSlice";
import { removeProductToFavorite } from "@/lib/features/products/productsSlice";

import { useAddToCartMutation } from "@/services/cartApi";

const MyProductAddUpdate = () => {
  const tMyProducts: any = useTranslations("MyProducts");
  const tMessages = useTranslations("Messages");

  const dispatch = useAppDispatch();

  const selectedItem = useAppSelector(selectIsItems);

  const [addToCart] = useAddToCartMutation();

  const [isLoading, setIsLoading] = useState({
    remove: false,
    addToCart: false,
  });

  const handleAddItemModal = () => {
    dispatch(onOpenAddItemModal());
  };

  const handleRemoveFavorites = () => {
    const successfulRemovals: string[] = []; // Keep track of successfully removed item codes
    setIsLoading({ remove: true, addToCart: false });

    const removalPromises = selectedItem.map((item: any) =>
      dispatch(removeProductToFavorite(item.LW3ITEMCD))
        .then((res) => {
          console.log("Removal successful:", res);

          successfulRemovals.push(item.LW3ITEMCD); // Store the code if removal is successful
        })

        .catch((err) => {
          console.error("Removal failed:", err);
        })
        .finally(() => setIsLoading({ remove: false, addToCart: false })),
    );

    Promise.all(removalPromises) // Wait for all API calls to resolve.  No need for finally()

      .then(() => {
        dispatch(onRemoveSelectItem(successfulRemovals)); // Dispatch once with all successful removals
      });
  };

  async function handleAddToCart() {
    setIsLoading({ remove: false, addToCart: true });
    const payload = selectedItem.map((item: any) => {
      return {
        productCode: item.LW3ITEMCD,
        quantity: Number(item.LW3COLQTY),
      };
    });
    const response = await addToCart(payload);
    if (response && response.data) {
      const { messages } = response.data;
      showToast("success", tMessages(messages[0].code));
      setIsLoading({ remove: false, addToCart: false });
    }
  }

  return (
    <>
      <div className="w-full flex items-center justify-end">
        <Button
          size="lg"
          className="sm:h-[50px] lg:h-[60px]  px-8"
          variant="secondary"
          onClick={handleAddItemModal}
        >
          <p className="text-sm lg:text-lg dark:text-neutral-200">
            {tMyProducts("AddItems")}
          </p>
        </Button>
        {/*<Button
            size="lg"
            className="sm:h-[50px] lg:h-[60px]  uppercase w-full"
            variant="secondary"
            onClick={handleRemoveFavorites}
            disabled={selectedItem.length <= 0}
          >
            <p className="text-sm lg:text-lg dark:text-neutral-200">
              {isLoading.remove
                ? `${tMyProducts("Removing")}` + `...`
                : tMyProducts("Remove")}
            </p>
          </Button>
          <Button
            size="lg"
            className="sm:h-[50px] lg:h-[60px]  uppercase w-full"
            variant="primary"
            onClick={handleAddToCart}
            disabled={selectedItem.length <= 0}
          >
            <p className="text-sm lg:text-lg dark:text-neutral-200">
              {isLoading.addToCart
                ? `${tMyProducts("Adding")}` + `...`
                : tMyProducts("AddSelectedProductsToCart")}
            </p>
          </Button>*/}
      </div>
    </>
  );
};

export default MyProductAddUpdate;
