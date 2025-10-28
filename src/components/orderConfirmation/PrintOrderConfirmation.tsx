"use client";

import Image from "next/image";
import SvgNoImage from "@/assets/svg/No-Image-Placeholder.svg";
import React, { forwardRef } from "react";
import { useTranslations } from "next-intl";
import {
  OrderAddress,
  OrderDetail,
  OrderDetails,
} from "@/types/OrderConfirmation";
import { BASE_IMAGE_URL } from "@/utils/constants";
import PaymentLogo from "@/components/PaymentLogo";
import { useAppSelector } from "@/lib/hooks";
import { selectAuthState } from "@/lib/features/auth/authSlice";
import useImageSrc from "@/lib/hooks/useImageSrc";
import Logo from "@/components/Logo";

const OrderConfirmationAddress = ({
  address,
  title,
}: {
  address: OrderAddress;
  title: string;
}) => {
  return (
    <div className="w-full">
      <span className="font-semibold">{title}</span>
      <div className="flex flex-col">
        <span>{address.name}</span>
        <span>{address.address1}</span>
        {address.address2 && <span>{address.address2}</span>}
        <span>
          {address.city} {address.state} {address.zip}
        </span>
        <span>{address.country}</span>
      </div>
    </div>
  );
};

const OrderConfirmationTableBody = ({ product }: { product: OrderDetail }) => {
  const imgSrc = useImageSrc(
    product.productImage,
    BASE_IMAGE_URL || "",
    SvgNoImage,
  );

  return (
    <tr className="bg-white border">
      <td className="px-4 py-2">
        <div className="flex gap-4 items-center">
          <Image src={imgSrc} width={70} height={50} alt="" priority={true} />
          <div className="flex flex-col">
            <p className="font-semibold">{product.productDesc}</p>
            <p className="text-sm text-gray-400">{product.productCode}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-2 text-center">{product.lineQuantity}</td>
      <td className="px-4 py-2 text-right">${product.unitPrice.toFixed(2)}</td>
      <td className="px-4 py-2 font-semibold text-right">
        {product.displayedLineTotal}
      </td>
    </tr>
  );
};

const PrintOrderConfirmation = forwardRef<
  HTMLDivElement,
  { orderDetails: OrderDetails }
>(({ orderDetails }, ref) => {
  const { shipTo, billTo, products = [], order, payment } = orderDetails;
  const tCart = useTranslations("Cart");
  const tOrderConfirmation = useTranslations("OrdConfirm");
  const { user } = useAppSelector(selectAuthState);

  return (
    <section className="p-4 space-y-4" ref={ref}>
      <div className="flex justify-between items-center">
        <Logo />
        <h1 className="text-2xl font-semibold">
          {tOrderConfirmation("OrderConfirmation")}
        </h1>
      </div>
      <section>
        <p className="text-lg font-semibold text-primary-700">
          {tOrderConfirmation("OrderDetails")}
        </p>
        <div className="flex mt-2 space-y-1">
          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-1 w-[25%] ">
              <span className="font-semibold">
                {tOrderConfirmation("OrderNumber")}:
              </span>
              <span className="font-semibold">
                {tOrderConfirmation("OrderedBy")}:
              </span>
              <span className="font-semibold">
                {tOrderConfirmation("OrderDate")}:
              </span>
              <span className="font-semibold">
                {tOrderConfirmation("CustomerNumber")}:
              </span>
              <span
                className={`font-semibold ${order.paymentType === "CD" ? "mb-6" : ""}`}
              >
                {tOrderConfirmation("PaymentOption")}:
              </span>
              {order.orderHeaderComment && (
                <span className="font-semibold">
                  {tOrderConfirmation("CartComments")}:
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 w-[75%]">
              <span>#{order.orderNumber}</span>
              <span>
                {user.firstname} {user.lastname}
              </span>
              <span>{order.displayedOrderDate}</span>
              <span>{order.customerNumber}</span>
              {order.paymentType === "PO" ? (
                <p className="font-medium">
                  {tOrderConfirmation("PurchaseOrderNumber")}:{" "}
                  <span className="font-semibold">{order.poNumber}</span>
                </p>
              ) : (
                <div className="flex items-center gap-2">
                  <PaymentLogo provider={payment.type} />
                  <p>
                    {tOrderConfirmation("CardEnding")}{" "}
                    <span className="font-semibold">
                      {payment.number.replace(/\*/g, "")}
                    </span>
                  </p>
                </div>
              )}
              {order.orderHeaderComment && (
                <span className="font-medium">{order.orderHeaderComment}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-4 my-8 w-full">
          <OrderConfirmationAddress
            address={shipTo}
            title={tOrderConfirmation("ShippingAddress")}
          />
          <OrderConfirmationAddress
            address={billTo}
            title={tOrderConfirmation("BillingAddress")}
          />
        </div>
      </section>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-primary-700 border">
            <th className="px-4 py-2 text-left text-white font-medium w-1/2">
              {tOrderConfirmation("Item")}
            </th>
            <th className="px-4 py-2 text-center text-white font-medium">
              {tOrderConfirmation("Quantity")}
            </th>
            <th className="px-4 py-2 text-right text-white font-medium">
              {tOrderConfirmation("UnitPrice")}
            </th>
            <th className="px-4 py-2 text-right text-white font-medium">
              {tOrderConfirmation("ExtendedPrice")}
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <OrderConfirmationTableBody
              product={product}
              key={product.productCode + index}
            />
          ))}
          <tr className="bg-white border-l border-r">
            <td className="px-4 py-1"></td>
            <td className="px-4 py-1"></td>
            <td className="px-4 py-1 text-right font-semibold">
              {tCart("Subtotal")}
            </td>
            <td className="px-4 py-1 text-right font-semibold">
              {order.displayedSubTotal}
            </td>
          </tr>
          <tr className="bg-white border-l border-r">
            <td className="px-4 py-1"></td>
            <td className="px-4 py-1"></td>
            <td className="px-4 py-1 text-right font-semibold">
              {tCart("Discount")}
            </td>
            <td className="px-4 py-1 text-right font-semibold">
              {order.displayedOrderDiscount == "$.00"
                ? "$0.00"
                : order.displayedOrderDiscount}
            </td>
          </tr>
          <tr className="border">
            <td className="px-4 py-2"></td>
            <td className="px-4 py-2"></td>
            <td className="px-4 py-2 text-right text-xl font-semibold">
              {tCart("Total")}
            </td>
            <td className="px-4 py-2 text-right text-xl font-semibold">
              {order.displayedOrderTotal}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
});

PrintOrderConfirmation.displayName = "PrintOrderConfirmation";

export default PrintOrderConfirmation;
