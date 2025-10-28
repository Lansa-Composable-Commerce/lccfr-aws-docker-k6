"use client";

import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import { useDropdown } from "@storefront-ui/react";
import { useTranslations } from "next-intl";

import Input from "@/components/globalUI/Input";
import RecentlyViewProductSlider from "@/components/RecentlyViewProductSlider";
import Chip from "@/components/globalUI/Chip";

import { getProductsSuggestions } from "@/api/products/getProductSuggestions";

import { createSlug } from "@/lib/helpers/createSlug";
import { useDebounce } from "@/lib/hooks/useDebounce";

import { COOKIE_PREFIX, STOREFRONT_ROUTES } from "@/utils/constants";

import { useRouter } from "@/i18n/routing";

import {
  onGetCateg,
  onRemoveSubCateg,
} from "@/lib/features/breadcrumbs/breadcrumbsSlice";
import { removeFilterCategory } from "@/lib/features/products/productsSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { removeDashesAndSpaces } from "@/lib/helpers/stringUtils";

import { SvgMagnifyingGlass, SvgSpinner } from "@/assets/svg";

const SuggestionListCard = ({
  productName,
  itemCode,
  className,
  onClick,
}: {
  productName: string;
  itemCode: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      className={classNames(
        "flex items-center justify-between py-1 md:py-2 px-1.5 lg:px-3 mx-1.5 lg:mx-3 bg-white text-xs md:text-sm font-medium shadow-card rounded-lg dark:bg-light-dark cursor-pointer hover:shadow-large",
        className,
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="ml-2">
          <p className="dark:text-gray-200">{productName}</p>
          <span className="block pt-0.5 text-xs font-normal capitalize text-brand dark:text-gray-400">
            {itemCode}
          </span>
        </div>
      </div>
    </div>
  );
};

const SearchButton = () => {
  const dispatch = useAppDispatch();

  const tHome = useTranslations("Home");
  const router = useRouter();

  const [_, setlocalStorageCateg] = useLocalStorage(
    `${COOKIE_PREFIX}product_category`,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setProductSuggestions] = useState([]);
  const [suggestCategory, setSuggestCategory] = useState([]);

  const close = () => setOpen(false);
  const toggle = () => setOpen((isOpen) => !isOpen);

  const { refs } = useDropdown({ isOpen, onClose: close });
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleEnterPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchTerm.trim() !== "") {
      try {
        setIsLoading(true);
        router.push(`${STOREFRONT_ROUTES.SEARCH_RESULT}?search=${searchTerm}`);
      } finally {
        setIsLoading(false);

        if (debouncedSearchTerm) {
          close();
        }
      }
    }
  };

  const goToCategory = (value: string) => {
    dispatch(onGetCateg(`${removeDashesAndSpaces(value)}`));
    dispatch(onRemoveSubCateg());
    dispatch(removeFilterCategory());
    setlocalStorageCateg(`${removeDashesAndSpaces(value)}`);
    router.push(
      `${STOREFRONT_ROUTES.PRODUCTS}?category=${value}&url=${removeDashesAndSpaces(value)}`,
    );
    close();
    setSearchTerm("");
  };

  const goToProductDetails = (itemCode: string) => {
    close();
    router.push(`${STOREFRONT_ROUTES.PRODUCTS}/` + `${createSlug(itemCode)}`);
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus(); // Focus on the input when opened
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      setOpen(true);
      setIsLoading(true);
      getProductsSuggestions(searchTerm)
        .then((res) => {
          if (res?.success) {
            setProductSuggestions(res?.data?.product);
            setSuggestCategory(res?.data?.category);
            console.log("trigger");
          } else {
            setProductSuggestions([]);
            setSuggestCategory([]);
          }
        })
        .finally(() => setIsLoading(false));
      setProductSuggestions([]);
      setSuggestCategory([]);
    }
  }, [searchTerm]);

  return (
    <div ref={refs.setReference} className="w-full grow">
      <div onClick={toggle} className="relative">
        <Input
          id="search"
          className="w-full lg:text-lg"
          ref={inputRef}
          placeholder={`${tHome("Search")}...`}
          slotSuffix={
            <SvgMagnifyingGlass className="size-7 text-black01 dark:text-gray-400" />
          }
          value={searchTerm}
          enterKeyHint="enter"
          onChange={handleInputChange}
          onKeyDown={handleEnterPress}
          aria-label={tHome("Search")}
        />
      </div>
      {isOpen && (
        <div
          ref={refs.setFloating}
          className="absolute right-0 lg:right-14 p-2 mt-2 lg:p-4 bg-white mx-auto  w-full max-w-screen-md rounded-large border shadow-lg dark:bg-black01 z-20"
          style={{ maxHeight: "calc(100vh - 100px)" }}
        >
          <div className="overflow-y-auto" style={{ maxHeight: "80vh" }}>
            <div>
              <div className="w-full h-full flex flex-col lg:flex-row gap-y-2 lg:gap-y-0 gap-x-4">
                <div className="w-full">
                  <div className="w-full flex items-center justify-between">
                    <p className="text-xs md:text-sm font-medium tracking-wide">
                      {tHome("Suggestions")}
                    </p>
                    <p className="text-xs font-medium tracking-wide text-gray-800 dark:text-gray-200">
                      {suggestions && suggestions.length}{" "}
                      <span>{tHome("ResultsFound")}</span>
                    </p>
                  </div>

                  <div className="max-h-[155px] lg:max-h-[330px] overflow-y-auto mt-1.5 lg:mt-3">
                    <div className="flex flex-col gap-y-2 py-2">
                      {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <SvgSpinner />
                        </div>
                      ) : suggestions.length > 0 ? (
                        suggestions.map(({ LW3ITEMCD, LW3IDESC }, id) => {
                          return (
                            <SuggestionListCard
                              key={id}
                              itemCode={LW3ITEMCD}
                              productName={LW3IDESC}
                              onClick={() => goToProductDetails(LW3ITEMCD)}
                            />
                          );
                        })
                      ) : (
                        <div className="bg-gray-100 p-2 rounded-md dark:bg-light-dark">
                          <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-200">
                            {tHome("NoSuggestion")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block border-l border-dashed">
                  &nbsp;
                </div>

                <div className="w-full mt-2 md:mt-0 lg:max-w-[300px] min-w-[300px]">
                  <p className="text-xs md:text-sm font-medium w-full">
                    {tHome("Categories")}
                  </p>
                  <div className="w-full max-h-[75px] lg:max-h-[330px] overflow-y-auto mt-1.5 lg:mt-3">
                    <div className="flex flex-wrap gap-1.5 lg:gap-3 py-2">
                      {suggestCategory.length > 0 ? (
                        suggestCategory.map(
                          (item: { LW3CATID: number; LW3CATNAM: string }) => (
                            <Chip
                              key={item.LW3CATID}
                              inputProps={{
                                checked: true,
                                onChange: () => goToCategory(item?.LW3CATNAM),
                              }}
                              size="sm"
                            >
                              <p className="text-xs md:text-sm font-medium capitalize">
                                {item?.LW3CATNAM}
                              </p>
                            </Chip>
                          ),
                        )
                      ) : (
                        <div className="w-full bg-gray-100 p-2 rounded-md dark:bg-light-dark">
                          <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-200">
                            {tHome("NoCategories")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs md:text-sm font-medium">
                {tHome("RecentlyViewedProducts")}
              </p>
              <div className="mt-1.5 lg:mt-3 w-full">
                <RecentlyViewProductSlider close={close} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchButton;
