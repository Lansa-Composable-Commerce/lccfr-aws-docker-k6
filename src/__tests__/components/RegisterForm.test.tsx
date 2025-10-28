import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import RegisterForm from "@/components/RegisterForm";
import { NextIntlClientProvider } from "next-intl";
import { transform } from "@/utils";
import { userEvent } from "@testing-library/user-event";
import StoreProvider from "@/app/[locale]/StoreProvider";

type MockPropTypeImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

jest.mock("next/image", () => {
  const MockImage = ({ src, alt, width, height }: MockPropTypeImage) => {
    return <img src={src} alt={alt} width={width} height={height} />;
  };

  MockImage.displayName = "MockNextImage";

  return MockImage;
});

jest.mock("react-hook-form", () => ({
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: jest.fn(),
    control: jest.fn(),
    setValue: jest.fn(),
    formState: {
      errors: {
        companyName: { message: "Company name is required" },
        userId: { message: "User ID is required" },
        email: { message: "Email is required" },
        password: { message: "Password is required" },
        confirmPassword: { message: "Confirm Password is required" },
        firstName: { message: "First Name is required" },
        lastName: { message: "Last Name is required" },
        referral: { message: "Please select a referral" },
        addressLine1: { message: "Address 1 is required" },
        country: { message: "Please select a country" },
        state: { message: "Please select a state" },
        city: { message: "City is required" },
        postalCode: { message: "Zip / Postal Code is required" },
        workPhone: { message: "Work Phone is required" },
      },
    },
  }),
  Controller: jest.fn(({ render }) => render({ field: {} })),
}));

const renderRegisterForm = async (locale: string) => {
  const messages = transform(
    (await import(`../../../messages/${locale}.json`)).default,
  );

  render(
    <StoreProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <RegisterForm countries={[]} referrals={[]} />
      </NextIntlClientProvider>
    </StoreProvider>,
  );
};

const inputFields = [
  {
    label: "Company Name",
    placeholder: "Enter your company name",
    inputValue: "LANSA Inc.",
    type: "text",
  },
  {
    label: "User ID",
    placeholder: "Enter your ID",
    inputValue: "001",
    type: "text",
  },
  {
    label: "Email Address",
    placeholder: "EX: email@test.com",
    inputValue: "john.doe@lansa.com",
    type: "email",
  },
  {
    label: "First Name",
    placeholder: "Enter your first name",
    inputValue: "John",
    type: "text",
  },
  {
    label: "Last Name",
    placeholder: "Enter your last name",
    inputValue: "Doe",
    type: "text",
  },
  {
    label: "Address Line 1",
    placeholder: "Enter your address line",
    inputValue: "B123 L4",
    type: "text",
  },
  {
    label: "Address Line 2",
    placeholder: "Enter your address line",
    inputValue: "B567 L8",
    type: "text",
  },
  {
    label: "City",
    placeholder: "Enter your city",
    inputValue: "Los Angeles",
    type: "text",
  },
  {
    label: "Zip / Postal Code",
    placeholder: "Enter your zip / postal code",
    inputValue: "4000",
    type: "text",
  },
  {
    label: "Work Phone",
    placeholder: "Enter your work phone number",
    inputValue: "+6397842153",
    type: "text",
  },
  {
    label: "Fax",
    placeholder: "Enter your fax number",
    inputValue: "+6397842153",
    type: "text",
  },
];

