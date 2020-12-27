import { useEffect, useState } from "react";
import { Location, History } from "history";
import { useLocation } from "react-router-dom";
import Api from "~/utils/api/Api";

interface FetchAppListProps {
  api: Api;
}

interface FetchAppListReturnValue {
  apps: Array<App>;
  error: string | null;
  loading: boolean;
}

export const useFetchAppList = ({
  api,
}: FetchAppListProps): FetchAppListReturnValue => {
  const [apps, setApps] = useState<Array<App>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unmounted = false;

    setLoading(true);
    setError(null);

    api
      .fetch("/apps")
      .then((res) => {
        if (unmounted !== true) {
          setApps(res.apps);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (unmounted !== true) {
          setError(e.message);
        }
      });

    return () => {
      unmounted = true;
    };
  }, [api]);

  return { apps, loading, error };
};

interface FetchAppProps {
  api: Api;
  appId: string;
}

interface FetchAppReturnValue {
  app: App | undefined;
  loading: boolean;
  error: string | null;
}

interface LocationState extends Location {
  app?: number;
}

const appCache: Record<string, App> = {};

export const useFetchApp = ({
  api,
  appId,
}: FetchAppProps): FetchAppReturnValue => {
  const location = useLocation<LocationState>();
  const [app, setApp] = useState<App | undefined>(appCache[appId]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const refresh = location?.state?.app;

  useEffect(() => {
    let unmounted = false;

    if (appCache[appId] && !refresh) {
      return;
    }

    !refresh && setLoading(true); // Do not refresh when updating app object.
    setError(null);

    api
      .fetch(`/app/${appId}`)
      .then((res) => {
        const app = res.app;
        const pieces = app.repo.split("/");
        app.provider = pieces.shift();
        app.name = pieces.join("/");

        if (unmounted !== true) {
          setApp(app);
        }
      })
      .catch(async (res) => {
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
  }, [api, appId, refresh]);

  return { app, loading, error };
};

interface DeployProps {
  api: Api;
  app: App;
  history: History;
  environment?: Environment;
  setError: SetError;
  setLoading: SetLoading;
  toggleModal: ToggleModal;
}

interface DeployCallbackProps {
  branch: string;
}

export const deploy = ({
  api,
  app,
  setLoading,
  setError,
  toggleModal,
  history,
  environment,
}: DeployProps) => ({ branch }: DeployCallbackProps): void => {
  if (!environment) {
    return setError("Please select an environment.");
  }

  setLoading(true);

  api
    .post(`/app/deploy`, { env: environment.env, branch, appId: app.id })
    .then((deploy) => {
      toggleModal(false, () => {
        if (deploy && deploy.id) {
          history.push(`/apps/${app.id}/deployments/${deploy.id}`);
        }
      });
    })
    .catch((res) => {
      if (res.status === 429) {
        setError(
          "You have exceeded the maximum number of concurrent builds " +
            "allowed for your application. Please wait until your other " +
            "deployments are completed. You can always upgrade your package " +
            "if you need more concurrent builds."
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
