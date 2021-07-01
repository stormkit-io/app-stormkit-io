import React, { useState, useEffect } from "react";
import { Location } from "history";
import { useHistory, useLocation } from "react-router";
import Api from "~/utils/api/Api";
import Form from "~/components/Form";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import { updateAdditionalSettings } from "../actions";
import { toRepoAddr } from "../helpers";

const NodeJS14 = "nodejs14.x";
const NodeJS12 = "nodejs12.x";
const NodeJS10 = "nodejs10.x";

type Runtime = typeof NodeJS14 | typeof NodeJS12 | typeof NodeJS10;

const AutoDeployCommit = "commit";
const AutoDeployPullRequest = "pull_request";
const AutoDeployDisabled = "disabled";

type AutoDeploy =
  | typeof AutoDeployCommit
  | typeof AutoDeployPullRequest
  | typeof AutoDeployDisabled;

interface AdditionalSettings {
  runtime: Runtime;
}

interface Props {
  api: Api;
  app: App;
  environments: Array<Environment>;
  additionalSettings: AdditionalSettings;
}

interface LocationState extends Location {
  settingsSuccess: null | boolean;
  app: null | number;
}

const FormAppSettings: React.FC<Props> = ({
  api,
  app,
  environments,
  additionalSettings
}) => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [runtime, setRuntime] = useState<Runtime>(additionalSettings.runtime || NodeJS10); // prettier-ignore
  const [autoDeploy, setAutoDeploy] = useState<AutoDeploy>(
    app.autoDeploy || "disabled"
  );
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
        history
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
            "aria-label": "Display name"
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
            "aria-label": "Repository"
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
          onChange={e => setRuntime(e.target.value as Runtime)}
          inputProps={{
            "aria-label": "Runtime"
          }}
        >
          <Form.Option value={NodeJS10}>NodeJS 10.x</Form.Option>
          <Form.Option value={NodeJS12}>NodeJS 12.x</Form.Option>
          <Form.Option value={NodeJS14}>NodeJS 14.x</Form.Option>
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
          onChange={e => setAutoDeploy(e.target.value as AutoDeploy)}
          inputProps={{
            "aria-label": "Auto deploy"
          }}
        >
          <Form.Option value={AutoDeployDisabled}>Disabled</Form.Option>
          <Form.Option value={AutoDeployCommit}>On commit</Form.Option>
          <Form.Option value={AutoDeployPullRequest}>
            On pull request
          </Form.Option>
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
              onChange={e => setDefaultEnv(e.target.value as string)}
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
                "aria-label": "Match prefix"
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
      {error && (
        <InfoBox type={InfoBox.ERROR} className="mt-4">
          {error}
        </InfoBox>
      )}
      {successMessage && (
        <InfoBox
          type={InfoBox.SUCCESS}
          toaster
          dismissable
          onDismissed={() =>
            history.replace({
              state: { app: location?.state?.app, settingsSuccess: null }
            })
          }
        >
          {successMessage}
        </InfoBox>
      )}
    </Form>
  );
};

export default FormAppSettings;
