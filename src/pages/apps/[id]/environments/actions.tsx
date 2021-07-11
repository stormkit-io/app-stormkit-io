import React, { useEffect, useState } from "react";
import { Location, History } from "history";
import { useLocation } from "react-router-dom";
import Api from "~/utils/api/Api";
import { ModalContextProps } from "~/components/Modal";
import { prepareBuildObject } from "./helpers";

interface FetchEnvironmentsProps {
  api: Api;
  app?: App;
}

interface FetchEnvironmentsReturnValue {
  environments: Array<Environment>;
  hasNextPage: boolean;
  loading: boolean;
  error: string | null;
}

interface FetchEnvironmentsAPIResponse {
  hasNextPage: boolean;
  envs: Array<Environment>;
}

interface LocationState extends Location {
  envs: number;
}

export const useFetchEnvironments = ({
  api,
  app,
}: FetchEnvironmentsProps): FetchEnvironmentsReturnValue => {
  const location = useLocation<LocationState>();
  const [environments, setEnvironments] = useState<Array<Environment>>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const refresh = location.state?.envs;

  useEffect(() => {
    let unmounted = false;

    if (!app?.id) {
      return;
    }

    setLoading(true);
    setError(null);

    api
      .fetch<FetchEnvironmentsAPIResponse>(`/app/${app.id}/envs`)
      .then(res => {
        if (unmounted !== true) {
          setHasNextPage(res.hasNextPage);
          setEnvironments(
            res.envs.map(e => ({
              ...e,
              getDomainName: () => {
                return e.domain?.name && e.domain?.verified
                  ? e.domain.name
                  : e.env === "production"
                  ? `${app.displayName}.stormkit.dev`
                  : `${app.displayName}--${e.env}.stormkit.dev`;
              },
            }))
          );
        }
      })
      .finally(() => {
        if (unmounted !== true) {
          setLoading(false);
        }
      });

    return () => {
      unmounted = true;
    };
  }, [api, app?.id, app?.displayName, refresh]);

  return { environments, error, loading, hasNextPage };
};

type STATUS_OK = 200;
type STATUS_NOT_FOUND = 404;
type STATUS_NOT_CONFIGURED = "NOT_CONFIGURED";

export type STATUSES =
  | STATUS_OK
  | STATUS_NOT_FOUND
  | STATUS_NOT_CONFIGURED
  | null;

export const STATUS: Record<string, STATUSES> = {
  OK: 200,
  NOT_FOUND: 404,
  NOT_CONFIGURED: "NOT_CONFIGURED",
};

interface FetchStatusProps {
  api: Api;
  app: App;
  domain: string;
  lastDeploy?: { id: string };
}

interface FetchStatusReturnValue {
  status: STATUSES;
  loading: boolean;
}

interface FetchStatusAPIResponse {
  status: STATUSES;
}

