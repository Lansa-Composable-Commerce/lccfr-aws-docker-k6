export const removeWhitespace = (str: string | null | undefined): string => {
  if (typeof str !== "string") {
    return "";
  }
  return str.replace(/\s+/g, "");
};
