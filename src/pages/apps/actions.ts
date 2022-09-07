import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

interface FetchAppListProps {
  from?: number;
  filter?: string;
}

interface FetchAppListReturnValue {
  apps: Array<App>;
  error: string | null;
  loading: boolean;
  hasNextPage: boolean;
}

interface FetchAppListAPIResponse {
  apps: Array<App>;
  hasNextPage: boolean;
}

export const useFetchAppList = ({
  from = 0,
  filter,
}: FetchAppListProps): FetchAppListReturnValue => {
  const [apps, setApps] = useState<Array<App>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    let unmounted = false;

    setLoading(true);
    setError(null);

    api
      .fetch<FetchAppListAPIResponse>(`/apps?from=${from}&filter=${filter}`)
      .then(res => {
        if (unmounted !== true) {
          if (from > 0) {
            setApps([...apps, ...res.apps]);
          } else {
            setApps(res.apps);
          }

          setHasNextPage(res.hasNextPage);
          setLoading(false);
        }
      })
      .catch(e => {
        if (unmounted !== true) {
          setError(e.message);
        }
      });

    return () => {
      unmounted = true;
    };
  }, [api, from, filter]);

  return { apps, loading, error, hasNextPage };
};

interface FetchAppProps {
  appId?: string;
}

interface FetchAppReturnValue {
  app: App | undefined;
  loading: boolean;
  error: string | null;
  refreshToken?: number;
  setRefreshToken: (val: number) => void;
}

interface FetchAppAPIResponse {
  app: App;
}

const appCache: Record<string, App> = {};

export const useFetchApp = ({ appId }: FetchAppProps): FetchAppReturnValue => {
  const [app, setApp] = useState<App | undefined>(appCache[appId!]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [refreshToken, setRefreshToken] = useState<number>();

  useEffect(() => {
    let unmounted = false;

    if (appCache[appId!] || !appId) {
      return;
    }

    setLoading(true); // Do not refresh when updating app object.
    setError(null);

    api
      .fetch<FetchAppAPIResponse>(`/app/${appId}`)
      .then(res => {
        const app = res.app;
        const pieces = app.repo.split("/");
        const provider = pieces.shift();

        if (
          provider === "github" ||
          provider === "gitlab" ||
          provider === "bitbucket"
        ) {
          app.provider = provider;
          app.name = pieces.join("/");
        }

        if (unmounted !== true) {
          setApp(app);
        }
      })
      .catch(async res => {
        if (res.status === 404) {
          return;
        }

        try {
          const error = await res.json();

          if (unmounted !== true) {
            setApp(undefined);
            setError(error);
          }
        } catch (e) {
          if (unmounted !== true) {
            setError(
              "Something went wrong on our side. Please try again. If the problem persists reach us out through Discord or email."
            );
          }
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
  }, [api, appId, refreshToken]);

  return { app, loading, error, refreshToken, setRefreshToken };
};

interface DeployProps {
  app: App;
  config?: {
    cmd: string;
    branch: string;
    distFolder?: string;
    publish: boolean;
  };
  environment?: Environment;
  setError: SetError;
  setLoading: SetLoading;
}

interface DeployAPIResponse {
  id: string;
}

export const deploy = ({
  app,
  config,
  setLoading,
  setError,
  environment,
}: DeployProps): Promise<DeployAPIResponse | void> => {
  if (!environment) {
    return Promise.resolve(setError("Please select an environment."));
  }

  setLoading(true);

  return api
    .post<DeployAPIResponse>(`/app/deploy`, {
      env: environment.env,
      appId: app.id,
      ...config,
    })
    .catch(async res => {
      if (res.status === 429) {
        setError((await api.errors(res))[0]);
      } else if (res.status === 401) {
        setError(
          "We do not have enough permissions to continue with the deployment. " +
            "Check the documentation for more information."
        );
      } else {
        setError(
          "Something wrong happened here. Please contact us at hello@stormkit.io"
        );
      }
    })
    .finally(() => {
      setLoading(false);
    });
};
