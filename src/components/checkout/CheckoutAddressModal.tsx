"use client";

import Modal from "@/components/globalUI/Modal";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectCheckoutState,
  setModalOpen,
  setUpdateShippingDetails,
} from "@/lib/features/checkout/checkoutSlice";
import { SfButton } from "@storefront-ui/react";
import { SvgXMark } from "@/assets/svg";
import SfRadio from "@/components/globalUI/Radio";
import React from "react";
import { useTranslations } from "next-intl";

export default function CheckoutAddressModal() {
  const tCheckout = useTranslations("Checkout");

  const { isOpen, shippingAddresses, shippingDetails } =
    useAppSelector(selectCheckoutState);
  const dispatch = useAppDispatch();

  const handleCloseModal = () => {
    dispatch(setModalOpen(false));
  };

  const handleChangeAddress = (address: any) => {
    dispatch(setUpdateShippingDetails(address));
    dispatch(setModalOpen(false));
  };

  return (
    <Modal
      isOpen={isOpen}
      close={handleCloseModal}
      className="z-50 w-full sm:w-[30em] p-8"
    >
      <header>
        <SfButton
          square
          variant="tertiary"
          className="absolute right-2 top-2"
          onClick={handleCloseModal}
        >
          <SvgXMark />
        </SfButton>
        <h3 id="checkout-modal-title" className="font-semibold text-xl">
          {tCheckout("AddressSelection")}
        </h3>
      </header>
      <section
        id="checkout-modal-body"
        className="my-2 max-h-[37em] overflow-y-auto no-scrollbar"
      >
        {shippingAddresses.map((detail: any) => (
          <div
            className="flex gap-2 p-4 border cursor-pointer group"
            key={detail.id}
            onClick={() => handleChangeAddress(detail)}
          >
            <SfRadio
              name={"addresses"}
              checked={shippingDetails.id === detail.id}
              readOnly={true}
            />
            <div className="flex flex-col">
              <span className="text-md font-medium p-0 leading-none group-hover:text-primary-700">
                {detail.contactName}
              </span>
              <span className="text-sm mt-1">{detail.address1}</span>
              <span className="text-sm">{detail.address2}</span>
              <span className="text-sm">{detail.regionDetails}</span>
              <span className="text-sm">{detail.country}</span>
            </div>
          </div>
        ))}
      </section>
    </Modal>
  );
}
