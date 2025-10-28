import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useMemo } from "react";
import { getENV } from "@/utils/env";
import { decrypt } from "@/utils/crypto";
import { setTokens } from "@/lib/features/auth/authSlice";

export default function useGetTokens(cookieValue?: string) {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const secretKey = await getENV("SECRET_KEY_ACCESS_TOKEN");

        if (secretKey && cookieValue) {
          const decryptedAccessToken = decrypt(cookieValue, secretKey);

          if (decryptedAccessToken !== accessToken) {
            dispatch(
              setTokens({
                accessToken: decryptedAccessToken,
              }),
            );
          }
        }
      } catch (error) {
        console.error("Failed to get tokens:", error);
      }
    };

    if (!cookieValue) {
      dispatch(
        setTokens({
          accessToken: null,
        }),
      );
    } else if (!accessToken) {
      fetchAccessToken().catch((err) => err);
    }
  }, [cookieValue]);

  return useMemo(() => accessToken, [accessToken]);
}
