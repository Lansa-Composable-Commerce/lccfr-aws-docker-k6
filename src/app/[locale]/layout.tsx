import { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "../../assets/css/globals.css";

import GoogleAnalyticsWrapper from "@/components/GoogleAnalyticsWrapper";

import StoreProvider from "@/app/[locale]/StoreProvider";

type Props = {
  params: { locale: string };
};

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale;

  const tGlobal = await getTranslations({ locale, namespace: "Global" });

  return {
    title: {
      template: `${tGlobal("StoreFront")} - %s`,
      default: `${tGlobal("StoreFront")}`,
    },
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="light"
        >
          <StoreProvider>
            <NextIntlClientProvider messages={messages}>
              <div className="relative min-h-screen">{children}</div>
              <Toaster position="bottom-right" reverseOrder={false} />
            </NextIntlClientProvider>
            <GoogleAnalyticsWrapper />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
