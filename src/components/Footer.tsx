import { getFooter } from "@/api/contents/getFooter";
import HTMLServerParser from "@/components/HTMLServerParser";

export default async function Footer() {
  const footer = await getFooter();

  if (!footer) {
    return <>Failed to fetch footer.</>;
  }

  return <HTMLServerParser content={footer.LW3CNTSTR} />;
}
