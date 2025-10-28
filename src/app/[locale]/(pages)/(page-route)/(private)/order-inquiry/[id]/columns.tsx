"use client";

import { createColumnHelper } from "@tanstack/react-table";

import { OrderItem } from "@/types";

const columnHelper = createColumnHelper<OrderItem>();

export const ordersDetailsColumns = [
  columnHelper.accessor("LW3ITEMCD", {
    header: () => <span className="w-12">item code</span>,
    cell: (info) => <span className="text-center w-12">{info.getValue()}</span>,
  }),
  columnHelper.accessor("LW3IDESC", {
    header: () => <span className="w-12">description</span>,
    cell: (info) => <span className="text-center w-12">{info.getValue()}</span>,
  }),
  columnHelper.accessor("D_LPRICE", {
    header: () => <p className="text-right">unit price</p>,
    cell: (info) => <p className="text-right">{info.getValue()}</p>,
  }),
  columnHelper.accessor("LW3UM", {
    header: () => <p className="">unit</p>,
    cell: (info) => <p className="text-black01">{info.getValue()}</p>,
  }),
  columnHelper.accessor("LW3QTYRQS", {
    header: () => <p className="text-right">quantity</p>,
    cell: (info) => {
      return <p className="text-right">{info.getValue()}</p>;
    },
  }),
  columnHelper.accessor("shippingDate", {
    header: () => <span>ship date</span>,
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  columnHelper.accessor("D_PRCEXT", {
    header: () => <p className="text-right">total</p>,
    cell: (info) => {
      return <p className="text-right">{info.getValue()}</p>;
    },
  }),
];