describe("Register Form", () => {
  test("it should render the application logo.", async () => {
    await renderRegisterForm("en");

    const logo = screen.getByAltText(/logo/i);

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/Logo.png");
    expect(logo).toHaveAttribute("width", "158");
    expect(logo).toHaveAttribute("height", "78");
  });

  test("it should render the title of the form.", async () => {
    await renderRegisterForm("en");

    const mockMainTitle = "Create an Account";

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(mockMainTitle);
  });

  test("it should render the create account button", async () => {
    await renderRegisterForm("en");

    const mockLabel = "Create My Account";

    const submitButton = screen.getByRole("button", {
      name: /Create My Account/i,
    });

    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent(mockLabel);
  });

  test("it should render the message asking if the user has an account", async () => {
    await renderRegisterForm("en");

    const mockMessage = "Already have an account?";

    const heading = screen.getByRole("heading", { name: mockMessage });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(mockMessage);
  });

  test("it should render the link to login page", async () => {
    await renderRegisterForm("en");

    const heading = screen.getByRole("heading", { name: "Login" });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Login");
  });

  describe("Register Form Fields", () => {
    test("it should render the register form", async () => {
      await renderRegisterForm("en");

      const registerForm = screen.getByRole("form");

      expect(registerForm).toBeInTheDocument();
    });

    test("it should render the title for 'User Details'", async () => {
      await renderRegisterForm("en");

      const mockUserDetailsTitle = "User Details";

      const heading = screen.getByRole("heading", { name: /User Details/i });

      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(mockUserDetailsTitle);
    });

    test("it should render the title for 'Location Details'", async () => {
      await renderRegisterForm("en");

      const mockUserDetailsTitle = "Location Details";

      const heading = screen.getByRole("heading", {
        name: /Location Details/i,
      });

      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(mockUserDetailsTitle);
    });

    inputFields.forEach(({ label, placeholder, inputValue, type }) => {
      test(`it should render the ${label} label and input field`, async () => {
        await renderRegisterForm("en");

        const labelElement = screen.getByText(label);
        const inputElement = screen.getByLabelText(new RegExp(label, "i"));

        expect(labelElement).toBeInTheDocument();
        expect(labelElement).toHaveTextContent(label);

        expect(inputElement).toHaveAttribute("type", type);
        expect(inputElement).toHaveAttribute("placeholder", placeholder);
        expect(inputElement).toHaveValue("");

        await userEvent.type(inputElement, inputValue);
        expect(inputElement).toHaveValue(inputValue);
      });
    });

    describe("Password and Confirm Password Fields", () => {
      const renderField = async (
        mockLabel: string,
        mockInputValue: string,
        mockIconTestId: string,
      ) => {
        const label = screen.getByText(mockLabel);
        const input = screen.getByLabelText(mockLabel);
        const visibilityIconOff = screen.getByTestId(mockIconTestId);

        expect(label).toBeInTheDocument();
        expect(label).toHaveTextContent(mockLabel);
        expect(visibilityIconOff).toBeInTheDocument();

        expect(input).toHaveAttribute("type", "password");
        expect(input).toHaveAttribute("placeholder", "********");
        expect(input).toHaveValue("");

        await userEvent.type(input, mockInputValue);
        expect(input).toHaveValue(mockInputValue);
      };

      test("it should render the password label, input and visibility icon 'off'", async () => {
        await renderRegisterForm("en");
        await renderField("Password", "Password123", "password-visibility-off");
      });

      test("it should render the confirm password label, input and visibility icon 'off'", async () => {
        await renderRegisterForm("en");
        await renderField(
          "Confirm Password",
          "Password123",
          "confirm-password-visibility-off",
        );
      });

      test("it should toggle the password visibility when the icon is clicked.", async () => {
        await renderRegisterForm("en");

        const input = screen.getByLabelText("Password");
        const visibilityIconOff = screen.getByTestId("password-visibility-off");

        expect(input).toHaveAttribute("type", "password");
        expect(visibilityIconOff).toBeInTheDocument();

        await userEvent.click(visibilityIconOff);

        const visibilityIconOn = screen.getByTestId("password-visibility-on");

        await waitFor(() => expect(input).toHaveAttribute("type", "text"));
        await waitFor(() => expect(visibilityIconOn).toBeInTheDocument());
        await waitFor(() => expect(visibilityIconOff).not.toBeInTheDocument());

        await userEvent.click(visibilityIconOn);

        await waitFor(() => expect(input).toHaveAttribute("type", "password"));
        expect(
          screen.getByTestId("password-visibility-off"),
        ).toBeInTheDocument();
        await waitFor(() => expect(visibilityIconOn).not.toBeInTheDocument());
      });

      test("it should toggle the confirm password visibility when the icon is clicked.", async () => {
        await renderRegisterForm("en");

        const input = screen.getByLabelText("Confirm Password");
        const visibilityIconOff = screen.getByTestId(
          "confirm-password-visibility-off",
        );

        expect(input).toHaveAttribute("type", "password");
        expect(visibilityIconOff).toBeInTheDocument();

        await userEvent.click(visibilityIconOff);

        const visibilityIconOn = screen.getByTestId(
          "confirm-password-visibility-on",
        );

        await waitFor(() => expect(input).toHaveAttribute("type", "text"));
        await waitFor(() => expect(visibilityIconOn).toBeInTheDocument());
        await waitFor(() => expect(visibilityIconOff).not.toBeInTheDocument());

        await userEvent.click(visibilityIconOn);

        await waitFor(() => expect(input).toHaveAttribute("type", "password"));
        expect(
          screen.getByTestId("confirm-password-visibility-off"),
        ).toBeInTheDocument();
        await waitFor(() => expect(visibilityIconOn).not.toBeInTheDocument());
      });
    });
  });

  describe("Register Form Validations", () => {
    test("it should render the required validation error", async () => {
      await renderRegisterForm("en");

      const reqCompanyName = /Company name is required/i;
      const reqUserId = /User ID is required/i;
      const reqEmail = /Email is required/i;
      const reqPassword = "Password is required*";
      const reqConfirmPassword = "Confirm Password is required*";
      const reqFirstName = /First Name is required/i;
      const reqLastName = /Last Name is required/i;
      const reqAddressLine1 = /Address 1 is required/i;
      const reqCity = /City is required/i;
      const reqPostalCode = /Zip \/ Postal Code is required/i;
      const reqWorkPhone = /Work Phone is required/i;
      const reqCountry = /Please select a country/i;
      const reqState = /Please select a state/i;

      const form = screen.getByRole("form");

      fireEvent.submit(form);

      await Promise.all([
        waitFor(() =>
          expect(screen.getByText(reqCompanyName)).toBeInTheDocument(),
        ),
        waitFor(() => expect(screen.getByText(reqUserId)).toBeInTheDocument()),
        waitFor(() => expect(screen.getByText(reqEmail)).toBeInTheDocument()),
        waitFor(() =>
          expect(screen.getByText(reqPassword)).toBeInTheDocument(),
        ),
        waitFor(() =>
          expect(screen.getByText(reqConfirmPassword)).toBeInTheDocument(),
        ),
        waitFor(() =>
          expect(screen.getByText(reqFirstName)).toBeInTheDocument(),
        ),
        waitFor(() =>
          expect(screen.getByText(reqLastName)).toBeInTheDocument(),
        ),
        waitFor(() =>
          expect(screen.getByText(reqAddressLine1)).toBeInTheDocument(),
        ),
        waitFor(() => expect(screen.getByText(reqCity)).toBeInTheDocument()),
        waitFor(() =>
          expect(screen.getByText(reqPostalCode)).toBeInTheDocument(),
        ),
        waitFor(() =>
          expect(screen.getByText(reqWorkPhone)).toBeInTheDocument(),
        ),
        waitFor(() => expect(screen.getByText(reqCountry)).toBeInTheDocument()),
        waitFor(() => expect(screen.getByText(reqState)).toBeInTheDocument()),
      ]);
    });
  });
});
