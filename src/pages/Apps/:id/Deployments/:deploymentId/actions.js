import { useState, useEffect } from "react";

export const useFetchDeployment = ({ api, app, deployId }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deploy, setDeploy] = useState({});
  const [time, setTime] = useState(null);

  useEffect(() => {
    let unmounted = false;

    // Run setLoading only when time is null, subsequent calls shouldn't
    // put the whole view in loading state.
    if (time === null) {
      setLoading(true);
    }

    api
      .fetch(`/app/${app.id}/deploy/${deployId}`)
      .then((res) => {
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
      .catch((e) => {
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

export const useScrollIntoView = ({ ref, loading }) => {
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ref, loading]);
};
