export default (): FunctionTrigger[] => [
  {
    id: "3289604702",
    cron: "2 0 2 * *",
    status: true,
    options: {
      url: "https://app.stormkit.io/api/test",
      method: "POST",
      payload: "hello-world",
      headers: "",
    },
  },
];
