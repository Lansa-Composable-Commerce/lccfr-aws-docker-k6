export function removeDashesFromSlug(slug: string | undefined): string {
  if (!slug) {
    return "";
  }
  return slug.replace(/-/g, " ");
}
