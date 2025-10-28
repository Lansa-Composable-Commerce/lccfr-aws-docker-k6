"use client";

import ProductSlider from "@/components/Products/ProductSlider";

import { useAppSelector } from "@/lib/hooks";
import { selectProductBestSellerAndRecommended } from "@/lib/features/products/productsSlice";

const FeaturedItems = () => {
  const recommendedData = useAppSelector(selectProductBestSellerAndRecommended);

  const newRecommendedData = recommendedData?.recommended.map((item) => ({
    ...item,
    buyerType: "B2B",
    W_AVLQTY: 0,
  }));

  return <ProductSlider products={newRecommendedData} sectionName="Featured" />;
};

export default FeaturedItems;
