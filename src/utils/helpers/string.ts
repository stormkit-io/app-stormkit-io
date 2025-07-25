/**
 * Given a `Provider` string, it returns the actual Company name.
 */
export const providerToText: Record<Provider, string> = {
  github: "GitHub",
  gitlab: "GitLab",
  bitbucket: "Bitbucket",
};

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

/**
 * Truncates the given string.
 */
export const truncate = (value: string, len = 100): string => {
  return value.length > len ? value.substring(0, len - 1) + "..." : value;
};

/**
 * Formats a number into a more readable string representation.
 * For example, 1,000 becomes "1k", 1,000,000 becomes "1m", and
 * 1,000,000,000 becomes "1b".
 */
export const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    return `${Math.floor((num / 1_000_000_000) * 10) / 10}b`;
  }

  if (num >= 1_000_000) {
    return `${Math.floor((num / 1_000_000) * 10) / 10}m`;
  }

  if (num >= 1_000) {
    return `${Math.floor((num / 1_000) * 10) / 10}k`;
  }

  return num.toString();
};
