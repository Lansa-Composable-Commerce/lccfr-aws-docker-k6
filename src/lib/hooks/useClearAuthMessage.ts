import { useCallback } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { clearAuthMessages } from "@/lib/features/auth/authSlice";

export function useClearAuthMessage(delay: number = 1000) {
  const dispatch = useAppDispatch();

  return useCallback(() => {
    setTimeout(() => dispatch(clearAuthMessages()), delay);
  }, [dispatch, delay]);
}
