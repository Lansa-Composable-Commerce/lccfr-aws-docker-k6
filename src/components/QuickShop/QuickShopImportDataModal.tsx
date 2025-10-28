"use client";

import React, { type ChangeEvent, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SfButton } from "@storefront-ui/react";

// components
import Modal from "@/components/globalUI/Modal";
import { SecondaryTitle } from "@/components/globalUI/Typography";
import Button from "@/components/globalUI/Button";
import TextArea from "@/components/globalUI/TextArea";
import { showToast } from "@/components/globalUI/CustomToast";

// lib
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  openQuickShopImportDataModal,
  quickShopImportProduct,
  selectIsLoadingImportProduct,
  selectIsOpenQuickShopImportDataModal,
  selectSuccessMessages,
  selectSuccessMessagesDisplayed,
  setAlertVisible,
  setSuccessMessagesDisplayed,
} from "@/lib/features/quickShop/quickShopSlice";

import { SvgXMark } from "@/assets/svg";
import { Messages } from "@/types";

const QuickShopImportDataModal = () => {
  const tQuickShop = useTranslations("quickshop");
  const tValidation = useTranslations("Validation");

  const dispatch = useAppDispatch();

  const isModalOpen = useAppSelector(selectIsOpenQuickShopImportDataModal);
  const isLoading = useAppSelector(selectIsLoadingImportProduct);
  const successMessages = useAppSelector(selectSuccessMessages);
  const successMessagesDisplayed = useAppSelector(
    selectSuccessMessagesDisplayed,
  );

  const [importText, setImportText] = useState("");

  const normalizeImportText = (text: string): string => {
    let cleanedText = text.replace(/\t/g, "");
    cleanedText = cleanedText.toUpperCase();

    return cleanedText;
  };

  // useDisplayToastMessage({ messages: isMessages });

  const handleImportProducts = async () => {
    const normalizedImportText = normalizeImportText(importText);

    try {
      const res = await dispatch(
        quickShopImportProduct({
          importText: normalizedImportText,
        }),
      );

      if (res.meta.requestStatus === "fulfilled") {
        const messages: Messages[] = res.payload?.data?.message;
        if (messages) {
          const errorMessages = messages.filter(
            (message) => message.type === "error",
          );
          if (errorMessages) {
            dispatch(setAlertVisible(true));
          }
        }
        //no need to call  showToast here anymore
      }

      dispatch(openQuickShopImportDataModal(false));
    } catch (error: any) {
      console.error("An unexpected error occurred during import:", error);
      showToast("error", tQuickShop("ImportFailedUnexpectedError"));
    }
  };

  /*  useEffect(() => {
    if (successMessages.length > 0) {
      successMessages.forEach((message: any) => {
        let finalMessage = tValidation(message.code);
        finalMessage = finalMessage.replace(/\\"/g, "");
        if (message.substitutions) {
          const placeholderRegex = /&(\d+)/g;
          finalMessage = finalMessage.replace(
            placeholderRegex,
            (match, placeholderNumber) => {
              const index = parseInt(placeholderNumber, 10) - 1;

              if (Array.isArray(message.substitutions)) {
                return message.substitutions[index] || match;
              } else if (typeof message.substitutions === "string") {
                return message.substitutions || match;
              }
              return match;
            },
          );
        }
        showToast("success", finalMessage);
      });
    }
  }, [successMessages]);*/

  const handleChangeTextArea = (event: ChangeEvent<HTMLInputElement>) => {
    let phrase = event.target.value;

    phrase = phrase.replace(/\n/g, ",");
    phrase = phrase.toUpperCase();
    setImportText(phrase);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      close={() => dispatch(openQuickShopImportDataModal(false))}
      className="mx-auto w-full p-5 z-50 max-w-md dark:bg-black01"
    >
      <header>
        <SfButton
          square
          variant="tertiary"
          className="absolute right-2 top-2"
          onClick={() => dispatch(openQuickShopImportDataModal(false))}
          aria-label="Close"
        >
          <SvgXMark />
        </SfButton>
        <h3
          id="productModalTitle"
          className="font-bold typography-headline-4 md:typography-headline-3"
        >
          {tQuickShop("ImportData")}
        </h3>
      </header>
      <div className="w-full h-full mt-3">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <SecondaryTitle content={tQuickShop("ImportDataDirectionText")} />
          <div className="w-full mt-4">
            <label>
              <span className="typography-text-sm font-medium cursor-not-allowed text-disabled-900 text-gray03 dark:text-gray-300">
                {tQuickShop("importDataLabel")}
              </span>
              <TextArea
                rows={4}
                placeholder={tQuickShop("importDateTextAreaPlaceholder")}
                className="w-full !ring-disabled-300 !ring-1 block dark:text-gray-200 dark:bg-light-dark"
                onChange={(e: any) => handleChangeTextArea(e)}
                size="lg"
              />
            </label>
          </div>
        </div>
        <div className="mt-12 flex items-center justify-end ">
          <div className="w-full max-w-40">
            <Button
              className="sm:h-[50px] lg:h-[60px]  uppercase min-w-10 w-full"
              onClick={handleImportProducts}
              disabled={importText === "" || isLoading}
            >
              {isLoading
                ? tQuickShop("Importing") + `...`
                : tQuickShop("Import")}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuickShopImportDataModal;
