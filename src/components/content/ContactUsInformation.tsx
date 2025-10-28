import { getContactUs } from "@/api/contents/getContactUs";
import React from "react";
import HTMLServerParser from "@/components/HTMLServerParser";

export default async function ContactUsInformation() {
  const contactUsContent = await getContactUs();

  if (!contactUsContent) {
    return <>Failed to fetch contact information.</>;
  }

  return <HTMLServerParser content={contactUsContent.LW3CNTSTR} />;
}
