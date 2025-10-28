import { ReactNode, Suspense } from "react";

import SkeletonFooter from "@/components/loading/SkeletonFooter";
import Footer from "@/components/Footer";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <Suspense fallback={<SkeletonFooter />}>
        <Footer />
      </Suspense>
    </>
  );
}
