import React from "react";
import { Metadata } from "next";

import ProductDetails from "@/components/Products/ProductDetails";

// api
import { getProductsDetails } from "@/api/products/getProductDetails";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Product - ${params.slug}`,
    description: "product details page",
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const productData = await getProductsDetails(params.slug);

  return (
    <div className="md:container mx-auto px-4">
      <ProductDetails productData={productData?.data} />
    </div>
  );
}
