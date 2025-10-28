"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/routing";

import Input from "@/components/globalUI/Input";

import { STOREFRONT_ROUTES } from "@/utils/constants";
import { SvgMagnifyingGlass } from "@/assets/svg";

const SearchResultInput = () => {
  const tSearch = useTranslations("Search");

  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event: any) => {
    setSearchTerm(event.target.value.toUpperCase());
  };

  const handleEnterPress = (event: any) => {
    if (event.key === "Enter" && searchTerm.trim() !== "") {
      router.push(`${STOREFRONT_ROUTES.SEARCH_RESULT}?search=${searchTerm}`);
    }
  };

  return (
    <Input
      className="py-3 lg:text-lg"
      placeholder={`${tSearch("Search")}...`}
      slotSuffix={<SvgMagnifyingGlass />}
      value={searchTerm.toLowerCase()}
      enterKeyHint="enter"
      onChange={handleInputChange}
      onKeyDown={handleEnterPress}
      aria-label="Search"
    />
  );
};

export default SearchResultInput;
