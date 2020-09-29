export const toArray = v =>
  (Array.isArray(v) ? v : [v]).filter(i => typeof i !== "undefined");
