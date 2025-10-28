import { UserRegisterInput, UserRegisterRequest } from "@/types";

export const mapRegisterInputToRequest = (
  input: UserRegisterInput,
): UserRegisterRequest => {
  const mapping: Record<string, string> = {
    companyName: "Company",
    userId: "Username",
    email: "Email",
    password: "Password",
    confirmPassword: "VerifyPassword",
    firstName: "FirstName",
    lastName: "LastName",
    referral: "Code",
    addressLine1: "Address1",
    addressLine2: "Address2",
    city: "City",
    state: "State",
    postalCode: "PostalCode",
    country: "Country",
    workPhone: "WorkPhone",
    mobileNumber: "Fax",
  };

  const result = Object.entries(input).reduce(
    (acc, [key, value]) => {
      if (mapping[key]) {
        acc[mapping[key]] = value;
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  return result as unknown as UserRegisterRequest;
};
