export default (): Snippets => ({
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
