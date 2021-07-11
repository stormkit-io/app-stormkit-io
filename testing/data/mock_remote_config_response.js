export default () => ({
  config: {
    bannerPromo: {
      desc: "Whether to display the promotional banner or not",
      experimentId: "4308439284039",
      targetings: [
        { appVersion: "", percentile: "", segment: "", value: "true" },
      ],
    },
    survey: {
      desc: "Survey that is displayed to the marketing team",
      experimentId: "",
      targetings: [
        {
          appVersion: "1644802351",
          percentile: "",
          segment: "",
          value: "true",
        },
        {
          appVersion: "1429333243019",
          percentile: "",
          segment: "",
          value: "false",
        },
        { appVersion: "", percentile: "", segment: "admin", value: "unknown" },
      ],
    },
  },
});
