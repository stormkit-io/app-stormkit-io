import { useEffect, useState } from "react";
import { ConfirmModalProps } from "~/components/ConfirmModal";
import Api from "~/utils/api/Api";

interface FetchFeatureFlagsArgs {
  api: Api;
  app: App;
  environment: Environment;
}

interface FetchFeatureFlagsReturnValue {
  flags: FeatureFlag[];
  error: string | null;
  loading: boolean;
  setError: SetError;
  setLoading: SetLoading;
  setReload: (val: number) => void;
}

export const useFetchFeatureFlags = ({
  api,
  app,
  environment,
}: FetchFeatureFlagsArgs): FetchFeatureFlagsReturnValue => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState<number>();

  useEffect(() => {
    let unmounted = false;
    setLoading(true);

    api
      .fetch<FeatureFlag[]>(`/apps/${app.id}/envs/${environment.id}/flags`)
      .then(result => {
        if (!unmounted) {
          setFlags(result);
        }
      })
      .catch(() => {
        if (!unmounted) {
          setError("Something went wrong while fetching feature flags");
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
  }, [reload]);

  return { flags, loading, error, setError, setLoading, setReload };
};

interface DeleteFeatureFlagArgs
  extends Pick<ConfirmModalProps, "confirmModal"> {
  api: Api;
  app: App;
  environment: Environment;
  flagName: string;
  setReload: (val: number) => void;
}

export function deleteFeatureFlag({
  api,
  app,
  environment,
  confirmModal,
  setReload,
  flagName,
}: DeleteFeatureFlagArgs): void {
  confirmModal(`Feature flag will be deleted`, {
    onConfirm: ({ closeModal, setError, setLoading }): void => {
      setLoading(true);
      api
        .delete(`/apps/flags`, {
          appId: app.id,
          envId: environment.id,
          flagName: flagName,
        })
        .then(() => {
          setReload(Date.now());
          closeModal();
        })
        .catch(() => {
          setError(
            "Something went wrong while deleting the feature flag. Please try again, if the problem persists contact us from Discord or email."
          );
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });
}

interface UpdateFeatureFlagStatus {
  api: Api;
  app: App;
  environment: Environment;
  flag: FeatureFlag;
  setError: SetError;
  setLoading: SetLoading;
}

export function updateFeatureFlagStatus({
  api,
  app,
  environment,
  setError,
  setLoading,
  flag,
}: UpdateFeatureFlagStatus) {
  if (flag.flagName === "" || flag.flagValue === undefined) {
    return setError("Wrong params");
  }

  return api
    .post(`/apps/flags`, {
      appId: app.id,
      flagName: flag.flagName,
      flagValue: flag.flagValue,
      envId: environment.id,
    })
    .catch(() => {
      const error =
        "Something went wrong on our side. Please try again later or reach us if the problem persists.";

      if (typeof setError === "function") {
        setError(error);
      } else {
        throw new Error(error);
      }
    })
    .finally(() => {
      setLoading(false);
    });
}

interface UpsertFeatureFlagArgs {
  api: Api;
  app: App;
  environment: Environment;
  setError: SetError;
  setLoading: SetLoading;
  closeModal: () => void;
  setReload: (val: number) => void;
}

interface FormValues {
  name: string;
  status: "true" | "false";
}

export const upsertFeatureFlag =
  ({
    api,
    app,
    environment,
    setError,
    setLoading,
    closeModal,
    setReload,
  }: UpsertFeatureFlagArgs) =>
  (values: FormValues) => {
    const name = values.name.trim();
    const status = values.status.trim() === "true" ? true : false;

    if (name === "") {
      return setError("Name cannot be empty.");
    }

    setLoading(true);

    return api
      .post(`/apps/flags`, {
        appId: app.id,
        flagName: name,
        flagValue: status,
        envId: environment.id,
      })
      .then(() => {
        setReload(Date.now());
        closeModal();
      })
      .catch(() => {
        setError(
          "Something went wrong on our side. Please try again later or reach us if the problem persists."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };