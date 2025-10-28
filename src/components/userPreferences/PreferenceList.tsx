"use client";

import React, { useCallback, useState } from "react";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { SfTooltip } from "@storefront-ui/react";

import Select from "@/components/globalUI/Select";
import Button from "@/components/globalUI/Button";

import { UserPreferenceList } from "@/types";

import { SvgListReset } from "@/assets/svg";
import { updateUserPreferences } from "@/lib/features/userPreferences/userPreferencesSlice";
import { useAppDispatch } from "@/lib/hooks";
import { showToast } from "@/components/globalUI/CustomToast";
import { reFetchUserPreferences } from "@/lib/hooks/reFetchUserPreferences";

const RenderUserPreferenceList = ({
  LW3CODE,
  DDSELT,
  DDRESET,
  optionValueArray,
  onChange,
  onClickReset,
}: UserPreferenceList & { onChange: (value: string) => void } & {
  onClickReset: (resetValue: string) => void;
}) => {
  const t = useTranslations("UsrPrefrnc");
  return (
    <div
      className={classNames(
        "relative mb-2.5 rounded-lg bg-white shadow-card transition-all last:mb-0 hover:shadow-large dark:bg-light-dark text-black01",
      )}
    >
      <div className="px-2 py-4.5 grid h-auto grid-cols-3 items-center gap-3 sm:grid-cols-5 sm:gap-4 md:grid-cols-5 lg:grid-cols-5 text-center">
        <div className="user-preference-table-data col-span-3 sm:col-span-2">
          <span className="mb-1 text-xs lg:text-base block text-gray-600 dark:text-gray-400 sm:hidden">
            {t("Feature")}
          </span>
          {LW3CODE}
        </div>
        <div className="user-preference-table-data">
          <span className="mb-1 text-xs lg:text-base block text-gray-600 dark:text-gray-400 sm:hidden">
            {t("Type")}
          </span>
          {DDSELT}
        </div>
        <div className="user-preference-table-data">
          <span className="mb-1 text-xs lg:text-base block text-gray-600 dark:text-gray-400 sm:hidden">
            {t("Preference")}
          </span>
          <div className="mx-auto max-w-24">
            <Select
              aria-label="Select Preference"
              size="sm"
              onChange={(e) => onChange(e.target.value)}
            >
              <option value="-" hidden>
                - -
              </option>
              {optionValueArray.map((option) => (
                <option value={option.DDCODE} key={option.DDCODE}>
                  {option.DDCODE}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="px-4 py-2 text-sm lg:text-base font-medium uppercase tracking-wider dark:text-white sm:text-sm ">
          <span className="mb-1 text-xs lg:text-base block text-gray-600 dark:text-gray-400 sm:hidden">
            {t("Reset")}
          </span>
          <div className="flex items-center justify-center">
            <SfTooltip label={t("Reset")}>
              <button
                type="button"
                onClick={() => onClickReset(DDRESET)}
                aria-label="Reset"
              >
                <SvgListReset className="translate-05 size-5 sm:size-6 lg:size-8 dark:text-gray-200 hover:dark:text-gray-50 cursor-pointer" />
              </button>
            </SfTooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PreferenceItem {
  DDSELT: string;
  LW3CODE: string;
}

const PreferenceList = ({
  preferencesData,
}: {
  preferencesData: UserPreferenceList[];
}) => {
  const t = useTranslations("UsrPrefrnc");
  const tValidation = useTranslations("Validation");

  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [updatedPreferences, setUpdatedPreferences] = useState<
    PreferenceItem[]
  >(
    preferencesData.map((item) => ({
      DDSELT: item.DDSELT,
      LW3CODE: item.LW3CODE,
    })),
  );

  const handleUpdatePreferences = useCallback(async () => {
    setIsLoading(true);
    const res = await dispatch(updateUserPreferences(updatedPreferences));

    if (res.meta.requestStatus === "fulfilled") {
      const code = res.payload.data.messages[0].code;
      showToast("success", tValidation(code));
      await reFetchUserPreferences();
      setIsLoading(false);
      return;
    }
  }, [updatedPreferences, dispatch, tValidation]);

  const handleChangePreference = useCallback(
    (lw3Code: string, newValue: string) => {
      setUpdatedPreferences((prevPreferences) =>
        prevPreferences.map((item) =>
          item.LW3CODE === lw3Code ? { ...item, DDSELT: newValue } : item,
        ),
      );
    },
    [],
  );

  const handleResetPreference = useCallback(
    async (lw3Code: string, resetValue: string) => {
      try {
        const mappedPreferences = preferencesData.map((item) => ({
          DDSELT: item.DDSELT,
          LW3CODE: item.LW3CODE,
        }));

        const updatedPayload = mappedPreferences.map((item) =>
          item.LW3CODE === lw3Code ? { ...item, DDSELT: resetValue } : item,
        );

        const res = await dispatch(updateUserPreferences(updatedPayload));

        if (res.meta?.requestStatus === "fulfilled") {
          const code = res.payload?.data?.messages?.[0]?.code;
          showToast("success", tValidation(code || "PREFERENCES_UPDATED"));
          await reFetchUserPreferences();
        } else {
          const errorMsg = "Failed to update preferences.";
          showToast("error", errorMsg);
        }
      } catch (err) {
        showToast("error", "An unexpected error occurred.");
      }
    },
    [preferencesData, dispatch, tValidation, showToast, reFetchUserPreferences],
  );

  return (
    <div className="w-full mb-4">
      <div className="mx-auto w-full">
        <div className="user-preference-table-header">
          <span className="user-preference-table-header-text text-center col-span-2">
            {t("Feature")}
          </span>
          <span className="user-preference-table-header-text text-center">
            {t("Type")}
          </span>
          <span className="user-preference-table-header-text text-center">
            {t("Preference")}
          </span>
          <span className="user-preference-table-header-text-header text-center">
            &nbsp;
          </span>
        </div>
      </div>
      {preferencesData.length > 0 && (
        <>
          {preferencesData.map((item: UserPreferenceList, id: number) => (
            <RenderUserPreferenceList
              key={id}
              DDSELT={item.DDSELT}
              LW3CODE={item.LW3CODE}
              optionValueArray={item.optionValueArray}
              DDRESET={item.DDRESET}
              onChange={(newValue) => {
                handleChangePreference(item.LW3CODE, newValue);
              }}
              onClickReset={(resetValue) =>
                handleResetPreference(item.LW3CODE, resetValue)
              }
            />
          ))}
          <div className="mt-6 w-full mx-auto max-w-sm">
            <Button
              type="button"
              size="lg"
              className="w-full lg:py-4.5 translate-05"
              onClick={() => handleUpdatePreferences()}
              disabled={isLoading}
            >
              <span className="btn-text">
                {isLoading ? `${t("Updating")}...` : t("UpdtPreferences")}
              </span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PreferenceList;
