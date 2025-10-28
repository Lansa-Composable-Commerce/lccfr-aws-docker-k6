"use client";

import { type ChangeEvent, useEffect, useId, useState } from "react";
import { SfButton } from "@storefront-ui/react";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "react-responsive";

// components
import Modal from "@/components/globalUI/Modal";
import Input from "@/components/globalUI/Input";
import Button from "@/components/globalUI/Button";
import ComboboxInput from "@/components/globalUI/ComboboxInput";

// redux
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getQuickOrderSuggestion,
  getQuickShopProduct,
  openQuickShopAddItemModal,
  selectIsError,
  selectIsLoading,
  selectIsLoadingAddProduct,
  selectIsOpenQuickShopAddItemModal,
  selectQuickShopSuggestionData,
  selectToggleCustomerItemNumber,
  setUniqueId,
} from "@/lib/features/quickShop/quickShopSlice";
import { useDebounce } from "@/lib/hooks/useDebounce";

import { SvgXMark } from "@/assets/svg";
import { showToast } from "@/components/globalUI/CustomToast";

const QuickShopModal = () => {
  const tQuickShop = useTranslations("quickshop");

  const dispatch = useAppDispatch();
  const uniqueId = useId();

  const isQuickShopModalVisible = useAppSelector(
    selectIsOpenQuickShopAddItemModal,
  );
  const isQuickShopErrorMessage = useAppSelector(selectIsError);
  const isSuggestionLoading = useAppSelector(selectIsLoading);
  const isAddProductLoading = useAppSelector(selectIsLoadingAddProduct);

  const suggestionData = useAppSelector(selectQuickShopSuggestionData);
  const isCustomerItemNumber = useAppSelector(selectToggleCustomerItemNumber);

  const [productData, setProductData] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [quantity, setQuantity] = useState<number | string>("");

  const [productCodeError, setProductCodeError] = useState("");
  const [quantityError, setQuantityError] = useState("");

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const debouncedSearchTerm = useDebounce(searchValue, 300);

  const params = {
    itemCode: searchValue,
    quantity: Number(quantity),
    type: isCustomerItemNumber ? null : `C`,
  };

  useEffect(() => {
    setProductCodeError(isQuickShopErrorMessage);
  }, [isQuickShopErrorMessage]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // @ts-ignore
      dispatch(getQuickOrderSuggestion(params));
    }
  }, [debouncedSearchTerm, dispatch, isCustomerItemNumber]);

  const handleAddProduct = async () => {
    if (!searchValue) {
      setProductCodeError(tQuickShop("ItemCodeRequired"));
      return;
    }
    if (Number(quantity) <= 0) {
      setQuantityError(tQuickShop("QuantityRequired"));
      return;
    }

    dispatch(setUniqueId(uniqueId));
    const res = await dispatch(getQuickShopProduct(params));
    // @ts-ignore

    if (res.meta.requestStatus === "fulfilled") {
      if (res.payload.data?.productCode !== "") {
        showToast("success", tQuickShop("ItemAddedSuccessfully"));
        setSearchValue("");
        setQuantity("");
        return;
      }
    }
  };

  const handleChangeQuantity = (event: ChangeEvent<HTMLInputElement>) => {
    let quantityValue: any = event.target.value;

    quantityValue = quantityValue.replace(/\D/g, "");
    if (quantityValue.length > 15) {
      quantityValue = quantityValue.slice(0, 15);
    }

    setQuantity(quantityValue);
  };

  const handleQuickModalVisible = () => {
    dispatch(openQuickShopAddItemModal());
    setProductCodeError("");
    setQuantityError("");
  };

  useEffect(() => {
    // @ts-ignore
    return setProductData(suggestionData);
  }, [suggestionData]);

  useEffect(() => {
    if (searchValue.length > 0) {
      setProductCodeError("");
    }

    if (Number(quantity) > 0) {
      setQuantityError("");
    }
  }, [searchValue, quantity]);

  return (
    <Modal
      isOpen={isQuickShopModalVisible}
      close={handleQuickModalVisible}
      className="mx-auto w-full px-4 p-5 z-50 max-w-lg dark:bg-black01"
    >
      <header>
        <SfButton
          square
          variant="tertiary"
          className="absolute right-2 top-2"
          onClick={handleQuickModalVisible}
          aria-label="Close"
        >
          <SvgXMark />
        </SfButton>
        <h3
          id="productModalTitle"
          className="font-bold typography-headline-4 md:typography-headline-3"
        >
          {tQuickShop("AddProduct")}
        </h3>
      </header>
      <div className="mt-4">
        <div className="flex items-start w-full gap-5">
          <div className="flex-grow w-full">
            <div className="w-full flex flex-col gap-1">
              <ComboboxInput
                label={tQuickShop("ItemCode")}
                options={productData}
                setSearchValue={setSearchValue}
                searchValue={searchValue}
                isSuggestionLoading={isSuggestionLoading}
                placeholder={tQuickShop("PlhItemCode")}
                required={true}
                size={isMobile ? "sm" : "base"}
              />
              <span className="text-error">{productCodeError}</span>
            </div>
          </div>
          <div className="flex-none w-full max-w-[150px]">
            <div className=" w-full flex flex-col gap-1">
              <p className="capitalize form-label">
                {tQuickShop("Quantity")} <span className="text-error">*</span>
              </p>
              <Input
                type="number"
                className="py-2 lg:text-lg"
                placeholder={tQuickShop("Quantity")}
                enterKeyHint="enter"
                onChange={handleChangeQuantity}
                disabled={!searchValue}
                value={quantity}
                aria-label="Quantity"
              />
              <span className="text-error">{quantityError}</span>
            </div>
          </div>
        </div>
        <div className="mt-9 flex items-center justify-end ">
          <div className="w-full max-w-40">
            <Button
              className="sm:h-[50px] lg:h-[60px]  uppercase w-full"
              onClick={handleAddProduct}
              disabled={isAddProductLoading}
            >
              {isAddProductLoading
                ? tQuickShop("Adding") + `...`
                : tQuickShop("Add")}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuickShopModal;
