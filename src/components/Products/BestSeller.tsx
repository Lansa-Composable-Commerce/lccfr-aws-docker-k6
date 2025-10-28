"use client";

import ProductSlider from "@/components/Products/ProductSlider";

import { useAppSelector } from "@/lib/hooks";
import { selectProductBestSellerAndRecommended } from "@/lib/features/products/productsSlice";

const BestSeller = () => {
  const bestSellerData = useAppSelector(selectProductBestSellerAndRecommended);

  const newBestSellerData = bestSellerData?.bestsellers.map((item) => ({
    ...item,
    buyerType: "B2B",
    W_AVLQTY: 0,
  }));
  return (
    <ProductSlider products={newBestSellerData} sectionName="Best Seller" />
  );
};

export default BestSeller;
