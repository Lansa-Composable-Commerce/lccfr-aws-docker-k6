import Mailbox from "@/components/Mailbox";
import { LocalePropsType } from "@/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: LocalePropsType): Promise<Metadata> {
  const locale = params.locale;

  const tMailbox = await getTranslations({ locale, namespace: "Mailbox" });

  return {
    title: `${tMailbox("Mailbox")}`,
    description: `${tMailbox("Mailbox")}`,
  };
}

export default async function MailboxPage() {
  return (
    <div className="page">
      <Mailbox />
    </div>
  );
}
