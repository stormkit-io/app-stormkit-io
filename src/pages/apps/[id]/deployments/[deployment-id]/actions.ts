import { useState, useEffect } from "react";
import api from "~/utils/api/Api";

interface FetchDeploymentProps {
  app: App;
  deployId: string;
}

interface FetchDeployResponse {
  deploy?: Deployment;
  loading: boolean;
  error: string | null;
}

interface FetchDeployAPIResponse {
  deploy: Deployment;
}

export const useFetchDeployment = ({
  app,
  deployId,
}: FetchDeploymentProps): FetchDeployResponse => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deploy, setDeploy] = useState<Deployment>();
  const [time, setTime] = useState<number | null>(null);

  useEffect(() => {
    let unmounted = false;

    // Run setLoading only when time is null, subsequent calls shouldn't
    // put the whole view in loading state.
    if (time === null) {
      setLoading(true);
    }

    api
      .fetch<FetchDeployAPIResponse>(`/app/${app.id}/deploy/${deployId}`)
      .then(res => {
        if (unmounted !== true) {
          setDeploy(res.deploy);
          setLoading(false);
        }

        // If the deployment is still running, then refetch it every 5 seconds
        // by refreshing the time to trigger a new call.
        setTimeout(() => {
          if (unmounted !== true) {
            res.deploy.isRunning && setTime(Date.now());
          }
        }, 5000);
      })
      .catch(() => {
        if (unmounted !== true) {
          setLoading(false);
          setError(
            "Something went wrong on our side while fetching deployments. Please try again and if the problem persists contact us from Discord or email."
          );
        }
      });

    return () => {
      unmounted = false;
    };
  }, [api, app, deployId, time]);

  return { deploy, loading, error };
};

interface ScrollIntoViewProps {
  loading: boolean;
}

export const useScrollIntoView = ({ loading }: ScrollIntoViewProps) => {
  useEffect(() => {
    const el = document.getElementById("deploy-spinner-running");

    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading]);
};
