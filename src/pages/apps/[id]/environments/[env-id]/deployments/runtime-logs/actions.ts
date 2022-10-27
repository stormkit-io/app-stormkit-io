import { useState, useEffect } from "react";
import api from "~/utils/api/Api";

interface FetchDeploymentRuntimeLogsProps {
  appId: string;
  deploymentId?: string;
  page: number
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
  totalPage: number;
}

export const useFetchDeploymentRuntimeLogs = ({
  appId,
  deploymentId,
  page
}: FetchDeploymentRuntimeLogsProps): FetchDeploymentRuntimeLogsReturnValue => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<Log[]>([]);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    if (!deploymentId) {
      return;
    }

    setLoading(true);
    setError(undefined);

    api
      .fetch<{ logs: Log[], totalPage:number }>(`/app/${appId}/logs?deploymentId=${deploymentId}&page=${page}`)
      .then(data  => {
        setLogs([...logs, ...data.logs]);
        setTotalPage(data.totalPage)
      })
      .catch(() => {
        setError("Something went wrong while fetching logs.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appId, deploymentId, page, totalPage]);

  return { logs, error, loading, totalPage };
};
