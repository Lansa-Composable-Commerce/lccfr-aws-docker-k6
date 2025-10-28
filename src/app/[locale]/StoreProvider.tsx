"use client";

import { Provider } from "react-redux";
import { makeStore } from "@/lib/store";
import { ReactNode } from "react";

export default function StoreProvider({ children }: { children: ReactNode }) {
  return <Provider store={makeStore}>{children}</Provider>;
}
