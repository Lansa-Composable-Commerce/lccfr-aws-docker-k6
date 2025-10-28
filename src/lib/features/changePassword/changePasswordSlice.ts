import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "@/lib/store";

type ChangePasswordState = {
  isLoading: boolean;
  messages: [];
  data: String[];
};

const initialState = {
  isLoading: false,
  messages: [],
  data: [],
} satisfies ChangePasswordState as ChangePasswordState;

export const updatePassword = createAsyncThunk(
  "changePassword/updatePassword",
  async (payload: any, thunkAPI) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/change-password`,
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

export const changePasswordSlice = createSlice({
  name: "changePassword",
  initialState,
  reducers: {
    removeMessageState: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updatePassword.pending, (state) => {
      state.isLoading = true;
      state.messages = [];
    });
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.messages = action.payload.data.messages;
    });
    builder.addCase(updatePassword.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { removeMessageState } = changePasswordSlice.actions;

export const selectIsLoading = (state: RootState) =>
  state.changePassword.isLoading;
export const selectChangePasswordMessages = (state: RootState) =>
  state.changePassword.messages;
export const selectData = (state: RootState) => state.changePassword.data;

export default changePasswordSlice.reducer;
