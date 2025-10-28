import Hero from "@/components/Hero";

import { Metadata } from "next";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { LocalePropsType } from "@/types";
import { getTranslations } from "next-intl/server";

const BestSeller = dynamic(() => import("@/components/Products/BestSeller"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const FeaturedItems = dynamic(
  () => import("@/components/Products/FeaturedItems"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

export async function generateMetadata({
  params,
}: LocalePropsType): Promise<Metadata> {
  const locale = params.locale;

  const tHome = await getTranslations({ locale, namespace: "Global" });

  return {
    title: `${tHome("Home")}`,
    description: `${tHome("Home")}`,
  };
}

export default function Home() {
  const tHome = useTranslations("Home");
  return (
    <main className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 pb-10 mt-10">
        <div className="flex flex-col gap-3 justify-center pt-10 pb-10">
          <h1 className="main-title text-center">{tHome("BestSeller")}</h1>
          <BestSeller />
        </div>
        <div className="flex flex-col gap-3 justify-center pt-10 pb-10">
          <h1 className="main-title text-center">{tHome("FeaturedItems")}</h1>
          <FeaturedItems />
        </div>
      </div>
    </main>
  );
}
