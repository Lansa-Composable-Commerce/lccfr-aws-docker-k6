import { register } from "@/app/[locale]/(pages)/(auth)/register/actions";
import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { AxiosError } from "axios";

jest.mock("@/lib/helpers/axiosInstance");

describe("User Registration Actions API", () => {
  describe("Fields Validation", () => {
    test("it should return with a message of 'Please fill in all required fields.' if there's a missing required fields.", async () => {
      const mockPayload = {
        Company: "Lansa",
        Username: "JD",
        Email: "",
        Password: "Lansa123",
        VerifyPassword: "Lansa123",
        FirstName: "John",
        LastName: "Doe",
        Code: "EMA",
        Address1: "Address1",
        Address2: "Address2",
        City: "Los Angeles",
        State: "CA",
        PostalCode: "90210",
        Country: "USA",
        WorkPhone: "123456789",
        Fax: "0987654321",
      };

      const result = await register(mockPayload);

      expect(result).toEqual({
        success: false,
        message: "Please fill in all required fields.",
      });
    });

    test("it should return with a message of 'Passwords do not match.' if the Password and Verify Password fields doesn't match.", async () => {
      const mockPayload = {
        Company: "Lansa",
        Username: "JD",
        Email: "john.doe@lansa.com",
        Password: "Lansa13",
        VerifyPassword: "Lansa12",
        FirstName: "John",
        LastName: "Doe",
        Code: "EMA",
        Address1: "Address1",
        Address2: "Address2",
        City: "Los Angeles",
        State: "CA",
        PostalCode: "90210",
        Country: "USA",
        WorkPhone: "123456789",
        Fax: "0987654321",
      };

      const result = await register(mockPayload);

      expect(result).toEqual({
        success: false,
        message: "Passwords do not match.",
      });
    });
  });

  describe("Register API Call", () => {
    const mockAxiosInstance = axiosInstance as jest.Mock;

    beforeEach(() => {
      mockAxiosInstance.mockReset();
    });

    const mockPayload = {
      Company: "Lansa",
      Username: "TESTRG123",
      Email: "rigor.gumera@lansa.com",
      Password: "Lansa123",
      VerifyPassword: "Lansa123",
      FirstName: "Rigor",
      LastName: "Gumera",
      Code: "EMA",
      Address1: "Address1",
      Address2: "Address2",
      City: "Los Angeles",
      State: "CA",
      PostalCode: "90210",
      Country: "USA",
      WorkPhone: "123456789",
      Fax: "987654321",
    };

    test("it should return success type of response if the API is success", async () => {
      const mockResult = {
        status: 200,
        data: {
          messages: [
            {
              code: "MsgRegistrationSuccessful",
              message: "Your registration is successfully",
              type: "success",
              field: "",
              detail: "Registration successful",
              substitution: [],
            },
          ],
        },
      };

      mockAxiosInstance.mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResult),
      });

      const result = await register(mockPayload);

      expect(mockAxiosInstance().post).toHaveBeenCalledWith(API.REGISTER, {
        ...mockPayload,
      });

      expect(result).toEqual({
        statusCode: 200,
        data: mockResult.data,
      });
    });

    test("it should log and return the error if there's a duplicated user coming from server.", async () => {
      const mockErrorResponse = {
        status: 400,
        data: {
          messages: [
            {
              code: "MsgUsernameShouldBeUnique",
              message: "Username should be unique",
              type: "error",
              field: "LW3WEBUSR",
              detail: "",
              substitutions: [],
            },
          ],
        },
      };

      const mockError = new AxiosError("Failed on user registration:");
      mockError.response = mockErrorResponse as any;

      mockAxiosInstance.mockReturnValue({
        post: jest.fn().mockRejectedValue(mockError),
      });

      console.error = jest.fn();
      const result = await register(mockPayload);

      expect(result).toEqual({
        statusCode: 400,
        data: mockErrorResponse.data,
      });

      expect(console.error).toHaveBeenCalledWith(
        "Failed on user registration:",
        mockErrorResponse.data,
      );
    });

    test("it should handle non axios errors and log to console", async () => {
      const mockError = new Error("Unexpected Error");
      mockAxiosInstance.mockReturnValue({
        post: jest.fn().mockRejectedValue(mockError),
      });

      console.error = jest.fn();
      await register(mockPayload);

      expect(console.error).toHaveBeenCalledWith(
        "An error occurred on user registration.",
        mockError,
      );
    });
  });
});
