import { UserInfo } from "@/types";

// @ts-ignore
export const labels: Record<keyof UserInfo, string> = {
  userEmail: "Email Address",
  firstName: "First Name",
  lastName: "Last Name",
  phoneNumber: "Work Phone",
  faxNumber: "Fax Number",
  address1: "Address 1",
  address2: "Address 2",
  city: "City",
  state: "State",
  zip: "Postal Code",
  country: "Country",
};
