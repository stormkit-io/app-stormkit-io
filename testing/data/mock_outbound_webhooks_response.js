export default () => ({
  webhooks: [
    {
      requestUrl: "https://discord.com/example/endpoint",
      requestMethod: "POST",
      requestPayload: '{"embeds":[]}',
      requestHeaders: { "content-type": "application/json" },
      triggerWhen: "on_publish",
      id: "3289604702",
    },
    {
      requestUrl:
        "https://discord.com/api/webhooks/example/endpoint/with/a/very/long/url/structure",
      requestMethod: "POST",
      requestPayload: '{"embeds":[]}',
      requestHeaders: { "content-type": "application/json" },
      triggerWhen: "on_publish",
      id: "3289604703",
    },
  ],
});
