"use client";

import { createColumnHelper } from "@tanstack/react-table";

import { Orders } from "@/types";

const columnHelper = createColumnHelper<Orders>();

export const ordersColumns = [
  columnHelper.accessor("LW3OION", {
    header: () => <span>order number</span>,
    cell: (info) => (
      <span className="text-brand font-semibold text-center">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("D_OIOT", {
    header: () => <p className="text-right">order total</p>,
    cell: (info) => <p className="text-right">{info.getValue()}</p>,
  }),
  columnHelper.accessor("LW3OIPO", {
    header: () => <p className="">purchase order</p>,
    cell: (info) => <p className="text-black01">{info.getValue()}</p>,
  }),
  columnHelper.accessor("orderDate", {
    header: () => <p className="text-right">order date</p>,
    cell: (info) => {
      return <p className="text-right">{info.getValue()}</p>;
    },
  }),
  columnHelper.accessor("shippingDate", {
    header: () => <p className="text-right">ship date</p>,
    cell: (info) => {
      return <p className="text-right">{info.getValue()}</p>;
    },
  }),
  columnHelper.accessor("LW3OITK", {
    header: () => <span>tracking</span>,
    cell: (info) => <span>{info.getValue() ? info.getValue() : `- -`}</span>,
  }),
];
