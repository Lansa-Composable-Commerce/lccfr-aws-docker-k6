import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { Cart, CartItems } from "@/types/Cart";
import { cartApi } from "@/services/cartApi";

export type Message = {
  code?: string;
  sub?: string;
};

type CartInitialStateType = {
  cartId: number | null;
  isCartOpen: boolean;
  isRemoveAllModalOpen: boolean;
  cartSubTotalPrice: string;
  cartTotalPrice: string;
  orderTotal: number;
  cartDiscount: string;
  items: CartItems;
  promoCode: string;
  message: Message | null;
};

const initialState: CartInitialStateType = {
  cartId: null,
  isCartOpen: false,
  isRemoveAllModalOpen: false,
  cartSubTotalPrice: "$0.00",
  cartTotalPrice: "$0.00",
  orderTotal: 0,
  cartDiscount: "$0.00",
  items: [],
  promoCode: "",
  message: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartOpen(state, action: PayloadAction<boolean>) {
      state.isCartOpen = action.payload;
    },
    setRemoveAllModalOpen(state, action: PayloadAction<boolean>) {
      state.isRemoveAllModalOpen = action.payload;
    },
    setExpirationMessage(state) {
      state.message = null;
    },
    resetPromoCode(state) {
      state.promoCode = "";
    },
    resetCart() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      cartApi.endpoints.addToCart.matchFulfilled,
      (state, action) => {
        const newCartItems: CartItems = action.payload.products;

        state.cartSubTotalPrice = action.payload.displayedSubTotal;
        state.cartTotalPrice = action.payload.displayedOrderTotal;

        newCartItems.forEach((newItem) => {
          const existingItem = state.items.find(
            (item) => item.productCode === newItem.productCode,
          );

          if (existingItem) {
            existingItem.quantity = newItem.quantity;
            existingItem.displayedLineTotal = newItem.displayedLineTotal;
          } else {
            state.items.push(newItem);
          }
        });
      },
    );

    builder.addMatcher(
      cartApi.endpoints.getCart.matchFulfilled,
      (state, action) => {
        const cart: Cart = action.payload.data;

        state.message = {
          code: cart?.message[0].code,
          sub: cart?.message[0].substitutions[0],
        };

        state.cartId = cart?.cartId;
        state.items = cart?.products || [];
        state.cartSubTotalPrice = cart?.displayedSubTotal;
        state.cartTotalPrice = cart?.displayedOrderTotal;
        state.orderTotal = cart?.orderTotal;
        state.cartDiscount =
          cart?.displayedOrderDiscount === "$.00"
            ? "$0.00"
            : cart?.displayedOrderDiscount;
        state.promoCode = cart?.promoCode;
      },
    );

    builder.addMatcher(
      cartApi.endpoints.updateCartItem.matchFulfilled,
      (state, action) => {
        const cart: Cart = action.payload;

        state.cartDiscount =
          cart.displayedOrderDiscount === "$.00"
            ? "$0.00"
            : cart.displayedOrderDiscount;
        state.cartSubTotalPrice = cart.displayedSubTotal;
        state.cartTotalPrice = cart.displayedOrderTotal;
        state.orderTotal = cart.orderTotal;

        const updatedItems = cart.products || [];

        updatedItems.forEach((updatedItem) => {
          const existingItem = state.items.find(
            (item) => item.productCode === updatedItem.productCode,
          );

          if (existingItem) {
            existingItem.quantity = updatedItem.quantity;
            existingItem.displayedLineTotal = updatedItem.displayedLineTotal;
          } else {
            state.items.push(updatedItem);
          }
        });
      },
    );

    builder.addMatcher(
      cartApi.endpoints.addPromotions.matchFulfilled,
      (state, action) => {
        const { promoCode } = action.meta.arg.originalArgs;

        state.promoCode = promoCode;
      },
    );
  },
});

export const {
  setCartOpen,
  setRemoveAllModalOpen,
  setExpirationMessage,
  resetPromoCode,
  resetCart,
} = cartSlice.actions;

export const selectCartState = (state: RootState) => state.cart;

export const selectCartTotalQuantity = (state: RootState) => {
  return state.cart.items.reduce((total, item) => total + item.quantity, 0);
};

export const selectCartTotalItems = (state: RootState) => {
  return state.cart.items.length;
};

export default cartSlice.reducer;
