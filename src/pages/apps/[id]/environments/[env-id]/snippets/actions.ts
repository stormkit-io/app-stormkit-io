import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

interface FetchSnippetsProps {
  app: App;
  env: Environment;
  refreshToken?: number;
}

interface FetchSnippetsReturnValue {
  loading: boolean;
  error: string | null;
  snippets?: Snippets;
}

export const useFetchSnippets = ({
  app,
  env,
  refreshToken,
}: FetchSnippetsProps): FetchSnippetsReturnValue => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snippets, setSnippets] = useState<Snippets>({ head: [], body: [] });

  useEffect(() => {
    let unmounted = false;

    setError(null);
    setLoading(true);

    api
      .fetch<{ snippets: Snippets }>(
        `/app/env/snippets?appId=${app.id}&envId=${env.id}`
      )
      .then(({ snippets }) => {
        if (!unmounted) {
          setSnippets({
            head: snippets.head.map(s => ({ ...s, location: "head" })),
            body: snippets.body.map(s => ({ ...s, location: "body" })),
          });
        }
      })
      .catch(e => {
        if (!unmounted) {
          setError("Something went wrong on our side while fetching snippets.");
        }
      })
      .finally(() => {
        if (!unmounted) {
          setLoading(false);
        }
      });

    return () => {
      unmounted = true;
    };
  }, [app.id, env.id, refreshToken]);

  return { loading, error, snippets };
};

interface UpsertSnippetsProps {
  appId: string;
  envId: string;
  snippet: Snippet;
}

export const addSnippet = ({
  appId,
  envId,
  snippet,
}: UpsertSnippetsProps): Promise<Snippet[]> => {
  if (!snippet.title || !snippet.content) {
    return Promise.reject("Title and content are required fields.");
  }

  return api.post(`/app/env/snippets`, {
    appId,
    envId,
    snippets: [snippet],
  });
};

interface DeleteSnippetProps {
  snippet: Snippet;
  appId: string;
  envId: string;
}

export const deleteSnippet = ({
  snippet,
  appId,
  envId,
}: DeleteSnippetProps): Promise<Snippets> => {
  return api.delete(
    `/app/env/snippets?id=${snippet.id}&envId=${envId}&appId=${appId}`
  );
};

interface UpdateSnippetProps {
  snippet: Snippet;
  appId: string;
  envId: string;
}

export const updateSnippet = ({
  snippet,
  appId,
  envId,
}: UpdateSnippetProps): Promise<Snippets> => {
  return api.put(`/app/env/snippets`, {
    appId,
    envId,
    snippets: [snippet],
  });
};
