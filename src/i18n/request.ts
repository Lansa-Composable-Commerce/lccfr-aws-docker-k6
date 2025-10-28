import { getRequestConfig } from "next-intl/server";
import { Locale, routing } from "@/i18n/routing";
import { getTranslatedData } from "@/api/translations";
import { transform } from "@/utils";

let translationCache: any = {};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  if (translationCache[locale]) {
    return { locale, messages: translationCache[locale] };
  }

  const data = await getTranslatedData(locale);
  let transformData;

  if (!data) {
    transformData = transform(
      (await import(`../../messages/${locale}.json`)).default,
    );
  } else {
    transformData = transform(data);
  }

  translationCache[locale] = transformData;

  return {
    locale,
    messages: transformData,
  };
});
