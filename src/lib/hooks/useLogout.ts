import { useRouter } from "@/i18n/routing";
import { useAppDispatch } from "@/lib/hooks";
import { useLogoutMutation } from "@/services/authApi";
import { clearRecentlyView } from "@/lib/features/recentlyViewedProducts/recentlyViewedProductsSlice";
import { setRemoveQuickShopItems } from "@/lib/features/quickShop/quickShopSlice";
import {
  clearTokens,
  clearUserInformation,
} from "@/lib/features/auth/authSlice";
import { resetCheckout } from "@/lib/features/checkout/checkoutSlice";
import { resetCart } from "@/lib/features/cart/cartSlice";
import { clearUserPreferences } from "@/lib/features/userPreferences/userPreferencesSlice";

export default function useLogout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();

  return async () => {
    try {
      const response = await logout({});

      if (response.data.success) {
        dispatch(clearRecentlyView());
        dispatch(setRemoveQuickShopItems());
        dispatch(clearTokens());
        dispatch(clearUserInformation());
        dispatch(resetCart());
        dispatch(resetCheckout());
        dispatch(clearUserPreferences());

        router.replace("/login");
        router.refresh();
      } else {
        console.error("Failed on logout");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
}
