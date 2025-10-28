"use client";
import { KeyboardEvent, useState } from "react";
import classNames from "classnames";
import {
  SfSelectSize,
  composeHandlers,
  useFocusVisible,
} from "@storefront-ui/react";

import { SfSelectProps } from "@/types";
import { SvgChevronDown } from "@/assets/svg";

export default function Select(props: SfSelectProps) {
  const {
    size = SfSelectSize.base,
    children,
    invalid,
    wrapperClassName,
    slotChevron,
    required,
    disabled,
    className,
    placeholder,
    onBlur,
    onChange,
    onClick,
    onKeyDown,
    ...attributes
  } = props;
  const { isFocusVisible } = useFocusVisible();
  const [chevronRotated, setChevronRotated] = useState(false);

  const rotateUp = () => setChevronRotated(true);
  const rotateDown = () => setChevronRotated(false);
  const keydownHandler = (event: KeyboardEvent<HTMLSelectElement>) => {
    if (event.code === "Space") rotateUp();
  };

  return (
    <span
      className={classNames(
        "relative flex flex-col rounded-md w-full",
        {
          "focus-within:outline focus-within:outline-offset": isFocusVisible,
        },
        wrapperClassName,
      )}
      data-testid="select"
    >
      <select
        required={required}
        disabled={disabled}
        className={classNames(
          "w-full px-2 text-sm appearance-none disabled:cursor-not-allowed cursor-pointer text-gray03 focus:ring-primary-700 focus:ring-2 outline-none bg-transparent rounded-md ring-1 ring-inset ring-neutral-300 dark:text-gray-200 hover:ring-primary-700 active:ring-2 active:ring-primary-700 disabled:bg-disabled-100 disabled:text-disabled-900 disabled:ring-disabled-200 lg:text-base bg-primary-700",
          {
            "py-1.5": size === SfSelectSize.sm,
            "py-2": size === SfSelectSize.base,
            "py-3 text-base": size === SfSelectSize.lg,
            "!ring-negative-700 ring-2": invalid && !disabled,
          },
          className,
        )}
        data-testid="select-input"
        onBlur={composeHandlers(rotateDown, onBlur)}
        onChange={composeHandlers(rotateDown, onChange)}
        onClick={composeHandlers(rotateUp, onClick)}
        onKeyDown={composeHandlers(keydownHandler, onKeyDown)}
        {...attributes}
      >
        {placeholder && (
          <option
            disabled
            hidden
            value=""
            className={classNames("bg-neutral-300 text-sm", {
              "text-base": size === SfSelectSize.lg,
            })}
            data-testid="select-placeholder"
          >
            {placeholder}
          </option>
        )}
        {children}
      </select>
      {slotChevron || (
        <SvgChevronDown
          className={classNames(
            "box-border absolute -translate-y-0.5 top-1/4 pointer-events-none right-3 transition easy-in-out duration-0.5 size-6 text-black01",
            disabled ? "text-disabled-500" : "text-gray01",
            { "rotate-180": chevronRotated },
          )}
        />
      )}
    </span>
  );
}
