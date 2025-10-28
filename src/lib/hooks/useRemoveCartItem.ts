import { useState } from "react";
import { useRemoveCartItemMutation } from "@/services/cartApi";
import { useTranslations } from "next-intl";
import { showToast } from "@/components/globalUI/CustomToast";

export default function useRemoveCartItem(refetchCart: Function) {
  const tMessage = useTranslations("Messages");
  const [removeCartItem] = useRemoveCartItemMutation();
  const [loadingItem, setLoadingItem] = useState<number | null>(null);

  const handleRemoveItem = async (column: number) => {
    setLoadingItem(column);

    const response = await removeCartItem(column);

    if (response && response.data) {
      await refetchCart();
      showToast("success", tMessage("MsgCartUpdated"));
    }

    setLoadingItem(null);
  };

  return { loadingItem, handleRemoveItem };
}
