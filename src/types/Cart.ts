import { Message } from "@/types/index";

export interface CartItem {
  productCode: string;
  lineNumber: number;
  lineStatus?: string;
  productDesc: string;
  quantity: number;
  unitPrice: number;
  lineDiscount: number;
  displayedLineDiscount: string;
  lineTotal: number;
  displayedLineTotal: string;
  productImage: string;
  freeGiftFlag?: string;
  categoryName?: string;
}

export interface PromotionCode {
  promoCode: string;
}

export interface Cart {
  cartId: number;
  itemCount: number;
  uniqueItemCount: number;
  subTotal: number;
  displayedSubTotal: string;
  orderTotal: number;
  displayedOrderTotal: string;
  orderDiscount: number;
  displayedOrderDiscount: string;
  promoCode: string;
  products: CartItem[];
  message: Message[];
}

export type CartRequest = Pick<CartItem, "productCode" | "quantity">;

export type CartItems = CartItem[];
