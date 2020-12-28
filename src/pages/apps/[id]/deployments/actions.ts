import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { History, Location } from "history";
import Api from "~/utils/api/Api";

interface DeleteForeverProps {
  api: Api;
  appId: string;
  deploymentId: string;
  deployments: Array<Deployment>;
  setLoading: (value: boolean) => void;
  setDeployments: (value: Array<Deployment>) => void;
}

export const deleteForever = ({
  api,
  appId,
  deploymentId,
  deployments,
  setLoading,
  setDeployments,
}: DeleteForeverProps): Promise<void> => {
  setLoading(true);

  return api.delete(`/app/deploy`, { deploymentId, appId }).then(() => {
    setDeployments(deployments.filter((d) => d.id !== deploymentId));
  });
};

interface PublishDeploymentsProps {
  api: Api;
  app: App;
  history: History;
  setPublishError: (value: string | null) => void;
}

interface PublishInfo {
  deploymentId: string;
  percentage: number;
}

export const publishDeployments = ({
  api,
  app,
  history,
  setPublishError,
}: PublishDeploymentsProps) => (
  sliders: Record<string, { percentage: number }>,
  envId: string
): Promise<void> => {
  setPublishError(null);

  const publish: Array<PublishInfo> = [];
  let total = 0;

  Object.keys(sliders).forEach((deploymentId) => {
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
      appId: `${app.id}`,
      envId,
      publish,
    })
    .then(() => {
      history.replace({
        state: {
          deployments: Date.now(),
          success: "Deployment has been successfully published.",
        },
      });
    })
    .catch((e) => {
      setPublishError(
        e.message || "Something went wrong on our side. Please try again later."
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
  api: Api;
  app: App;
  from: number;
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

interface LocationState extends Location {
  success?: string;
  deployments?: number;
}

interface FetchDeploymentsAPIResponse {
  hasNextPage: boolean;
  deploys: Array<Deployment>;
}

export const useFetchDeployments = ({
  api,
  app,
  from,
  skipQuery,
  filters,
  setFrom,
}: UseFetchDeploymentsProps): UseFetchDeploymentsReturnValaue => {
  const location = useLocation<LocationState>();
  const [deployments, setDeployments] = useState<Array<Deployment>>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastFrom, setLastFrom] = useState(from);
  const refreshTime = location?.state?.deployments;
  const success = location?.state?.success;

  const { envId, status, published, branch } = filters || {};

  useEffect(() => {
    if (refreshTime && setFrom) {
      setLastFrom(0);
      setFrom(0);
    }
  }, [refreshTime]);

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
        appId: `${app.id}`,
        from,
        envId,
        status,
        published,
        branch,
      })
      .then((res) => {
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
  }, [
    api,
    app.id,
    envId,
    published,
    branch,
    status,
    refreshTime,
    from,
    skipQuery,
  ]);

  return {
    deployments,
    error,
    loading,
    hasNextPage,
    success,
    setDeployments,
  };
};
