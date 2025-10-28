import { domToReact } from "html-react-parser";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export default function HTMLParserOptions() {
  const options = {
    replace: (domNode: any) => {
      const { attribs = {}, children, name } = domNode;

      if (attribs.class) {
        attribs.className = attribs.class;
        delete attribs.class;
      }

      if (name === "a" || attribs.id === "link") {
        return (
          <Link href={attribs.href || "#"} prefetch={false}>
            {domToReact(children, options)}
          </Link>
        );
      }

      if (name === "img") {
        const { src, width, height, alt } = attribs;
        return (
          <Image src={src} alt={alt} width={width} height={height} priority />
        );
      }
    },
  };

  return options;
}
