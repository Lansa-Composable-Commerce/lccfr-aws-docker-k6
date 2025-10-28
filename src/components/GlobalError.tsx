"use client";

import { ReactNode } from "react";

type GlobalErrorPropType = {
  title: string;
  children: ReactNode;
};

export default function GlobalError({ title, children }: GlobalErrorPropType) {
  return (
    <section className="w-full h-[70vh] flex flex-col justify-center items-center">
      <h1 className="text-xl font-medium my-4 md:text-2xl lg:text-4xl">
        {title}
      </h1>
      {children}
    </section>
  );
}
