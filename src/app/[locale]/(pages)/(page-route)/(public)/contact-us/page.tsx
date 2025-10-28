import { Suspense } from "react";
import { Metadata } from "next";
import ContactUsForm from "@/components/ContactUsForm";
import { getTopics } from "@/api/contactUs/getTopics";
import ContactUsInformation from "@/components/content/ContactUsInformation";
import { LocalePropsType } from "@/types";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: LocalePropsType): Promise<Metadata> {
  const locale = params.locale;

  const t = await getTranslations({ locale, namespace: "ContactUs" });

  return {
    title: `${t("ContactUs")}`,
    description: `${t("ContactUs")}`,
  };
}

export default async function ContactUsPage() {
  const topics = await getTopics();

  const transformTopics = topics?.topic.map((topic) => {
    return {
      label: topic.emailName,
      value: topic.emailAddress,
    };
  });

  return (
    <div className="page flex flex-col gap-8 p-8 lg:p-20 lg:flex-row">
      <Suspense fallback={<>Loading...</>}>
        <ContactUsInformation />
      </Suspense>
      <ContactUsForm topics={transformTopics || []} />
    </div>
  );
}
