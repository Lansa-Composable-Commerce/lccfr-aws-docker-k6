import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "@/lib/store";

interface InvoicesState {
  isLoading: boolean;
  isError: boolean;
  invoiceInquiryData: any;
  invoiceSummaryData: any;
  invoiceInitData: any;
}

const initialState: InvoicesState = {
  isLoading: false,
  isError: false,
  invoiceInquiryData: [],
  invoiceSummaryData: [],
  invoiceInitData: [],
};

export const getInvoicesInquiry = createAsyncThunk(
  "invoices/getInvoicesInquiry",
  async (payload: any, thunkAPI) => {
    try {
      const config = {
        params: payload,
      };

      const response = await axios(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/invoice-inquiry`,
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

export const getInvoicesSummary = createAsyncThunk(
  "invoices/getInvoicesSummary",
  async (_, thunkAPI) => {
    try {
      const response = await axios(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/invoice-summary`,
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
export const getInvoicesInit = createAsyncThunk(
  "invoices/getInvoicesInit",
  async (_, thunkAPI) => {
    try {
      const response = await axios(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/invoice-init`,
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

export const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    resetError: (state) => {
      state.isError = false;
      state.invoiceInquiryData = {
        ...state.invoiceInquiryData,
        success: null,
        errors: null,
      }; // Reset success and errors of orderInquiryData
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getInvoicesInquiry.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(getInvoicesInquiry.fulfilled, (state, action) => {
      state.invoiceInquiryData = action.payload;
      state.isError = action.payload.success === true;
      state.isLoading = false;
    });
    builder.addCase(getInvoicesInquiry.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addCase(getInvoicesSummary.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getInvoicesSummary.fulfilled, (state, action) => {
      state.invoiceSummaryData = action.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getInvoicesSummary.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getInvoicesInit.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getInvoicesInit.fulfilled, (state, action) => {
      state.invoiceInitData = action.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getInvoicesInit.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { resetError } = invoicesSlice.actions;

export const selectIsLoading = (state: RootState) => state.invoices.isLoading;
export const selectIsInvoiceInquiryData = (state: RootState) =>
  state.invoices.invoiceInquiryData;
export const selectIsInvoiceSummaryData = (state: RootState) =>
  state.invoices.invoiceSummaryData;
export const selectIsInvoiceInitData = (state: RootState) =>
  state.invoices.invoiceInitData;

export default invoicesSlice.reducer;
