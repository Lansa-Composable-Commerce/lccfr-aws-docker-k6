import { ReactNode } from "react";
import { CountryIso2 } from "react-international-phone";
// @ts-ignore
import { FormatPhoneConfig } from "react-international-phone/dist/utils";

export type PaymentType = "PO" | "CD";

export type ProductTabs = {
  id: string;
  caption: string;
  content: string;
};

export type ProductTypes = {
  LW3ITEMCD: string;
  LW3IDESC: string;
  LW3LPRICE?: number;
  LW3URL?: string;
  LW3IMAGE?: string;
  LW3STKAVL?: number;
  LW3CATNAM?: string;
  W_AVLQTY?: number;
  W_FLAGP?: string;
  W_PDFLINK?: string;
  D_LPRICE?: string;
  LW3CATID?: number;
  W_LOFT?: string;
  W_RGHTHND?: string;
  W_LEFTHND?: string;
  W_BRAND?: string;
  buyerType?: string;
  tabs?: ProductTabs[] | any;
  unitOfMeasure?: string;
  specification?: string;
};

export interface Accounts {
  LW3JDEC01: string;
  LW3CUSNAM: string;
  LW3ADDRS1: string;
  LW3ADDRS2: string;
  LW3CTY1: string;
  LW3ADDS: string;
  LW3ADDZ: string;
  LW3SCNTRY: string;
}

export interface LoginRequest {
  Email: string;
  Password?: string;
}

export interface LoginResponse {
  LW3RETCOD: string;
  LW3CHPASF: string;
  LW3ACSTKN: string;
  LW3CSRFTK: string;
  LW3RFSTKN: string;
}

export type SelectOption = {
  id?: string;
  label: string;
  value: string;
};

export type Node = {
  key: string;
  value: {
    label: string;
    link?: string;
    url?: string;
  };
  href?: string;
  children?: Node[];
  isLeaf: boolean;
};

export interface Orders {
  LW3OION: string;
  LW3OIOT: number;
  LW3OIPO: string;
  LW3OIOD: number;
  LW3OISD: number;
  LW3OITK: string;
  LW3OIURL: string;
  D_OIOT: string;
  orderDate: string;
  shippingDate: string;
}

export interface FilterOrders {
  desc: string;
  value: string;
}

export interface OrderItem {
  D_LPRICE: string;
  D_PRCEXT: string;
  LW3ICOLR: string;
  LW3IDESC: string;
  LW3ISIZE: string;
  LW3ITEMCD: string;
  LW3LPRICE: number;
  LW3OISD: number;
  LW3PRCEXT: number;
  LW3QTYRQS: number;
  LW3UM: string;
  shippingDate: string;
}

type SfSelectSize = "sm" | "base" | "lg";

export interface SfSelectProps {
  value?: string;
  size?: SfSelectSize | undefined;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  placeholder?: string;
  wrapperClassName?: string;
  onChange?: (event: any) => void;
  slotChevron?: ReactNode;
  children?: ReactNode;
  className?: string;
  onBlur?: () => void;
  onClick?: () => void;
  onKeyDown?: () => void;
}

export interface IProductDetails {
  LW3ITEMCD: string;
  LW3IDESC: string;
  LW3LPRICE: number;
  LW3URL: string;
  LW3IMAGE: string;
  LW3STKAVL: number;
  LW3CATNAM?: string;
  W_AVLQTY: number;
  W_FLAGP: string;
  W_PDFLINK: string;
  D_LPRICE: string;
  LW3CATID: number;
  W_LOFT?: string;
  W_RGHTHND: boolean;
  W_LEFTHND: boolean;
  W_BRAND?: string;
  BASE64IMAGE?: string;
  tabs?: [];
  buyerType?: string;
}

export type TBreadCrumbProps = {
  homeElement: ReactNode;
  separator: ReactNode;
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
};

export interface OrderInquiryListTypes {
  orderNumber: string;
  orderTotal: string;
  purchaseOrder: string;
  orderDate: string;
  shipDate: string;
  tracking: string;
  onCollapse?: boolean;
  onClickRow?: () => void;
}

export interface IOrderInquiryListProps {
  orderNumber: string;
  orderTotal: string;
  purchaseOrderNumber: string;
  orderDate: string;
  orderShippingDate: string;
  trackingNumber: string;
  trackingURL: string;
  displayedOrderTotal: string;
  displayedOrderDate: string;
  displayedShippingDate: string;
}

