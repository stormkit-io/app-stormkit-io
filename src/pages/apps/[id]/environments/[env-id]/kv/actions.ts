import { I } from "dist/assets/Grow.cd8761d3";
import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

interface FetchKeysArgs {
  appId?: string;
  environmentId?: string;
}

interface FetchValueArgs {
  appId?: string;
  environmentId?: string;
  key?: string;
}

interface FetchValueReturn {
    val: string
}

interface FetchKeysReturnValue {
  keys: string[];
  error: string | null;
  loading: boolean;
}

export const FetchValue = ({appId, environmentId, key}: FetchValueArgs): Promise<FetchValueReturn> => {
    return api.post<FetchValueReturn>(`/apps/${appId}/envs/${environmentId}/value`, {appId: appId, envId: environmentId, key: key})
};

export const useFetchKeys = ({
  appId,
  environmentId,
}: FetchKeysArgs): FetchKeysReturnValue => {
  const [keys, setKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!appId || !environmentId) {
      return;
    }

    let unmounted = false;
    setLoading(true);

    api
      .fetch<{ keys: string[] }>(`/apps/${appId}/envs/${environmentId}/keys`)
      .then(result => {
        if (!unmounted) {
          setKeys(result.keys);
        }
      })
      .catch((error: Response) => {
        if (!unmounted) {
          error.text().then(msg => setError(msg))
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
  }, [appId, environmentId]);

  return { keys, loading, error };
};
