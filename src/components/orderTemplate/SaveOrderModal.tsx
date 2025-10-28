"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import Modal from "@/components/globalUI/Modal";
import Button from "@/components/globalUI/Button";
import Input from "@/components/globalUI/Input";
import SelectDropdownWithPlaceholder from "../globalUI/SelectDropdown";
import ErrorMessage from "@/components/ErrorMessage";
import { showToast } from "@/components/globalUI/CustomToast";

import {
  saveNewOrderTemplate,
  selectIsLoadingSaveOrder,
  selectIsSaveOrderModalVisible,
  setRemoveMessages,
  setSaveOrderModalVisible,
  updateSavedOrder,
} from "@/lib/features/orderTemplate/orderTemplateSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectCartState } from "@/lib/features/cart/cartSlice";
import {
  CartItemTransformed,
  SavedOrderResponseTypes,
  SelectOption,
} from "@/types";
import { reFetchSavedOrder } from "@/lib/hooks/reFetchSavedOrder";
import { STOREFRONT_ROUTES } from "@/utils/constants";

import { getSavedOrder } from "@/api/orderTemplate/getSavedOrder";

const SaveOrderModal = () => {
  const tValidation = useTranslations("Validation");
  const t: any = useTranslations("OrdrTmplte");

  const router = useRouter();

  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(selectIsLoadingSaveOrder);
  const isSaveOrderModalVisible = useAppSelector(selectIsSaveOrderModalVisible);

  const { items } = useAppSelector(selectCartState);

  const [savedUserDescription, setSavedUserDescription] = useState([]);

  const [isError, setIsError] = useState("");
  const [orderDescription, setOrderDescription] = useState("");
  const [selectOrderDescription, setSelectOrderDescription] =
    useState<SelectOption | null>();

  const onChangeCreateNewOrderTemplate = (event: any) => {
    const phrase = event.target.value;
    setIsError("");
    setSelectOrderDescription(null);
    setOrderDescription(phrase);
  };

  const handleSaveOrderModalVisible = () => {
    setIsError("");
    setOrderDescription("");
    setSelectOrderDescription(null);
    dispatch(setSaveOrderModalVisible());
  };

  const handleSaveOrder = async () => {
    try {
      const transformItems: CartItemTransformed[] = items.map((item) => ({
        productCode: item.productCode,
        quantity: item.quantity,
      }));

      const payload = {
        description: orderDescription,
        items: transformItems,
      };

      let res;
      if (selectOrderDescription) {
        // Update Existing Order
        res = await dispatch(
          updateSavedOrder({
            ...payload,
            id: selectOrderDescription.id,
          }),
        );
      } else {
        // Create New Order
        res = await dispatch(saveNewOrderTemplate(payload));
      }
      if (res?.meta?.requestStatus === "rejected") {
        setIsError(tValidation(res?.payload?.data?.messages[0]?.code));
        return;
      } else {
        showToast(
          "success",
          tValidation(res?.payload?.data?.messages[0]?.code),
        );

        await reFetchSavedOrder();
        router.push(STOREFRONT_ROUTES.ORDER_TEMPLATE);
        dispatch(setSaveOrderModalVisible());
        dispatch(setRemoveMessages());
        setOrderDescription("");
        setSelectOrderDescription(null);
      }
    } catch (error: any) {
      console.error("error", error);
    }
  };

  const handleEnterPress = async (event: any) => {
    if (event.key === "Enter") {
      await handleSaveOrder();
    }
  };

  const transformOrderDescription = savedUserDescription.map(
    (item: SavedOrderResponseTypes) => {
      return {
        id: item.savedOrderNumber,
        label: item.savedOrderDescription,
        value: item.savedOrderDescription,
      };
    },
  );

  useEffect(() => {
    if (isSaveOrderModalVisible) {
      const fetchSavedOrders = async () => {
        try {
          const res = await getSavedOrder();
          setSavedUserDescription(res);
        } catch (error) {
          console.error("Failed to fetch saved orders", error);
        }
      };

      fetchSavedOrders();
    }
  }, [isSaveOrderModalVisible]);

  return (
    <Modal
      isOpen={isSaveOrderModalVisible}
      close={handleSaveOrderModalVisible}
      title={t("SaveOrderTemplate")}
      className="mx-3 lg:mx-auto lg:w-full p-5 z-50 lg:max-w-md dark:bg-black01"
    >
      <div className="w-full h-full mt-3">
        <div className="flex flex-col gap-y-1.5 sm:gap-y-2 lg:gap-y-4">
          <div className="w-full flex flex-col gap-1 my-2">
            <label htmlFor="create-new-order-template" className="form-label">
              {t("CreateNwTmplte")}
            </label>
            <Input
              id="create-new-order-template"
              onChange={onChangeCreateNewOrderTemplate}
              className="py-3 lg:py-4 lg:text-lg border-none text-sm"
              placeholder={t("OrderDescription")}
              aria-label="Create new Order Template"
              onKeyDown={handleEnterPress}
            />
            {isError && <ErrorMessage message={isError} />}
          </div>
          <div className="w-full flex flex-col gap-1 my-2 lg:my-0">
            <SelectDropdownWithPlaceholder
              useUrl={false}
              selectName={t("UseExistingTmplte")}
              placeholder={t("SlctOrdrDesc")}
              options={transformOrderDescription}
              selectedOption={selectOrderDescription}
              setSelectedOption={(option: SelectOption | null) => {
                setSelectOrderDescription(option);
                setIsError("");
              }}
              disabled={!!orderDescription}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-end ">
        <div className="w-full max-w-40">
          <Button
            className="sm:h-[50px] lg:h-[60px]  uppercase min-w-10 w-full"
            onClick={handleSaveOrder}
            disabled={isLoading}
          >
            {isLoading ? `${t("Save")}...` : t("Save")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(SaveOrderModal);
