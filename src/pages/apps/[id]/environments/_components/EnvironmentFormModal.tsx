import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { RootContextProps } from "~/pages/Root.context";
import { AppContextProps } from "~/pages/apps/App.context";
import AuthContext, { AuthContextProps } from "~/pages/auth/Auth.context";
import Modal from "~/components/Modal";
import Form from "~/components/Form";
import Button from "~/components/Button";
import InfoBox from "~/components/InfoBox";
import ConfirmModal, { ConfirmModalProps } from "~/components/ConfirmModal";
import { connect } from "~/utils/context";
import {
  insertEnvironment,
  editEnvironment,
  useFetchRepoType,
  deleteEnvironment,
} from "../actions";

interface Props
  extends Pick<RootContextProps, "api">,
    Pick<AppContextProps, "app"> {
  environment?: Environment;
  isOpen: boolean;
  toggleModal: (val: boolean) => void;
}

interface ContextProps extends ConfirmModalProps, AuthContextProps {}

type EnvVar = { key: string; value: string };

const frameworks = ["angular", "nuxt", "next"];

const envVarsToArray = (environment?: Environment): Array<EnvVar> => {
  if (!environment?.build?.vars) {
    return [];
  }

  return Object.keys(environment.build.vars).map(key => ({
    key,
    value: environment ? environment.build.vars[key] : "",
  }));
};

