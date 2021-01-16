/**
 * Formats a date.
 *
 * @param {*} ts
 */
export const formattedDate = (ts: number): string => {
  const date = new Date(ts * 1000);
  const now = new Date();

  if (
    date.getDate() === now.getDate() &&
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  ) {
    return `Today at ${date.toLocaleDateString("de-CH", {
      hour: "2-digit",
      minute: "2-digit"
    })}`;
  }

  return date.toLocaleDateString("de-CH", {
    hour: "2-digit",
    minute: "2-digit"
  });
};
