import { useMemo, useState } from "react";

export type SortDirection = "asc" | "desc";

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

export default function useSortData<T>(
  items: T[] = [],
  defaultSortKey: keyof T,
  defaultDirection: SortDirection = "asc",
) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: defaultSortKey,
    direction: defaultDirection,
  });

  const sortedData = useMemo(() => {
    if (!sortConfig) return items;

    return [...items].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return (
        String(aValue).localeCompare(String(bValue), undefined, {
          numeric: true,
          sensitivity: "base",
        }) * (sortConfig.direction === "asc" ? 1 : -1)
      );
    });
  }, [items, sortConfig]);

  const handleSort = (key: keyof T) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  return { sortedData, sortConfig, handleSort };
}
