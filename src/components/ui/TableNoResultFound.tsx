import React from "react";

const TableNoResultFound = ({ content }: { content: string }) => {
  return (
    <div className="flex items-center justify-center rounded-lg bg-white px-5 py-4 text-sm shadow-card dark:bg-light-dark lg:py-6">
      <div className="flex items-center gap-5">
        <span className="text-neutral-500 font-medium text-sm lg:text-base tracking-wider dark:text-neutral-200">
          {content}
        </span>
      </div>
    </div>
  );
};

export default TableNoResultFound;
