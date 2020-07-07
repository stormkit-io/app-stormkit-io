import { useEffect, useState } from "react";

const isUndef = (a) => typeof a === "undefined";

const normalize = (snippets) => {
  const head = snippets.head || [];
  const body = snippets.body || [];

  return {
    head: head.map((s, _i) => ({ ...s, _injectLocation: "head", _i })),
    body: body.map((s, _i) => ({ ...s, _injectLocation: "body", _i })),
  };
};

const putSnippets = ({
  snippets,
  api,
  app,
  environment,
  setLoading,
  setSnippets,
  setError,
  onSuccess,
}) => {
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
    .catch((e) => {
      console.log(e);
      setError(
        "Something went wrong while updating snippets. Please try again, if the problem persists reach us from Discord or email."
      );
    })
    .finally(() => {
      setLoading(false);
    });
};

export const useFetchSnippets = ({ api, app, env, location }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snippets, setSnippets] = useState({ head: [], body: [] });
  const refresh = location?.state?.snippets;

  useEffect(() => {
    let unmounted = false;

    setError(null);
    setLoading(true);

    api
      .fetch(`/app/${app.id}/envs/${env.env}/snippets`)
      .then((res) => {
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

export const upsertSnippets = ({
  api,
  app,
  environment,
  setError,
  setLoading,
  snippets = {},
  setSnippets,
  toggleModal,
  index = -1,
  injectLocation,
  isEnabled,
  isPrepend,
}) => (values) => {
  if (!values.title || !values.content) {
    return setError("Title and content are required fields.");
  }

  const isEdit = index > -1;
  const clone = JSON.parse(JSON.stringify(snippets));
  const snippet = clone?.[injectLocation]?.[index] || {};

  Object.keys(values).forEach((k) => {
    snippet[k] = values[k];
  });

  snippet.enabled = isEnabled;
  snippet.prepend = isUndef(isPrepend) ? snippet.prepend : isPrepend;

  // Delete private variables
  Object.keys(snippet)
    .filter((k) => k[0] === "_")
    .forEach((key) => delete snippet[key]);

  const hasInjectLocationChanged = injectLocation !== values._injectLocation;

  if (isEdit && hasInjectLocationChanged) {
    clone[injectLocation].splice(index, 1);
    clone[values._injectLocation].push(snippet);
  } else if (!isEdit) {
    clone[values._injectLocation].push(snippet);
  }

  return putSnippets({
    snippets: clone,
    api,
    app,
    environment,
    setLoading,
    setSnippets,
    setError,
    onSuccess: () => toggleModal && toggleModal(false),
  });
};

export const deleteSnippet = ({
  confirmModal,
  index,
  snippets,
  setSnippets,
  api,
  app,
  environment,
  injectLocation,
}) => {
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
          onSuccess: closeModal,
        });
      },
    }
  );
};

export const enableOrDisable = ({
  confirmModal,
  isEnabled,
  id: formSwitchSelector,
  index,
  snippet,
  setSnippets,
  ...rest
}) => {
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
          injectLocation: snippet._injectLocation,
          setSnippets,
        })(snippet).then(closeModal);
      },
      onCancel: (close) => {
        document.querySelector(`#${formSwitchSelector}`).click();
        close();
      },
    }
  );
};