export const useFetchStatus = ({
  api,
  app,
  domain,
  lastDeploy,
}: FetchStatusProps): FetchStatusReturnValue => {
  const [status, setStatus] = useState<STATUSES>(null);
  const [loading, setLoading] = useState(false);
  const lastDeployId = lastDeploy?.id;

  useEffect(() => {
    let unmounted = false;

    if (!lastDeployId) {
      setStatus(STATUS.NOT_CONFIGURED);
      return;
    }

    setLoading(true);

    api
      .post<FetchStatusAPIResponse>("/app/proxy", {
        url: `https://${domain}`,
        appId: app.id,
      })
      .then(res => {
        if (!unmounted) {
          setStatus(res.status);
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
  }, [domain, lastDeployId, app.id, api]);

  return { status, loading };
};

interface Meta {
  type: "-" | "nuxt" | "next" | "angular";
}

interface FetchRepoTypeProps {
  api: Api;
  app: App;
  env: Environment;
}

interface FetchRepoTypeReturnValue {
  loading: boolean;
  meta: Meta;
}

type FetchRepoTypeAPIResponse = Meta;

export const useFetchRepoType = ({
  app,
  api,
  env,
}: FetchRepoTypeProps): FetchRepoTypeReturnValue => {
  const [meta, setMeta] = useState<Meta>({ type: "-" });
  const [loading, setLoading] = useState(false);
  const name = env?.env || "production";

  useEffect(() => {
    let unmounted = false;

    setLoading(true);

    api
      .fetch<FetchRepoTypeAPIResponse>(`/app/${app.id}/envs/${name}/meta`)
      .then(res => {
        if (unmounted !== true) {
          setMeta(res);
        }
      })
      .catch(() => {
        if (unmounted !== true) {
          setMeta({ type: "-" });
        }
      })
      .finally(() => {
        if (unmounted !== true) {
          setLoading(false);
        }
      });

    return () => {
      unmounted = true;
    };
  }, [api, app.id, name]);

  return { meta, loading };
};

interface DeleteEnvironmentProps {
  api: Api;
  app: App;
  environment: Environment;
  history: History;
  closeModal: CloseModal;
  setLoading: SetLoading;
  setError: SetError;
}

export const deleteEnvironment = ({
  api,
  app,
  environment,
  history,
  setLoading,
  setError,
  closeModal,
}: DeleteEnvironmentProps): Promise<void> => {
  const name = environment?.env;

  if (!name) {
    return Promise.reject();
  }

  setLoading(true);

  return api
    .delete(`/app/env`, {
      appId: app.id,
      env: name,
    })
    .then(() => {
      setLoading(false);
      closeModal(() => {
        history.push({
          pathname: `/apps/${app.id}/environments`,
          state: {
            envs: Date.now(),
            message: "Environment has been removed successfully.",
          },
        });
      });
    })
    .catch(() => {
      setLoading(false);
      setError(
        "Something went wrong while deleting the environment. Please try again, if the problem persists contact us from Discord or email."
      );
    });
};

interface InsertEnvironmentProps
  extends Pick<ModalContextProps, "toggleModal"> {
  api: Api;
  app: App;
  history: History;
  isServerless: boolean;
  isAutoPublish: boolean;
  setError: SetError;
  setLoading: SetLoading;
}

export const insertEnvironment =
  ({
    api,
    app,
    history,
    isServerless,
    isAutoPublish,
    toggleModal,
    setError,
    setLoading,
  }: InsertEnvironmentProps) =>
  (values: Record<string, string>): void => {
    const { name, branch } = values;
    const build = prepareBuildObject(values, isServerless);

    if (!name || !branch) {
      return setError("Environment and branch names are required.");
    }

    setLoading(false);

    api
      .post(`/app/env`, {
        appId: app.id,
        env: name,
        branch,
        build,
        autoPublish: isAutoPublish,
      })
      .then(() => {
        setLoading(false);
        toggleModal(false, () => {
          history.replace({
            state: {
              envs: Date.now(),
              message:
                "Environment has been created successfully. You can now deploy with your new configuration.",
            },
          });
        });
      })
      .catch(async res => {
        setLoading(false);
        const data = await res.json();

        if (data.errors.env) {
          setError(data.errors.env);
        } else {
          return Promise.reject();
        }
      })
      .catch(() => {
        setError(
          "Something went wrong while creating the environment. Please try again, if the problem persists reach us from Discord."
        );
      });
  };

interface EditEnvironmentProps extends Pick<ModalContextProps, "toggleModal"> {
  api: Api;
  app: App;
  history: History;
  isServerless: boolean;
  isAutoPublish: boolean;
  environmentId: string;
  setError: SetErrorWithJSX;
  setLoading: SetLoading;
}

export const editEnvironment =
  ({
    api,
    app,
    history,
    isServerless,
    isAutoPublish,
    environmentId,
    toggleModal,
    setError,
    setLoading,
  }: EditEnvironmentProps) =>
  (values: Record<string, string>): void => {
    const { name, branch } = values;
    const build = prepareBuildObject(values, isServerless);

    if (!name || !branch) {
      return setError("Environment and branch names are required.");
    }

    setLoading(true);

    api
      .put(`/app/env`, {
        appId: app.id,
        envId: environmentId,
        env: name,
        branch,
        build,
        autoPublish: isAutoPublish,
      })
      .then(() => {
        setLoading(false);
        toggleModal(false, () => {
          history.replace({
            state: {
              envs: Date.now(),
              message:
                "Environment has been updated successfully. You can now deploy with your new configuration.",
            },
          });
        });
      })
      .catch(async res => {
        let data: { code: "duplicate"; errors: Record<string, string> };

        try {
          data = await res.json();
        } catch (e) {
          return;
        }

        let message;

        if (data.code === "duplicate") {
          message =
            "You can't have duplicate environments or branch names for the same application.";
        } else if (res.status === 400 && data.errors) {
          message = Object.keys(data.errors).map(k => (
            <div key={k}>{data.errors[k]}</div>
          ));
        }

        setError(message);
        setLoading(false);
      });
  };
