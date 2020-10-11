/**
 * Capitalizes the first letter of the given string.
 */
export const capitalize = (value?: string): string => {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
};
