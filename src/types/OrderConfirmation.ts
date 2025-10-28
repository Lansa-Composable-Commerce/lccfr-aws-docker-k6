import { PaymentType } from "@/types/index";

export interface OrderInformation {
  orderNumber: string;
  customerNumber: string;
  paymentType: PaymentType;
  poNumber: string;
  subTotal: number;
  displayedSubTotal: string;
  orderDiscount: number;
  displayedOrderDiscount: string;
  orderTotal: number;
  displayedOrderTotal: string;
  orderHeaderComment: string;
  orderDate: string;
  displayedOrderDate: string;
}

export interface OrderAddress {
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderDetail {
  productCode: string;
  lineNumber: number;
  lineStatus: string;
  productDesc: string;
  lineQuantity: number;
  unitPrice: number;
  lineDiscount: number;
  displayedLineDiscount: string;
  lineTotal: number;
  displayedLineTotal: string;
  productImage: string;
  freeGiftFlag: string;
}

export interface Payment {
  number: string;
  type: string;
  name: string;
  year: string;
  month: string;
}

export interface OrderDetails {
  order: OrderInformation;
  billTo: OrderAddress;
  shipTo: OrderAddress;
  products: OrderDetail[];
  payment: Payment;
  promo: {
    code: string;
  };
}
