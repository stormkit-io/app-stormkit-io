import { useState, useEffect } from "react";
import api from "~/utils/api/Api";

interface FetchDeploymentRuntimeLogsProps {
  appId: string;
  deploymentId?: string;
}

export interface Log {
  appId: string;
  envId: string;
  deploymentId: string;
  timestamp: string;
  data: string;
}

interface FetchDeploymentRuntimeLogsReturnValue {
  loading: boolean;
  error?: string;
  logs: Log[];
}

export const useFetchDeploymentRuntimeLogs = ({
  appId,
  deploymentId,
}: FetchDeploymentRuntimeLogsProps): FetchDeploymentRuntimeLogsReturnValue => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    if (!deploymentId) {
      return;
    }

    setLoading(true);
    setError(undefined);

    api
      .fetch<{ logs: Log[] }>(`/app/${appId}/logs?deploymentId=${deploymentId}`)
      .then(({ logs }) => {
        setLogs(logs);
      })
      .catch(() => {
        setError("Something went wrong while fetching logs.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appId, deploymentId]);

  return { logs, error, loading };
};