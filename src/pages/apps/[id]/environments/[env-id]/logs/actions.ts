import { useState, useEffect } from "react";
import api from "~/utils/api/Api";
import qs from "query-string";

interface FetchLogsProps {
  environment: Environment;
  app: App;
}

interface FetchLogsResponse {
  error: string | null;
  loading: boolean;
  logs: any[];
}

export const useFetchLogs = ({
  environment,
  app,
}: FetchLogsProps): FetchLogsResponse => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    let unmounted = false;

    setLoading(true);
    setError(null);

    // TODO: define an interface for logs
    api
      .fetch<any>(
        `/app/${app.id}/logs?${qs.stringify({ env: environment.env })}`
      )
      .then(({ logs }) => {
        if (unmounted !== true) {
          setLogs(logs);
        }
      })
      .catch(res => {
        if (unmounted !== true) {
          setError(res.message || res);
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
  }, [api, app.id, environment.env]);

  return { error, loading, logs };
};
