export default (): Snippet[] => [
  {
    id: "1",
    enabled: false,
    prepend: false,
    content: "<script>console.log('snippet 1')</script>",
    title: "Snippet 1",
  },
  {
    id: "2",
    enabled: true,
    prepend: false,
    content: "<script>console.log('snippet 2')</script>",
    title: "Snippet 2",
  },
];
