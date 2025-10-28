"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import Input from "@/components/globalUI/Input";
import Button from "@/components/globalUI/Button";
import FilterBySelect from "@/components/OrderInquiry/FilterBySelect";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getOrderInit,
  selectIsOrderInitData,
} from "@/lib/features/orderInquiry/orderInquirySlice";

import { usePathname, useRouter } from "@/i18n/routing";

import { SelectOption } from "@/types";

const RenderFilter = ({
  selectOptions,
  tGlobal,
  orderNumber,
  pONumber,
}: {
  selectOptions: { label: string; value: string }[];
  tGlobal: any;
  orderNumber: string;
  pONumber: string;
}) => {
  const defaultSelectedOption = {
    label: "0 - 30 days",
    value: "0",
  };

  const [selectedOption, setSelectedOption] = useState<SelectOption>(
    defaultSelectedOption,
  );
  const searchParams = useSearchParams();
  const daysFromUrl: string | null = searchParams?.get("days") || null;

  return (
    <div className="w-full">
      <FilterBySelect
        selectName={tGlobal("FilterBy")}
        options={selectOptions}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        selectValue={daysFromUrl}
        disabled={orderNumber.length > 0 || pONumber.length > 0}
      />
    </div>
  );
};

export const SearchCriteria = () => {
  const tOrderInquiry: any = useTranslations("OrderInq");
  const tGlobal: any = useTranslations("Global");

  const dispatch = useAppDispatch();
  const selectOrderInitData = useAppSelector(selectIsOrderInitData);

  const selectOptions = selectOrderInitData.map(
    (item: { description: string; value: string }) => {
      return {
        label: item.description,
        value: item.value,
      };
    },
  );
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState<string>(
    () => searchParams.get("order") || "",
  );
  const [pONumber, setPONumber] = useState<string>(
    () => searchParams.get("ponum") || "",
  );

  const createQueryString = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    const days = searchParams.get("days");
    if (days) {
      params.set("days", days);
    }

    params.forEach((value, key) => {
      if (!value) {
        params.delete(key);
      }
    });
    return params.toString();
  }, [searchParams]);

  const updateSearchParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    router.push(pathname + "?" + newParams.toString());
  };

  const handleOrderNumberChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setOrderNumber(numericValue);
  };

  const handlePurchaseOrderChange = (value: string) => {
    setPONumber(value);
  };

  const handleSearch = async () => {
    const newParams = new URLSearchParams(searchParams);

    const days = searchParams.get("days");
    if (days) {
      newParams.set("days", days);
    }

    if (orderNumber) {
      newParams.set("order", orderNumber);
    } else {
      newParams.delete("order");
    }

    if (pONumber) {
      newParams.set("ponum", pONumber);
    } else {
      newParams.delete("ponum");
    }

    router.push(pathname + "?" + newParams.toString());
  };

  const handleEnterPress = async (event: any) => {
    if (event.key === "Enter") {
      await handleSearch();
    }
  };

  useEffect(() => {
    dispatch(getOrderInit());
  }, [dispatch]);

  return (
    <div className="w-full h-full grid grid-rows-2  md:grid-rows-2 md:grid-cols-2 lg:grid-rows-2 xl:grid-rows-1 lg:grid-cols-2 xl:grid-cols-4 grid-flow-col gap-1.5 sm:gap-3 lg:gap-5">
      <div className="w-full place-self-end">
        <div className=" flex flex-col gap-1">
          <p className="capitalize form-label">{tOrderInquiry("Order")}</p>
          <Input
            id="order"
            type="text"
            name="order"
            className="w-full text-base h-[48px] lg:h-[50px]"
            placeholder="0"
            onChange={(e) => handleOrderNumberChange(e.target.value)}
            value={orderNumber}
            aria-label="Order number"
            inputMode="numeric"
            pattern="\d*"
            onKeyDown={handleEnterPress}
          />
        </div>
      </div>

      <div className="w-full place-self-end">
        <div className="w-full flex flex-col gap-1">
          <div>
            <p className="capitalize form-label">
              {tOrderInquiry("PurchaseOrder")}
            </p>
          </div>

          <Input
            id="ponum"
            name="ponum"
            className="w-full text-base h-[48px] lg:h-[50px]"
            placeholder="0"
            onChange={(e) => handlePurchaseOrderChange(e.target.value)}
            value={pONumber}
            aria-label="Purchase order"
            onKeyDown={handleEnterPress}
          />
        </div>
      </div>
      <div className="w-full place-self-end">
        <RenderFilter
          selectOptions={selectOptions}
          tGlobal={tGlobal}
          orderNumber={orderNumber}
          pONumber={pONumber}
        />
      </div>
      <div className="w-full place-self-end">
        <p className="capitalize form-label">&nbsp;</p>
        <Button
          size="lg"
          className="sm:h-[50px] lg:h-[60px] w-full lg:py-3 translate-05"
          onClick={handleSearch}
        >
          <p className="text-base uppercase tracking-wider">
            {tGlobal("Search")}
          </p>
        </Button>
      </div>
    </div>
  );
};
