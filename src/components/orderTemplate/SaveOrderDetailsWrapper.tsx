"use client";

import React from "react";
import { useTranslations } from "next-intl";

import PageTitle from "@/components/ui/PageTitle";
import SaveOrderDetailsList from "@/components/orderTemplate/SaveOrderDetailsList";
import SaveOrderDetails from "@/components/orderTemplate/SaveOrderDetails";

import { SaveOrderDetailsWrapperProps } from "@/types";

const SaveOrderDetailsWrapper = ({
  savedOrderDetailsData,
}: SaveOrderDetailsWrapperProps) => {
  return (
    <>
      <section>
        <SaveOrderDetails savedOrderDetailsData={savedOrderDetailsData} />
        <SaveOrderDetailsList savedOrderDetailsData={savedOrderDetailsData} />
      </section>
    </>
  );
};

export default SaveOrderDetailsWrapper;
