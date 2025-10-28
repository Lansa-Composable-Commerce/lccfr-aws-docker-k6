import useGetTokens from "@/lib/hooks/useGetTokens";
import { decodeToken } from "@/lib/auth/verifyToken";
import { useAppDispatch } from "@/lib/hooks";
import { useEffect, useMemo, useState } from "react";
import { setUser, User } from "@/lib/features/auth/authSlice";
import Cookies from "js-cookie";
import { COOKIE_PREFIX } from "@/utils/constants";
import { usePathname } from "@/i18n/routing";

export default function useGetUserInformation(cookieValue?: string) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const accessToken = useGetTokens(cookieValue);

  const result = useMemo(
    () => (accessToken ? decodeToken(accessToken) : null),
    [accessToken],
  );

  const [localUser, setLocalUser] = useState<User | null>(null);

  useEffect(() => {
    if (!result) {
      setLocalUser(null);
      return;
    }

    const { xtras } = result;
    const userData = {
      email: xtras.ceEmail,
      firstname: xtras.ceFirstName,
      lastname: xtras.ceLastName,
      username: xtras.ceUserName,
      customerName: Cookies.get(`${COOKIE_PREFIX}customerName`),
      customerNumber: Cookies.get(`${COOKIE_PREFIX}accNum`),
    };

    setLocalUser(userData);
    dispatch(setUser(userData));
  }, [result, dispatch, pathname]);

  return localUser;
}
