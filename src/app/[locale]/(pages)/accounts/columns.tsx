"use client";

import { createColumnHelper } from "@tanstack/react-table";

import { Accounts } from "@/types";

const columnHelper = createColumnHelper<Accounts>();

export const accountColumns = [
  columnHelper.accessor("LW3JDEC01", {
    header: () => <span>account</span>,
    cell: (info) => <span className="text-brand">{info.getValue()}</span>,
  }),
  columnHelper.accessor("LW3CUSNAM", {
    header: () => <span>account name</span>,
    cell: (info) => <>{info.getValue()}</>,
  }),
  columnHelper.accessor("LW3ADDRS1", {
    header: () => "address",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("LW3CTY1", {
    header: () => <span>city</span>,
  }),
  columnHelper.accessor("LW3ADDS", {
    header: () => <span>state</span>,
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  columnHelper.accessor("LW3ADDZ", {
    header: () => <span>zip</span>,
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  columnHelper.accessor("LW3SCNTRY", {
    header: () => <span>country</span>,
    cell: (info) => <span className="uppercase">{info.getValue()}</span>,
  }),
];
