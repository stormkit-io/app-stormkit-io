interface SnippetResponse extends Omit<Snippet, "_injectLocation" | "_i"> {}

export default (): { head: SnippetResponse[]; body: SnippetResponse[] } => ({
  head: [
    {
      enabled: false,
      prepend: false,
      content: "<script>console.log('snippet 1')</script>",
      title: "Snippet 1",
    },
  ],
  body: [
    {
      enabled: true,
      prepend: false,
      content: "<script>console.log('snippet 2')</script>",
      title: "Snippet 2",
    },
  ],
});
