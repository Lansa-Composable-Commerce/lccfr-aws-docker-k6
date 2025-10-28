import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "@/services/authApi";
import { LoginResponse } from "@/types";
import { RootState } from "@/lib/store";

type VerifyLink = {
  isFailed: boolean;
  code: string;
};

type VerifyAccount = {
  isSuccess: boolean;
  code: string;
};

type ForgotPasswordStatus = {
  isSuccess: boolean;
  code: string;
  email: string;
};

export interface User {
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  customerName?: string;
  customerNumber?: string;
}

interface Authorization {
  routes: string[];
  canAddProduct: boolean;
}

interface AuthInitialStateType {
  accessToken: string | null;
  csrfToken: string | null;
  user: User;
  forgotPasswordStatus: ForgotPasswordStatus;
  isRegisterSuccess: boolean;
  isResetPasswordSuccess: boolean;
  verifyLink: VerifyLink;
  verifyAccount: VerifyAccount;
  authorization: Authorization;
}

const initialState: AuthInitialStateType = {
  accessToken: null,
  csrfToken: null,
  user: {
    email: "",
    firstname: "",
    lastname: "",
    username: "",
  },
  forgotPasswordStatus: {
    isSuccess: false,
    code: "MsgForgotPasswordSuccess",
    email: "",
  },
  isRegisterSuccess: false,
  isResetPasswordSuccess: false,
  verifyLink: {
    isFailed: false,
    code: "MsgDefaultError",
  },
  verifyAccount: {
    isSuccess: false,
    code: "MsgDefaultError",
  },
  authorization: {
    routes: [],
    canAddProduct: false,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens(state, action) {
      state.accessToken = action.payload.accessToken;
      state.csrfToken = action.payload.csrfToken;
    },
    clearAuthMessages(state) {
      state.forgotPasswordStatus = initialState.forgotPasswordStatus;
      state.isResetPasswordSuccess = false;
      state.isResetPasswordSuccess = false;
      state.verifyLink.isFailed = false;
    },
    clearTokens(state) {
      state.accessToken = null;
      state.csrfToken = null;
    },
    clearUserInformation(state) {
      state.user = initialState.user;
    },
    setAuthorization(state, action) {
      state.authorization.routes = action.payload.routes;
    },
    setForgotPasswordStatus(
      state,
      action: PayloadAction<ForgotPasswordStatus>,
    ) {
      state.forgotPasswordStatus = action.payload;
    },
    setIsRegisterSuccess(state, action: PayloadAction<boolean>) {
      state.isRegisterSuccess = action.payload;
    },
    setIsResetPasswordSuccess(state, action: PayloadAction<boolean>) {
      state.isResetPasswordSuccess = action.payload;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setVerifyLink(state, action: PayloadAction<VerifyLink>) {
      state.verifyLink = action.payload;
    },
    setVerifyAccount(state, action: PayloadAction<VerifyAccount>) {
      state.verifyAccount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        const response: LoginResponse = action.payload;

        state.accessToken = response.LW3ACSTKN;
        state.csrfToken = response.LW3CSRFTK;
      },
    );
  },
});

export const {
  setTokens,
  clearAuthMessages,
  clearTokens,
  clearUserInformation,
  setAuthorization,
  setForgotPasswordStatus,
  setIsRegisterSuccess,
  setIsResetPasswordSuccess,
  setUser,
  setVerifyLink,
  setVerifyAccount,
} = authSlice.actions;
export const selectAuthState = (state: RootState) => state.auth;
export default authSlice.reducer;
