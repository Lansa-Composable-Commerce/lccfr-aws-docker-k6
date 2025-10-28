import React, {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import {
  InitialFocusType,
  SfInput,
  SfListItem,
  useDisclosure,
  useDropdown,
  useTrapFocus,
} from "@storefront-ui/react";
import { offset } from "@floating-ui/react-dom";

import {
  getQuickShopProduct,
  setNewItemCode,
  setUniqueId,
} from "@/lib/features/quickShop/quickShopSlice";
import { useAppDispatch } from "@/lib/hooks";

import { SvgArrowPath } from "@/assets/svg";

import { ProductSuggestionResponse, SelectOption } from "@/types";
import { showToast } from "@/components/globalUI/CustomToast";

const QuickShopComboboxInput = ({
  label,
  options,
  setSearchValue,
  searchValue,
  isSuggestionLoading,
  placeholder,
  itemCode,
  id,
  size,
  newQuantity,
}: {
  options: ProductSuggestionResponse[];
  setSearchValue: string | any;
  searchValue: string;
  isSuggestionLoading: boolean;
  itemCode: string;
  id: string | number;
  label?: string;
  placeholder?: string;
  size: any;
  newQuantity: number;
}) => {
  const dispatch = useAppDispatch();

  const [isDisabled] = useState(false);
  const [isValid, setIsValid] = useState<boolean | undefined>();
  const [selectedValueCombobox, setSelectedValueCombobox] =
    useState<string>("");
  const [snippets, setSnippets] = useState<{ label: string; value: string }[]>(
    [],
  );

  const comboboxInputRef = useRef<HTMLInputElement>(null);
  const comboboxDropdownRef = useRef<HTMLUListElement>(null);

  const {
    isOpen: isOpenCombobox,
    close: closeCombobox,
    open: openCombobox,
    toggle: toggleCombobox,
  } = useDisclosure();
  const { refs: comboboxRefs, style: comboboxStyle } = useDropdown({
    isOpen: isOpenCombobox,
    onClose: closeCombobox,
    placement: "bottom-start",
    middleware: [offset(4)],
  });
  const comboboxId = useId();
  const comboboxListId = useId();

  const {
    current: currentFocus,
    focusables: focusableElements,
    updateFocusableElements,
  } = useTrapFocus(comboboxDropdownRef, {
    trapTabs: false,
    arrowKeysUpDown: true,
    activeState: isOpenCombobox,
    initialFocus: false,
  });

  const handleFocusInput = () => {
    comboboxInputRef.current?.focus();
  };

  const handleReset = () => {
    setSearchValue("");
    setSnippets([]);
    closeCombobox();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const phrase = event.target.value;
    setSelectedValueCombobox("");
    if (phrase) {
      setSearchValue(phrase);
    } else {
      handleReset();
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") handleReset();
    if (event.key === "Enter") closeCombobox();
    if (event.key === "ArrowUp") {
      openCombobox();
      updateFocusableElements();
      if (isOpenCombobox && focusableElements.length > 0) {
        focusableElements[focusableElements.length - 1].focus();
      }
    }
    if (event.key === "ArrowDown") {
      openCombobox();
      updateFocusableElements();
      if (isOpenCombobox && focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  };

  const selectOptionCombobox = async (
    event: FormEvent,
    option: SelectOption,
  ) => {
    setSearchValue(option.label);
    setSelectedValueCombobox(option.label);
    closeCombobox();
    handleFocusInput();

    const params = {
      itemCode: option.value,
      quantity: newQuantity,
    };
    // redux
    dispatch(setUniqueId(id));
    dispatch(setNewItemCode(itemCode));
    const res = await dispatch(getQuickShopProduct(params));
    if (res.meta.requestStatus === "fulfilled") {
      showToast("success", "Product Code updated successfully");
      return;
    }
  };

  const handleOptionItemKeyDownCombobox = (
    event: KeyboardEvent<HTMLButtonElement>,
    option: SelectOption,
  ) => {
    if (event.key === "Escape") {
      handleFocusInput();
    } else if (event.key === " " || event.key === "Enter")
      selectOptionCombobox(event, option);
  };

  const mockAutocompleteRequest = (phrase: string) => {
    return options.filter((option: any) =>
      option.value.toLowerCase().startsWith(phrase.toLowerCase()),
    );
  };

  useEffect(() => {
    if (searchValue && !selectedValueCombobox) {
      const getSnippets = async () => {
        openCombobox();
        try {
          const data = mockAutocompleteRequest(searchValue);
          // @ts-ignore
          setSnippets(data);
        } catch (error) {
          closeCombobox();
          console.error(error);
        }
      };
      getSnippets();
    }
  }, [searchValue]);

  const { close, isOpen } = useDisclosure();

  const { refs } = useDropdown({
    isOpen,
    onClose: close,
  });

  useTrapFocus(refs.floating, {
    arrowKeysUpDown: true,
    activeState: isOpen,
    initialFocus: InitialFocusType.autofocus,
  });

  return (
    <div
      ref={comboboxRefs.setReference}
      className="relative flex flex-col gap-1 w-full"
    >
      {label && (
        <p className="capitalize form-label">
          {label} <span className="text-sm text-red-500">*</span>
        </p>
      )}
      <SfInput
        ref={comboboxInputRef}
        id={comboboxId}
        role="combobox"
        value={searchValue}
        onChange={handleChange}
        onFocus={() => setIsValid(undefined)}
        aria-label={placeholder}
        placeholder={placeholder}
        aria-controls={comboboxListId}
        aria-autocomplete="list"
        aria-disabled={isDisabled}
        aria-expanded={isOpenCombobox}
        aria-activedescendant={currentFocus?.id}
        invalid={isValid === false && !isOpenCombobox}
        disabled={isDisabled}
        // onClick={toggleCombobox}
        onKeyDown={handleInputKeyDown}
        className={classNames(
          "cursor-pointer placeholder:text-neutral-500 text-xs sm:text-sm md:text-base",
          {
            "!text-disabled-500": isDisabled,
          },
        )}
        wrapperClassName={classNames({
          "!bg-disabled-100 !ring-disabled-300 !ring-1": isDisabled,
        })}
        size={size}
        /*slotSuffix={
                                <SfIconExpandMore
                                  onClick={() => !isDisabled && toggleCombobox()}
                                  className={classNames(
                                    "ml-auto text-neutral-500 transition-transform ease-in-out duration-300",
                                    {
                                      "rotate-180": isOpenCombobox,
                                      "!text-disabled-500 cursor-not-allowed": isDisabled,
                                    },
                                  )}
                                />
                              }*/
      />

      <div
        ref={comboboxRefs.setFloating}
        style={comboboxStyle}
        className="w-full absolute left-0 right-0 z-10"
      >
        {isOpenCombobox && (
          <ul
            id={comboboxListId}
            role="listbox"
            ref={comboboxDropdownRef}
            aria-label="Product Code"
            className="w-full py-2 bg-white border border-solid rounded-md border-neutral-100 drop-shadow-md"
          >
            {(snippets.length > 0 &&
              snippets.map((option) => (
                <li key={option.value}>
                  <SfListItem
                    id={`${comboboxListId}-${option.value}`}
                    as="button"
                    type="button"
                    onClick={(event) => selectOptionCombobox(event, option)}
                    onKeyDown={(event) =>
                      handleOptionItemKeyDownCombobox(event, option)
                    }
                    className="flex justify-start"
                    aria-selected={option.value === selectedValueCombobox}
                  >
                    <p className="text-left">
                      <span>{option.label}</span>
                    </p>
                  </SfListItem>
                </li>
              ))) ||
              (isSuggestionLoading && (
                <div
                  className="w-full inline-flex items-center justify-center px-4 py-2"
                  aria-label="No options"
                >
                  <SvgArrowPath className="animate-spin size-6" />
                </div>
              )) ||
              (options.length <= 0 && (
                <p
                  className="inline-flex px-4 py-2 w-full text-left"
                  aria-label="No options"
                >
                  <span>No options</span>
                </p>
              )) ||
              options.map((option: any) => (
                <li key={option.value}>
                  <SfListItem
                    id={`${comboboxListId}-${option.value}`}
                    as="button"
                    type="button"
                    onClick={(event) => selectOptionCombobox(event, option)}
                    onKeyDown={(event) =>
                      handleOptionItemKeyDownCombobox(event, option)
                    }
                    className="w-full flex justify-start hover:bg-lightGreen"
                    aria-selected={option.value === selectedValueCombobox}
                  >
                    <p className="text-left text-xs">
                      <span>{option.label}</span>
                    </p>
                  </SfListItem>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default QuickShopComboboxInput;
