declare interface Snippet {
  title: string;
  content: string;
  enabled: boolean;
  prepend: boolean;
  location?: "head" | "body";
  rules?: SnippetRules;
  id?: number;
}

declare interface SnippetRules {
  hosts?: string[];
}
