import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { checkoutApi } from "@/services/checkoutApi";
import { RootState } from "@/lib/store";
import { CheckoutInitResponse, PlaceOrderRequest } from "@/types/Checkout";

const initialState = {
  isOpen: false,
  billingDetails: {
    contactName: "",
    address1: "",
    address2: "",
    regionDetails: "",
    country: "",
  },
  shippingDetails: {
    id: "0",
    contactName: "",
    address1: "",
    address2: "",
    regionDetails: "",
    country: "",
  },
  placeOrderPayload: {
    shipToId: "0",
    paymentType: "PO",
    cartHeaderComment: undefined,
    poNumber: undefined,
    cardType: undefined,
    cardHolderName: undefined,
    cardNumber: undefined,
    cardExpiryMonth: undefined,
    cardExpiryYear: undefined,
    cardCCV: undefined,
  } as PlaceOrderRequest,
  paymentOptions: [] as any,
  creditCards: [] as any,
  shippingAddresses: [] as any,
  paymentErrors: {} as { [key: string]: string },
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setModalOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
    setUpdateShippingDetails(state, action: PayloadAction<any>) {
      state.shippingDetails = { ...action.payload };
      state.placeOrderPayload.shipToId = action.payload.id;
    },
    setPaymentOption(state, action: PayloadAction<"PO" | "CD">) {
      state.placeOrderPayload.paymentType = action.payload;
    },
    setPlaceOrderPayload(
      state,
      action: PayloadAction<Partial<PlaceOrderRequest>>,
    ) {
      state.placeOrderPayload = {
        ...state.placeOrderPayload,
        ...action.payload,
      };
    },
    setAdditionalNotes(state, action: PayloadAction<string>) {
      state.placeOrderPayload.cartHeaderComment = action.payload;
    },
    setFormErrors(state, action: PayloadAction<{ [key: string]: string }>) {
      state.paymentErrors = action.payload;
    },
    resetPaymentForm(state) {
      state.placeOrderPayload = {
        ...state.placeOrderPayload,
        poNumber: undefined,
        cardType: undefined,
        cardHolderName: undefined,
        cardNumber: undefined,
        cardExpiryMonth: undefined,
        cardExpiryYear: undefined,
        cardCCV: undefined,
      };
    },
    resetFieldErrors(state) {
      state.paymentErrors = {};
    },
    resetCheckout() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      checkoutApi.endpoints.getCheckoutDetails.matchFulfilled,
      (state, action) => {
        const data: CheckoutInitResponse = action.payload.data;

        const {
          BillToDetails,
          ShipToDetails,
          ShipToAddressList,
          PaymentOptionsList,
          CreditCardTypeList,
        } = data;

        const shippingDetails = {
          id: "0",
          contactName: ShipToDetails.LW3CSNAME,
          address1: ShipToDetails.LW3SADDR1,
          address2: ShipToDetails.LW3SADDR2 ?? "",
          regionDetails: ShipToDetails.LW3STCSZ,
          country: ShipToDetails.LW3SCNTRY,
        };

        state.billingDetails = {
          contactName: BillToDetails.LW3CHNAME,
          address1: BillToDetails.LW3HADDR1,
          address2: BillToDetails.LW3HADDR2 ?? "",
          regionDetails: BillToDetails.LW3BTCSZ,
          country: BillToDetails.LW3HCNTRY,
        };

        state.shippingDetails = shippingDetails;

        state.shippingAddresses = [
          { ...shippingDetails },
          ...ShipToAddressList.map((address) => ({
            id: address.FXSHIPID,
            contactName: address.LW3CHNAME,
            address1: address.LW3SADDR1,
            address2: address.LW3SADDR2 ?? "",
            regionDetails: address.LW3ADDRS1,
            country: address.LW3SCNTRY,
          })),
        ];

        state.paymentOptions = PaymentOptionsList.map((payment) => ({
          type: payment.LW3PAYTYP,
          description: payment.LW3CDES,
        }));

        state.creditCards = CreditCardTypeList.map((card) => ({
          value: card.LW3BILLCT,
          label: card.LW3BILLCD,
        }));
      },
    );
  },
});

export const {
  setModalOpen,
  setUpdateShippingDetails,
  setPaymentOption,
  setPlaceOrderPayload,
  setAdditionalNotes,
  setFormErrors,
  resetPaymentForm,
  resetFieldErrors,
  resetCheckout,
} = checkoutSlice.actions;

export const selectCheckoutState = (state: RootState) => state.checkout;

export const selectCartCommentLength = (state: RootState) => {
  const cartHeaderComment = state.checkout.placeOrderPayload.cartHeaderComment;

  return cartHeaderComment ? cartHeaderComment.length : 0;
};

export default checkoutSlice.reducer;
