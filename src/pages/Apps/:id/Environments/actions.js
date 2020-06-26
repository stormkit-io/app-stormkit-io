import { useEffect, useState } from "react";

export const useFetchEnvironments = ({ api, app }) => {
  const [environments, setEnvironments] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unmounted = false;

    if (!app.id) {
      return;
    }

    setLoading(true);
    setError(null);

    api
      .fetch(`/app/${app.id}/envs`)
      .then((res) => {
        if (unmounted !== true) {
          setHasNextPage(res.hasNextPage);
          setEnvironments(
            res.envs.map((e) => ({
              ...e,
              getDomainName: () => {
                return e.domain?.name && e.domain?.verified
                  ? e.domain.name
                  : e.env === "production"
                  ? `${app.displayName}.stormkit.dev`
                  : `${app.displayName}--${e.env}.stormkit.dev`;
              },
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
  }, [api, app]);

  return { environments, error, loading, hasNextPage };
};

export const STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  NOT_CONFIGURED: "NOT_CONFIGURED",
};

export const useFetchStatus = ({ api, app, domain, lastDeploy }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const lastDeployId = lastDeploy?.id;

  useEffect(() => {
    let unmounted = false;

    if (!lastDeployId) {
      setStatus(STATUS.NOT_CONFIGURED);
      return;
    }

    setLoading(true);

    api
      .post("/app/proxy", {
        url: `https://${domain}`,
        appId: app.id,
      })
      .then((res) => {
        if (!unmounted) {
          setStatus(res.status);
        }
      })
      .finally(() => {
        if (!unmounted) {
          setLoading(false);
        }
      });

    return () => {
      unmounted = true;
    };
  }, [domain, lastDeployId, app.id, api]);

  return { status, loading };
};
