import { useEffect, useState } from "react";
import api from "~/utils/api/Api";
import { normalize, isUndef } from "./helpers";

type SetSnippets = (val: Snippets) => void;

interface PutSnippetsProps {
  snippets: Snippets;
  app: App;
  environment: Environment;
  setLoading: SetLoading;
  setError: SetError;
  setSnippets: SetSnippets;
  onSuccess: () => void;
}

const putSnippets = ({
  snippets,
  app,
  environment,
  setLoading,
  setSnippets,
  setError,
  onSuccess,
}: PutSnippetsProps): Promise<void> => {
  setLoading(true);

  return api
    .put(`/app/env/snippets`, {
      appId: app.id,
      env: environment.env,
      snippets,
    })
    .then(() => {
      setSnippets(normalize(snippets));
      onSuccess && onSuccess();
    })
    .catch(() => {
      setError(
        "Something went wrong while updating snippets. Please try again, if the problem persists reach us from Discord or email."
      );
    })
    .finally(() => {
      setLoading(false);
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
  setError: SetError;
  setLoading: SetLoading;
  setSnippets: SetSnippets;
  snippets: Snippets;
  index?: number;
  injectLocation?: "head" | "body";
  isEnabled: boolean;
  isPrepend?: boolean;
  closeModal?: () => void;
}

export const upsertSnippets =
  ({
    app,
    environment,
    setError,
    setLoading,
    snippets,
    setSnippets,
    closeModal,
    index = -1,
    injectLocation = "head",
    isEnabled,
    isPrepend,
  }: UpsertSnippetsProps) =>
  (values: Snippet): Promise<void> => {
    if (!values.title || !values.content) {
      return Promise.resolve(
        setError("Title and content are required fields.")
      );
    }

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
      setLoading,
      setSnippets,
      setError,
      onSuccess: () => closeModal && closeModal(),
    });
  };

interface DeleteSnippetProps {
  snippets: Snippets;
  setSnippets: SetSnippets;
  setLoading: SetLoading;
  setError: SetError;
  closeModal: () => void;
  app: App;
  environment: Environment;
  injectLocation: "head" | "body";
  index: number;
}

export const deleteSnippet = ({
  index,
  snippets,
  setSnippets,
  setLoading,
  setError,
  closeModal,
  app,
  environment,
  injectLocation,
}: DeleteSnippetProps): void => {
  const clone = JSON.parse(JSON.stringify(snippets));
  clone[injectLocation].splice(index, 1);

  putSnippets({
    app,
    environment,
    snippets: clone,
    setLoading,
    setSnippets,
    setError,
    onSuccess: closeModal,
  });
};

type ExtendedUpsertSnippetProps = Omit<
  UpsertSnippetsProps,
  "setError" | "setLoading" | "injectLocation" | "isPrepend" | "closeModal"
>;

interface EnableOrDisableProps extends ExtendedUpsertSnippetProps {
  snippet: Snippet;
  setError: SetError;
  setLoading: SetLoading;
}

export const enableOrDisable = ({
  isEnabled,
  index,
  snippet,
  setSnippets,
  setError,
  setLoading,
  ...rest
}: EnableOrDisableProps): Promise<void> => {
  return upsertSnippets({
    ...rest,
    index,
    isEnabled,
    setError,
    setLoading,
    injectLocation: snippet._injectLocation || "body",
    setSnippets,
  })(snippet);
};
