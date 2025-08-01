export function isStringEmpty(str?: string | null): boolean {
  return !str || str.trim() === "";
}