export interface OrderInquiryListResponse {
  data: IOrderInquiryListProps[];
  success: boolean;
  errors: any;
}

export interface IOrderDetailsItems {
  productCode: string;
  productDesc: string;
  unitPrice: number;
  unitOfMeasure: string;
  lineQuantity: number;
  shippingDate: number;
  displayedUnitPrice: string;
  displayedLineTotal: string;
  productSize: string;
  productColor: string;
  displayedShippingDate: string;
}

interface IOrderDetailsShipToProps {
  name: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  cityStateZip: string;
  country: string;
}

interface IOrderDetailsBillToProps {
  name: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  cityStateZip: string;
  country: string;
}

interface IOrderDetailsOrder {
  customerId: string;
  orderNumber: string;
  poNumber: string;
  displayedOrderDate: string;
  trackingNumber: string;
  trackingURL: string;
}

interface IOrderDetailsTotals {
  displayedOrderTotal: string;
  displayedTotalCharge: string;
  displayedAmount: string;
  displayedTotal: string;
}

export interface IOrderDetailsResponse {
  product: IOrderDetailsItems[];
  shipTo: IOrderDetailsShipToProps;
  billTo: IOrderDetailsBillToProps;
  order: IOrderDetailsOrder;
  totals: IOrderDetailsTotals;
}

export interface OrderDetailsListTypes {
  productCode: string;
  productDescription: string;
  unitPrice: string;
  unitOfMeasure: string;
  lineQuantity: string;
  shippingDate: string;
  displayedLineTotal: string;
  onCollapse?: boolean;
  onClickRow?: () => void;
  tOrderInquiryDetails: any;
}

export interface Iinvoices {
  invoiceNumber: string;
  invoiceTotal: number;
  invoicePO: string;
  invoiceDate: string;
  invoiceCloseDate: string;
  invoiceAmount: number;
  displayedInvoiceTotal: string;
  displayedBalanceOwing: string;
  displayedInvoiceDate: string;
  displayedInvoiceCloseDate: string;
}

export interface IinvoicesProps {
  invoicesData: {
    success: boolean;
    data: any;
    errors: string;
  };
}

export interface IGetInvoices {
  success?: boolean;
  data?: any;
  errors?: string | undefined;
}

export interface InvoicesListTypes {
  invoiceNumber: string;
  invoiceTotal: string;
  balanceOwing: string;
  purchaseOrder: string;
  invoiceDate: string;
  invoiceCloseDate: string;
  onCollapse?: boolean;
  onClickRow?: () => void;
}

export interface Iinvoice {
  productCode: string;
  productDescription: string;
  productColor: string;
  productSize: string;
  productPrice: number;
  unitOfMeasure: string;
  lineQuantity: number;
  lineNumber: number;
  shippingDate: string;
  displayedUnitPrice: string;
  displayedLineTotal: string;
  displayedShippingDate: string;
}

export interface InvoiceListTypes {
  productCode: string;
  lineNumber: number;
  productDescription: string;
  productColor: string;
  productSize: string;
  displayedUnitPrice: string;
  unitOfMeasure: string;
  displayedLineTotal: string;
  onCollapse?: boolean;
  onClickRow?: () => void;
}

interface IshipToProps {
  name: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  cityStateZip: string;
  country: string;
}

interface IbillToProps {
  name: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  cityStateZip: string;
  country: string;
}

interface IinvoiceDescProp {
  customerId: string;
  invoiceNumber: string;
  invoicePO: string;
  invoiceAmount: number;
  displayedInvoiceAmount: string;
  invoiceTotal: number;
  displayedInvoiceTotal: string;
  displayedInvoiceDate: string;
  displayedCloseDate: string;
}

interface IInvoiceTotalsProp {
  invoiceAmount: number;
  invoiceTotal: number;
  displayedInvoiceAmount: string;
  displayedInvoiceTotal: string;
}

export interface IGetInvoiceResponse {
  data: {
    items: Iinvoice[];
    shipTo: IshipToProps;
    billTo: IbillToProps;
    invoice: IinvoiceDescProp;
    totals: IInvoiceTotalsProp;
  } | null;
  success: boolean;
  messages: string;
}

