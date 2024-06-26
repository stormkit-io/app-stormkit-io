import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

interface FetchSnippetsProps {
  app: App;
  env: Environment;
  hosts?: string;
  refreshToken?: number;
  loadMoreToken?: number;
}

interface FetchSnippetsReturnValue {
  loading: boolean;
  error: string | null;
  snippets?: Snippet[];
  hasNextPage?: boolean;
}

export const useFetchSnippets = ({
  app,
  env,
  hosts,
  refreshToken,
  loadMoreToken,
}: FetchSnippetsProps): FetchSnippetsReturnValue => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [afterId, setAfterId] = useState<string>();

  useEffect(() => {
    let unmounted = false;

    setError(null);
    setLoading(true);

    const qs = new URLSearchParams(
      JSON.parse(
        JSON.stringify({
          appId: app.id,
          envId: env.id,
          hosts,
          afterId,
        })
      )
    );

    api
      .fetch<{ snippets: Snippet[]; pagination: Pagination }>(
        `/snippets?${qs.toString()}`
      )
      .then(({ snippets: newSnippets, pagination }) => {
        if (!unmounted) {
          setAfterId(pagination?.afterId);
          setSnippets(
            loadMoreToken ? [...snippets, ...newSnippets] : newSnippets
          );
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
  }, [app.id, env.id, refreshToken, loadMoreToken, hosts]);

  return { loading, error, snippets, hasNextPage: Boolean(afterId) };
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

  return api.post(`/snippets`, {
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
}: DeleteSnippetProps): Promise<Snippet[]> => {
  return api.delete(`/snippets?id=${snippet.id}&envId=${envId}&appId=${appId}`);
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
}: UpdateSnippetProps): Promise<Snippet[]> => {
  return api.put(`/snippets`, {
    appId,
    envId,
    snippet,
  });
};
