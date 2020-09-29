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
      .then(res => {
        if (unmounted !== true) {
          setApps(res.apps);
          setLoading(false);
        }
      })
      .catch(e => {
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

export const useFetchApp = ({ api, appId, location }) => {
  const [app, setApp] = useState(appCache[appId] || {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const refresh = location?.state?.app;

  useEffect(() => {
    let unmounted = false;

    if (appCache[appId] && !refresh) {
      return;
    }

    !refresh && setLoading(true); // Do not refresh when updating app object.
    setError(false);

    api
      .fetch(`/app/${appId}`)
      .then(res => {
        const app = res.app;
        const pieces = app.repo.split("/");
        app.provider = pieces.shift();
        app.name = pieces.join("/");
        if (unmounted !== true) {
          setApp(app);
        }
      })
      .catch(error => {
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
  }, [api, appId, refresh]);

  return { app, loading, error };
};

export const deploy = ({
  api,
  app,
  setLoading,
  setError,
  toggleModal,
  history,
  environment
}) => ({ branch }) => {
  if (!environment) {
    return setError("Please select an environment.");
  }

  setLoading(true);

  api
    .post(`/app/deploy`, { env: environment.env, branch, appId: app.id })
    .then(deploy => {
      toggleModal(false, () => {
        if (deploy && deploy.id) {
          history.push(`/apps/${app.id}/deployments/${deploy.id}`);
        }
      });
    })
    .catch(res => {
      if (res.status === 429) {
        setError(
          "You have exceeded the maximum number of concurrent builds " +
            "allowed for your application. Please wait until your other " +
            "deployments are completed. You can always upgrade your package " +
            "if you need more concurrent builds."
        );
      } else {
        setError(
          "Something wrong happened here. Please contact us at hello@stormkit.io"
        );
      }
    })
    .finally(() => {
      setLoading(false);
    });
};
