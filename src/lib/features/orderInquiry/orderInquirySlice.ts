import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "@/lib/store";

interface OrderInquiryState {
  isLoading: boolean;
  isError: boolean;
  orderInquiryData: any;
  orderInitData: any;
}

const initialState: OrderInquiryState = {
  isLoading: false,
  isError: false,
  orderInquiryData: [],
  orderInitData: [],
};

export const getOrderInquiry = createAsyncThunk(
  "orderInquiry/getOrderInquiry",
  async (payload: any, thunkAPI) => {
    try {
      const config = {
        params: payload,
      };

      const response = await axios(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/order-inquiry`,
        config,
      );

      return response?.data;
    } catch (error) {
      console.error("API call failed:", error);
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const getOrderInit = createAsyncThunk(
  "orderInquiry/getOrderInit",
  async (_, thunkAPI) => {
    try {
      const response = await axios(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/order-init`,
      );

      return response?.data;
    } catch (error) {
      console.error("API call failed:", error);
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const orderInquirySlice = createSlice({
  name: "orderInquiry",
  initialState,
  reducers: {
    resetError: (state) => {
      state.isError = false;
      state.orderInquiryData = {
        ...state.orderInquiryData,
        success: null,
        errors: null,
      }; // Reset success and errors of orderInquiryData
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOrderInquiry.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(getOrderInquiry.fulfilled, (state, action) => {
      state.orderInquiryData = action.payload;
      state.isError = action.payload.success === true;
      state.isLoading = false;
    });
    builder.addCase(getOrderInquiry.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addCase(getOrderInit.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getOrderInit.fulfilled, (state, action) => {
      state.orderInitData = action.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getOrderInit.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { resetError } = orderInquirySlice.actions;

export const selectIsLoading = (state: RootState) =>
  state.orderInquiry.isLoading;
export const selectIsOrderInquiryData = (state: RootState) =>
  state.orderInquiry.orderInquiryData;
export const selectIsOrderInitData = (state: RootState) =>
  state.orderInquiry.orderInitData;
export const selectIsError = (state: RootState) => state.orderInquiry.isError;

export default orderInquirySlice.reducer;
