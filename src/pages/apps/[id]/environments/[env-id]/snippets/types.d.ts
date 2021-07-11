declare interface Snippet {
  title: string;
  content: string;
  enabled: boolean;
  prepend: boolean;
  _injectLocation: "head" | "body";
  _i: number;
}

declare interface Snippets {
  head: Array<Snippet>;
  body: Array<Snippet>;
}
