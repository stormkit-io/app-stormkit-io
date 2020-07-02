import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Modal from "~/components/Modal";
import Link from "~/components/Link";
import Form from "~/components/Form";
import Button from "~/components/Button";
import InfoBox from "~/components/InfoBox";
import ConfirmModal from "~/components/ConfirmModal";
import { PlusButton } from "~/components/Buttons";
import { connect } from "~/utils/context";
import {
  insertEnvironment,
  editEnvironment,
  useFetchRepoType,
  deleteEnvironment,
} from "../actions";

const ModalContext = Modal.Context();

const supportedFrameworks = [
  { text: "Next.js", value: "next" },
  { text: "Nuxt.js", value: "nuxt" },
  { text: "Angular", value: "angular" },
  { text: "Other", value: "other" },
];

const envVarsToArray = (environment) =>
  Object.keys(environment?.build?.vars || { "": "" }).map((key) => ({
    key,
    value: environment ? environment.build.vars[key] : "",
  }));

const EnvironmentFormModal = ({
  isOpen,
  toggleModal,
  environment,
  confirmModal,
  api,
  app,
  history,
}) => {
  const [isAutoPublish, setIsAutoPublish] = useState(true);
  const [isServerless, setIsServerless] = useState(!!environment?.build?.entry);
  const [envVars, setEnvVars] = useState(envVarsToArray(environment));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [framework, setFramework] = useState("");
  const isFramework = framework !== "" && framework !== "other";
  const { meta } = useFetchRepoType({ api, app, env: environment });
  const isEdit = !!environment?.id;
  const handleSubmit = isEdit ? editEnvironment : insertEnvironment;

  useEffect(() => {
    setFramework(
      supportedFrameworks.filter((f) => f.value === meta.type)[0]?.value ||
        "other"
    );
  }, [meta.type]);

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
          name: environment?.env,
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
            defaultValue={environment?.env}
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
            defaultValue={environment?.branch}
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
              onChange={(e) => setIsAutoPublish(e.target.checked)}
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
          <div className="flex-auto mb-8">
            <Form.Select
              name="framework"
              displayEmpty
              value={framework}
              SelectDisplayProps={{
                className: "bg-gray-90 w-full p-4 rounded text-gray-40",
              }}
              onChange={(f) => setFramework(f)}
            >
              <Form.Option disabled value="">
                Pick your framework
              </Form.Option>
              {supportedFrameworks.map((f) => (
                <Form.Option value={f.value} key={f.value}>
                  {f.text}
                </Form.Option>
              ))}
            </Form.Select>
            <div className="p-3 text-sm opacity-50">
              Specify the framework you're using.
            </div>
          </div>
          <div className="mb-8">
            <div className="flex w-full border border-solid border-gray-85 rounded py-2 items-center text-sm bg-gray-90">
              <Form.Switch
                className="mr"
                checked={isServerless}
                onChange={(e) => setIsServerless(e.target.checked)}
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
                defaultValue={environment?.build?.entry || ""}
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
                defaultValue={environment?.build?.distFolder || ""}
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
              className="bg-gray-90"
              required={meta.packageJson}
              defaultValue={environment?.build?.cmd || ""}
              inputProps={{
                "aria-label": "Build command",
              }}
              fullWidth
            />
            <div className="p-3 text-sm opacity-50">
              The command to build your application. You can chain multiple
              commands with the <b>&amp;&amp;</b> operator.
            </div>
          </div>
          <h3 className="mt-8 font-bold">Environment variables</h3>
          <div className="pt-3 text-sm opacity-50 mb-8">
            These variables can be used both on client-side and on server-side.
            Variables not used won't appear in the source code.
          </div>
          <div className="mb-8">
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
              onClick={() => {
                setEnvVars([].concat(envVars, [{}]));
              }}
            />
          </div>
          {error && (
            <InfoBox type={InfoBox.ERROR} className="mb-8" scrollIntoView>
              {error}
            </InfoBox>
          )}
          <div className="flex justify-between">
            {isEdit && environment?.name !== "production" && (
              <Button
                secondary
                type="button"
                aria-label="Delete environment"
                onClick={() =>
                  confirmModal(
                    "This will completely the environment and all associated deployments.",
                    (closeModal) => {
                      closeModal(() =>
                        deleteEnvironment({
                          api,
                          app,
                          environment,
                          history,
                        })
                      );
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

EnvironmentFormModal.propTypes = {
  isOpen: PropTypes.bool,
  toggleModal: PropTypes.func,
  environment: PropTypes.object,
  api: PropTypes.object,
  app: PropTypes.object,
  history: PropTypes.object,
  confirmModal: PropTypes.func,
};

export default Object.assign(
  connect(withRouter(EnvironmentFormModal), [
    { Context: ModalContext, props: ["toggleModal", "isOpen"] },
    { Context: ConfirmModal, props: ["confirmModal"], wrap: true },
  ]),
  ModalContext
);
