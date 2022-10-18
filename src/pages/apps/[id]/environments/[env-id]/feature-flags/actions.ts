import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

interface FetchFeatureFlagsArgs {
  app: App;
  environment: Environment;
}

interface FetchFeatureFlagsReturnValue {
  flags: FeatureFlag[];
  error: string | null;
  loading: boolean;
  setReload: (val: number) => void;
}

export const useFetchFeatureFlags = ({
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

  return { flags, loading, error, setReload };
};

interface DeleteFeatureFlagArgs {
  app: App;
  environment: Environment;
  flagName: string;
}

export function deleteFeatureFlag({
  app,
  environment,
  flagName,
}: DeleteFeatureFlagArgs): Promise<void> {
  return api.delete(`/apps/flags`, {
    appId: app.id,
    envId: environment.id,
    flagName: flagName,
  });
}

interface UpsertFeatureFlagArgs {
  app: App;
  environment: Environment;
  values: FormValues;
}

export interface FormValues {
  flagName: string;
  flagValue: boolean | "on" | "off";
}

export const upsertFeatureFlag = ({
  app,
  environment,
  values,
}: UpsertFeatureFlagArgs): Promise<void> => {
  const name = values.flagName.trim();

  if (name === "") {
    return Promise.reject("Flag name cannot be empty.");
  }

  return api.post(`/apps/flags`, {
    appId: app.id,
    flagName: name,
    flagValue: values.flagValue === true || values.flagValue === "on",
    envId: environment.id,
  });
};
