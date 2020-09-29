export const sortConfigByKey = (config) => {
  const ordered = {};

  Object.keys(config)
    .sort()
    .forEach((key) => {
      ordered[key] = config[key];
    });

  return ordered;
};

export const keyToName = {
  appVersion: "App version",
  segment: "Segment",
  percentile: "Percentile",
  value: "Value",
};
