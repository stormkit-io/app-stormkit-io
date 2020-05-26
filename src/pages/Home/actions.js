import { useEffect, useState } from "react";

export const useFetchAppList = ({ api }) => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch apps
  useEffect(() => {
    let unmounted = false;

    setLoading(true);
    setError(false);

    api
      .fetch("/apps")
      .then((res) => {
        if (unmounted !== true) {
          setApps(res.apps);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (unmounted !== true) {
          setError(e.message);
        }
      });

    return () => {
      unmounted = true;
    };
  }, [api]);

  return { apps, loading, error };
};
