import { useEffect, useState } from "react";
import { formatRepo } from "./helpers";
import api from "~/utils/api/Api";
import type { AppSettings, Runtime } from "./types.d";

interface DeleteAppProps {
  app: App;
  setLoading: SetLoading;
  setError: SetError;
}

type voidFn = () => void;

/**
 * Action to delete an application.
 */
export const deleteApp = ({
  app,
  setLoading,
  setError,
}: DeleteAppProps): Promise<void> => {
  setLoading(true);

  return api
    .delete("/app", { appId: app.id })
    .then(() => {
      setLoading(false);
      window.location.href = "/";
    })
    .catch(() => {
      setLoading(false);
      setError(
        "Something went wrong on our side. Please try again. If the problem persists reach us out through Discord or email."
      );
    });
};

interface UpdateDeployTriggerProps {
  app: App;
  setLoading: SetLoading;
  setError: SetError;
}

export const updateDeployTrigger =
  ({ app, setLoading, setError }: UpdateDeployTriggerProps): voidFn =>
  () => {
    setLoading(true);
    setError(null);

    api
      .put(`/app/deploy-trigger`, { appId: app.id })
      .then(() => {
        setLoading(false);
        window.location.reload();
      })
      .catch(() => {
        setLoading(false);
        setError(
          "Something went wrong while generating a new hash. Please try again and if the problem persists contact us on Discord or Email."
        );
      });
  };

interface UseFetchAdditionalSettings {
  app: App;
}

interface UseFetchAdditionalSettingsReturnValue {
  loading: boolean;
  error: string | null;
  settings: AppSettings;
}

export const useFetchAdditionalSettings = ({
  app,
}: UseFetchAdditionalSettings): UseFetchAdditionalSettingsReturnValue => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AppSettings>({
    envs: [],
    runtime: "nodejs14.x",
  });

  useEffect(() => {
    let unmounted = false;

    setLoading(true);
    setError(null);

    api
      .fetch<AppSettings>(`/app/${app.id}/settings`)
      .then(res => {
        if (unmounted !== true) {
          setSettings({
            deployTrigger: res.deployTrigger,
            runtime: res.runtime,
            envs: res.envs,
          });
        }
      })
      .catch(() => {
        if (unmounted !== true) {
          setError(
            "Failed fetching application settings. Please try again and if the problem persists contact us from Discord or email."
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
  }, [api, app.id]);

  return { loading, error, settings };
};

interface UpdateAdditionalSettingsProps {
  setError: SetError;
  setLoading: SetLoading;
  app: App;
}

interface FormValues {
  repo: string;
  displayName: string;
  runtime: Runtime;
}

export const updateAdditionalSettings =
  ({ app, setLoading, setError }: UpdateAdditionalSettingsProps) =>
  ({ repo, displayName, runtime }: FormValues): void => {
    repo = formatRepo(repo);
    setLoading(true);
    setError(null);

    api
      .put(`/app`, {
        appId: app.id,
        displayName,
        repo,
        runtime,
      })
      .then(() => {
        setLoading(false);
        window.location.reload();
      })
      .catch(res => {
        res
          .json()
          .then(({ errors }: { errors: Record<string, string> }) => {
            setLoading(false);
            setError(
              Object.keys(errors)
                .map(k => errors[k])
                .join(", ")
            );
          })
          .catch(() => {
            setLoading(false);
            setError(
              "Something went wrong happened while updating settings. " +
                "Please try again and if the problem persists contact us from Discord or email."
            );
          });
      });
  };
