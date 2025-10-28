"use client";

import { useEffect, useMemo, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import HTMLParserOptions from "@/components/HTMLParserOptions";
import parse, { domToReact } from "html-react-parser";
import Swiper from "@/components/globalUI/Swiper";
import { SwiperSlide } from "swiper/react";

export default function HTMLClientParser({ content }: { content: string }) {
  const [sanitizedContent, setSanitizedContent] = useState("");

  useEffect(() => {
    const cleanContent = DOMPurify.sanitize(content);

    setSanitizedContent(cleanContent);
  }, [content]);

  const extendedOptions = useMemo(() => {
    const baseOptions = HTMLParserOptions();

    const extendedOptions = {
      ...baseOptions,
      replace: (domNode: any) => {
        const { attribs = {}, children } = domNode;

        if (attribs.id === "carousel") {
          return <Swiper>{domToReact(children, extendedOptions)}</Swiper>;
        }

        if (attribs.id === "carousel-slider") {
          return (
            <SwiperSlide>{domToReact(children, extendedOptions)}</SwiperSlide>
          );
        }

        return null;
      },
    };

    return extendedOptions;
  }, []);

  return <>{parse(sanitizedContent, extendedOptions)}</>;
}
