import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Api from "~/utils/api/Api";
import Modal, { ModalContextProps } from "~/components/Modal";
import EnvironmentSelector from "~/components/EnvironmentSelector";
import InfoBox from "~/components/InfoBox";
import Form from "~/components/Form";
import Button from "~/components/Button";
import { connect } from "~/utils/context";
import { deploy } from "../actions";
import { useFetchRepoType } from "../[id]/environments/actions";

interface Props {
  api: Api;
  app: App;
  environments: Array<Environment>;
}

const ModalContext = Modal.Context();

const DeployModal: React.FC<Props & ModalContextProps> = ({
  isOpen,
  toggleModal,
  environments,
  api,
  app,
}): React.ReactElement => {
  const history = useHistory();
  const [selectedEnv, setSelectedEnv] = useState<Environment>();
  const fetchResult = useFetchRepoType({ api, app, env: selectedEnv });
  const [branch, setBranch] = useState("");
  const [cmd, setCmd] = useState("");
  const [dist, setDist] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [isAutoPublish, setIsAutoPublish] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);
  const { meta, loading: metaLoading } = fetchResult;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        toggleModal(false);
        setCmd("");
        setDist("");
        setBranch("");
        setIsAutoPublish(undefined);
        setSelectedEnv(undefined);
      }}
      className="max-w-screen-sm"
    >
      <h3 className="mb-8 text-xl font-bold">Start a deployment</h3>
      <Form
        handleSubmit={() =>
          deploy({
            api,
            app,
            environment: selectedEnv,
            toggleModal,
            history,
            setError,
            setLoading,
            config: {
              branch,
              cmd,
              distFolder: dist,
              publish: isAutoPublish || false,
            },
          })
        }
      >
        <EnvironmentSelector
          className="mb-4"
          placeholder="Select an environment to deploy"
          environments={environments}
          onSelect={(env: Environment): void => {
            if (!branch) {
              setBranch(env.branch);
            }

            if (!cmd) {
              setCmd(env.build.cmd);
            }

            if (!dist && !meta.isFramework) {
              setDist(env.build.distFolder);
            }

            if (typeof isAutoPublish === "undefined") {
              setIsAutoPublish(env.autoPublish);
            }

            setError(null);
            setSelectedEnv(env);
          }}
        />
        {selectedEnv && !metaLoading && (
          <>
            <Form.Input
              name="branch"
              className="bg-gray-90"
              label="Checkout Branch"
              value={branch}
              onChange={e => setBranch(e.target.value)}
              inputProps={{
                "aria-label": "Branch to deploy",
              }}
              fullWidth
            />
            <Form.Input
              name="cmd"
              className="bg-gray-90 mt-4"
              label="Build Command"
              placeholder="e.g. npm run build"
              value={cmd}
              onChange={e => setCmd(e.target.value)}
              inputProps={{
                "aria-label": "Cmd to execute",
              }}
              fullWidth
            />
            {!meta.isFramework && (
              <Form.Input
                name="distFolder"
                className="bg-gray-90 mt-4"
                label="Build Folder"
                placeholder="Usually this is the folder created by the build command"
                value={dist}
                onChange={e => setDist(e.target.value)}
                inputProps={{
                  "aria-label": "Build Folder",
                }}
                fullWidth
              />
            )}
            <div className="flex justify-between w-full border border-solid border-gray-85 rounded py-2 pl-4 items-center text-sm bg-gray-90 mt-4">
              Publish deployment
              <Form.Switch
                checked={isAutoPublish}
                placeholder="Publish deployment"
                onChange={e => setIsAutoPublish(e.target.checked)}
                inputProps={{
                  "aria-label": "Publish deployment toggle",
                }}
              />
            </div>
          </>
        )}
        {error && (
          <InfoBox type={InfoBox.ERROR} className="mt-4">
            {error}
          </InfoBox>
        )}
        <div className="flex justify-center mt-4 w-full">
          <Button primary loading={loading}>
            Deploy now
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default Object.assign(
  connect<Props, ModalContextProps>(DeployModal, [
    { Context: ModalContext, props: ["toggleModal", "isOpen"] },
  ]),
  ModalContext
);
