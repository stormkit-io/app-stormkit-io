import React, { useEffect, useState } from "react";
import { toArray } from "~/utils/helpers/array";

export const useFetchEnvironments = ({ api, app, location }) => {
  const [environments, setEnvironments] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const refresh = location.state?.envs;

  useEffect(() => {
    let unmounted = false;

    if (!app.id) {
      return;
    }

    setLoading(true);
    setError(null);

    api
      .fetch(`/app/${app.id}/envs`)
      .then(res => {
        if (unmounted !== true) {
          setHasNextPage(res.hasNextPage);
          setEnvironments(
            res.envs.map(e => ({
              ...e,
              getDomainName: () => {
                return e.domain?.name && e.domain?.verified
                  ? e.domain.name
                  : e.env === "production"
                  ? `${app.displayName}.stormkit.dev`
                  : `${app.displayName}--${e.env}.stormkit.dev`;
              }
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
  }, [api, app.id, app.displayName, refresh]);

  return { environments, error, loading, hasNextPage };
};

export const STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  NOT_CONFIGURED: "NOT_CONFIGURED"
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
        appId: app.id
      })
      .then(res => {
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

export const useFetchRepoType = ({ app, api, env }) => {
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const name = env?.env || "production";

  useEffect(() => {
    let unmounted = false;

    setLoading(true);

    api
      .fetch(`/app/${app.id}/envs/${name}/meta`)
      .then(res => {
        if (unmounted !== true) {
          setMeta(res);
        }
      })
      .catch(() => {
        if (unmounted !== true) {
          setMeta({ type: "-" });
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
  }, [api, app.id, name]);

  return { meta, loading };
};

export const deleteEnvironment = ({
  api,
  app,
  environment,
  history,
  setLoading,
  setError,
  closeModal
}) => {
  const name = environment?.env;

  if (!name) {
    return;
  }

  setLoading(true);

  return api
    .delete(`/app/env`, {
      appId: app.id,
      env: name
    })
    .then(() => {
      setLoading(false);
      closeModal(() => {
        history.push({
          pathname: `/apps/${app.id}/environments`,
          state: {
            envs: Date.now(),
            message: "Environment has been removed successfully."
          }
        });
      });
    })
    .catch(() => {
      setLoading(false);
      setError(
        "Something went wrong while deleting the environment. Please try again, if the problem persists contact us from Discord or email."
      );
    });
};

const prepareBuildObject = (values, isServerless) => {
  const vars = {};

  const keys = toArray(values["build.vars.keys"]);
  const vals = toArray(values["build.vars.values"]);

  keys.forEach((key, i) => {
    vars[key] = vals[i].replace(/^['"]+|['"]+$/g, "");
  });

  const build = {
    cmd: values["build.cmd"],
    entry: values["build.entry"] || "",
    distFolder: values["build.distFolder"] || "",
    vars
  };

  if (!build.cmd) {
    build.cmd = "echo 'skip build step'";
  }

  if (isServerless && !build.entry) {
    build.entry = "__SSR__";
  }

  return build;
};

export const insertEnvironment = ({
  api,
  app,
  history,
  isServerless,
  isAutoPublish,
  toggleModal,
  setError,
  setLoading
}) => values => {
  const { name, branch } = values;
  const build = prepareBuildObject(values, isServerless);

  if (!name || !branch) {
    return setError("Environment and branch names are required.");
  }

  setLoading(false);

  api
    .post(`/app/env`, {
      appId: app.id,
      env: name,
      branch,
      build,
      autoPublish: isAutoPublish
    })
    .then(() => {
      setLoading(false);
      toggleModal(false, () => {
        history.replace({
          state: {
            envs: Date.now(),
            message:
              "Environment has been created successfully. You can now deploy with your new configuration."
          }
        });
      });
    })
    .catch(async res => {
      setLoading(false);
      const data = await res.json();

      if (data.errors.env) {
        setError(data.errors.env);
      } else {
        return Promise.reject();
      }
    })
    .catch(() => {
      setError(
        "Something went wrong while creating the environment. Please try again, if the problem persists reach us from Discord."
      );
    });
};

export const editEnvironment = ({
  api,
  app,
  history,
  isServerless,
  isAutoPublish,
  environmentId,
  toggleModal,
  setError,
  setLoading
}) => values => {
  const { name, branch } = values;
  const build = prepareBuildObject(values, isServerless);

  if (!name || !branch) {
    return setError("Environment and branch names are required.");
  }

  setLoading(true);

  api
    .put(`/app/env`, {
      appId: app.id,
      envId: environmentId,
      env: name,
      branch,
      build,
      autoPublish: isAutoPublish
    })
    .then(() => {
      setLoading(false);
      toggleModal(false, () => {
        history.replace({
          state: {
            envs: Date.now(),
            message:
              "Environment has been updated successfully. You can now deploy with your new configuration."
          }
        });
      });
    })
    .catch(async res => {
      console.log(res);
      const data = await res.json();

      let message;

      if (data.code === "duplicate") {
        message =
          "You can't have duplicate environments or branch names for the same application.";
      } else if (res.status === 400 && data.errors) {
        message = Object.keys(data.errors).map(k => (
          <div key={k}>{data.errors[k]}</div>
        ));
      }

      setError(message);
      setLoading(false);
    });
};
