import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "@/lib/store";

type ContentState = {
  isLoading: boolean;
  faqData: {
    LW3CNTSTR: string;
  };
  aboutUsData: {
    LW3CNTSTR: string;
  };
  privacyPolicyData: {
    LW3CNTSTR: string;
  };
  ordersPaymentData: {
    LW3CNTSTR: string;
  };
  shippingInfoData: {
    LW3CNTSTR: string;
  };
  eventInfoData: {
    LW3CNTSTR: string;
  };
  returnExchangeData: {
    LW3CNTSTR: string;
  };
};

const initialState: ContentState = {
  isLoading: false,
  faqData: {
    LW3CNTSTR: "",
  },
  aboutUsData: {
    LW3CNTSTR: "",
  },
  privacyPolicyData: {
    LW3CNTSTR: "",
  },
  ordersPaymentData: {
    LW3CNTSTR: "",
  },
  shippingInfoData: {
    LW3CNTSTR: "",
  },
  eventInfoData: {
    LW3CNTSTR: "",
  },
  returnExchangeData: {
    LW3CNTSTR: "",
  },
} satisfies ContentState as ContentState;

export const getContentFaq = createAsyncThunk(
  "content/faq",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/content/faq`,
      );

      return response?.data?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const getContentAboutUs = createAsyncThunk(
  "content/aboutUs",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/content/aboutus`,
      );

      return response?.data?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const getContentPrivacyPolicy = createAsyncThunk(
  "content/privacyPolicy",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/content/privacy-and-policy`,
      );

      return response?.data?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const getContentOrdersAndPayment = createAsyncThunk(
  "content/orderAndPayment",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/content/orders-and-payment`,
      );

      return response?.data?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const getContentShippingInfo = createAsyncThunk(
  "content/shippingInfo",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/content/shipping-information`,
      );

      return response?.data?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const getContentEventInfo = createAsyncThunk(
  "content/eventInfo",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/content/event-information`,
      );

      return response?.data?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const getContentReturnExchange = createAsyncThunk(
  "content/returnExchange",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/content/return-and-exchange`,
      );

      return response?.data?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getContentFaq.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getContentFaq.fulfilled, (state, action) => {
      state.faqData = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getContentFaq.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getContentAboutUs.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getContentAboutUs.fulfilled, (state, action) => {
      state.aboutUsData = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getContentAboutUs.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getContentPrivacyPolicy.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getContentPrivacyPolicy.fulfilled, (state, action) => {
      state.privacyPolicyData = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getContentPrivacyPolicy.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getContentOrdersAndPayment.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getContentOrdersAndPayment.fulfilled, (state, action) => {
      state.ordersPaymentData = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getContentOrdersAndPayment.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getContentShippingInfo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getContentShippingInfo.fulfilled, (state, action) => {
      state.shippingInfoData = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getContentShippingInfo.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getContentEventInfo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getContentEventInfo.fulfilled, (state, action) => {
      state.eventInfoData = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getContentEventInfo.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getContentReturnExchange.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getContentReturnExchange.fulfilled, (state, action) => {
      state.returnExchangeData = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getContentReturnExchange.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const selectIsContent = (state: RootState) => state.content;

export default contentSlice.reducer;
