import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

export type setLoadingArgs = null | "delete" | "stop";
type setLoadingFunc = (value: setLoadingArgs) => void;
type setDeploymentsFunc = (value: Array<Deployment>) => void;

interface DeleteForeverProps {
  appId: string;
  deploymentId: string;
  deployments: Array<Deployment>;
  setLoading: setLoadingFunc;
  setDeployments: setDeploymentsFunc;
}

export const deleteForever = ({
  appId,
  deploymentId,
  deployments,
  setLoading,
  setDeployments,
}: DeleteForeverProps): Promise<void> => {
  setLoading("delete");

  return api.delete(`/app/deploy`, { deploymentId, appId }).then(() => {
    setDeployments(deployments.filter(d => d.id !== deploymentId));
  });
};

interface PublishDeploymentsProps {
  app: App;
  setPublishError: (value: string | null) => void;
}

interface PublishInfo {
  deploymentId: string;
  percentage: number;
}

export const publishDeployments =
  ({ app, setPublishError }: PublishDeploymentsProps) =>
  (
    sliders: Record<string, { percentage: number }>,
    envId: string
  ): Promise<void> => {
    setPublishError(null);

    const publish: Array<PublishInfo> = [];
    let total = 0;

    Object.keys(sliders).forEach(deploymentId => {
      const slider = sliders[deploymentId];
      total = total + slider.percentage;

      publish.push({
        percentage: slider.percentage,
        deploymentId,
      });
    });

    if (total !== 100) {
      setPublishError(
        `The sum of percentages has be to 100. Currently it is ${total}.`
      );

      return Promise.resolve();
    }

    return api
      .post(`/app/deployments/publish`, {
        appId: app.id,
        envId,
        publish,
      })
      .then(() => {
        window.location.reload();
      })
      .catch(e => {
        setPublishError(
          e.message ||
            "Something went wrong on our side. Please try again later."
        );
      });
  };

export type Filters = {
  envId?: string;
  branch?: string;
  published?: boolean;
  status?: boolean;
};

interface UseFetchDeploymentsProps {
  app: App;
  from?: number;
  skipQuery?: boolean;
  filters?: Filters;
  setFrom?: (v: number) => void;
}

interface UseFetchDeploymentsReturnValaue {
  deployments: Array<Deployment>;
  error: string | null;
  success?: string;
  loading: boolean;
  hasNextPage: boolean;
  setDeployments: (value: Array<Deployment>) => void;
}

interface FetchDeploymentsAPIResponse {
  hasNextPage: boolean;
  deploys: Array<Deployment>;
}

export const useFetchDeploymentManifest = ( appId: string, envId: string): any => {
  const [manifest, setManifest] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    api
      .fetch(`/app/${appId}/manifest/${envId}`, { method: "GET" })
      .then(data => setManifest(data))
      .catch(e => setError(e)).finally(() => setLoading(false));
    setError(null);
  }, []);

  return {
    loading,
    error,
    manifest
  }
};

export const useFetchDeployments = ({
  app,
  from,
  skipQuery,
  filters,
}: UseFetchDeploymentsProps): UseFetchDeploymentsReturnValaue => {
  const [deployments, setDeployments] = useState<Array<Deployment>>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastFrom, setLastFrom] = useState(from);

  const { envId, status, published, branch } = filters || {};

  useEffect(() => {
    let unmounted = false;

    // This is a special case where we reset the selected environment.
    if (envId === "" || skipQuery) {
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
          setLastFrom(from);
          setDeployments(
            lastFrom !== from ? [...deployments, ...res.deploys] : res.deploys
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
  }, [app.id, envId, published, branch, status, from, skipQuery]);

  return {
    deployments,
    error,
    loading,
    hasNextPage,
    setDeployments,
  };
};

interface StopDeploymentProps {
  appId: string;
  deploymentId: string;
  deployments: Array<Deployment>;
  setLoading: setLoadingFunc;
  setDeployments: (deployments: Array<Deployment>) => void;
}

export const stopDeployment = ({
  appId,
  deploymentId,
  deployments,
  setLoading,
  setDeployments,
}: StopDeploymentProps): Promise<void> => {
  setLoading("stop");

  return api.post("/app/deploy/stop", { appId, deploymentId }).then(() => {
    setLoading(null);
    setDeployments(
      deployments.slice(0).map(d =>
        d.id === deploymentId
          ? {
              ...d,
              exit: -1,
              stoppedAt: Date.now(),
              isRunning: false,
            }
          : d
      )
    );
  });
};
