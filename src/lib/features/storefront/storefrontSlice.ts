import { Storefront } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

const initialState: Storefront = {
  storefrontId: 0,
  storefrontShortName: "",
  storefrontIndicator: "",
  currencyCode: "",
  currencySymbol: "",
  decimalPointSymbol: "",
  thousandSeparatorsSymbol: "",
  storefrontName: "",
  analyticsFlag: "",
  analyticsAccount: "",
  msClarityId: "",
  pendingCartFlag: false,
};

const storefrontSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setStorefrontDetails(_, action: PayloadAction<Storefront>) {
      return action.payload;
    },
  },
});

export const { setStorefrontDetails } = storefrontSlice.actions;

export const selectStorefrontState = (state: RootState) => state.storefront;

export default storefrontSlice.reducer;
