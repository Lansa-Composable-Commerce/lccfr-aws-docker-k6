"use client";

import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  TABLE_DEFAULT_PAGE_INDEX,
  TABLE_DEFAULT_PAGE_SIZE,
  TABLE_MAX_PAGE_SIZE,
} from "@/utils/constants";
import Button from "@/components/globalUI/Button";

interface MainTableProps {
  label?: string;
  noDataLabel?: string;
  tableData: any;
  columns: any;
  onClickRow?: (value: any) => void;
  withPagination?: boolean;
}

const MainTable = ({
  label,
  noDataLabel = "There's no available data.",
  tableData,
  columns,
  onClickRow,
  withPagination = true,
}: MainTableProps) => {
  const [pagination, setPagination] = useState<PaginationState | any>({
    pageIndex: TABLE_DEFAULT_PAGE_INDEX,
    pageSize: withPagination ? TABLE_DEFAULT_PAGE_SIZE : TABLE_MAX_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
    columns,
    data: tableData,
  });

  return (
    <div className="w-full border border-white02 rounded-4xl mb-4">
      <div className="pt-4 pb-6 px-7">
        <h4 className="font-medium dark:text-gray-400">{label}</h4>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="min-w-1/2 w-full border-collapse">
          <thead className="rounded-lg bg-white02 ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="py-2 uppercase text-black01 px-5 text-sm lg:text-base"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                          title={
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === "asc"
                                ? "Sort ascending"
                                : header.column.getNextSortingOrder() === "desc"
                                  ? "Sort descending"
                                  : "Clear sort"
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="text-lg hover:bg-lightGreen cursor-pointer text-gray03 dark:text-gray-400 hover:dark:text-gray-900"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="p-5 text-center"
                      onClick={() => onClickRow && onClickRow(row.original)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className={"py-8 text-center text-gray03 dark:text-gray-400"}
                  colSpan={7}
                >
                  {noDataLabel}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {withPagination && (
        <>
          <div className="h-2 border-t" />
          <div className="flex flex-wrap justify-center lg:items-center lg:justify-between gap-2 pt-3 pb-5 w-full px-8">
            <div className="flex items-center gap-2">
              <Button
                className="table-pagination-btn"
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {"<<"}
              </Button>
              <Button
                className="table-pagination-btn"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {"<"}
              </Button>
              <Button
                className="table-pagination-btn"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {">"}
              </Button>
              <Button
                className="table-pagination-btn"
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
              >
                {">>"}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <div>Page</div>
                <strong>
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount().toLocaleString()}
                </strong>
              </span>
              <span className="flex items-center gap-1">
                | Go to page:
                <input
                  type="number"
                  min="1"
                  max={table.getPageCount()}
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    table.setPageIndex(page);
                  }}
                  className="border p-1 rounded w-16"
                />
              </span>
            </div>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="text-black01 dark:text-gray-400"
            >
              {[10, 25, 50, "all"].map((pageSize) => (
                <option
                  key={pageSize}
                  value={pageSize}
                  className="text-black01"
                >
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default MainTable;
