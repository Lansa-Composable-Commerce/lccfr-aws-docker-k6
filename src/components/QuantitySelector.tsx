"use client";

import {
  useId,
  ChangeEvent,
  MouseEvent,
  useEffect,
  useState,
  useRef,
} from "react";
import { clamp } from "@storefront-ui/shared";

import { SvgMinus, SvgPlus } from "@/assets/svg";

import { QuantitySelectorPropType } from "@/types";
import classNames from "classnames";

export default function QuantitySelector({
  min = 1,
  max = 10,
  value,
  onValueChange,
  variant = "default",
  productInStock,
}: QuantitySelectorPropType) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>(min.toString());

  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    const { value: currentValue } = event.target;
    if (currentValue.trim() === "") return;

    const nextValue = parseFloat(currentValue);

    if (isNaN(nextValue)) return;

    const clampedValue = clamp(nextValue, min, max);
    setInputValue(clampedValue.toString());
    onValueChange(clampedValue);
  }

  function handleIncrement(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    const nextValue = clamp(parseInt(inputValue, 10) + 1, min, max);
    setInputValue(nextValue.toString());
    onValueChange(nextValue);
  }

  function handleDecrement(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    const nextValue = clamp(parseInt(inputValue, 10) - 1, min, max);
    setInputValue(nextValue.toString());
    onValueChange(nextValue);
  }

  useEffect(() => {
    setInputValue(clamp(value, min, max).toString()); // Convert to string
  }, [value, min, max]);

  const handleOnBlur = () => {
    const parsedValue = parseInt(inputValue, 10);
    if (isNaN(parsedValue) || parsedValue < min) {
      setInputValue(min.toString());
      onValueChange(min);
    }
  };

  const handleOnFocus = () => {
    // Select the entire input content when focused
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length,
      );
    }
  }, [inputValue]);

  return (
    <div className="inline-flex flex-col items-center flex-none">
      <div className="bg-white h-full flex items-center p-1.5 gap-2 border border-neutral-300 rounded-full">
        <button
          className="flex items-center justify-center p-1.5 h-full w-full !rounded-full bg-brand translate-05 hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={value <= min || productInStock}
          aria-controls={inputId}
          aria-label="Decrease value"
          onClick={(e) => handleDecrement(e)}
        >
          <SvgMinus
            className={classNames("text-white", {
              "size-5 lg:size-6": variant === "default",
              "size-2": variant === "small",
            })}
          />
        </button>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          className={classNames(
            "h-full appearance-none text-center bg-transparent font-medium [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:display-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:display-none [&::-webkit-outer-spin-button]:m-0 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none disabled:placeholder-disabled-900 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm dark:text-gray03",
            {
              "w-10 lg:h-[40px] lg:w-16": variant === "default",
              "w-8 text-sm": variant === "small",
              "cursor-not-allowed": productInStock,
            },
          )}
          min={min}
          max={max}
          value={inputValue}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          onFocus={handleOnFocus}
          aria-label="value"
          disabled={productInStock}
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <button
          className="flex items-center justify-center p-1.5 !rounded-full h-full w-full bg-brand translate-05 hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={value >= max || productInStock}
          aria-controls={inputId}
          aria-label="Increase value"
          onClick={(e) => handleIncrement(e)}
        >
          <SvgPlus
            className={classNames("text-white", {
              "size-5 lg:size-6": variant === "default",
              "size-2": variant === "small",
            })}
          />
        </button>
      </div>
    </div>
  );
}
