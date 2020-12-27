declare interface Snippet extends Record<string, string | number | boolean> {
  title: string;
  content: string;
  enabled: boolean;
  prepend: boolean;
  _injectLocation?: "head" | "body";
  _i?: number;
}

declare interface Snippets {
  head: Array<Snippet>;
  body: Array<Snippet>;
}
