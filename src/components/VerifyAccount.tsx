"use client";

import { Message } from "@/types";
import { useRouter } from "@/i18n/routing";
import { useEffect, useState } from "react";
import Spinner from "@/components/loading/Spinner";
import Logo from "@/components/Logo";
import { useAppDispatch } from "@/lib/hooks";
import { setVerifyAccount } from "@/lib/features/auth/authSlice";
import { useTranslations } from "next-intl";

type Response = {
  status: number;
  data: { messages: Message[] };
};

type VerifyAccountPropType = {
  response: Response;
};

export function VerifyAccount({ response }: VerifyAccountPropType) {
  const tValidation = useTranslations("Validation");
  const tGlobal = useTranslations("Global");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!response) return;

    const isSuccess = response.status === 200;

    dispatch(
      setVerifyAccount({
        isSuccess,
        code: response.data.messages[0].code,
      }),
    );

    if (isSuccess) {
      router.replace("/login");
    }

    setTimeout(() => setIsVerifying(false), 1000);
  }, [response]);

  return (
    <div>
      {isVerifying ? (
        <Spinner />
      ) : (
        <section className="border border-white02 rounded-xl px-4 lg:px-20 py-6 w-[637px] shadow-sm">
          <div className="flex justify-center items-center w-full">
            <Logo />
          </div>
          <div className="my-2 space-y-2">
            <p className="text-center text-2xl">
              {tGlobal("VerificationFailed")}
            </p>
            <p className="text-center">
              {tValidation(response.data?.messages[0].code)}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
