import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import HTMLParserOptions from "@/components/HTMLParserOptions";

export default function HTMLServerParser({ content }: { content: string }) {
  const sanitizedContent = DOMPurify.sanitize(content);
  const options = HTMLParserOptions();

  return <>{parse(sanitizedContent, options)}</>;
}
