import { PaymentType } from "@/types/index";

export interface BillingDetails {
  LW3CHNAME: string;
  LW3HADDR1: string;
  LW3HADDR2?: string;
  LW3CHCITY: string;
  LW3HSTATE: string;
  LW3HPSTAL: string;
  LW3BTCSZ: string;
  LW3HCNTRY: string;
}

export interface ShippingDetails {
  LW3CSNAME: string;
  LW3CSCPNY?: string;
  LW3SADDR1: string;
  LW3SADDR2?: string;
  LW3CSCITY: string;
  LW3SSTATE: string;
  LW3SPSTAL: string;
  LW3STCSZ: string;
  LW3SCNTRY: string;
}

export interface ShippingAddress {
  FXSHIPID: string;
  LW3IS001?: string;
  LW3WEBSHP: number;
  LW3CHNAME: string;
  LW3ADDRS1: string;
  LW3SADDR1: string;
  LW3SADDR2?: string;
  LW3CSCITY: string;
  LW3SSTATE: string;
  LW3SPSTAL: string;
  LW3SCNTRY: string;
}

export interface PaymentOption {
  LW3PAYTYP: string;
  LW3CDES: string;
}

export interface CreditCardType {
  LW3BILLCT: string;
  LW3BILLCD: string;
}

export type PaymentOptions = PaymentOption[];
export type CreditCardTypeList = CreditCardType[];

export interface CheckoutInitResponse {
  BillToDetails: BillingDetails;
  ShipToDetails: ShippingDetails;
  PaymentOptionsList: PaymentOptions;
  ShipToAddressList: ShippingAddress[];
  CreditCardTypeList: CreditCardTypeList;
}

export interface PlaceOrderRequest {
  shipToId: string;
  cartHeaderComment?: string;
  paymentType: PaymentType;
  poNumber?: string;
  cardType?: string;
  cardNumber?: string;
  cardHolderName?: string;
  cardCCV?: string;
  cardExpiryYear?: number;
  cardExpiryMonth?: number;
}

export interface PostOrderDetails {
  isSuccess: boolean;
  emailStatus: "OK" | "ER";
}
