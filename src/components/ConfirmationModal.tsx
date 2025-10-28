"use client";

import { SfButton } from "@storefront-ui/react";
import { SvgXMark } from "@/assets/svg";
import Modal from "@/components/globalUI/Modal";
import React from "react";
import Button from "@/components/globalUI/Button";
import Spinner from "@/components/loading/Spinner";

type ConfirmationModalPropType = {
  isOpen: boolean;
  isLoading: boolean;
  close(): void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onConfirm(): void;
};

export default function ConfirmationModal({
  isOpen,
  close,
  isLoading,
  title = "Title",
  description = "Description",
  confirmText = "Yes",
  cancelText = "Cancel",
  onConfirm,
}: ConfirmationModalPropType) {
  return (
    <Modal isOpen={isOpen} close={close} className="z-50 max-w-lg p-8">
      <header>
        <SvgXMark
          className="absolute right-4 top-4 hover:text-primary-700 cursor-pointer size-7"
          onClick={close}
        />
        <h3 id="checkout-modal-title" className="font-semibold text-xl">
          {title}
        </h3>
      </header>
      <section id="checkout-modal-body" className="my-2 text-sm">
        {description}
      </section>
      <footer className="py-2 flex gap-2 justify-end">
        <Button
          variant="primary"
          className="min-w-fit"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner className="w-4 h-4 fill-primary-700" />
          ) : (
            confirmText
          )}
        </Button>
        <Button variant="secondary" onClick={close} disabled={isLoading}>
          {cancelText}
        </Button>
      </footer>
    </Modal>
  );
}
