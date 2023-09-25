declare interface Snippet {
  title: string;
  content: string;
  enabled: boolean;
  prepend: boolean;
  location?: "head" | "body";
  id?: number;
}

declare interface Snippets {
  head: Array<Snippet>;
  body: Array<Snippet>;
}
