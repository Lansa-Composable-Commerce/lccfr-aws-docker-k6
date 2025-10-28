import React from "react";
import type { Metadata } from "next";

import LoginContainer from "@/components/LoginContainer";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your account to access exclusive content.",
};

const LoginPage = () => {
  return (
    <section className="container mx-auto px-4 w-full">
      <LoginContainer />
    </section>
  );
};

export default LoginPage;
