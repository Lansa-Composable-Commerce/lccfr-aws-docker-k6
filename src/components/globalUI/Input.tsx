"use client";

import classNames from "classnames";
import {
  SfInputSize,
  useFocusVisible,
  type SfInputProps,
  polymorphicForwardRef,
} from "@storefront-ui/react";

const defaultWrapperTag = "span";

/*const sizeClasses = {
  [SfInputSize.sm]: " h-[32px]",
  [SfInputSize.base]: "h-[40px]",
  [SfInputSize.lg]: "h-[48px]",
};*/

const Input = polymorphicForwardRef<typeof defaultWrapperTag, SfInputProps>(
  (
    {
      wrapperAs,
      size = SfInputSize.base,
      slotPrefix,
      slotSuffix,
      invalid,
      className,
      wrapperClassName,
      ...attributes
    },
    ref,
  ) => {
    const WrapperTag = wrapperAs || defaultWrapperTag;
    const { isFocusVisible } = useFocusVisible({ isTextInput: true });

    return (
      <WrapperTag
        className={classNames([
          "h-full bg-white flex items-center gap-2 rounded-lg lg:rounded-large ring-2 text-black01 text-base hover:ring-primary-700 focus-within:caret-primary-700 active:caret-primary-700 active:ring-primary-700 active:ring-2 focus-within:ring-primary-700 focus-within:ring-2 dark:bg-dark",
          {
            "ring-2 ring-negative-700": invalid,
            "ring-1 ring-neutral-300": !invalid,
            "focus-within:outline focus-within:outline-offset": isFocusVisible,
          },
          // sizeClasses[size],
          wrapperClassName,
        ])}
        data-testid="input"
      >
        {slotPrefix}
        <input
          className={classNames([
            "pl-4.5 rounded-large h-[50px] lg:h-[60px] dark:bg-transparent min-w-[80px] w-full text-base outline-none appearance-none text-black01 disabled:cursor-not-allowed disabled:bg-gray-200 read-only:bg-transparent dark:text-gray-300 dark:placeholder-gray-600",
            className,
          ])}
          type="text"
          data-testid="input-field"
          size={1}
          ref={ref}
          {...attributes}
        />
        <span className="pr-2">{slotSuffix}</span>
      </WrapperTag>
    );
  },
);

export default Input;
