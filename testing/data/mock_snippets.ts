interface SnippetResponse extends Omit<Snippet, "location"> {}

export default (): { head: SnippetResponse[]; body: SnippetResponse[] } => ({
  head: [
    {
      id: 1,
      enabled: false,
      prepend: false,
      content: "<script>console.log('snippet 1')</script>",
      title: "Snippet 1",
    },
  ],
  body: [
    {
      id: 2,
      enabled: true,
      prepend: false,
      content: "<script>console.log('snippet 2')</script>",
      title: "Snippet 2",
    },
  ],
});
