import { useAppDispatch } from "@/lib/hooks";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { showToast } from "@/components/globalUI/CustomToast";
import { Message, setExpirationMessage } from "@/lib/features/cart/cartSlice";

export default function usePromoCodeHandler(
  cartFetched: boolean,
  message: Message | null,
) {
  const tValidation = useTranslations("Validation");
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!cartFetched || !message) return;

    const invalidPromoCodes = [
      "MsgInactivePromo",
      "MsgExpiredPromo",
      "MsgInvalidPromoCode",
    ];

    if (message.code && invalidPromoCodes.includes(message.code)) {
      showToast("error", tValidation(message.code, { code: message.sub }));
      dispatch(setExpirationMessage());
    }
  }, [cartFetched]);
}
