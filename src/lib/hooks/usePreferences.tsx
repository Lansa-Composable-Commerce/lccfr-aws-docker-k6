import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { setGridView } from "@/lib/features/global/globalSlice";
import { useAppSelector } from "@/lib/hooks";
import { selectUserPreferencesData } from "@/lib/features/userPreferences/userPreferencesSlice";

interface Preference {
  DDSELT: string;
  LW3CODE: string;
}

export default function usePreferences() {
  const dispatch = useDispatch();
  const userPreferencesData = useAppSelector(selectUserPreferencesData);

  /*  useEffect(() => {
    if (!userPreferencesData || userPreferencesData.length === 0) {
      throw new Error("User preferences data is missing or empty.");
    }
  }, [userPreferencesData]);*/

  const mappedPreferences: Preference[] = useMemo(() => {
    return userPreferencesData.map(({ DDSELT, LW3CODE }) => ({
      DDSELT,
      LW3CODE,
    }));
  }, [userPreferencesData]);

  useEffect(() => {
    const preference = mappedPreferences.find((item) => item.LW3CODE === "PLM");
    if (preference?.DDSELT) {
      dispatch(setGridView(preference.DDSELT));
    }
  }, [mappedPreferences, dispatch]);
}
