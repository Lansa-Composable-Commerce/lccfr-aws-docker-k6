import {
  SfIconCheckCircle,
  SfIconClose,
  SfIconError,
  SfIconInfo,
  SfIconWarning,
} from "@storefront-ui/react";
import classNames from "classnames";

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

export const AlertSuccess = ({
  message,
  title,
  hasCloseIcon,
  close,
  containerClass,
  titleClass,
  messageClass,
}: AlertPropType) => {
  return (
    <div
      role="alert"
      className={classNames(
        "flex items-start max-w-[500px] shadow-md bg-positive-100 pr-2 pl-4 ring-1 ring-positive-200 typography-text-sm md:typography-text-base py-1 rounded-md",
        containerClass,
      )}
    >
      <SfIconCheckCircle
        className="my-2 mr-3 text-positive-700 shrink-0 size-8"
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
      </div>
      {hasCloseIcon && (
        <button
          onClick={close}
          type="button"
          className="p-1.5 md:p-2 ml-auto rounded-md text-positive-700 hover:bg-positive-200 active:bg-positive-300 hover:text-positive-800 active:text-positive-900 focus-visible:outline focus-visible:outline-offset"
          aria-label="Close positive alert"
        >
          <SfIconClose className="hidden md:block size-4" />
          <SfIconClose size="sm" className="block md:hidden size-4" />
        </button>
      )}
    </div>
  );
};

export const AlertError = ({
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
        "flex items-start md:items-center max-w-[500px] shadow-md bg-negative-100 pr-2 pl-4 ring-1 ring-negative-300 typography-text-sm md:typography-text-base py-1 rounded-md",
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

export const AlertWarning = ({
  message,
  title,
  hasCloseIcon,
  close,
  containerClass,
  titleClass,
  messageClass,
}: AlertPropType) => {
  return (
    <div
      role="alert"
      className={classNames(
        "flex items-start max-w-[500px] shadow-md bg-warning-100 pr-2 pl-4 ring-1 ring-warning-200 typography-text-sm md:typography-text-base py-1 rounded-md",
        containerClass,
      )}
    >
      <SfIconWarning
        className="my-2 mr-2 text-warning-700 shrink-0"
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
      </div>
      {hasCloseIcon && (
        <button
          onClick={close}
          type="button"
          className="p-1.5 md:p-2 ml-auto rounded-md text-warning-700 hover:bg-warning-200 active:bg-warning-300 hover:text-warning-800 active:text-warning-900 font-medium focus-visible:outline focus-visible:outline-offset"
        >
          <SfIconClose className="hidden md:block" />
          <SfIconClose size="sm" className="block md:hidden" />
        </button>
      )}
    </div>
  );
};

export const AlertInfo = ({
  message,
  title,
  hasCloseIcon,
  close,
  containerClass,
  titleClass,
  messageClass,
}: AlertPropType) => {
  return (
    <div
      role="alert"
      className={classNames(
        "flex items-start max-w-[500px] shadow-md bg-secondary-100 pr-2 pl-4 ring-1 ring-secondary-200 typography-text-sm md:typography-text-base py-1 rounded-md",
        containerClass,
      )}
    >
      <SfIconInfo
        className="my-2 mr-2 text-secondary-700 shrink-0"
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
      </div>
      {hasCloseIcon && (
        <button
          onClick={close}
          type="button"
          className="p-1.5 md:p-2 ml-auto rounded-md text-secondary-700 hover:bg-secondary-200 active:bg-secondary-300 hover:text-secondary-800 active:text-secondary-900 font-medium focus-visible:outline focus-visible:outline-offset"
        >
          <SfIconClose className="hidden md:block" />
          <SfIconClose size="sm" className="block md:hidden" />
        </button>
      )}
    </div>
  );
};

export default function AlertNeutral({ content }: { content: string }) {
  return (
    <div
      role="alert"
      className="bg-neutral-100 max-w-[600px] pr-2 pl-4 ring-neutral-200 typography-text-sm md:typography-text-sm py-1 rounded-md dark:bg-neutral-300 dark:text-gray-900"
    >
      <div className="py-2">
        You&apos;re currently selected{" "}
        <span className="font-bold">{content} </span>
        account
      </div>
    </div>
  );
}
