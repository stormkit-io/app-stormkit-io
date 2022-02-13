import { useEffect, useState } from "react";
import { RouteComponentProps, useLocation } from "react-router-dom";
import { RootContextProps } from "~/pages/Root.context";
import { ConfirmModalProps } from "~/components/ConfirmModal";
import { formatRepo } from "./helpers";
import type { AppSettings, LocationState, Runtime } from "./types.d";

interface DeleteAppProps
  extends Pick<RootContextProps, "api">,
    Pick<ConfirmModalProps, "confirmModal">,
    Pick<RouteComponentProps, "history"> {
  app: App;
}

type voidFn = () => void;

/**
 * Action to delete an application.
 */
export const deleteApp =
  ({ api, app, confirmModal, history }: DeleteAppProps): voidFn =>
  () => {
    confirmModal(
      "This will completely remove the application. All associated files and endpoints will be gone. Remember there is no going back from here.",
      {
        typeConfirmationText: "permanently delete application",
        onConfirm: ({ closeModal, setError, setLoading }) => {
          setLoading(true);
          api
            .delete("/app", { appId: app.id })
            .then(() => {
              setLoading(false);
              closeModal();
              history.push("/");
            })
            .catch(() => {
              setLoading(false);
              setError(
                "Something went wrong on our side. Please try again. If the problem persists reach us out through Discord or email."
              );
            });
        },
      }
    );
  };

interface UpdateDeployTriggerProps
  extends Pick<RootContextProps, "api">,
    Pick<RouteComponentProps, "history"> {
  app: App;
  setLoading: SetLoading;
  setError: SetError;
}

export const updateDeployTrigger =
  ({
    api,
    app,
    setLoading,
    setError,
    history,
  }: UpdateDeployTriggerProps): voidFn =>
  () => {
    setLoading(true);
    setError(null);

    api
      .put(`/app/deploy-trigger`, { appId: app.id })
      .then(() => {
        setLoading(false);
        history.replace({
          state: {
            app: Date.now(), // This will trigger a re-fetch for the app.
            triggerDeploysSuccess: "Endpoint was created successfully.",
          },
        });
      })
      .catch(() => {
        setLoading(false);
        setError(
          "Something went wrong while generating a new hash. Please try again and if the problem persists contact us on Discord or Email."
        );
      });
  };

interface UseFetchAdditionalSettings extends Pick<RootContextProps, "api"> {
  app: App;
}

interface UseFetchAdditionalSettingsReturnValue {
  loading: boolean;
  error: string | null;
  settings: AppSettings;
}

export const useFetchAdditionalSettings = ({
  api,
  app,
}: UseFetchAdditionalSettings): UseFetchAdditionalSettingsReturnValue => {
  const location = useLocation<LocationState>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AppSettings>({
    envs: [],
    runtime: "nodejs14.x",
  });

  const refresh = location?.state?.app;

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
  }, [api, app.id, refresh]);

  return { loading, error, settings };
};

interface UpdateAdditionalSettingsProps
  extends Pick<RootContextProps, "api">,
    Pick<RouteComponentProps, "history"> {
  setError: SetError;
  setLoading: SetLoading;
  app: App;
}

interface FormValues {
  repo: string;
  displayName: string;
  autoDeploy: string;
  defaultEnv: string;
  commitPrefix: string;
  runtime: Runtime;
}

export const updateAdditionalSettings =
  ({
    api,
    app,
    setLoading,
    setError,
    history,
  }: UpdateAdditionalSettingsProps) =>
  ({
    repo,
    displayName,
    autoDeploy,
    commitPrefix,
    runtime,
    defaultEnv,
  }: FormValues): void => {
    repo = formatRepo(repo);
    setLoading(true);
    setError(null);

    api
      .put(`/app`, {
        appId: app.id,
        displayName,
        repo,
        autoDeploy,
        runtime,
        defaultEnv,
        commitPrefix: autoDeploy !== "disabled" ? commitPrefix : undefined,
      })
      .then(() => {
        setLoading(false);
        history.replace({
          state: {
            app: Date.now(), // This will trigger a re-fetch for the app.
            settingsSuccess: "Your app has been updated successfully.",
          },
        });
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
