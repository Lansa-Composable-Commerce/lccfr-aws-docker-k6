import React, { useState } from "react";

import { LongArrowLeft } from "@/assets/svg/long-arrow-left";
import { LongArrowRight } from "@/assets/svg/long-arrow-right";
import { useTranslations } from "next-intl";

interface Props {
  items: any[];
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const TablePagination = ({ items, itemsPerPage, onPageChange }: Props) => {
  const tGlobal = useTranslations("Global");

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (newPage: any) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      onPageChange(newPage);
    }
  };

  return (
    <div className="mt-3 flex items-center justify-center rounded-lg bg-white px-5 py-4 text-sm shadow-card dark:bg-light-dark lg:py-6">
      <div className="flex items-center gap-5">
        <button
          className={`text-gray-700 disabled:text-gray-400 dark:text-white ${
            currentPage === 1 ? "disabled" : ""
          } disabled:dark:text-gray-400 disabled:cursor-not-allowed`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title={tGlobal("PrevPage")}
        >
          <LongArrowLeft className="h-auto size-6 rtl:rotate-180" />
        </button>
        <div>
          {tGlobal("Page")}{" "}
          <strong className="font-semibold">
            {currentPage} of {totalPages}
          </strong>{" "}
        </div>
        <button
          className={`text-gray-700 disabled:text-gray-400 dark:text-white ${
            currentPage === totalPages ? "disabled" : ""
          } disabled:dark:text-gray-400 disabled:cursor-not-allowed`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title={tGlobal("NextPage")}
        >
          <LongArrowRight className="h-auto size-6 rtl:rotate-180 " />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
