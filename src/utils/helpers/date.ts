const n = (value: number, text: string) => {
  return `${value} ${text}${value === 1 ? "" : "s"}`;
};

export function timeSince(timestamp: number) {
  const now = new Date();
  const seconds = Math.floor((+now - timestamp) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return n(Math.floor(interval), "year");
  }

  interval = seconds / 2592000;

  if (interval > 1) {
    return n(Math.floor(interval), "month");
  }

  interval = seconds / 86400;

  if (interval > 1) {
    return n(Math.floor(interval), "day");
  }

  interval = seconds / 3600;

  if (interval > 1) {
    return n(Math.floor(interval), "hour");
  }

  interval = seconds / 60;

  if (interval > 1) {
    return n(Math.floor(interval), "minute");
  }

  return n(Math.floor(seconds), "second");
}
