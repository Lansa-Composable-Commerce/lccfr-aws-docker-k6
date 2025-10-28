"use client";

import React, { useEffect, useState } from "react";
import { SfButton, SfCheckbox } from "@storefront-ui/react";
import { useTranslations } from "next-intl";
import classNames from "classnames";
import { useMediaQuery } from "react-responsive";

import Modal from "@/components/globalUI/Modal";
import Input from "@/components/globalUI/Input";
import Button from "@/components/globalUI/Button";

import { useDebounce } from "@/lib/hooks/useDebounce";
import {
  addProductToFavorite,
  removeSuccessMessage,
  selectIsLoading,
} from "@/lib/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  onOpenAddItemModal,
  selectIsOpen,
} from "@/lib/features/myProducts/myProductsSlice";

import { getMyProductSearch } from "@/api/myProducts/getMyProductSearch";

import { SvgMagnifyingGlass, SvgSpinner, SvgXMark } from "@/assets/svg";

interface Item {
  LW3ITEMCD: string;
  LW3IATVL: string;
}

const ItemCard: React.FC<
  Item & { isSelected: boolean; onClick: () => void }
> = ({ LW3ITEMCD, LW3IATVL, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        "flex items-center justify-between py-2.5 px-2 bg-white text-sm font-medium shadow-card rounded-lg cursor-pointer hover:shadow-large truncate",
        { selected: isSelected },
      )}
    >
      <div className="flex items-center p-1">
        <SfCheckbox checked={isSelected} onChange={() => {}} />

        <div className="ml-3">
          <h4 className="text-gray-700">{LW3IATVL}</h4>
          <span className="block pt-0.5 text-xs font-normal capitalize text-brand dark:text-gray-400">
            {LW3ITEMCD}
          </span>
        </div>
      </div>
    </div>
  );
};

const MyProductsAddItemModal = () => {
  const tMyProducts: any = useTranslations("MyProducts");

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const dispatch = useAppDispatch();

  const selectIsModalVisible = useAppSelector(selectIsOpen);
  const selectIsAddingToFavLoading = useAppSelector(selectIsLoading);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchItems, setSearchItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const countSearchResult = (searchItems && searchItems.length) || 0;
  const countSelectedItem = selectedItems.length;

  const handleClose = () => {
    dispatch(onOpenAddItemModal());
    dispatch(removeSuccessMessage());

    setSearchTerm("");
    setSearchItems([]);
    setSelectedItems([]);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toUpperCase());
    setSelectedItems([]);
  };

  const handleEnterPress = async (event: any) => {
    if (event.key === "Enter" && searchTerm.trim() !== "") {
      setIsLoading(true);
      getMyProductSearch(searchTerm)
        .then((res) => {
          if (res?.success) {
            setSearchItems(res?.data);
          } else {
            setSearchItems([]);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
      setSearchItems([]);
    }
  };

  const handleItemClick = (item: Item) => {
    if (selectedItems.includes(item.LW3ITEMCD)) {
      setSelectedItems(
        selectedItems.filter((itemCode) => itemCode !== item.LW3ITEMCD),
      );
    } else {
      setSelectedItems([...selectedItems, item.LW3ITEMCD]);
    }
  };

  const handleAddToFavorites = async () => {
    dispatch(addProductToFavorite(selectedItems)).then(() => handleClose());
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoading(true);

      getMyProductSearch(debouncedSearchTerm)
        .then((res) => {
          if (res?.success) {
            setSearchItems(res?.data);
          } else {
            setSearchItems([]);
          }
        })
        .finally(() => setIsLoading(false)); // Ensure loading is set to false always
    } else {
      setSearchItems([]); // Clear results if search term is empty
    }
  }, [debouncedSearchTerm]);

  return (
    <Modal
      isOpen={selectIsModalVisible}
      close={handleClose}
      className="mx-2 md:mx-auto px-4 p-5 z-50 max-w-2xl dark:bg-black01"
    >
      <header>
        <SfButton
          square
          variant="tertiary"
          className="absolute right-2 top-2"
          onClick={handleClose}
          aria-label="Close"
        >
          <SvgXMark />
        </SfButton>
        <h3
          id="productModalTitle"
          className="font-semibold typography-headline-5 md:typography-headline-3"
        >
          {tMyProducts("SearchProducts")}
        </h3>
      </header>
      <div className="pt-3">
        <div className="w-full relative flex items-center gap-3">
          <div className="w-full grow">
            <Input
              className="bg-white py-3 lg:text-lg "
              slotSuffix={
                <SvgMagnifyingGlass className="size-6 dark:text-gray-400" />
              }
              placeholder={`${tMyProducts("Search")}` + `...`}
              aria-label="Search"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleEnterPress}
              size="lg"
            />
          </div>

          <div className="w-1/2">
            <Button
              className="w-full sm:h-[50px] lg:h-[60px]  uppercase px-3"
              size={isMobile ? "sm" : "lg"}
              onClick={handleAddToFavorites}
              disabled={selectedItems.length === 0}
            >
              {selectIsAddingToFavLoading ? (
                <p className="text-sm lg:text-lg dark:text-neutral-200">
                  {`${tMyProducts("Adding")}` + `...`}
                </p>
              ) : (
                <p className="text-sm lg:text-lg dark:text-neutral-200">
                  {tMyProducts("AddToFav")}
                </p>
              )}
            </Button>
          </div>
        </div>
        <div className="w-full mt-2 flex items-center justify-start text-xs md:text-sm">
          {countSelectedItem > 0 && (
            <p>
              {tMyProducts("YouSelect")} <b>{countSelectedItem}</b>{" "}
              {tMyProducts("Items")}
            </p>
          )}
          {!isLoading && countSearchResult > 0 && (
            <p className="ml-auto">
              {countSearchResult} {tMyProducts("ResultFound")}
            </p>
          )}
        </div>
        {isLoading && (
          <div className="mt-3 w-full flex items-center justify-center">
            <SvgSpinner />
          </div>
        )}

        {searchItems.length > 0 ? (
          <div className="overflow-y-auto mt-3">
            <div className="max-h-[340px]">
              <div className="flex flex-col gap-y-2 pb-3">
                {searchItems.map((item) => {
                  return (
                    <ItemCard
                      key={item.LW3ITEMCD}
                      {...item}
                      isSelected={selectedItems.includes(item.LW3ITEMCD)}
                      onClick={() => handleItemClick(item)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          !isLoading &&
          searchTerm && ( //Only show 'No Results' when not loading and searchTerm exists.
            <p className="text-center mt-4 text-gray-500 dark:text-gray-200">
              {tMyProducts("NoResultsFound")}
            </p>
          )
        )}
      </div>
    </Modal>
  );
};

export default MyProductsAddItemModal;
