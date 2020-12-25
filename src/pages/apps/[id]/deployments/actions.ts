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

interface Filter {
  envId: string;
  branch: string;
  published: boolean;
}

interface UseFetchDeploymentsProps {
  api: Api;
  app: App;
  from: number;
  filters?: Filter;
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

export const useFetchDeployments = ({
  api,
  app,
  from,
  filters,
}: UseFetchDeploymentsProps): UseFetchDeploymentsReturnValaue => {
  const location = useLocation<LocationState>();
  const [deployments, setDeployments] = useState<Array<Deployment>>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { envId, branch, published } = filters || {};
  const refreshTime = location?.state?.deployments;
  const success = location?.state?.success;

  useEffect(() => {
    let unmounted = false;

    // This is a special case where we reset the selected environment.
    if (envId === "") {
      setDeployments([]);
      return;
    }

    setLoading(true);
    setError(null);

    api
      .post("/app/deployments", {
        appId: `${app.id}`,
        from,
        envId,
        branch,
        published,
      })
      .then((res) => {
        if (unmounted !== true) {
          setDeployments(res.deploys);
          setHasNextPage(res.hasNextPage);
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
  }, [api, app.id, envId, branch, published, from, refreshTime]);

  return {
    deployments,
    error,
    loading,
    hasNextPage,
    success,
    setDeployments,
  };
};
