import React from "react";
import PageTitle from "@/components/ui/PageTitle";
import { useTranslations } from "next-intl";

const MyProductTitle = () => {
  const tMyProducts: any = useTranslations("MyProducts");

  return <PageTitle withTitle content={tMyProducts("MyProducts")} />;
};

export default MyProductTitle;
