"use server";

import { UserRegisterRequest } from "@/types";
import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { AxiosError } from "axios";
import { API } from "@/utils/constants";

const requiredFields: (keyof UserRegisterRequest)[] = [
  "Company",
  "Username",
  "Email",
  "Password",
  "VerifyPassword",
  "FirstName",
  "LastName",
  "Address1",
  "City",
  "State",
  "PostalCode",
  "Country",
  "WorkPhone",
];

export async function register(payload: UserRegisterRequest) {
  const missingFields = requiredFields.filter(
    (field) => !payload[field] || payload[field].trim() === "",
  );

  if (missingFields.length > 0) {
    return {
      success: false,
      message: "Please fill in all required fields.",
    };
  }

  if (payload.Password !== payload.VerifyPassword) {
    return {
      success: false,
      message: "Passwords do not match.",
    };
  }

  const fax = payload.Fax.length < 4 ? "" : payload.Fax;

  try {
    const axios = axiosInstance();

    const response = await axios.post(API.REGISTER, { ...payload, Fax: fax });

    return {
      statusCode: response.status,
      data: response.data,
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Failed on user registration:", error.response?.data);

      return {
        statusCode: error.response?.status,
        data: error.response?.data,
      };
    } else {
      console.error("An error occurred on user registration.", error);
    }
  }
}
