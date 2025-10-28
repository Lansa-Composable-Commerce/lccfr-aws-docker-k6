import React, { useEffect, useState } from "react";
import { SfIconClose, SfIconError } from "@storefront-ui/react";
import { useTranslations } from "next-intl";
import classNames from "classnames";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectErrorMessages,
  selectIsAlertVisible,
  setAlertVisible,
} from "@/lib/features/quickShop/quickShopSlice";

const QuickShopAlert = () => {
  const dispatch = useAppDispatch();
  const isAlertVisible = useAppSelector(selectIsAlertVisible);
  const errorMessages: any = useAppSelector(selectErrorMessages);

  const tValidation = useTranslations("Validation");

  const [formattedErrorCodes, setFormattedErrorCodes] = useState<string[]>([]);

  useEffect(() => {
    if (errorMessages.length > 0) {
      const formattedCodes: string[] = [];
      if (errorMessages && Array.isArray(errorMessages)) {
        errorMessages.forEach((message: any) => {
          let translatedCode = tValidation(message.code);
          if (message.substitutions) {
            const placeholderRegex = /&(\d+)/g;
            translatedCode = translatedCode.replace(
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

          if (message.type === "error") {
            formattedCodes.push(translatedCode);
          }
        });
      }
      setFormattedErrorCodes(formattedCodes);
    } else {
      setFormattedErrorCodes([]);
    }
  }, [errorMessages, tValidation]);

  const handleCloseAlert = () => {
    dispatch(setAlertVisible(false));
  };

  return (
    <>
      {isAlertVisible && errorMessages.length > 0 && (
        <QuickShopAlertError
          messages={formattedErrorCodes}
          messagesClass="pl-2.5 lg:pl-4 list-disc list-outside"
          messageTextClass="py-0.5"
          containerClass="max-w-full "
          hasCloseIcon={true}
          close={handleCloseAlert}
        />
      )}
    </>
  );
};

export default QuickShopAlert;

const QuickShopAlertError = ({
  message,
  title,
  hasCloseIcon,
  close,
  containerClass,
  titleClass,
  messageClass,
  messages,
  messagesClass,
  messageTextClass,
}: AlertPropType) => {
  return (
    <div
      role="alert"
      className={classNames(
        "flex items-start max-w-full shadow-md bg-negative-100 pr-2 pl-4 ring-1 ring-negative-300 typography-text-sm md:typography-text-base py-1 rounded-md",
        containerClass,
      )}
    >
      <SfIconError
        className="my-2 mr-3 text-negative-700 shrink-0 size-8"
        fill="currentColor"
      />
      <div className="py-2 mr-2">
        {title && (
          <p className={classNames("font-medium text-lg", titleClass)}>
            {title}
          </p>
        )}
        <p className={classNames("dark:text-gray03", messageClass)}>
          {message}
        </p>
        {messages && (
          <ul className={classNames("dark:text-gray03", messagesClass)}>
            {messages.map((message: any, index: number) => (
              <li
                key={index}
                className={classNames(messageTextClass, {
                  "pt-0": index === 0,
                  "pt-0.5": index > 0,
                })}
              >
                {message}
              </li>
            ))}
          </ul>
        )}
      </div>
      {hasCloseIcon && (
        <button
          onClick={close}
          type="button"
          className="p-1.5 md:p-2 ml-auto rounded-md text-negative-700 hover:bg-negative-200 active:bg-negative-300 hover:text-negative-800 active:text-negative-900 focus-visible:outline focus-visible:outline-offset"
          aria-label="Close error alert"
        >
          <SfIconClose className="hidden md:block size-4" />
          <SfIconClose size="sm" className="block md:hidden size-4" />
        </button>
      )}
    </div>
  );
};

type AlertPropType = {
  message?: string;
  title?: string;
  hasCloseIcon?: boolean;
  close?: () => void;
  containerClass?: string;
  titleClass?: string;
  messageClass?: string;
  messages?: string[];
  messagesClass?: string;
  messageTextClass?: string;
};
