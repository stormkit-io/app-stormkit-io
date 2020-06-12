import { useEffect, useState } from "react";

export const useFetchEnvironments = ({ api, app }) => {
  const [environments, setEnvironments] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unmounted = false;

    setLoading(true);
    setError(null);

    api
      .fetch(`/app/${app.id}/envs`)
      .then((res) => {
        if (unmounted !== true) {
          setEnvironments(res.envs);
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
  }, [api, app]);

  return { environments, error, loading, hasNextPage };
};
