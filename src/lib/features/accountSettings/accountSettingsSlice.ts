import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "@/lib/store";
import { getUserProfile } from "@/api/account-settings/getUserProfile";

type AccountSettingsState = {
  isLoading: {
    updateProfile: boolean;
    subUserDetails: boolean;
  };
  isB2B: boolean;
  profile: {};
  paymentOption: {
    payByPONumFlag: string;
    payByCCDirectFlag: string;
    payByCCSavedFlag: string;
    payByAnyFlag: string;
  };
  messages: [];
};

const initialState = {
  isLoading: {
    updateProfile: false,
    subUserDetails: false,
  },
  isB2B: true,
  profile: {},
  paymentOption: {
    payByPONumFlag: "",
    payByCCDirectFlag: "",
    payByCCSavedFlag: "",
    payByAnyFlag: "",
  },
  messages: [],
} satisfies AccountSettingsState as AccountSettingsState;

export const updateProfile = createAsyncThunk(
  "accountSettings/updateProfile",
  async (payload: any, thunkAPI) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/update-profile`,
        payload,
      );

      return response?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const updateProfilePayOpt = createAsyncThunk(
  "accountSettings/updateProfilePayOpt",
  async (payload: any, thunkAPI) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/update-payment-options`,
        payload,
      );
      const updatedProfile = await getUserProfile();

      return {
        payOpt: updatedProfile.data.payOpt,
        messages: response.data,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const accountSettingsSlice = createSlice({
  name: "accountSettings",
  initialState,
  reducers: {
    setOnB2B: (state, action) => {
      state.isB2B = action.payload;
    },
    removeMessageState: (state) => {
      state.messages = [];
    },
    getPaymentOptionsState: (state, action) => {
      state.paymentOption = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateProfile.pending, (state) => {
      state.isLoading.updateProfile = true;
      state.messages = [];
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.isLoading.updateProfile = false;
      state.profile = action.payload;
      state.messages = action.payload.data.messages;
    });
    builder.addCase(updateProfile.rejected, (state) => {
      state.isLoading.updateProfile = false;
      state.messages = [];
    });
    builder.addCase(updateProfilePayOpt.pending, (state) => {
      state.messages = [];
    });
    builder.addCase(updateProfilePayOpt.fulfilled, (state, action) => {
      state.paymentOption = action.payload?.payOpt;
      state.messages = action.payload?.messages?.data?.messages;
    });
    builder.addCase(updateProfilePayOpt.rejected, (state) => {
      state.messages = [];
    });
  },
});

export const { setOnB2B, removeMessageState, getPaymentOptionsState } =
  accountSettingsSlice.actions;

export const selectIsOnB2B = (state: RootState) => state.accountSettings.isB2B;
export const selectIsLoading = (state: RootState) =>
  state.accountSettings.isLoading.updateProfile;
export const selectMessages = (state: RootState) =>
  state.accountSettings.messages;
export const selectPaymentOption = (state: RootState) =>
  state.accountSettings.paymentOption;

export default accountSettingsSlice.reducer;
