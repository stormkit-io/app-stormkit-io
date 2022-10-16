import { useEffect, useState } from "react";
import api from "~/utils/api/Api";
import { normalize, isUndef } from "./helpers";

type SetSnippets = (val: Snippets) => void;

interface PutSnippetsProps {
  snippets: Snippets;
  app: App;
  environment: Environment;
}

const putSnippets = ({
  snippets,
  app,
  environment,
}: PutSnippetsProps): Promise<Snippets> => {
  return api
    .put(`/app/env/snippets`, {
      appId: app.id,
      env: environment.env,
      snippets,
    })
    .then(() => {
      return normalize(snippets);
    });
};

interface FetchSnippetsProps {
  app: App;
  env: Environment;
}

interface FetchSnippetsReturnValue {
  loading: boolean;
  error: string | null;
  snippets?: Snippets;
  setSnippets: SetSnippets;
}

interface FetchSnippetsAPIResponse {
  snippets: Snippets;
}

export const useFetchSnippets = ({
  app,
  env,
}: FetchSnippetsProps): FetchSnippetsReturnValue => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snippets, setSnippets] = useState<Snippets>({ head: [], body: [] });

  useEffect(() => {
    let unmounted = false;

    setError(null);
    setLoading(true);

    api
      .fetch<FetchSnippetsAPIResponse>(
        `/app/${app.id}/envs/${env.env}/snippets`
      )
      .then(res => {
        if (!unmounted) {
          setSnippets(normalize(res.snippets));
        }
      })
      .catch(() => {
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
  }, [app.id, env.env]);

  return { loading, error, snippets, setSnippets };
};

interface UpsertSnippetsProps {
  app: App;
  environment: Environment;
  snippets: Snippets;
  index?: number;
  injectLocation?: "head" | "body";
  isEnabled: boolean;
  isPrepend?: boolean;
  values: Snippet;
}

export const upsertSnippets = ({
  app,
  environment,
  snippets,
  index = -1,
  injectLocation = "head",
  isEnabled,
  isPrepend,
  values,
}: UpsertSnippetsProps): Promise<Snippets> => {
  if (!values.title || !values.content) {
    return Promise.reject("Title and content are required fields.");
  }

  values._injectLocation = values._injectLocation.split("_")[0] as
    | "body"
    | "head";

  const isEdit = index > -1;
  const clone = JSON.parse(JSON.stringify(snippets || {}));
  const snippet: Snippet = clone?.[injectLocation]?.[index] || {};

  Object.assign(snippet, values);

  snippet.enabled = isEnabled;
  snippet.prepend = isUndef(isPrepend) ? snippet.prepend : isPrepend || false;

  // Delete private variables
  Object.keys(snippet)
    .filter(k => k[0] === "_")
    .forEach(key => {
      if (key === "_i" || key === "_injectLocation") {
        delete snippet[key];
      }
    });

  const hasInjectLocationChanged = injectLocation !== values._injectLocation;
  const _injectLocation = values._injectLocation || "";

  if (isEdit && hasInjectLocationChanged) {
    clone[injectLocation].splice(index, 1);
    clone[_injectLocation].push(snippet);
  } else if (!isEdit) {
    clone[_injectLocation].push(snippet);
  }

  return putSnippets({
    snippets: clone,
    app,
    environment,
  });
};

interface DeleteSnippetProps {
  snippets: Snippets;
  app: App;
  environment: Environment;
  injectLocation: "head" | "body";
  index: number;
}

export const deleteSnippet = ({
  index,
  snippets,
  app,
  environment,
  injectLocation,
}: DeleteSnippetProps): Promise<Snippets> => {
  const clone = JSON.parse(JSON.stringify(snippets));
  clone[injectLocation].splice(index, 1);

  return putSnippets({
    app,
    environment,
    snippets: clone,
  });
};

type ExtendedUpsertSnippetProps = Omit<
  UpsertSnippetsProps,
  "injectLocation" | "isPrepend" | "values"
>;

interface EnableOrDisableProps extends ExtendedUpsertSnippetProps {
  snippet: Snippet;
}

export const enableOrDisable = ({
  isEnabled,
  index,
  snippet,
  ...rest
}: EnableOrDisableProps): Promise<Snippets> => {
  return upsertSnippets({
    ...rest,
    index,
    isEnabled,
    injectLocation: snippet._injectLocation || "body",
    values: snippet,
  });
};
