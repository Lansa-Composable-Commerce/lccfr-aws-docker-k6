"use client";

import React, { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";

// components
import MainTable from "@/components/globalUI/MainTable";
import SelectDropdownWithPlaceholder from "@/components/globalUI/SelectDropdown";
import Input from "@/components/globalUI/Input";
import Button from "@/components/globalUI/Button";

import { ordersColumns } from "@/app/[locale]/(pages)/(page-route)/(private)/order-inquiry/columns";
import { STOREFRONT_ROUTES } from "@/utils/constants";

import { FilterOrders, Orders, SelectOption } from "@/types";
import { usePathname, useRouter } from "@/i18n/routing";

const RenderFilter = ({
  selectOptions,
}: {
  selectOptions: { label: string; value: string }[];
}) => {
  const [selectedOption, setSelectedOption] = useState<SelectOption>();

  return (
    <div className="w-full">
      <SelectDropdownWithPlaceholder
        selectName="Filter By"
        options={selectOptions}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
    </div>
  );
};

const RenderSearchCriteria = ({
  selectOptions,
}: {
  selectOptions: { label: string; value: string }[];
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handleOrderNumberChange = (value: string) => {
    router.push(pathname + "?" + createQueryString("order", value));
  };

  const handlePurchaseOrderChange = (value: string) => {
    router.push(pathname + "?" + createQueryString("ponum", value));
  };

  return (
    <div className="w-full max-w-3xl">
      <div className=" flex items-center justify-center gap-5">
        <div className="w-36 flex-none flex-col gap-1">
          <span className="capitalize form-label">Order</span>
          <Input
            id="order"
            name="order"
            className="py-3 lg:py-3 lg:text-lg"
            placeholder={`0`}
            onChange={(e) => handleOrderNumberChange(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <span className="capitalize form-label">Purchase Order</span>
          <Input
            id="ponum"
            name="ponum"
            className="py-3 lg:py-3 lg:text-lg"
            placeholder={`0`}
            onChange={(e) => handlePurchaseOrderChange(e.target.value)}
          />
        </div>
        <RenderFilter selectOptions={selectOptions} />
        <div className=" flex-1 flex-col gap-1">
          <span className="capitalize form-label">&nbsp;</span>
          <Button
            variant="primary"
            type="submit"
            className="w-full lg:py-3 translate-05"
          >
            <h4 className="text-lg">Search</h4>
          </Button>
        </div>
      </div>
    </div>
  );
};

const OrderInquiryTable = ({
  orders,
  options,
}: {
  orders: Orders;
  options: FilterOrders[];
}) => {
  const router = useRouter();
  // select dropdown
  const selectOptions = options.map((item: { desc: string; value: string }) => {
    return {
      label: item.desc,
      value: item.value,
    };
  });

  const onClickRow = async (value: Orders) => {
    router.push(`${STOREFRONT_ROUTES.ORDER_INQUIRY}/${value.LW3OION}`);
    console.log("onClickRow", value);
  };

  return (
    <div className="mb-10">
      <h4 className="text-xl mb-4">Search Criteria</h4>
      <div className="flex items-center justify-between mb-7">
        <RenderSearchCriteria selectOptions={selectOptions} />
      </div>

      <MainTable
        label="List of Orders"
        noDataLabel="There's no order to display."
        tableData={orders}
        columns={ordersColumns}
        onClickRow={(e: any) => onClickRow(e)}
        withPagination={false}
      />
    </div>
  );
};

export default OrderInquiryTable;
