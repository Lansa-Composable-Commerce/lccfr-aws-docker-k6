"use client";

import { OrderDetails } from "@/types/OrderConfirmation";
import { useTranslations } from "next-intl";

type CardCustomerDetailsPropType = Omit<OrderDetails, "products">;

export default function CardCustomerDetails({
  order,
  shipTo,
  billTo,
}: CardCustomerDetailsPropType) {
  const tOrderConfirmation = useTranslations("OrdConfirm");

  return (
    <div className="flex flex-col w-full gap-2 border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-2">
        {tOrderConfirmation("OrderDetails")}
      </h3>
      <div className="flex flex-col md:flex-row md:justify-between gap-4 my-4">
        <div className="w-full">
          <h5 className="text-md text-gray-500 font-medium">
            {tOrderConfirmation("OrderNumber")}
          </h5>
          <span className="text-sm">#{order.orderNumber}</span>
        </div>
        <div className="w-full">
          <h5 className="text-md text-gray-500 font-medium">
            {tOrderConfirmation("PaymentOption")}
            <span className="mx-1 text-xs">
              (
              {order.paymentType === "PO"
                ? tOrderConfirmation("PurchaseOrderNumber")
                : tOrderConfirmation("CreditCard")}
              )
            </span>
          </h5>
          <span className="text-sm">{order.poNumber}</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between gap-4 my-4">
        <div className="w-full">
          <h5 className="text-md text-gray-500 font-medium mb-2">
            {tOrderConfirmation("ShippingAddress")}
          </h5>
          <div className="flex flex-col gap-1">
            <span className="text-sm">{shipTo.name}</span>
            <span className="text-sm">{shipTo.address1}</span>
            {shipTo.address2 && (
              <span className="text-sm">{shipTo.address2}</span>
            )}
            <span className="text-sm">
              {shipTo.city} {shipTo.state} {shipTo.zip}
            </span>
            <span className="text-sm">{shipTo.country}</span>
          </div>
        </div>
        <div className="w-full">
          <h5 className="text-md text-gray-500 font-medium mb-2">
            {tOrderConfirmation("BillingAddress")}
          </h5>
          <div className="flex flex-col gap-1">
            <span className="text-sm">{billTo.name}</span>
            <span className="text-sm">{billTo.address1}</span>
            {shipTo.address2 && (
              <span className="text-sm">{billTo.address2}</span>
            )}
            <span className="text-sm">
              {billTo.city} {billTo.state} {billTo.zip}
            </span>
            <span className="text-sm">{billTo.country}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
