import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { COOKIE_PREFIX } from "@/utils/constants";

// import { RootState } from "@/lib/store";

interface UserPreferencesState {
  isLoading: boolean;
  userPreferencesData: [];
}

const initialState: UserPreferencesState = {
  isLoading: false,
  userPreferencesData: [],
};

export const getUserPreferences = createAsyncThunk(
  "userPreferences/getUserPreferences",
  async (_, thunkAPI) => {
    try {
      const response = await axios(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/user-preferences`,
      );

      return response?.data?.data.map((item: any) => ({
        DDSELT: item.DDSELT,
        LW3CODE: item.LW3CODE,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const updateUserPreferences = createAsyncThunk(
  "userPreferences/updateUserPreferences",
  async (payload: any, thunkAPI) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/user-preferences`,
        payload,
      );

      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const userPreferencesSlice = createSlice({
  name: "userPreferences",
  initialState,
  reducers: {
    setUserPreferences: (state, action) => {
      state.userPreferencesData = action.payload;
    },
    clearUserPreferences: (state) => {
      state.userPreferencesData = [];
      localStorage.removeItem(`${COOKIE_PREFIX}user_preferences`);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserPreferences.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserPreferences.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userPreferencesData = action.payload;
    });
    builder.addCase(getUserPreferences.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateUserPreferences.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUserPreferences.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(updateUserPreferences.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { setUserPreferences, clearUserPreferences } =
  userPreferencesSlice.actions;

export const selectIsLoading = (state: RootState) =>
  state.userPreferences.isLoading;
export const selectUserPreferencesData = (state: RootState) =>
  state.userPreferences.userPreferencesData || [];

const loadUserPreferencesFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem(
      `${COOKIE_PREFIX}user_preferences`,
    );
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
};

export const initializeUserPreferencesState = () => {
  return loadUserPreferencesFromLocalStorage() ?? { userPreferencesData: [] };
};

export default userPreferencesSlice.reducer;
