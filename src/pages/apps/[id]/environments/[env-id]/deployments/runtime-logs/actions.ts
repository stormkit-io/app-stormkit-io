import { useState, useEffect } from "react";
import api from "~/utils/api/Api";

interface FetchDeploymentRuntimeLogsProps {
  appId: string;
  afterTs?: string;
  deploymentId: string;
}

export interface Log {
  id: string;
  appId: string;
  envId: string;
  deploymentId: string;
  timestamp: string;
  data: string;
}

export const useFetchDeploymentRuntimeLogs = ({
  appId,
  deploymentId,
  afterTs,
}: FetchDeploymentRuntimeLogsProps) => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<Log[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(undefined);

    api
      .fetch<{ logs: Log[]; hasNextPage: boolean }>(
        `/app/${appId}/logs?deploymentId=${deploymentId}${
          afterTs ? `&after=${afterTs}` : ""
        }`
      )
      .then(data => {
        setLogs([...logs, ...data.logs]);
        setHasNextPage(data.hasNextPage);
      })
      .catch(() => {
        setError("Something went wrong while fetching logs.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appId, deploymentId, afterTs]);

  return { logs, error, loading, hasNextPage };
};
