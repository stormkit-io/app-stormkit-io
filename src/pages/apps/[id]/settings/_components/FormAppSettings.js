import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Form from "~/components/Form";
import InfoBox, { SUCCESS, ERROR } from "~/components/InfoBox";
import Button from "~/components/Button";
import { updateAdditionalSettings } from "../actions";
import { toRepoAddr } from "../helpers";

const FormAppSettings = ({
  api,
  app,
  environments,
  additionalSettings,
  history,
  location,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [runtime, setRuntime] = useState(additionalSettings.runtime || "nodejs10.x"); // prettier-ignore
  const [autoDeploy, setAutoDeploy] = useState(app.autoDeploy || "disabled");
  const [defaultEnv, setDefaultEnv] = useState(app.defaultEnv);
  const isAutoDeployEnabled = autoDeploy !== "disabled";
  const successMessage = location?.state?.settingsSuccess;

  useEffect(() => {
    if (additionalSettings.runtime) {
      setRuntime(additionalSettings.runtime);
    }
  }, [additionalSettings.runtime]);

  return (
    <Form
      handleSubmit={updateAdditionalSettings({
        app,
        api,
        setLoading,
        setError,
        history,
      })}
    >
      <Form.Section label="Display name">
        <Form.Input
          name="displayName"
          className="bg-gray-90"
          required
          defaultValue={app.displayName}
          fullWidth
          inputProps={{
            "aria-label": "Display name",
          }}
        />
        <Form.Description>
          The display name has to be unique over the whole Stormkit application
          ecosystem. It will be used as a prefix for your deployment endpoints.
          You can change it as many times as you wish, however be aware that as
          soon as your display name is changed, the old one will be available
          for others to use.
        </Form.Description>
      </Form.Section>
      <Form.Section label="Repository">
        <Form.Input
          name="repo"
          className="bg-gray-90"
          required
          defaultValue={toRepoAddr(app.repo)}
          fullWidth
          inputProps={{
            "aria-label": "Repository",
          }}
        />
        <Form.Description>
          The repository address of your application. You can paste the full
          https address here, we'll take care of formatting it for Stormkit.
        </Form.Description>
      </Form.Section>
      <Form.Section label="Runtime">
        <Form.Select
          name="runtime"
          displayEmpty
          value={runtime}
          onChange={(v) => setRuntime(v)}
          inputProps={{
            "aria-label": "Runtime",
          }}
        >
          <Form.Option value="nodejs10.x">NodeJS 10.x</Form.Option>
          <Form.Option value="nodejs12.x">NodeJS 12.x</Form.Option>
        </Form.Select>
        <Form.Description>
          The application runtime for deployments and server side environment.
        </Form.Description>
        {runtime !== additionalSettings.runtime &&
          typeof additionalSettings.runtime !== "undefined" && (
            <InfoBox className="mt-4">
              This change will only be applied to your new deployments.
            </InfoBox>
          )}
      </Form.Section>
      <Form.Section label="Auto deploys" marginBottom="mb-4">
        <Form.Select
          name="autoDeploy"
          displayEmpty
          value={autoDeploy}
          onChange={(v) => setAutoDeploy(v)}
          inputProps={{
            "aria-label": "Auto deploy",
          }}
        >
          <Form.Option value="disabled">Disabled</Form.Option>
          <Form.Option value="commit">On commit</Form.Option>
          <Form.Option value="pull_request">On pull request</Form.Option>
        </Form.Select>
        <Form.Description>
          Specify whether automatic deployments are enabled or not.
        </Form.Description>
        {isAutoDeployEnabled && (
          <div className="mt-4">
            <Form.Select
              name="defaultEnv"
              label="Default environment"
              displayEmpty
              value={defaultEnv}
              onChange={(v) => setDefaultEnv(v)}
            >
              {environments.map(({ env }) => (
                <Form.Option value={env} key={env}>
                  {env}
                </Form.Option>
              ))}
            </Form.Select>
            <Form.Description>
              Specify which environment configuration should feature branches
              use. Any branch that has no corresponding environment will default
              to this configuration.
            </Form.Description>
          </div>
        )}
        {isAutoDeployEnabled && (
          <div className="mt-4">
            <Form.Input
              name="commitPrefix"
              label="Match prefix"
              className="bg-gray-90"
              defaultValue={app.commitPrefix}
              fullWidth
              inputProps={{
                "aria-label": "Match prefix",
              }}
            />
            <Form.Description>
              The optional prefix that will tell Stormkit to deploy only commits
              or pull requests starting with the given prefix. This is
              especially useful if you're using a monorepo and hosting different
              apps on Stormkit.
            </Form.Description>
          </div>
        )}
      </Form.Section>
      <div className="flex justify-end">
        <Button primary loading={loading} type="submit">
          Update
        </Button>
      </div>
      {error && <InfoBox type={ERROR}>{error}</InfoBox>}
      {successMessage && (
        <InfoBox
          type={SUCCESS}
          toaster
          dismissable
          onDismissed={() =>
            history.replace({
              state: { app: location?.state?.app, settingsSuccess: null },
            })
          }
        >
          {successMessage}
        </InfoBox>
      )}
    </Form>
  );
};

FormAppSettings.propTypes = {
  app: PropTypes.object,
  api: PropTypes.object,
  environments: PropTypes.array,
  additionalSettings: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
};

export default FormAppSettings;
