import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { apiSlice } from "@/services/apiSlice";

import authSlice from "@/lib/features/auth/authSlice";
import cartSlice from "@/lib/features/cart/cartSlice";
import checkoutSlice from "@/lib/features/checkout/checkoutSlice";
import globalSlice from "./features/global/globalSlice";
import recentlyViewedProductsSlice, {
  initializeRecentlyViewedState,
} from "@/lib/features/recentlyViewedProducts/recentlyViewedProductsSlice";
import productsSlice from "@/lib/features/products/productsSlice";
import breadcrumbSlice from "@/lib/features/breadcrumbs/breadcrumbsSlice";
import quickShopSlice from "@/lib/features/quickShop/quickShopSlice";
import accountSlice from "@/lib/features/account/accountSlice";
import myProductsSlice from "@/lib/features/myProducts/myProductsSlice";
import accountSettingsSlice from "@/lib/features/accountSettings/accountSettingsSlice";
import orderInquirySlice from "@/lib/features/orderInquiry/orderInquirySlice";
import invoicesSlice from "@/lib/features/invoices/invoicesSlice";
import changePasswordSlice from "@/lib/features/changePassword/changePasswordSlice";
import orderTemplateSlice from "@/lib/features/orderTemplate/orderTemplateSlice";
import subUserSlice from "@/lib/features/subUser/subUserSlice";
import storefrontSlice from "@/lib/features/storefront/storefrontSlice";
import userPreferencesSlice, {
  initializeUserPreferencesState,
} from "@/lib/features/userPreferences/userPreferencesSlice";
import mailSlice from "@/lib/features/mail/mailSlice";
import contentSlice from "@/lib/features/content/contentSlice";

import { COOKIE_PREFIX } from "@/utils/constants";

// Save user preferences to localStorage
const saveUserPreferencesToLocalStorage = (state: any) => {
  // Ensure localStorage is available
  if (typeof window !== "undefined" && window.localStorage) {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(`${COOKIE_PREFIX}user_preferences`, serializedState);
  }
};

// Save recently viewed products to localStorage
const saveRecentlyViewedProductsToLocalStorage = (state: any) => {
  // Ensure localStorage is available
  if (typeof window !== "undefined" && window.localStorage) {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(
      `${COOKIE_PREFIX}recently_viewed_products`,
      serializedState,
    );
  }
};

// Create the store
export const makeStore = configureStore({
  reducer: {
    global: globalSlice,
    auth: authSlice,
    account: accountSlice,
    cart: cartSlice,
    checkout: checkoutSlice,
    recentlyViewedProducts: recentlyViewedProductsSlice,
    products: productsSlice,
    breadcrumbs: breadcrumbSlice,
    quickShop: quickShopSlice,
    myProducts: myProductsSlice,
    accountSettings: accountSettingsSlice,
    orderInquiry: orderInquirySlice,
    invoices: invoicesSlice,
    changePassword: changePasswordSlice,
    orderTemplate: orderTemplateSlice,
    subUser: subUserSlice,
    userPreferences: userPreferencesSlice,
    content: contentSlice,
    mail: mailSlice,
    storefront: storefrontSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  preloadedState: {
    recentlyViewedProducts: initializeRecentlyViewedState(),
    userPreferences: initializeUserPreferencesState(),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Store subscriber
if (typeof window !== "undefined") {
  makeStore.subscribe(() => {
    saveRecentlyViewedProductsToLocalStorage(
      makeStore.getState().recentlyViewedProducts,
    );
    saveUserPreferencesToLocalStorage(makeStore.getState().userPreferences);
  });
}

setupListeners(makeStore.dispatch);

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore.getState>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof makeStore.getState>;
export type AppDispatch = typeof makeStore.dispatch;
