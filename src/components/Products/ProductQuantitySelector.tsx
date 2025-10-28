import React, { ChangeEvent, useEffect, useId, useState, useRef } from "react";
import { clamp } from "@storefront-ui/shared";

import { SvgMinus, SvgPlus } from "@/assets/svg";

import { QuantitySelectorPropType } from "@/types";
import classNames from "classnames";

const ProductCardQuantitySelector = ({
  min = 1,
  max = 99999,
  value,
  onValueChange,
  productInStock,
  isLoading,
}: QuantitySelectorPropType) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>(min.toString());

  useEffect(() => {
    setInputValue(clamp(value, min, max).toString()); // Convert to string
  }, [value, min, max]);

  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    const { value: currentValue } = event.target;

    if (currentValue.trim() === "") {
      setInputValue(min.toString());
      onValueChange(min);
      return;
    }

    const nextValue = parseInt(currentValue, 10);

    if (isNaN(nextValue)) {
      return;
    }

    const clampedValue = clamp(nextValue, min, max);
    setInputValue(clampedValue.toString());
    onValueChange(clampedValue);
  }

  function handleIncrement() {
    const nextValue = clamp(parseInt(inputValue, 10) + 1, min, max);
    setInputValue(nextValue.toString());
    onValueChange(nextValue);
  }

  function handleDecrement() {
    const nextValue = clamp(parseInt(inputValue, 10) - 1, min, max);
    setInputValue(nextValue.toString());
    onValueChange(nextValue);
  }

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
    <div className="w-full inline-flex flex-col items-center flex-none">
      <div className="w-full p-1 bg-white h-full flex items-center md:p-1.5 border border-neutral-300 rounded-full">
        <button
          className="flex items-center justify-center p-1 md:p-1 h-full !rounded-full bg-brand translate-05 hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={
            parseInt(inputValue, 10) <= min || productInStock || isLoading
          }
          aria-controls={inputId}
          aria-label="Decrease value"
          onClick={handleDecrement}
        >
          <SvgMinus className="size-5 text-white" />
        </button>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          className={classNames(
            "w-full h-full lg:h-[25px] appearance-none mx-0.5 text-xs sm:text-base text-center bg-transparent font-medium [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:display-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:display-none [&::-webkit-outer-spin-button]:m-0 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none disabled:placeholder-disabled-900 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm dark:text-neutral-700",
            productInStock && "cursor-not-allowed",
          )}
          min={min}
          max={max}
          value={inputValue}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          onFocus={handleOnFocus}
          aria-label="Quantity"
          disabled={productInStock || isLoading}
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <button
          className="flex items-center justify-center p-1 md:p-1 !rounded-full h-full bg-brand translate-05 hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={
            parseInt(inputValue, 10) >= max || productInStock || isLoading
          }
          aria-controls={inputId}
          aria-label="Increase value"
          onClick={handleIncrement}
        >
          <SvgPlus className="size-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ProductCardQuantitySelector;
