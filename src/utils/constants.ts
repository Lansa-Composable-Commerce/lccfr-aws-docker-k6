export const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
export const BUYER_TYPE = process.env.NEXT_PUBLIC_BUYER_TYPE
  ? process.env.NEXT_PUBLIC_BUYER_TYPE
  : "B2B";
export const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

const Url = process.env.NEXT_PUBLIC_CENEXT_URL
  ? `${process.env.NEXT_PUBLIC_CENEXT_URL}`
  : `http://solutions.lansa.com:8571/cen`;

export const API = {
  ACCOUNTS: `${Url}/CNSACTSEL/accounts`,
  CART_ADD: `${Url}/CNSCART/cart/add`,
  CART_GET: `${Url}/CNSCART/cart`,
  CART_REMOVE_ITEM: `${Url}/CNSCART/cart/remove`,
  CART_REMOVE_ALL_ITEM: `${Url}/CNSCART/cart/remove/all`,
  CART_UPDATE: `${Url}/CNSCART/cart/update`,
  CHECKOUT_DETAILS: `${Url}/CNSCHKOUT/checkout/init`,
  CONTACT_US_INIT: `${Url}/CNSCNTUS/init`,
  CONTACT_US_SEND: `${Url}/CNSCNTUS/send`,
  COUNTRIES: `${Url}/CNSLCTN/countries`,
  FORGOT_PASSWORD: `${Url}/CNSPWRD/forgotpassword`,
  FORGOT_PASSWORD_VERIFICATION: `${Url}/CNSPWRD/forgotpassword/verification`,
  LOGIN: `${Url}/CNSLOGIN/login`,
  ORDERS_DROPDOWN: `${Url}/CNSORDER/orders/init`,
  ORDERS: `${Url}/CNSORDER/orders`,
  ORDER_DETAILS: `${Url}/CNSORDER/order`,
  INVOICES: `${Url}/CNSINVOI/invoices`,
  INVOICE: `${Url}/CNSINVOI/invoice`,
  INVOICES_INIT: `${Url}/CNSINVOI/invoices/init`,
  INVOICE_SUMMARY: `${Url}/CNSINVOI/invoice/summary`,
  ORDER_CONFIRMATION: `${Url}/CNSORDCNF/confirmation?cartId=`,
  PLACE_ORDER: `${Url}/CNSCHKOUT/placeorder`,
  PRODUCTS_BY_CATEGORY: `${Url}/CNSPROD/category`,
  PRODUCTS: `${Url}/CNSPROD/products`,
  PRODUCTS_DETAILS: `${Url}/CNSPROD/product`,
  PRODUCTS_SUGGESTIONS: `${Url}/CNSPROD/products/suggestions`,
  PROMOTIONS_ADD: `${Url}/CNSCART/cart/promo/add`,
  PROMOTIONS_REMOVE: `${Url}/CNSCART/cart/promo/remove`,
  REFERRALS: `${Url}/CNSREGSTR/init`,
  REFRESH_TOKEN: `${Url}/CNSAUTH/refresh`,
  REGISTER: `${Url}/CNSREGSTR/register`,
  RESET_PASSWORD: `${Url}/CNSPWRD/forgotpassword/update`,
  STATES: `${Url}/CNSLCTN/states`,
  STOREFRONT_INIT: `${Url}/CNSINIT/init`,
  STOREFRONT_FEATURED: `${Url}/CNSINIT/init/featured`,
  STOREFRONT_MENUS: `${Url}/CNSINIT/menus`,
  QUICK_SHOP_PRODUCT: `${Url}/CNSQKSHP/product`,
  MY_PRODUCTS: `${Url}/CNSMYPRD/products`,
  USER_PROFILE: `${Url}/CNSUSER/profile`,
  USER_PROFILE_PAYOPT: `${Url}/CNSUSER/profile/payopt`,
  CHANGE_PASSWORD: `${Url}/CNSPWRD/changepassword`,
  SUB_USER: `${Url}/CNSSUBU/subuser`,
  SAVED_ORDER: `${Url}/CNSSAVORD/order/saved`,
  SAVE_ORDER: `${Url}/CNSSAVORD/order/save`,
  SAVED_ORDER_TO_CART: `${Url}/CNSCART/cart/add/order`,
  UPDATE_SAVED_ORDER: `${Url}/CNSSAVORD/order/update`,
  PREFERENCES: `${Url}/CNSUSRPRF/preferences`,
  CONTENT: `${Url}/CNSCNTAST/content`,
  MAIL: `${Url}/CNSMLTRP/mailtrap/account/inboxes/messages`,
  VERIFY_ACCOUNT: `${Url}/CNSREGSTR/verify/user`,
};

export const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-user",
];
export const PRIVATE_ROUTES = [
  "/accounts",
  "/",
  "/order-inquiry",
  "/products",
  "/product",
  "/search-result",
  "/invoices",
  "/quick-shop",
  "/cart",
  "/checkout",
  "/order-confirmation",
  "/my-products",
  "/account-settings",
  "/order-template",
  "/user-preference",
];

export const STOREFRONT_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  CONTACT_US: "/contact-us",
  ORDER_INQUIRY: "/order-inquiry",
  PRODUCTS: "/products",
  SEARCH_RESULT: "/search-result",
  INVOICES: "/invoices",
  QUICK_SHOP: "/quick-shop",
  LOG_OUT: "/logout",
  ACCOUNT_SETTINGS: "/account-settings",
  ORDER_TEMPLATE: "/order-template",
  USER_PREFERENCE: "/user-preference",
  EVENT_INFORMATION: "/content/event-information",
};

/////////////////////////////////////////
export const COOKIE_PREFIX = "cenext_";
export const COOKIE_EXPIRES_ONE_DAY = 1;
export const COOKIE_EXPIRES_DAYS = 7;
export const TABLE_DEFAULT_PAGE_INDEX = 0;
export const TABLE_DEFAULT_PAGE_SIZE = 5;
export const TABLE_MAX_PAGE_SIZE = 100_000;

export const PAGINATION_PAGE_SIZE = 100_000;
export const PAGINATION_CURRENT_PAGE = 1;
export const PAGINATION_MAX_PAGES = 4;

export const INITIAL_PAGE = 1;
export const ITEM_PER_PAGE = 10;
export const DEFAULT_SHOW_COUNT = 9;

export const GTM_EVENTS = {
  VIEW_ITEM: "view_item",
  USER_ACTIVITY: "user_activity",
  USER_ORDER: "user_order",
  PURCHASE: "purchase",
  ADD_TO_CART: "add_to_cart",
  CLICK_FEATURED_PRODUCT: "click_featured_product",
  CLICK_BEST_SELLER_PRODUCT: "click_best_seller_product",
  APPLIED_PROMO_CODE: "applied_promo_code",
  BEGIN_CHECKOUT: "begin_checkout",
};
