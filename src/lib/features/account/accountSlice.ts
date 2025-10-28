import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "@/lib/store";

const initialState = {
  accountData: "",
  accountCount: 0,
};
export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    onGetAccountCount: (state, action) => {
      state.accountCount = action.payload;
    },
  },
});

export const { onGetAccountCount } = accountSlice.actions;

export const selectAccountData = (state: RootState) =>
  state.account.accountData;

export default accountSlice.reducer;
