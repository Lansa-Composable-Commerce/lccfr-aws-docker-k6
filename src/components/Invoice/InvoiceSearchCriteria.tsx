"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import Input from "@/components/globalUI/Input";
import Button from "@/components/globalUI/Button";
import { SecondaryTitle } from "@/components/globalUI/Typography";

import { usePathname, useRouter } from "@/i18n/routing";

import { SelectOption } from "@/types";
import FilterBySelect from "@/components/OrderInquiry/FilterBySelect";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getInvoicesInit,
  selectIsInvoiceInitData,
} from "@/lib/features/invoices/invoicesSlice";

const RenderFilter = ({
  selectOptions,
  tGlobal,
  paramsId,
  paramsPONum,
}: {
  selectOptions: { label: string; value: string }[];
  tGlobal: any;
  paramsId: string;
  paramsPONum: string;
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
        disabled={paramsId.length > 0 || paramsPONum.length > 0}
      />
    </div>
  );
};

const InvoiceSearchCriteria = () => {
  const dispatch = useAppDispatch();
  const invoiceInit = useAppSelector(selectIsInvoiceInitData);

  const router = useRouter();
  const pathname = usePathname();

  const tGlobal: any = useTranslations("Global");
  const tInvoices: any = useTranslations("invoices");

  const selectOptions = invoiceInit.map(
    (item: { description: string; value: string }) => {
      return {
        label: item.description,
        value: item.value,
      };
    },
  );

  const searchParams = useSearchParams();

  const [paramsId, setParamsId] = useState<string>(
    () => searchParams.get("id") || "",
  );
  const [paramsPONum, setParamsPONum] = useState<string>(
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

  // Helper function to update the searchParams
  const updateSearchParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams); // Create a copy of the current searchParams
    if (value) {
      newParams.set(key, value); // Add or update the parameter
    } else {
      newParams.delete(key); // Remove the parameter if the value is empty or '0'
    }
    router.push(pathname + "?" + newParams.toString());
  };

  const handleInvoiceNumberChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");

    // updateSearchParams("id", numericValue);
    setParamsId(numericValue);
  };

  const handlePurchaseOrderChange = (value: string) => {
    // updateSearchParams("ponum", value);
    setParamsPONum(value);
  };

  const handleSearch = async () => {
    const newParams = new URLSearchParams(searchParams);

    const days = searchParams.get("days");
    if (days) {
      newParams.set("days", days);
    }

    if (paramsId) {
      newParams.set("id", paramsId);
    } else {
      newParams.delete("id");
    }

    if (paramsPONum) {
      newParams.set("ponum", paramsPONum);
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
    dispatch(getInvoicesInit());
  }, []);

  return (
    <div className="mb-2.5 w-full">
      <SecondaryTitle content={tInvoices("SearchCriteria")} />
      <div className="w-full flex items-center justify-between">
        <div className="mt-1 mb-4 w-full flex flex-col items-end lg:flex-row gap-3 max-w-3xl">
          <div className="w-full flex flex-col gap-1 ">
            <p className="capitalize form-label">{tInvoices("invoice")}</p>
            <Input
              id="invoice"
              type="text"
              name="invoice"
              className="w-full bg-white text-base h-[48px] lg:h-[50px]"
              placeholder="0"
              onKeyDown={handleEnterPress}
              onChange={(e) => handleInvoiceNumberChange(e.target.value)}
              value={paramsId}
              aria-label="Invoice Number"
              inputMode="numeric"
              pattern="\d*"
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <p className="capitalize form-label">
              {tInvoices("PurchaseOrder")}
            </p>
            <Input
              id="purchaseOrder"
              name="purchaseOrder"
              className="w-full text-base h-[48px] lg:h-[50px]"
              placeholder="0"
              onKeyDown={handleEnterPress}
              onChange={(e) => handlePurchaseOrderChange(e.target.value)}
              value={paramsPONum}
              aria-label="Purchase Order"
            />
          </div>
          <RenderFilter
            selectOptions={selectOptions}
            tGlobal={tGlobal}
            paramsId={paramsId}
            paramsPONum={paramsPONum}
          />
          <div className="w-full mt-2">
            <Button
              size="lg"
              className="sm:h-[50px] lg:h-[60px] w-full"
              onClick={handleSearch}
            >
              <p className="text-base uppercase tracking-wider">
                {tInvoices("Search")}
              </p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSearchCriteria;
