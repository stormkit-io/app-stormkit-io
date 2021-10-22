import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { RootContextProps } from "~/pages/Root.context";
import { AppContextProps } from "~/pages/apps/App.context";
import Modal, { ModalContextProps } from "~/components/Modal";
import Link from "~/components/Link";
import Form from "~/components/Form";
import Button from "~/components/Button";
import InfoBox from "~/components/InfoBox";
import ConfirmModal, { ConfirmModalProps } from "~/components/ConfirmModal";
import { PlusButton } from "~/components/Buttons";
import { connect } from "~/utils/context";
import {
  insertEnvironment,
  editEnvironment,
  useFetchRepoType,
  deleteEnvironment,
} from "../actions";

interface Props
  extends ConfirmModalProps,
    Pick<RootContextProps, "api">,
    Pick<AppContextProps, "app"> {
  environment: Environment;
}

type EnvVar = { key: string; value: string };

const ModalContext = Modal.Context();
const frameworks = ["angular", "nuxt", "next"];

const envVarsToArray = (environment: Environment): Array<EnvVar> => {
  if (!environment?.build?.vars) {
    return [];
  }

  return Object.keys(environment.build.vars).map(key => ({
    key,
    value: environment ? environment.build.vars[key] : "",
  }));
};

const EnvironmentFormModal: React.FC<Props & ModalContextProps> = ({
  isOpen,
  toggleModal,
  environment: env,
  confirmModal,
  api,
  app,
}): React.ReactElement => {
  const history = useHistory();

  const [isAutoPublish, setIsAutoPublish] = useState(env?.autoPublish || true);
  const [isServerless, setIsServerless] = useState(!!env?.build?.entry);
  const [envVars, setEnvVars] = useState(envVarsToArray(env));
  const [loading, setLoading] = useState(false);
  const [buildCmd, setBuildCmd] = useState(env?.build?.cmd || "");
  const [error, setError] = useState(null);
  const { meta } = useFetchRepoType({ api, app, env });
  const isFramework = frameworks.indexOf(meta.type) > -1;
  const isEdit = !!env?.id;
  const handleSubmit = isEdit ? editEnvironment : insertEnvironment;

  useEffect(() => {
    if (typeof env?.autoPublish !== "undefined") {
      setIsAutoPublish(env?.autoPublish);
    }
  }, [env?.autoPublish]);

  if (isEdit && !env?.id) {
    throw new Error(
      "Invalid environment object passed. Id is a required field."
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => toggleModal(false)}
      className="max-w-screen-lg"
    >
      <Form
        handleSubmit={handleSubmit({
          api,
          app,
          isServerless,
          isAutoPublish,
          environmentId: env?.id || "",
          history,
          toggleModal,
          setLoading,
          setError,
        })}
      >
        <h3 className="mb-8 font-bold">Environment details</h3>
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
          <div className="p-3 text-sm opacity-50">
            The name which this environment is going to use. You cannot change
            the name after having created the environment.
          </div>
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
          <div className="p-3 text-sm opacity-50">
            Pushes/merges to this branch will trigger an auto deploy when auto
            deploys are enabled.
          </div>
        </div>
        <div>
          <div className="flex w-full border border-solid border-gray-85 rounded py-2 items-center text-sm bg-gray-90">
            <Form.Switch
              className="mr"
              checked={isAutoPublish}
              onChange={e => setIsAutoPublish(e.target.checked)}
              inputProps={{
                "aria-label": "Auto publish toggle",
              }}
            />
            Auto Publish
          </div>
          <div className="p-3 text-sm opacity-50">
            When auto publish is enabled, successful deployments will be
            published automatically.
          </div>
        </div>
        <h3 className="my-8 font-bold">Build configuration</h3>
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex w-full border border-solid border-gray-85 rounded py-2 items-center text-sm bg-gray-90">
              <Form.Switch
                className="mr"
                checked={isServerless}
                onChange={e => setIsServerless(e.target.checked)}
              />
              Serverless
            </div>
            <div className="p-3 text-sm opacity-50">
              Turn on to enable serverless side rendering. If turned on, your
              application will be served from lambdas.
            </div>
          </div>
          {!isFramework && isServerless && (
            <div className="mb-8">
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
              <div className="p-3 text-sm opacity-50">
                The entry file for the server side application. For more
                information refer to our{" "}
                <Link
                  to="https://www.stormkit.io/docs/deployments/configuration"
                  secondary
                >
                  docs
                </Link>
                .
              </div>
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
              <div className="p-3 text-sm opacity-50">
                The output folder that will be uploaded to our CDN. Usually this
                is either <b>dist</b> or <b>build</b>.
              </div>
            </div>
          )}
          <div>
            <Form.Input
              name="build.cmd"
              label="Build command"
              error={!buildCmd.length}
              className="bg-gray-90"
              onChange={item => setBuildCmd(item.target.value)}
              value={buildCmd}
              required={meta.packageJson}
              inputProps={{
                "aria-label": "Build command",
              }}
              fullWidth
            />
            <div className="p-3 text-sm opacity-50">
              The command to build your application. You can chain multiple
              commands with the <b>&amp;&amp;</b> operator. (i.e. npm run test
              &amp;&amp; npm run build)
            </div>
          </div>
          <h3 className="mt-8 font-bold">Environment variables</h3>
          <div className="pt-3 text-sm opacity-50 mb-8">
            These variables can be used both on client-side and on server-side.
            Variables not used won't appear in the source code.
          </div>
          <div className="mb-8" id="env-vars">
            {envVars.map(({ key, value }, i) => (
              <div className="flex justify-between mb-2" key={`${key}${i}`}>
                <div className="flex-auto mr-2">
                  <Form.Input
                    name="build.vars.keys"
                    label="Key"
                    multiline
                    className="bg-gray-90"
                    defaultValue={key}
                    fullWidth
                    inputProps={{
                      "aria-label": `Environment variable name ${i}`,
                    }}
                  />
                </div>
                <div className="flex flex-auto items-center max-w-1/2 relative">
                  <Form.Input
                    name="build.vars.values"
                    label="Value"
                    multiline
                    className="bg-gray-90"
                    defaultValue={value}
                    fullWidth
                    inputProps={{
                      "aria-label": `Environment variable value ${i}`,
                    }}
                  />
                  <Button
                    styled={false}
                    className="absolute right-0 -mr-6"
                    type="button"
                    onClick={() => {
                      const copy = envVars.slice(0);
                      copy.splice(i, 1);
                      setEnvVars(copy);
                    }}
                  >
                    <span className="fas fa-minus-circle red-50" />
                  </Button>
                </div>
              </div>
            ))}
            <PlusButton
              className="mt-2"
              size="small"
              aria-label="Add new environment variable"
              onClick={() => {
                setEnvVars([...envVars, { key: "", value: "" }]);
              }}
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

export default Object.assign(
  connect<Props, ModalContextProps>(EnvironmentFormModal, [
    { Context: ModalContext, props: ["toggleModal", "isOpen"] },
    { Context: ConfirmModal, props: ["confirmModal"], wrap: true },
  ]),
  ModalContext
);
