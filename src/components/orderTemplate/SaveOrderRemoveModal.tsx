"use client";

import React from "react";
import { useTranslations } from "next-intl";

import Modal from "@/components/globalUI/Modal";
import Button from "@/components/globalUI/Button";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  removeSavedOrder,
  selectIsLoadingRemoveSavedOrder,
  selectIsMessages,
  selectIsRemoveModalVisible,
  selectIsSavedOrderNumber,
  setRemoveMessages,
  setRemoveModalVisible,
} from "@/lib/features/orderTemplate/orderTemplateSlice";
import { useDisplayToastMessage } from "@/lib/hooks/useDisplayToastMessage";
import { reFetchSavedOrder } from "@/lib/hooks/reFetchSavedOrder";

const SaveOrderRemoveModal = () => {
  const t: any = useTranslations("OrdrTmplte");

  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(selectIsLoadingRemoveSavedOrder);
  const isRemoveModalVisible = useAppSelector(selectIsRemoveModalVisible);
  const savedOrderNumber = useAppSelector(selectIsSavedOrderNumber);
  const messages = useAppSelector(selectIsMessages);

  useDisplayToastMessage({ status: "success", messages: messages });

  const handleRemoveSavedOrder = async () => {
    const res = await dispatch(removeSavedOrder(savedOrderNumber));

    if (res?.meta?.requestStatus === "fulfilled") {
      await reFetchSavedOrder();
      dispatch(setRemoveModalVisible());
      dispatch(setRemoveMessages());
    }
  };

  return (
    <Modal
      isOpen={isRemoveModalVisible}
      title={`${t("RmvSvdOrdr")} # ${savedOrderNumber}`}
      close={() => dispatch(setRemoveModalVisible())}
      className=" p-5 z-50 sm:mx-auto sm:max-w-md dark:bg-black01 mx-2"
    >
      <div className="mt-5">
        <span>{t("RmvThisTmplte")}</span>
      </div>
      <div className="mt-8 flex items-center justify-end ">
        <div className="w-full max-w-40">
          <Button
            className="sm:h-[50px] lg:h-[60px]  uppercase min-w-10 w-full"
            onClick={handleRemoveSavedOrder}
            disabled={isLoading}
          >
            {isLoading ? `${t("Removing")}...` : t("Confirm")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SaveOrderRemoveModal;
