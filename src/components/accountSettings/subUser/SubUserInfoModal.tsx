import React from "react";

import Modal from "@/components/globalUI/Modal";
import Tabs from "@/components/accountSettings/subUser/Tabs";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectSelectedSubUser,
  selectSubUserInfoModalVisible,
  setSubUserInfoModalVisible,
} from "@/lib/features/subUser/subUserSlice";

import { useTranslations } from "next-intl";

const SubUserInfoModal = () => {
  const tUsrSetting = useTranslations("UsrSetting");

  const dispatch = useAppDispatch();
  const isSubUserModalVisible = useAppSelector(selectSubUserInfoModalVisible);
  const selectedSubUser = useAppSelector(selectSelectedSubUser);

  return (
    <Modal
      isOpen={isSubUserModalVisible}
      close={() => dispatch(setSubUserInfoModalVisible(""))}
      className="mx-3 my-8 lg:mx-auto lg:p-5 z-20 lg:max-w-[50rem] dark:bg-black01"
      // style={{ maxHeight: "calc(100vh - 100px)" }}
      title={
        <>
          {tUsrSetting("SubUser")}{" "}
          <span className="capitalize">{selectedSubUser.subUserId}</span>
        </>
      }
    >
      <Tabs />
    </Modal>
  );
};

export default SubUserInfoModal;
