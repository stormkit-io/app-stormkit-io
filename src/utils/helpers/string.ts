/**
 * Capitalizes the first letter of the given string.
 */
export const capitalize = (value?: string): string => {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
};

/**
 * Takes a boolean value and casts it into a string. For instance,
 * if the value is `true`, this will return a string "true". When
 * value is undefined, it will return an empty string.
 */
export const booleanToString = (value?: boolean): string => {
  if (typeof value === "undefined") {
    return "";
  }

  return value ? "true" : "false";
};

/**
 * Takes a string value and parses it into a string. If the
 * string is any value other than "true" or "false", it will return undefined.
 */
export const parseBoolean = (value?: string): boolean | undefined => {
  return value === "true" ? true : value === "false" ? false : undefined;
};
