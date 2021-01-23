import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Location } from "history";
import Api from "~/utils/api/Api";
import { normalize, isUndef } from "./helpers";

type SetSnippets = (val: Snippets) => void;

interface PutSnippetsProps {
  snippets: Snippets;
  api: Api;
  app: App;
  environment: Environment;
  setLoading: SetLoading;
  setError: SetError;
  setSnippets: SetSnippets;
  onSuccess: () => void;
}

const putSnippets = ({
  snippets,
  api,
  app,
  environment,
  setLoading,
  setSnippets,
  setError,
  onSuccess
}: PutSnippetsProps): Promise<void> => {
  setLoading(true);

  return api
    .put(`/app/env/snippets`, {
      appId: app.id,
      env: environment.env,
      snippets
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
  api: Api;
  app: App;
  env: Environment;
}

interface FetchSnippetsReturnValue {
  loading: boolean;
  error: string | null;
  snippets?: Snippets;
  setSnippets: SetSnippets;
}

interface LocationState extends Location {
  snippets: number;
}

interface FetchSnippetsAPIResponse {
  snippets: Snippets;
}

export const useFetchSnippets = ({
  api,
  app,
  env
}: FetchSnippetsProps): FetchSnippetsReturnValue => {
  const location = useLocation<LocationState>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snippets, setSnippets] = useState<Snippets>({ head: [], body: [] });
  const refresh = location?.state?.snippets;

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
  }, [app.id, env.env, api, refresh]);

  return { loading, error, snippets, setSnippets };
};

interface UpsertSnippetsProps {
  api: Api;
  app: App;
  environment: Environment;
  setError: SetError;
  setLoading: SetLoading;
  setSnippets: SetSnippets;
  snippets: Snippets;
  toggleModal: ToggleModal;
  index: number;
  injectLocation: "head" | "body";
  isEnabled: boolean;
  isPrepend: boolean;
}

export const upsertSnippets = ({
  api,
  app,
  environment,
  setError,
  setLoading,
  snippets,
  setSnippets,
  toggleModal,
  index = -1,
  injectLocation,
  isEnabled,
  isPrepend
}: UpsertSnippetsProps) => (values: Snippet): Promise<void> => {
  if (!values.title || !values.content) {
    return Promise.resolve(setError("Title and content are required fields."));
  }

  const isEdit = index > -1;
  const clone = JSON.parse(JSON.stringify(snippets || {}));
  const snippet: Snippet = clone?.[injectLocation]?.[index] || {};

  Object.assign(snippet, values);

  snippet.enabled = isEnabled;
  snippet.prepend = isUndef(isPrepend) ? snippet.prepend : isPrepend;

  // Delete private variables
  Object.keys(snippet)
    .filter(k => k[0] === "_")
    .forEach(key => {
      delete snippet[key];
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
    api,
    app,
    environment,
    setLoading,
    setSnippets,
    setError,
    onSuccess: () => toggleModal && toggleModal(false)
  });
};

interface DeleteSnippetProps {
  confirmModal: ConfirmModalFn;
  snippets: Snippets;
  setSnippets: SetSnippets;
  api: Api;
  app: App;
  environment: Environment;
  injectLocation: "head" | "body";
  index: number;
}

export const deleteSnippet = ({
  confirmModal,
  index,
  snippets,
  setSnippets,
  api,
  app,
  environment,
  injectLocation
}: DeleteSnippetProps): void => {
  confirmModal(
    `This will delete the snippet and it won't be injected anymore.`,
    {
      onConfirm: ({ closeModal, setError, setLoading }) => {
        const clone = JSON.parse(JSON.stringify(snippets));
        clone[injectLocation].splice(index, 1);

        putSnippets({
          api,
          app,
          environment,
          snippets: clone,
          setLoading,
          setSnippets,
          setError,
          onSuccess: closeModal
        });
      }
    }
  );
};

interface EnableOrDisableProps extends UpsertSnippetsProps {
  confirmModal: ConfirmModalFn;
  id: string;
  snippet: Snippet;
}

export const enableOrDisable = ({
  confirmModal,
  isEnabled,
  id: formSwitchSelector,
  index,
  snippet,
  setSnippets,
  ...rest
}: EnableOrDisableProps): void => {
  const enableOrDisable = isEnabled ? "enable" : "disable";

  confirmModal(
    `This will ${enableOrDisable} the snippet and the changes will be effective immediately.`,
    {
      onConfirm: ({ closeModal, setError, setLoading }) => {
        upsertSnippets({
          ...rest,
          index,
          isEnabled,
          setError,
          setLoading,
          injectLocation: snippet._injectLocation || "body",
          setSnippets
        })(snippet).then(closeModal);
      },
      onCancel: close => {
        const el = document.querySelector<HTMLButtonElement>(
          `#${formSwitchSelector}`
        );

        if (el) {
          el.click();
        }

        close();
      }
    }
  );
};