interface IinvoiceSummaryCustomerProps {
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface IinvoiceSummarysProps {
  displayedOpenAR: number;
  displayedBillAR: number;
  currencyCode: string;
  displayedOpenAmount: number;
}

export interface IinvoiceSummaryProps {
  customer: IinvoiceSummaryCustomerProps;
  summary: IinvoiceSummarysProps;
}

export interface Country {
  LW3CTRY: string;
  LW3CTRYD: string;
}

export interface Referral {
  LW3CODE: string;
  LW3CDES: string;
}

export interface State {
  LW3CTRY: string;
  LW3STATE: string;
  LW3STATED: string;
}

export interface UserRegisterInput {
  companyName: string;
  userId: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  referral: Referral | string;
  addressLine1: string;
  addressLine2: string;
  country: Country | null;
  state: State | null;
  city: string;
  postalCode: string;
  workPhone: string;
  mobileNumber: string;
}

export interface UserRegisterRequest {
  Company: string;
  Username: string;
  Email: string;
  Password: string;
  VerifyPassword: string;
  FirstName: string;
  LastName: string;
  Code: string;
  Address1: string;
  Address2: string;
  City: string;
  State: string;
  PostalCode: string;
  Country: string;
  WorkPhone: string;
  Fax: string;
}

export interface Message {
  code: string;
  message: string;
  type: string;
  field: string;
  detail: string;
  substitutions: string[];
}

export interface QuickShopProps {
  itemCode: string;
  quantity: number;
  productDescription: string;
  displayedUnitPrice: string;
  displayedLineTotal: string;
  availableQuantity: number;
  id: number;
  onCollapse?: boolean;
  onClickRow?: () => void;
}

export type QuickShopResponse = {
  id: number;
  productCode: string;
  productDescription: string;
  categoryName?: string;
  productPrice: number;
  displayedUnitPrice: string;
  availableQuantity: number;
  lineTotal: number;
  displayedLineTotal: string;
  linenotes: [];
  quantity: number;
  originalIndex: number;
};

export interface ProductSuggestionResponse {
  label: string;
  value: string;
}

export type QuickShopImportItem = {
  itemCode: string;
  quantity: number;
};

export type QuantitySelectorPropType = {
  min?: number;
  max?: number;
  value: number;
  onValueChange(newValue: number): void;
  variant?: "default" | "small";
  productInStock?: boolean;
  isLoading?: boolean;
};

type tabs = {
  id: string;
  caption: string;
  content: string;
};
export type TabsDataTypes = {
  tabsData: tabs[];
};

export type LocalePropsType = {
  params: { locale: string };
};

export interface MyProduct {
  LW3ITEMCD: string;
  LW3IDESC: string;
  LW3URL: string;
  LW3IMAGE: string;
  FXUM: string;
  D_LPRICE: string;
  W_IMGURL: string;
  LW3COLQTY: number;
  isSelected?: boolean;
}

export interface Messages {
  code?: string;
  substitutions?: string | string[];
  type?: "error" | "success";
}

export interface ParsedCountry {
  name: string;
  iso2: CountryIso2;
  dialCode: string;
  format: FormatPhoneConfig | string | undefined;
  priority: number | undefined;
  areaCodes: string[] | undefined;
}

export interface PhoneMeta {
  country: ParsedCountry;
  inputValue: string;
}

export interface Storefront {
  storefrontId: number;
  storefrontShortName: string;
  storefrontIndicator: string;
  currencyCode: string;
  currencySymbol: string;
  decimalPointSymbol: string;
  thousandSeparatorsSymbol: string;
  storefrontName: string;
  analyticsFlag: string;
  analyticsAccount: string;
  msClarityId: string;
  pendingCartFlag: boolean;
}

export interface UserInfo {
  userEmail: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  faxNumber: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  userType?: string;
  inheritAccountsFlag?: string;
}

export interface IAccountProps {
  customerNumber: string;
  customerName: string;
  customerType: string;
}

export interface PaymentOptions {
  [key: string]: string;
}

export interface AccountSettingNavigation {
  accountInformation: string;
  paymentOption: string;
  associatedAccounts: string;
  subUserInformation: string;
  changePassword: string;
}

export interface ISubUserProps {
  subUserId: string;
  fullName: string;
  subUserEmail: string;
}

export interface AccountSettingContainerProps {
  user: {
    success: boolean;
    data: {
      userInfo: UserInfo;
      payOpt: PaymentOptions;
      accounts: IAccountProps[];
      subusers: ISubUserProps[];
    };
  };
  countries: any[];
  accessCookieValue: string | undefined;
}

export interface IRenderSubUserInformationList {
  subUser: string;
  name: string;
  email: string;
  onCollapse?: boolean;
  onClickRow?: (e: any) => void;
}

export interface IRenderAssociatedAccountList {
  customerNumber: string;
  customerName: string;
  customerType: string;
  onClickRow?: () => void;
}

export interface ChangePasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface SavedOrderResponseTypes {
  savedOrderNumber: number;
  savedOrderDescription: string;
  displayedCreatedAt: string;
}

interface OrderItemsType {
  productCode: string;
  description: string;
  unitPrice: number;
  quantity: number;
  extendedPrice: number;
  displayedUnitPrice: string;
  displayedExtendedPrice: string;
}

export interface SavedOrderDetailsResponseTypes {
  saveOrderHeader: {
    savedOrderNumber: number;
    savedOrderDescription: string;
    createdAt: string;
    displayedCreatedAt: string;
  };
  orderItems: OrderItemsType[];
}

export interface OrderTemplateListTypes {
  savedOrderNumber: number;
  savedOrderDescription: string;
  displayedCreatedAt: string;
  onClickRow?: () => void;
  onClickAddToCart?: () => void;
  onClickRemove?: () => void;
}

export interface SavedOrderDetailsListTypes {
  productCode: string;
  quantity: number;
  description: string;
  displayedUnitPrice: string;
  displayedExtendedPrice: string;
}

export interface CartItemTransformed {
  productCode: string;
  quantity: number;
}

export interface OrderTemplateWrapperProps {
  initialSavedOrderData: SavedOrderResponseTypes[];
}

export interface SaveOrderDetailsWrapperProps {
  savedOrderDetailsData: SavedOrderDetailsResponseTypes;
}

export interface OrderTemplateItem {
  savedOrderNumber: number;
  savedOrderDescription: string;
  displayedCreatedAt: string;
}

export interface PermissionItem {
  menuId: number;
  menuName: string;
  subMenu: number;
  subuserPermissionFlag: "Y" | "N" | "";
}

export interface NestedPermissionNode extends PermissionItem {
  checked: boolean;
  indeterminate: boolean;
  children: NestedPermissionNode[];
}

export interface SubUserAssocAccountsItem {
  customerId: string;
  customerName: string;
  customerType: string;
  accountStatus: string;
  accountStatusDesc: "active" | "inactive" | "suspended";
  isAssociated: string;
}

export interface SubUserInfo {
  mode?: string;
  accountStatus: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  workPhone: string;
  fax: string;
  inheritsSuperUserAccounts?: string;
  password?: string;
  verifyPassword?: string;
}

export interface RenderSubUserAssociatedAccountListProps {
  customerId: string;
  customerName: string;
  customerType: string;
  accountStatusDesc: "active" | "inactive" | "suspended";
  isAssociated: string;
  onClickRow: (item: any) => void;
  item: any;
  isInherit: boolean;
}

export interface ChipStatusProps {
  status: "active" | "inactive" | "suspended";
  className?: string;
  props?: any;
}

export interface GroupedPermission {
  parent: PermissionItem | null;
  children: (PermissionItem & { checked: boolean })[];
  checked: boolean;
  indeterminate: boolean;
}

export interface BreadcrumbItem {
  id: number;
  name: string;
  link: string;
}

interface preferenceOption {
  LW3CODE: string;
  DDCODE: string;
}

export interface UserPreferenceList {
  DDSELT: string;
  LW3CODE: string;
  DDRESET: string;
  optionValueArray: preferenceOption[];
  onChange: (value: string) => void;
  onClickReset: (value: string) => void;
}

export interface MailTrapMessagesResponseTypes {
  MailTrapMessageID: number;
  MailTrapMessageSubject: string;
  MailTrapMessageFromMail: string;
  MailTrapMessageFromName: string;
  MailTrapMessageToMail: string;
  MailTrapMessageToName: string;
  MailTrapMessageSentAt: string;
  MailTrapMessageIsRead: boolean;
}