const EnvironmentFormModal: React.FC<Props & ContextProps> = ({
  isOpen,
  toggleModal,
  environment: env,
  confirmModal,
  api,
  app,
  user,
}): React.ReactElement => {
  const history = useHistory();

  const [isAutoPublish, setIsAutoPublish] = useState<boolean>(
    env?.autoPublish ?? true
  );

  const [isAutoDeploy, setIsAutoDeploy] = useState<boolean>(
    env?.autoDeploy ?? true
  );

  const [showAutoDeployBranchWarning, setShowAutoDeployBranchWarning] =
    useState(Boolean(env?.autoDeployBranches));

  const [isServerless, setIsServerless] = useState(!!env?.build?.entry);
  const [envVars, setEnvVars] = useState(envVarsToArray(env));
  const [loading, setLoading] = useState(false);
  const [buildCmd, setBuildCmd] = useState(env?.build?.cmd || "");
  const [error, setError] = useState(null);
  const { meta } = useFetchRepoType({ api, app, env });
  const isDefault = app.defaultEnv === (env?.name || env?.env);
  const isFramework = frameworks.indexOf(meta.type) > -1;
  const isEdit = !!env?.id;
  const handleSubmit = isEdit ? editEnvironment : insertEnvironment;

  useEffect(() => {
    if (typeof env?.autoPublish !== "undefined") {
      setIsAutoPublish(env?.autoPublish);
    }
  }, [env?.autoPublish]);

  useEffect(() => {
    if (typeof env?.autoDeploy !== "undefined") {
      setIsAutoDeploy(env?.autoDeploy);
    }
  }, [env?.autoDeploy]);

  if (isEdit && !env?.id) {
    throw new Error(
      "Invalid environment object passed. Id is a required field."
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => toggleModal(false)}
      className="max-w-screen-sm"
    >
      <Form
        handleSubmit={handleSubmit({
          api,
          app,
          isServerless,
          isAutoPublish,
          isAutoDeploy,
          environmentId: env?.id || "",
          history,
          toggleModal,
          setLoading,
          setError,
        })}
      >
        <Form.Header className="mb-4">Environment details</Form.Header>
        <div className="mb-8">
          <Form.Input
            name="name"
            label="Name"
            className="bg-gray-90"
            required
            defaultValue={env?.env}
            fullWidth
            inputProps={{
              "aria-label": "Environment name",
            }}
          />
          <Form.Helper>The name of the environment.</Form.Helper>
        </div>
        <div className="mb-8">
          <Form.Input
            name="branch"
            label="Branch"
            className="bg-gray-90"
            required
            defaultValue={env?.branch}
            fullWidth
            inputProps={{
              "aria-label": "Branch name",
            }}
          />
          <Form.Helper>
            When auto deployments are enabled, merges/pushes to this branch will
            trigger a deployment with this configuration.
          </Form.Helper>
        </div>
        {user.isAdmin && (
          <div className="mb-8">
            <Form.Switch
              withWrapper
              className="mr"
              checked={isAutoDeploy}
              onChange={e => setIsAutoDeploy(e.target.checked)}
              inputProps={{
                "aria-label": "Auto deploy toggle",
              }}
            >
              Auto Deploy
            </Form.Switch>
            <Form.Helper>
              When enabled any push that matches <b>Auto Deploy Branches</b>{" "}
              configuration will be deployed.
            </Form.Helper>
          </div>
        )}
        <div className="mb-8">
          <Form.Switch
            withWrapper
            className="mr"
            checked={isAutoPublish}
            onChange={e => setIsAutoPublish(e.target.checked)}
            inputProps={{
              "aria-label": "Auto publish toggle",
            }}
          >
            Auto Publish
          </Form.Switch>
          <Form.Helper>
            When auto publish is enabled, successful deployments with the branch
            name above will be published automatically to the environment
            endpoint.
          </Form.Helper>
        </div>
        <div className="mb-16">
          <Form.Input
            name="autoDeployBranches"
            label="Auto deploy branches"
            className="bg-gray-90"
            disabled={!app.autoDeploy}
            onChange={e => {
              setShowAutoDeployBranchWarning(e.target.value !== "");
            }}
            defaultValue={env?.autoDeployBranches}
            fullWidth
            tooltip={
              <div>
                {!app.autoDeploy ? (
                  <p>
                    Enable auto deployments from the application's settings page
                    to use this feature.
                  </p>
                ) : (
                  <>
                    <h3 className="mb-4 font-bold">Examples</h3>
                    <ol>
                      <li className="mb-2">
                        <code className="text-white mr-2">
                          ^(?!dependabot).+
                        </code>{" "}
                        Match anything that does not start with{" "}
                        <b>dependabot</b>
                      </li>
                      <li className="mb-2">
                        <code className="text-white mr-2">^release-.+</code>
                        Match anything that starts with <b>release-</b>
                      </li>
                    </ol>
                  </>
                )}
              </div>
            }
            InputProps={{
              endAdornment: <code className="ml-1 mr-2 text-pink-50">/i</code>,
              startAdornment: <code className="mr-1 text-pink-50">/</code>,
            }}
            inputProps={{
              "aria-label": "Auto deploy branches",
            }}
          />
          <Form.Helper>
            Regexp to specify for which branches auto deployments are enabled.{" "}
            {isDefault
              ? "When left empty all branches will be deployed with this configuration if the auto deployment is enabled."
              : "When left empty only branches which correspond to the branch field will be deployed with this configuration."}
            The pattern is case insensitive.
          </Form.Helper>
          {isDefault && showAutoDeployBranchWarning && Boolean(app.autoDeploy) && (
            <InfoBox className="mt-4">
              The <b>Auto Deploy Branches</b> configuration will overwrite the
              default environment behaviour. If feature branches do not match
              the <b>Auto Deploy Branches</b> configuration, they won't be
              deployed.
            </InfoBox>
          )}
        </div>
        <Form.Header className="mb-4">Build configuration</Form.Header>
        <div className="flex flex-col">
          <div className="mb-8">
            <Form.Switch
              withWrapper
              className="mr"
              checked={isServerless}
              onChange={e => setIsServerless(e.target.checked)}
            >
              Serverless
            </Form.Switch>
            <Form.Helper>
              Turn on to enable serverless side rendering. If turned on, your
              application will be served from lambdas.
            </Form.Helper>
          </div>
          {!isFramework && isServerless && (
            <div className="mb-8 hidden">
              <Form.Input
                name="build.entry"
                label="Serverless entry file"
                className="bg-gray-90"
                defaultValue={env?.build?.entry || ""}
                fullWidth
                inputProps={{
                  "aria-label": "Serverless entry file",
                }}
              />
            </div>
          )}
          {!isFramework && (
            <div className="mb-8">
              <Form.Input
                name="build.distFolder"
                label="Public folder"
                className="bg-gray-90"
                defaultValue={env?.build?.distFolder || ""}
                inputProps={{
                  "aria-label": "Output/dist folder",
                }}
                fullWidth
              />
              <Form.Helper>
                The output folder that will be uploaded to our CDN. Usually this
                is either <b>dist</b> or <b>build</b>.
              </Form.Helper>
            </div>
          )}
          <div className="mb-16">
            <Form.Input
              name="build.cmd"
              label="Build command"
              className="bg-gray-90"
              onChange={item => setBuildCmd(item.target.value)}
              value={buildCmd}
              inputProps={{
                "aria-label": "Build command",
              }}
              fullWidth
            />
            <Form.Helper>
              The build command specified in your <code>package.json</code>.
              Chain multiple commands with the <b>&amp;&amp;</b> operator - i.e.
              npm run test &amp;&amp; npm run build
            </Form.Helper>
          </div>
          <Form.Header>Environment variables</Form.Header>
          <Form.Helper className="pl-0 mb-6">
            Environment variables that will be injected during the build
            process.
          </Form.Helper>
          <div className="mb-8" id="env-vars">
            <Form.KeyValue
              defaultValues={envVars}
              keyProps={{
                name: "build.vars.keys",
                label: "Key",
                inputProps: {
                  "aria-label": `Environment variable name`,
                },
              }}
              valueProps={{
                name: "build.vars.values",
                label: "Value",
                inputProps: {
                  "aria-label": `Environment variable value`,
                },
              }}
              plusButtonAriaLabel="Add new environment variable"
              onChange={setEnvVars}
            />
          </div>
          {error && (
            <InfoBox type={InfoBox.ERROR} className="mb-8" scrollIntoView>
              {error}
            </InfoBox>
          )}
          <div className="flex justify-between">
            {isEdit && env?.env !== "production" && (
              <Button
                secondary
                type="button"
                aria-label="Delete environment"
                onClick={() =>
                  confirmModal(
                    "This will completely remove the environment and all associated deployments.",
                    {
                      onConfirm: ({ closeModal, setLoading, setError }) => {
                        deleteEnvironment({
                          api,
                          app,
                          environment: env,
                          history,
                          setLoading,
                          setError,
                          closeModal,
                        });
                      },
                    }
                  )
                }
              >
                Delete
              </Button>
            )}
            <div className="flex flex-auto justify-end">
              <Button
                type="button"
                secondary
                onClick={() => toggleModal(false)}
              >
                Cancel
              </Button>
              <Button primary className="ml-4" loading={loading}>
                {isEdit ? "Update" : "Create"} environment
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default connect<Props, ContextProps>(EnvironmentFormModal, [
  { Context: ConfirmModal, props: ["confirmModal"], wrap: true },
  { Context: AuthContext, props: ["user"] },
]);
