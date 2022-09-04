import React, { useEffect, useState } from "react";
import api from "~/utils/api/Api";
import { prepareBuildObject } from "./helpers";

interface FetchEnvironmentsProps {
  app?: App;
  refreshToken?: number;
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

export const useFetchEnvironments = ({
  app,
  refreshToken,
}: FetchEnvironmentsProps): FetchEnvironmentsReturnValue => {
  const [environments, setEnvironments] = useState<Array<Environment>>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
  }, [app?.id, app?.displayName, refreshToken]);

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
  }, [app.id, name]);

  return { meta, loading };
};

interface DeleteEnvironmentProps {
  app: App;
  environment: Environment;
}

export const deleteEnvironment = ({
  app,
  environment,
}: DeleteEnvironmentProps): Promise<void> => {
  const name = environment?.env;

  if (!name) {
    return Promise.reject();
  }

  return api.delete(`/app/env`, {
    appId: app.id,
    env: name,
  });
};

interface InsertEnvironmentProps {
  app: App;
  isAutoPublish: boolean;
  isAutoDeploy: boolean;
  setError: SetError;
  setLoading: SetLoading;
  toggleModal: (val: boolean) => void;
}

export const insertEnvironment =
  ({
    app,
    isAutoPublish,
    isAutoDeploy,
    toggleModal,
    setError,
    setLoading,
  }: InsertEnvironmentProps) =>
  (values: Record<string, string>): void => {
    const { name, branch, autoDeployBranches } = values;
    const build = prepareBuildObject(values);

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
        autoDeploy: isAutoDeploy,
        autoDeployBranches: autoDeployBranches || null,
      })
      .then(() => {
        setLoading(false);
        toggleModal(false);
        window.location.reload();
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

        if (res.status === 400) {
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
      })
      .catch(() => {
        setError(
          "Something went wrong while creating the environment. Please try again, if the problem persists reach us from Discord."
        );
      });
  };

interface EditEnvironmentProps {
  app: App;
  isAutoPublish: boolean;
  isAutoDeploy: boolean;
  environmentId: string;
  setError: SetErrorWithJSX;
  setLoading: SetLoading;
  toggleModal: (val: boolean) => void;
}

export const editEnvironment =
  ({
    app,
    isAutoPublish,
    isAutoDeploy,
    environmentId,
    toggleModal,
    setError,
    setLoading,
  }: EditEnvironmentProps) =>
  (values: Record<string, string>): void => {
    const { name, branch, autoDeployBranches } = values;
    const build = prepareBuildObject(values);

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
        autoDeploy: isAutoDeploy,
        autoDeployBranches: autoDeployBranches || null,
      })
      .then(() => {
        setLoading(false);
        toggleModal(false);
        window.location.reload();
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

        if (res.status === 400) {
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

interface UpdateIntegrationProps {
  app: App;
  environmentId: string;
  setLoading: SetLoading;
  setError: SetError;
  toggleModal: (val: boolean) => void;
}

export const updateIntegration =
  ({
    app,
    environmentId,
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
      })
      .catch(async res => {
        setLoading(false);

        const errs = await api.errors(res);
        setError(errs.map(err => <div key={err}>{err}</div>));
      });
  };
