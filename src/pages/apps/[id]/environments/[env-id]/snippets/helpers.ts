export const isUndef = (a: unknown): boolean => typeof a === "undefined";

export const normalize = (snippets: Snippets): Snippets => {
  const head = snippets.head || [];
  const body = snippets.body || [];

  return {
    head: head.map((s: Snippet, _i: number) => ({
      ...s,
      _injectLocation: "head",
      _i
    })),
    body: body.map((s: Snippet, _i: number) => ({
      ...s,
      _injectLocation: "body",
      _i
    }))
  };
};
