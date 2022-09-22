import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

interface DeleteForeverProps {
  appId: string;
  deploymentId: string;
}

export const deleteForever = ({
  appId,
  deploymentId,
}: DeleteForeverProps): Promise<void> => {
  return api.delete(`/app/deploy`, { deploymentId, appId });
};

interface PublishDeploymentsProps {
  app: App;
  envId: string;
  percentages: Record<string, number>;
}

interface PublishInfo {
  deploymentId: string;
  percentage: number;
}

export const publishDeployments = ({
  app,
  percentages,
  envId,
}: PublishDeploymentsProps): Promise<void> => {
  const publish: Array<PublishInfo> = [];
  let total = 0;

  Object.keys(percentages).forEach(deploymentId => {
    const percentage = percentages[deploymentId];
    total = total + percentage;

    publish.push({
      percentage,
      deploymentId,
    });
  });

  if (total !== 100) {
    return Promise.reject(
      `The sum of percentages has be to 100. Currently it is ${total}.`
    );
  }

  return api.post(`/app/deployments/publish`, {
    appId: app.id,
    envId,
    publish,
  });
};

interface FetchManifestProps {
  deploymentId: string;
  appId: string;
}

interface FetchManifestReturnValue {
  manifest: Manifest;
  loading: boolean;
  error: string | null;
}

export const useFetchManifest = ({
  appId,
  deploymentId,
}: FetchManifestProps): FetchManifestReturnValue => {
  const [manifest, setManifest] = useState<Manifest>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    api
      .fetch<{ manifest: Manifest }>(`/app/${appId}/manifest/${deploymentId}`, {
        method: "GET",
      })
      .then(data => setManifest(data.manifest))
      .catch(e => setError(e))
      .finally(() => setLoading(false));
  }, []);

  return {
    loading,
    error,
    manifest,
  };
};

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

interface UseFetchDeploymentsReturnValue {
  deployments: Array<Deployment>;
  error: string | null;
  success?: string;
  loading: boolean;
  hasNextPage: boolean;
}

interface FetchDeploymentsAPIResponse {
  hasNextPage: boolean;
  deploys: Array<Deployment>;
}

export const useFetchDeployments = ({
  app,
  from,
  filters,
}: UseFetchDeploymentsProps): UseFetchDeploymentsReturnValue => {
  const [deployments, setDeployments] = useState<Array<Deployment>>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { envId, status, published, branch } = filters || {};

  useEffect(() => {
    let unmounted = false;

    if (envId === "") {
      setDeployments([]);
      return;
    }

    setLoading(true);
    setError(null);

    api
      .post<FetchDeploymentsAPIResponse>("/app/deployments", {
        appId: app.id,
        from,
        envId,
        status,
        published,
        branch,
      })
      .then(res => {
        if (unmounted !== true) {
          setHasNextPage(res.hasNextPage);
          setDeployments(
            from && from > 0 ? [...deployments, ...res.deploys] : res.deploys
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
  }, [app.id, app.refreshToken, envId, published, branch, status, from]);

  return {
    deployments,
    error,
    loading,
    hasNextPage,
  };
};

interface StopDeploymentProps {
  appId: string;
  deploymentId: string;
}

export const stopDeployment = ({
  appId,
  deploymentId,
}: StopDeploymentProps): Promise<void> => {
  return api.post("/app/deploy/stop", { appId, deploymentId });
};
