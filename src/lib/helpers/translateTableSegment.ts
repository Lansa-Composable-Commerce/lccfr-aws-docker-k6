export function translatableSegment(segment: string) {
  return !/^\d+$/.test(segment);
}
