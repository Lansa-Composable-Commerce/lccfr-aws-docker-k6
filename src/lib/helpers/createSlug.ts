export function createSlug(inputString: string) {
  // Remove leading and trailing spaces
  const trimmedString = inputString.trim();

  // Replace spaces with dashes
  const slug = trimmedString.replace(/\s+/g, "-");

  return slug;
}
