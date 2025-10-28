import { defaultCountries, parseCountry } from "react-international-phone";

interface DataObject {
  [key: string]: {
    [innerKey: string]: string;
  }[];
}

interface TransformedObject {
  [key: string]: {
    [innerKey: string]: string;
  };
}

export const transform = (data: DataObject): TransformedObject => {
  const transformed: TransformedObject = {};

  for (const key in data) {
    if (Array.isArray(data[key])) {
      transformed[key] = { ...data[key][0] };
    }
  }

  return transformed;
};

export const parseLocaleAndPath = (url: string) => {
  const segments = url.split("/").filter(Boolean);

  if (segments.length === 0) {
    console.error("Invalid URL Format!");
  }

  const locale = `/${segments[0]}`;
  const path = `/${segments.slice(1).join("/")}`;

  return { locale, path };
};

export const getISO2 = (value: string) => {
  const countryCodes: { [key: string]: string } = {
    CAN: "ca",
    FRE: "fr",
    MEX: "mx",
    USA: "us",
  };

  return countryCodes[value] || "Invalid country code!";
};

export const primaryCountries = defaultCountries.filter((country) => {
  const { iso2 } = parseCountry(country);
  return ["ca", "fr", "mx", "us"].includes(iso2);
});

export const isExpirationDateExpired = (month: number, year: number) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  return year < currentYear || (year === currentYear && month < currentMonth);
};

export const extractPathsFromMenu = (menus: any[]): string[] => {
  const hrefs: string[] = [];

  const flattenMenus = (menuItems: any[]) => {
    for (const item of menuItems) {
      if (item.value?.label === "Products") {
        hrefs.push("/products");
      } else {
        if (item.href) {
          const pathname = item.href.split("?")[0].replace(/^\//, "");
          hrefs.push(`/${pathname}`);
        }
        if (item.children && item.value?.label !== "Products") {
          flattenMenus(item.children);
        }
      }
    }
  };

  flattenMenus(menus);

  const unique = Array.from(new Set(hrefs));
  return unique.filter((item) => item !== "/#");
};

export const isAllowedPath = (path: string, paths: string[]) => {
  const pathnameOnly = path.split("?")[0];

  return (
    paths.includes(pathnameOnly) ||
    paths.some((p) => pathnameOnly.startsWith(`${p}/`)) ||
    pathnameOnly === "/"
  );
};
