"use client";

import React, { useEffect, useState } from "react";

import ProductListWrapper from "@/components/ProductListWrapper";

import { useAppSelector } from "@/lib/hooks";
import {
  selectIsFavoritesMessages,
  selectIsStatus,
} from "@/lib/features/products/productsSlice";
import { useDisplayToastMessage } from "@/lib/hooks/useDisplayToastMessage";

import { getMyProducts } from "@/api/myProducts/getMyProducts";

import { MyProduct } from "@/types";

interface MyProductListProps {
  products: MyProduct[];
}

const MyProductListTable: React.FC<MyProductListProps> = ({ products }) => {
  const selectIsFavoritesMessageCode = useAppSelector(
    selectIsFavoritesMessages,
  );
  const selectIsToastType = useAppSelector(selectIsStatus);

  useDisplayToastMessage({
    status: selectIsToastType,
    messages: selectIsFavoritesMessageCode,
  });

  const [newMyProducts, setNewMyProducts] = useState<MyProduct[]>(
    products.map((product) => ({
      ...product,
      buyerType: "B2B",
      LW3COLQTY: product.LW3COLQTY || 0,
    })),
  );

  useEffect(() => {
    (async () => {
      if (selectIsFavoritesMessageCode.length > 0) {
        getMyProducts().then((res) => {
          setNewMyProducts(
            res.data.map((product: any) => ({
              ...product,
              buyerType: "B2B",
              LW3COLQTY: 0,
            })),
          );
          // dispatch(onGetMyProducts(res?.data));
        });
      }
    })();
  }, [selectIsFavoritesMessageCode]);

  return (
    <div className="w-full mb-4">
      <ProductListWrapper products={newMyProducts} />
    </div>
  );
};

export default MyProductListTable;
