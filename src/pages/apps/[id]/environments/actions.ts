import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

interface FetchEnvironmentsProps {
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

export const useFetchEnvironments = ({
  app,
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

    setLoading(!app?.refreshToken);
    setError(null);

    api
      .fetch<FetchEnvironmentsAPIResponse>(`/app/${app.id}/envs`)
      .then(res => {
        if (unmounted !== true) {
          setHasNextPage(res.hasNextPage);
          setEnvironments(
            res.envs.map(e => ({
              ...e,
              name: e.env,
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
  }, [app?.id, app?.displayName, app?.refreshToken]);

  return { environments, error, loading, hasNextPage };
};

interface FetchStatusProps {
  app: App;
  environment: Environment;
  domain: string;
}

interface FetchStatusReturnValue {
  status?: number;
  loading: boolean;
}

interface FetchStatusAPIResponse {
  status: number;
}

export const isEmpty = (val?: boolean | Array<unknown>): boolean => {
  if (typeof val === "boolean") {
    return !val;
  }

  if (Array.isArray(val)) {
    return val.length === 0;
  }

  return !val;
};

export const useFetchStatus = ({
  app,
  environment,
  domain,
}: FetchStatusProps): FetchStatusReturnValue => {
  const [status, setStatus] = useState<number>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unmounted = false;

    if (isEmpty(environment.published)) {
      return;
    }

    setLoading(!app.refreshToken);

    api
      .post<FetchStatusAPIResponse>("/app/proxy", {
        url: domain,
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
  }, [domain, app.id, app.refreshToken, environment.published]);

  return { status, loading };
};
