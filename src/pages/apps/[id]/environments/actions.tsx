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
      .catch(() => {
        // do nothing
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
  type: "nuxt" | "next" | "react" | "vue" | "angular" | "nest" | "-";
  packageJson?: boolean;
  isFramework?: boolean;
}

interface FetchRepoTypeProps {
  api: Api;
  app: App;
  env?: Environment;
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

    // For the production environment we fetch the meta information while
    // fetching the application. Therefore, we do not need to re-fetch it.
    if (name === "production" && app.meta) {
      return setMeta({
        type: app.meta.repoType,
        packageJson: app.meta.hasPackageJson,
        isFramework: app.meta.isFramework,
      });
    }

    setLoading(true);

    api
      .fetch<FetchRepoTypeAPIResponse>(`/app/${app.id}/envs/${name}/meta`)
      .then(res => {
        if (unmounted !== true && res.type) {
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
        toggleModal(false);
        history.replace({
          state: {
            envs: Date.now(),
            message:
              "Environment has been created successfully. You can now deploy with your new configuration.",
          },
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
        id: environmentId,
        appId: app.id,
        env: name,
        branch,
        build,
        autoPublish: isAutoPublish,
      })
      .then(() => {
        setLoading(false);
        toggleModal(false);
        history.replace({
          state: {
            envs: Date.now(),
            message:
              "Environment has been updated successfully. You can now deploy with your new configuration.",
          },
        });
      })
      .catch(async res => {
        let data: {
          code?: "duplicate";
          errors?: Record<string, string>;
          error?: string;
        };

        try {
          data = await res.json();
        } catch {
          data = {};
        }

        let message;

        if (data.code === "duplicate") {
          message =
            "You can't have duplicate environments or branch names for the same application.";
        } else if (res.status === 400) {
          if (data.errors) {
            message = Object.keys(data.errors).map(k => (
              <div key={k}>{data.errors?.[k]}</div>
            ));
          } else {
            message = data.error;
          }
        } else if (res.status === 404) {
          message =
            "The environment is not found. Refresh the page and check that it's not deleted.";
        }

        setError(message);
        setLoading(false);
      });
  };

interface UpdateIntegrationProps
  extends Pick<ModalContextProps, "toggleModal"> {
  api: Api;
  app: App;
  environmentId: string;
  history: History;
  setLoading: SetLoading;
  setError: SetError;
}

export const updateIntegration =
  ({
    app,
    api,
    environmentId,
    history,
    toggleModal,
    setLoading,
    setError,
  }: UpdateIntegrationProps) =>
  (form: Record<string, string>): void => {
    if (!(form.integration === "bunny_cdn" || form.integration === "aws_s3")) {
      setError(
        "Invalid integration provided. Allowed values are: bunny_cdn, aws_s3"
      );

      return;
    }

    try {
      new URL(form.externalUrl);
    } catch {
      setError("Invalid URL provided. Please provide a valid URL.");
      return;
    }

    const config: CustomStorage = {
      integration: form.integration,
      externalUrl: form.externalUrl,
      settings: {},
    };

    // We receive the key name in string format: settings.STORAGE_KEY
    // This snippets creates an object from it.
    Object.keys(form).forEach(key => {
      if (key.indexOf(".") === -1) {
        return;
      }

      config.settings[key.split(".")[1]] = form[key];
    });

    setLoading(true);

    api
      .put(`/app/env/custom-storage`, {
        appId: app.id,
        envId: environmentId,
        config,
      })
      .then(() => {
        setLoading(false);
        toggleModal(false);
        history.replace({
          state: {
            envs: Date.now(),
            message: "Custom integration has been updated successfully.",
          },
        });
      })
      .catch(async res => {
        setLoading(false);

        const errs = await api.errors(res);
        setError(errs.map(err => <div key={err}>{err}</div>));
      });
  };
