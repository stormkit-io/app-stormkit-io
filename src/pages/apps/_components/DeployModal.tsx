import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Modal from "~/components/Modal";
import EnvironmentSelector from "~/components/EnvironmentSelector";
import InfoBox from "~/components/InfoBox";
import Form from "~/components/Form";
import Button from "~/components/Button";
import { deploy } from "../actions";
import { useFetchRepoType } from "../[id]/environments/actions";

interface Props {
  app: App;
  environments: Array<Environment>;
  toggleModal: (val: boolean) => void;
}

const DeployModal: React.FC<Props> = ({
  toggleModal,
  environments,
  app,
}): React.ReactElement => {
  const history = useHistory();
  const [selectedEnv, setSelectedEnv] = useState<Environment>();
  const fetchResult = useFetchRepoType({ app, env: selectedEnv });
  const [branch, setBranch] = useState("");
  const [cmd, setCmd] = useState("");
  const [dist, setDist] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [isAutoPublish, setIsAutoPublish] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);
  const { meta, loading: metaLoading } = fetchResult;

  const clearForm = () => {
    setCmd("");
    setDist("");
    setBranch("");
    setSelectedEnv(undefined);
    setIsAutoPublish(undefined);
  };

  return (
    <Modal
      isOpen
      onClose={() => {
        clearForm();
        toggleModal(false);
      }}
      className="max-w-screen-sm"
    >
      <h3 className="mb-8 text-xl font-bold">Start a deployment</h3>
      <Form
        handleSubmit={() =>
          deploy({
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
          defaultValue={selectedEnv?.id}
          onSelect={(env: Environment): void => {
            if (env) {
              setBranch(env.branch);
              setCmd(env.build.cmd);
              setDist(env.build.distFolder);
              setIsAutoPublish(env.autoPublish);
              setError(null);
              setSelectedEnv(env);
            } else {
              clearForm();
            }
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
              placeholder="Default is `npm run build`, `pnpm build` or `yarn build`"
              value={cmd}
              onChange={e => setCmd(e.target.value)}
              tooltip="Stormkit will run this command to build for your project. i.e npm run build or simply mkdir build && cp index.html build"
              inputProps={{
                "aria-label": "Cmd to execute",
              }}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
            {!meta.isFramework && (
              <Form.Input
                name="distFolder"
                className="bg-gray-90 mt-4"
                label="Build Folder"
                tooltip="The directory that is going to be uploaded. i.e for npm projects its generally build folder"
                placeholder="Default is `dist`, `build` respectively"
                value={dist}
                onChange={e => setDist(e.target.value)}
                inputProps={{
                  "aria-label": "Build Folder",
                }}
                InputLabelProps={{
                  shrink: true,
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
          <Button primary loading={loading} disabled={!selectedEnv}>
            Deploy now
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default DeployModal;
