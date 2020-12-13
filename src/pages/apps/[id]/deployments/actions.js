import { useEffect, useState } from "react";

export const deleteForever = ({
  api,
  appId,
  deploymentId,
  deployments,
  setLoading,
  setDeployments,
}) => {
  setLoading(true);

  return api.delete(`/app/deploy`, { deploymentId, appId }).then(() => {
    setDeployments(deployments.filter((d) => d.id !== deploymentId));
  });
};

export const publishDeployments = ({ api, app, setPublishError, history }) => (
  sliders,
  envId
) => {
  setPublishError(null);

  const publish = [];
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
    return setPublishError(
      `The sum of percentages has be to 100. Currently it is ${total}.`
    );
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

export const useFetchDeployments = ({
  api,
  app,
  location,
  from,
  filters = {},
}) => {
  const [deployments, setDeployments] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { envId, branch, published } = filters;
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
          setDeployments((d) => [...d, ...res.deploys]);
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
