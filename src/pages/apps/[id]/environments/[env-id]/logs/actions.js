import { useState, useEffect } from "react";
import qs from "query-string";

export const useFetchLogs = ({ api, environment, app }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    let unmounted = false;

    setLoading(true);
    setError(null);

    api
      .fetch(`/app/${app.id}/logs?${qs.stringify({ env: environment.env })}`)
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
