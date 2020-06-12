import { useEffect, useState } from "react";

export const useFetchAppList = ({ api }) => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

const appCache = {};

export const useFetchApp = ({ api, appId }) => {
  const [app, setApp] = useState(appCache[appId] || {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unmounted = false;

    if (appCache[appId]) {
      return;
    }

    setLoading(true);
    setError(false);

    api
      .fetch(`/app/${appId}`)
      .then((res) => {
        const app = res.app;
        const pieces = app.repo.split("/");
        app.provider = pieces.shift();
        app.name = pieces.join("/");
        if (unmounted !== true) {
          setApp(app);
        }
      })
      .catch((error) => {
        if (unmounted !== true) {
          setApp(null);
          setError(error);
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
  }, [api, appId]);

  return { app, loading, error };
};
