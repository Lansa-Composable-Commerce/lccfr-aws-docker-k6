"use client";

import { SvgAmex, SvgDiscover, SvgMasterCard, SvgVisa } from "@/assets/svg";

export default function PaymentLogo({ provider }: { provider: string }) {
  const getLogo = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "american express":
        return <SvgAmex className="size-12" />;
      case "visa card":
        return <SvgVisa className="size-12" />;
      case "master card":
        return <SvgMasterCard className="size-12" />;
      case "discover":
        return <SvgDiscover className="size-12" />;
    }
  };

  return getLogo(provider);
}
