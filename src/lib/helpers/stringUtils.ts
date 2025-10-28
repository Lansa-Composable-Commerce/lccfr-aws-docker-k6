export function capitalizeWordsFromQuery(
  queryParam: string | undefined | null,
): string {
  if (!queryParam) {
    return "";
  }

  return queryParam
    .replace(/-/g, " ") // Replace dashes with spaces
    .split(" ") // Split on spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word properly
    .join(" "); // Join words back into a single string
}

export function removeDashesAndSpaces(str: string | undefined | null): string {
  if (!str) {
    return "";
  }
  return str.replace(/[- ]/g, "");
}
