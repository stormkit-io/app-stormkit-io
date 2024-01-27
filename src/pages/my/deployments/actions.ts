import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

interface Filters {
  envId?: string;
  branch?: string;
  published?: boolean;
  status?: boolean;
}

interface UseFetchDeploymentsProps {
  app: App;
  from?: number;
  filters?: Filters;
}

export const useFetchDeployments = ({
  from,
  filters,
}: UseFetchDeploymentsProps) => {
  const [deployments, setDeployments] = useState<DeploymentV2[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unmounted = false;

    setLoading(true);
    setError(null);

    api
      .fetch<{ deployments: DeploymentV2[]; hasNextPage: boolean }>(
        "/my/deployments"
      )
      .then(res => {
        if (unmounted !== true) {
          setHasNextPage(res.hasNextPage);
          setDeployments(
            (from && from > 0
              ? [...deployments, ...res.deployments]
              : res.deployments
            ).map(d => ({
              ...d,
              detailsUrl: `/apps/${d.appId}/environments/${d.envId}/deployments/${d.id}`,
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
  }, []);

  return {
    deployments,
    error,
    loading,
    hasNextPage,
  };
};
