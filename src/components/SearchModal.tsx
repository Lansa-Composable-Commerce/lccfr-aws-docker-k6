"use client";

import React, { useState } from "react";

import Modal from "@/components/globalUI/Modal";
import Input from "@/components/globalUI/Input";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  openSearchModal,
  selectOpenSearchModal,
} from "@/lib/features/global/globalSlice";
import { SvgMagnifyingGlass } from "@/assets/svg";

import { STOREFRONT_ROUTES } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { SfChip } from "@storefront-ui/react";
import Chip from "@/components/globalUI/Chip";

const SearchModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isSearchModalVisible = useAppSelector(selectOpenSearchModal);

  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event: any) => {
    setSearchTerm(event.target.value.toUpperCase());
  };

  const handleEnterPress = (event: any) => {
    if (event.key === "Enter" && searchTerm.trim() !== "") {
      router.push(`${STOREFRONT_ROUTES.SEARCH_RESULT}?search=${searchTerm}`);
      dispatch(openSearchModal());
    }
  };

  return (
    <div className="z-20">
      <div>
        <Modal
          isOpen={isSearchModalVisible}
          close={() => dispatch(openSearchModal())}
          className="px-10 dark:bg-black01"
        >
          <div>
            <Input
              className="py-2 lg:text-lg"
              placeholder="Search..."
              slotSuffix={<SvgMagnifyingGlass />}
              value={searchTerm.toLowerCase()}
              enterKeyHint="enter"
              onChange={handleInputChange}
              onKeyDown={handleEnterPress}
            />
          </div>
          <div className="flex gap-2 w-full mt-5">
            <Chip className="px-4 shadow-card">Golf</Chip>
            <SfChip className="px-4">Bags</SfChip>
            <SfChip className="px-4">Gloves</SfChip>
          </div>

          <div className="mt-8">
            <h4 className="text-xl font-medium">Recently Viewed Products</h4>
            {/*<ProductList
              productList={productByCategory}
              showCount={showCount}
            />*/}
            {/*<RecentlyViewList />*/}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SearchModal;
