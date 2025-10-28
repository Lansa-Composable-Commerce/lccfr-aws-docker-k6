"use client";

import { ReactNode, useId, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { SfButton, SfModal } from "@storefront-ui/react";
import classNames from "classnames";

import { SvgXMark } from "@/assets/svg";

export type ModalProps = {
  title?: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  close?: () => void;
  className?: string;
  props?: any;
  style?: any;
};

export default function Modal({
  title,
  children,
  isOpen,
  close,
  className,
  style,
  props,
}: ModalProps) {
  const headingId = useId();
  const descriptionId = useId();
  const modalRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Backdrop */}
      <CSSTransition
        in={isOpen}
        nodeRef={backdropRef}
        timeout={200}
        unmountOnExit
        classNames={{
          enter: "opacity-0",
          enterDone: "opacity-100 transition duration-200 ease-out",
          exitActive: "opacity-0 transition duration-200 ease-out",
        }}
      >
        <div
          ref={backdropRef}
          className="fixed inset-0 bg-black bg-opacity-60 z-20"
        />
      </CSSTransition>

      {/* Modal */}
      <CSSTransition
        in={isOpen}
        nodeRef={modalRef}
        timeout={200}
        unmountOnExit
        classNames={{
          enter: "translate-y-10 opacity-0",
          enterDone:
            "translate-y-0 opacity-100 transition duration-200 ease-out",
          exitActive:
            "translate-y-10 opacity-0 transition duration-200 ease-out",
        }}
      >
        <SfModal
          open
          onClose={close}
          ref={modalRef}
          as="section"
          role="alertdialog"
          aria-labelledby={headingId}
          aria-describedby={descriptionId}
          className={classNames("my-24 rounded-large h-fit", className)}
          style={style}
          {...props}
        >
          {title && (
            <header>
              <SfButton
                square
                variant="tertiary"
                className="absolute right-2 top-2"
                onClick={close}
                aria-label="Close"
                title="close"
              >
                <SvgXMark />
              </SfButton>
              <span
                id={headingId}
                className="font-bold typography-headline-4 md:typography-headline-3"
              >
                {title}
              </span>
            </header>
          )}

          <p id={descriptionId} className="mt-3">
            {children}
          </p>
        </SfModal>
      </CSSTransition>
    </>
  );
}
