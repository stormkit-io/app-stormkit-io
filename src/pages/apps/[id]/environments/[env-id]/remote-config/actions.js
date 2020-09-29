import { useEffect, useState } from "react";
import { keyToName } from "./helpers";

export const useFetchRemoteConfig = ({ api, app, env, location }) => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({});
  const [error, setError] = useState(null);
  const rcTime = location.state?.rc;

  useEffect(() => {
    let unmounted = false;
    setLoading(true);
    setError(null);

    api
      .fetch(`/app/${app.id}/envs/${env.env}/remote-config`)
      .then((res) => {
        if (unmounted !== true) {
          setConfig(res.config || {});
        }
      })
      .catch((res) => {
        if (unmounted !== true) {
          setError(
            res.error ||
              "Something went wrong on our side. Please reach us if the problem persists."
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
  }, [api, app.id, env.env, rcTime]);

  return { error, loading, config, setConfig };
};

export const deleteKeyFromConfig = ({
  api,
  app,
  config,
  environment,
  history,
  setLoading,
  setError,
  closeModal,
}) => (oldName) => {
  const newConfig = { ...config };
  delete newConfig[oldName];

  setLoading(true);

  return api
    .put(`/app/env/remote-config`, {
      appId: app.id,
      env: environment.env,
      config: newConfig,
    })
    .then(() => {
      closeModal(() => {
        history.replace({
          state: {
            rc: Date.now(),
          },
        });
      });
    })
    .catch(() => {
      setError(
        "Something went wrong while deleting the config. Please try again, if the problem persists contact us from Discord or email."
      );
    })
    .finally(() => {
      setLoading(false);
    });
};

export const upsertRemoteConfig = ({
  api,
  app,
  config,
  environment,
  setError,
  setLoading,
  history,
  toggleModal,
}) => (values) => {
  const name = values.name.trim();

  if (name === "") {
    return setError("Parameter name cannot be empty.");
  }

  if (config[name] && name !== values.nameOld) {
    return setError(
      "This name already exists in the config. Please either update or delete it."
    );
  }

  setLoading(true);

  const normalized = {
    desc: values.desc,
    experimentId: values.experimentId,
    targetings: [],
  };

  Object.keys(keyToName).forEach((key) => {
    if (!Array.isArray(values[`targetings.${key}`])) {
      values[`targetings.${key}`] = [values[`targetings.${key}`]];
    }

    values[`targetings.${key}`].forEach((v, i) => {
      normalized.targetings[i] = normalized.targetings[i] || {};
      normalized.targetings[i][key] = v;
    });
  });

  const newConfig = { ...config, [name]: normalized };

  // Delete the previous version in case name has changed.
  if (name !== values.nameOld) {
    delete newConfig[values.nameOld];
  }

  return api
    .put(`/app/env/remote-config`, {
      appId: app.id,
      env: environment.env,
      config: newConfig,
    })
    .then(() => {
      toggleModal(false, () =>
        history.replace({
          state: {
            rc: Date.now(),
          },
        })
      );
    })
    .catch(() => {
      const error =
        "Something went wrong on our side. Please try again later or reach us if the problem persists.";

      if (typeof setError === "function") {
        setError(error);
      } else {
        throw new Error(error);
      }
    })
    .finally(() => {
      setLoading(false);
    });
};
