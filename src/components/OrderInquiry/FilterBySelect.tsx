"use client";

import React, {
  useId,
  useRef,
  type KeyboardEvent,
  useCallback,
  useEffect,
} from "react";
import classNames from "classnames";
import {
  SfListItem,
  useDisclosure,
  useDropdown,
  useTrapFocus,
  InitialFocusType,
} from "@storefront-ui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { SvgCheck, SvgChevronDown } from "@/assets/svg";

type SelectOption = {
  label: string;
  value: string;
};

interface SelectProps {
  selectName: string;
  options: SelectOption[];
  selectedOption?: any;
  setSelectedOption?: any;
  useUrl?: boolean;
  invalid?: boolean;
  isRequired?: boolean;
  placeholder?: string;
  selectValue?: string | null;
  disabled?: any;
}

export default function FilterBySelect({
  selectName,
  options,
  selectedOption,
  setSelectedOption,
  useUrl = true,
  invalid,
  isRequired,
  placeholder,
  selectValue,
  disabled,
}: SelectProps) {
  const tGlobal = useTranslations("Global");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { close, toggle, isOpen } = useDisclosure({ initialValue: false });

  const listboxId = useId();
  const selectTriggerRef = useRef<HTMLDivElement>(null);

  const { refs, style: dropdownStyle } = useDropdown({
    isOpen,
    onClose: close,
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams();
      params.set(name, value);

      return params.toString();
    },

    [],
  );

  useTrapFocus(refs.floating, {
    arrowKeysUpDown: true,
    activeState: isOpen,
    initialFocus: InitialFocusType.autofocus,
    initialFocusContainerFallback: true,
  });

  const selectOption = (option: SelectOption) => {
    if (useUrl) {
      router.push(pathname + "?" + createQueryString("days", option?.value));
    }

    setSelectedOption(option);
    close();
    selectTriggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === " ") toggle();
  };

  const handleOptionItemKeyDown = (
    event: KeyboardEvent<HTMLLIElement>,
    option: SelectOption,
  ) => {
    if (event.key === " " || event.key === "Enter") selectOption(option);
  };

  const handleToggle = () => {
    if (disabled) {
      close();
      return;
    }
    toggle();
  };

  useEffect(() => {
    if (selectValue) {
      const option = options.find((opt: any) => opt.value === selectValue);
      if (option) {
        setSelectedOption(option);
      }
    }
  }, [selectValue, options, disabled]);

  return (
    <>
      <p className="form-label mb-0.5">
        {selectName}
        {isRequired && <span className="asterisk-required"> *</span>}
      </p>
      <div ref={refs.setReference} className="relative">
        <div
          ref={selectTriggerRef}
          role="combobox"
          aria-required="true"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-label="Select one option"
          aria-activedescendant={
            selectedOption ? `${listboxId}-${selectedOption.value}` : undefined
          }
          className={classNames([
            "w-full h-[50px] lg:h-[60px] rounded-lg lg:rounded-large flex items-center gap-8 relative font-normal text-black01 text-sm py-3 lg:py-3.5 ring-inset px-2 lg:px-3 dark:text-gray-300 hover:ring-primary-700 active:ring-primary-700 active:ring-2 focus:ring-primary-700 focus:ring-2 focus-visible:outline focus-visible:outline-offset",
            {
              "ring-2 ring-negative-700 bg-gray-400 hover:ring-gray-400 text-black01/50 !cursor-not-allowed":
                invalid || disabled,
              "ring-2 ring-neutral-300  cursor-pointer": !invalid || !disabled,
            },
          ])}
          tabIndex={0}
          onKeyDown={handleTriggerKeyDown}
          onClick={handleToggle}
        >
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className="text-base w-full text-gray-400 ml-2 dark:text-gray-400">
              {placeholder || tGlobal("Select")}
            </span>
          )}
          <SvgChevronDown
            className={classNames(
              "size-7 ml-auto text-neutral-500 transition-transform ease-in-out duration-300",
              {
                "rotate-180": isOpen,
              },
            )}
          />
        </div>
        <ul
          id={listboxId}
          ref={refs.setFloating}
          role="listbox"
          aria-label="Select one option"
          className={classNames(
            "max-h-[18.75em] overflow-y-auto w-full py-2 rounded-md shadow-md border border-neutral-100 bg-white z-10 dark:bg-light-dark",
            {
              hidden: !isOpen,
            },
          )}
          style={dropdownStyle}
        >
          {options?.map((option: any) => (
            <SfListItem
              id={`${listboxId}-${option.value}`}
              key={option.value}
              role="option"
              tabIndex={0}
              aria-selected={option.value === selectedOption?.value}
              className={classNames(
                "block hover:bg-lightGreen dark:hover:bg-gray-700 dark:text-gray-400",
                {
                  "font-medium dark:text-gray-300":
                    option.value === selectedOption?.value,
                },
              )}
              onClick={() => selectOption(option)}
              onKeyDown={(event) => handleOptionItemKeyDown(event, option)}
              slotSuffix={
                option.value === selectedOption?.value && (
                  <SvgCheck className="size-6 text-lightGreen dark:text-gray-300" />
                )
              }
            >
              {option.label}
            </SfListItem>
          ))}
        </ul>
      </div>
    </>
  );
}
