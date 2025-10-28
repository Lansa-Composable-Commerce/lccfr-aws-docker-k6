import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { showToast } from "@/components/globalUI/CustomToast";
import { useAppDispatch } from "@/lib/hooks";
import { removeSuccessMessage } from "@/lib/features/products/productsSlice";
import { Messages } from "@/types";

export const useDisplayToastMessage = ({
  status,
  messages,
}: {
  status?: any;
  messages: Messages[] | undefined | null;
}) => {
  const dispatch = useAppDispatch();
  const tValidation = useTranslations("Validation");

  const [messagesDisplayed, setMessagesDisplayed] = useState(0);

  useEffect(() => {
    if (messages && Array.isArray(messages)) {
      messages.forEach((message) => {
        let finalMessage = tValidation(message.code);

        finalMessage = finalMessage.replace(/\\"/g, "");

        if (message.substitutions) {
          const placeholderRegex = /&(\d+)/g;

          finalMessage = finalMessage.replace(
            placeholderRegex,
            (match, placeholderNumber) => {
              const index = parseInt(placeholderNumber, 10) - 1;

              if (Array.isArray(message.substitutions)) {
                return message.substitutions[index] || match;
              } else if (typeof message.substitutions === "string") {
                return message.substitutions || match;
              }

              return match;
            },
          );
        }

        showToast(status || message?.type, finalMessage);
        setMessagesDisplayed((prevCount) => prevCount + 1);
      });
    }
  }, [messages, tValidation, status]);

  useEffect(() => {
    if (messages && messagesDisplayed === messages.length) {
      setTimeout(() => {
        dispatch(removeSuccessMessage());
        setMessagesDisplayed(0);
      }, 0);
    }
  }, [messages, messagesDisplayed, dispatch]);
};
