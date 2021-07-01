import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatRepo } from "./helpers";

/**
 * Action to delete an application.
 */
export const deleteApp = ({ api, app, confirmModal, history }) => () => {
  confirmModal(
    "This will completely remove the application. All associated files and endpoints will be gone. Remember there is no going back from here.",
    {
      onConfirm: ({ closeModal, setError, setLoading }) => {
        setLoading(true);
        api
          .delete("/app", { appId: app.id })
          .then(() => {
            setLoading(false);
            closeModal(() => history.push("/"));
          })
          .catch(() => {
            setLoading(false);
            setError(
              "Something went wrong on our side. Please try again. If the problem persists reach us out through Discord or email."
            );
          });
      }
    }
  );
};

export const updateDeployTrigger = ({
  api,
  app,
  setLoading,
  setError,
  history
}) => () => {
  setLoading(true);
  setError(null);

  api
    .put(`/app/deploy-trigger`, { appId: app.id })
    .then(() => {
      setLoading(false);
      history.replace({
        state: {
          app: Date.now(), // This will trigger a re-fetch for the app.
          triggerDeploysSuccess: "Endpoint was created successfully."
        }
      });
    })
    .catch(() => {
      setLoading(false);
      setError(
        "Something went wrong while generating a new hash. Please try again and if the problem persists contact us on Discord or Email."
      );
    });
};

export const useFetchAdditionalSettings = ({ api, app, location }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const refresh = location?.state?.app;

  useEffect(() => {
    let unmounted = false;

    setLoading(true);
    setError(null);

    api
      .fetch(`/app/${app.id}/settings`)
      .then(res => {
        if (unmounted !== true) {
          setSettings({
            trigger: res.deployTrigger,
            hooks: res.deployHooks,
            runtime: res.runtime,
            envs: res.envs
          });
        }
      })
      .catch(() => {
        if (unmounted !== true) {
          setError(
            "Failed fetching application settings. Please try again and if the problem persists contact us from Discord or email."
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
  }, [api, app.id, refresh]);

  return { loading, error, settings };
};

export const updateAdditionalSettings = ({
  api,
  app,
  setLoading,
  setError,
  history
}) => ({
  repo,
  displayName,
  autoDeploy,
  commitPrefix,
  runtime,
  defaultEnv
}) => {
  repo = formatRepo(repo);
  setLoading(true);
  setError(null);

  api
    .put(`/app`, {
      appId: app.id,
      displayName,
      repo,
      autoDeploy,
      runtime,
      defaultEnv,
      commitPrefix: autoDeploy !== "disabled" ? commitPrefix : undefined
    })
    .then(() => {
      setLoading(false);
      history.replace({
        state: {
          app: Date.now(), // This will trigger a re-fetch for the app.
          settingsSuccess: "Your app has been updated successfully."
        }
      });
    })
    .catch(res => {
      res
        .json()
        .then(({ errors }) => {
          setLoading(false);
          setError(
            Object.keys(errors)
              .map(k => errors[k])
              .join(", ")
          );
        })
        .catch(() => {
          setLoading(false);
          setError(
            "Something went wrong happened while updating settings. " +
              "Please try again and if the problem persists contact us from Discord or email."
          );
        });
    });
};

export const updateHooks = ({
  api,
  app,
  setLoading,
  setError,
  history
}) => values => {
  const hooks = {
    slack: {
      webhook: values["slack.webhook"],
      channel: values["slack.channel"]?.replace(/^#+/, ""),
      onStart: values["slack.onStart"] === "true",
      onEnd: values["slack.onEnd"] === "true",
      onPublish: values["slack.onPublish"] === "true"
    }
  };

  if (
    hooks.slack.webhook === "" &&
    (hooks.slack.onStart || hooks.slack.onEnd || hooks.slack.onPublish)
  ) {
    return setError("Please provide a valid Slack webhook endpoint.");
  }

  setLoading(true);
  setError(null);

  api
    .put(`/app/hooks`, { hooks, appId: app.id })
    .then(() => {
      setLoading(false);
      history.replace({
        state: {
          app: Date.now(), // This will trigger a re-fetch for the app.
          integrationsSuccess: "Your app has been updated successfully."
        }
      });
    })
    .catch(res => {
      setLoading(false);

      if (res.status === 400) {
        return setError(
          "Invalid JSON request has been sent to th server. This is an internal error, please report this."
        );
      }

      if (res.status === 402) {
        return setError(
          <div>
            Your current package does not allow setting app hooks. You can
            always <Link to="/user/account">upgrade</Link> to proceed.
          </div>
        );
      }
    });
};
