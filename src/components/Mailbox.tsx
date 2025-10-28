"use client";

import classNames from "classnames";
import { formatDistanceToNow } from "date-fns";
import type { Locale } from "date-fns";
import { enUS, fr, de, es } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import SpinnerLoading from "@/components/globalUI/SpinnerLoading";

import {
  getMailTrapMessage,
  getMailTrapMessageById,
  getMailTrapMessages,
  selectMailData,
} from "@/lib/features/mail/mailSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { MailTrapMessagesResponseTypes } from "@/types";
import { SvgArrowLeft, SvgEnvelope, SvgEnvelopeOpen } from "@/assets/svg";
import { useLocale, useTranslations } from "next-intl";

const Mailbox = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const t: any = useTranslations("Mailbox");
  const locale = useLocale();

  const dateFnsLocales: { [key: string]: Locale } = {
    en: enUS,
    fr: fr,
    de: de,
    es: es,
  };

  const {
    isLoading,
    isLoadingMessageBody,
    listMessages: messagesList,
    mailMessage: selectedMessageData,
    messageDataByID: selectedMessageMeta,
  } = useAppSelector(selectMailData);

  const [decodedHTMLContent, setDecodedHTMLContent] = useState<string>("");
  const [selectedMessageID, setSelectedMessageID] = useState<number | null>(
    null,
  );
  const [isMessagePanelOpen, setIsMessagePanelOpen] = useState(false);

  const decodeBase64 = (base64String: string) => atob(base64String);

  useEffect(() => {
    dispatch(getMailTrapMessages());
  }, [dispatch]);

  useEffect(() => {
    const messageIDFromUrl = Number(searchParams.get("messageId"));
    if (messageIDFromUrl) {
      setSelectedMessageID(messageIDFromUrl);
      setIsMessagePanelOpen(true);
      dispatch(getMailTrapMessageById(messageIDFromUrl));
      dispatch(getMailTrapMessage(messageIDFromUrl));
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (selectedMessageData && selectedMessageData.MailTrapHTMLMessageFile) {
      const htmlContent = decodeBase64(
        selectedMessageData.MailTrapHTMLMessageFile,
      );
      setDecodedHTMLContent(htmlContent);
    }
  }, [selectedMessageData]);

  const handleViewMessage = (id: number) => {
    setSelectedMessageID(id);
    setIsMessagePanelOpen(true);
    router.push(`?messageId=${id}`);
    dispatch(getMailTrapMessageById(id));
    dispatch(getMailTrapMessage(id));
  };

  const handleBackToList = () => {
    setIsMessagePanelOpen(false);
    setSelectedMessageID(null);
    router.push(`${window.location.pathname}`);
  };

  return (
    <div className="pt-5 pb-10 flex flex-col lg:flex-row">
      {/* Left Sidebar */}
      <div
        className={classNames(
          "w-full max-w-full lg:max-w-[415px] lg:border-b lg:border-l lg:border-t py-2 rounded-tl-xl rounded-bl-xl",
          isMessagePanelOpen ? "hidden lg:block" : "lg:block",
        )}
      >
        {isLoading ? (
          <div className="min-h-20 flex items-center justify-center">
            <SpinnerLoading />
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto h-screen">
            {messagesList.length <= 0 ? (
              <div className="text-center py-4 text-gray-500">No messages</div>
            ) : (
              messagesList.map((message: MailTrapMessagesResponseTypes) => (
                <div
                  key={message.MailTrapMessageID}
                  className={classNames(
                    "border-b px-0 lg:px-4 py-2 hover:bg-gray-100 dark:hover:bg-light-dark cursor-pointer",
                    selectedMessageID === message.MailTrapMessageID
                      ? "bg-gray-100 dark:bg-light-dark"
                      : "",
                  )}
                  onClick={() => handleViewMessage(message.MailTrapMessageID)}
                >
                  <div className="flex items-center gap-3">
                    {message?.MailTrapMessageIsRead ? (
                      <SvgEnvelopeOpen />
                    ) : (
                      <SvgEnvelope />
                    )}
                    <div className="w-full flex flex-col gap-2">
                      <div
                        className={classNames(
                          "text-sm text-gray-900 dark:text-gray-200 line-clamp-1",
                          message?.MailTrapMessageIsRead
                            ? "font-normal"
                            : "font-semibold",
                        )}
                      >
                        {message.MailTrapMessageSubject}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {t("To")}: {`<${message.MailTrapMessageToMail}>`}
                        </span>
                        <span>
                          {formatDistanceToNow(
                            new Date(message.MailTrapMessageSentAt),
                            {
                              includeSeconds: true,
                              locale: dateFnsLocales[locale] || enUS,
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div
        className={classNames(
          "lg:border flex-1 lg:flex-3 w-full lg:px-4 py-4 lg:py-4 lg:rounded-tr-xl lg:rounded-br-xl",
          !isMessagePanelOpen ? "hidden lg:block" : "lg:block",
        )}
      >
        {isLoadingMessageBody ? (
          <div className="min-h-20 flex items-center justify-center">
            <SpinnerLoading />
          </div>
        ) : (
          <>
            {selectedMessageData?.MailTrapHTMLMessageFile ? (
              <>
                <div className="flex items-center gap-3 lg:gap-0">
                  <SvgArrowLeft
                    className="lg:hidden size-6"
                    onClick={handleBackToList}
                  />
                  <div className="text-lg font-semibold text-gray-900 lg:mb-4 dark:text-gray-200 line-clamp-2">
                    {selectedMessageMeta?.MailTrapMessageSubject}
                  </div>
                </div>
                <div className="mb-5 lg:mb-0 flex flex-col lg:flex-row items-start justify-between text-xs lg:text-sm text-gray-500">
                  <div className="flex flex-col mb-4 gap-1 lg:gap-0 pt-2 lg:pt-2">
                    <div className="flex flex-row lg:items-center gap-2">
                      <span className="text-gray-900 dark:text-gray-400">
                        {t("From")}:
                      </span>
                      <div>
                        {selectedMessageMeta.MailTrapMessageFromName}
                        <span>{`<${selectedMessageMeta.MailTrapMessageFromMail}>`}</span>
                      </div>
                    </div>
                    <div className="flex flex-row lg:items-center gap-2">
                      <span className="text-gray-900 dark:text-gray-400">
                        {t("To")}:
                      </span>
                      <div>
                        {selectedMessageMeta.MailTrapMessageToName}
                        <span>{`<${selectedMessageMeta.MailTrapMessageToMail}>`}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {new Date(
                      selectedMessageMeta.MailTrapMessageSentAt,
                    ).toLocaleString()}
                  </div>
                </div>
                <div
                  className="border rounded-md p-2"
                  dangerouslySetInnerHTML={{ __html: decodedHTMLContent }}
                />
              </>
            ) : (
              <div className="text-center py-4 text-gray-500">
                {t("SctMssgeView")}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Mailbox;
