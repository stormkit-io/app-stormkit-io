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
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment>();
  const [branch, setBranch] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => toggleModal(false)}
      className="max-w-screen-sm"
    >
      <h3 className="mb-8 text-xl font-bold">Start a deployment</h3>
      <Form
        handleSubmit={deploy({
          api,
          app,
          environment: selectedEnvironment,
          toggleModal,
          history,
          setError,
          setLoading,
        })}
      >
        <EnvironmentSelector
          className="mb-4"
          placeholder="Select an environment to deploy"
          environments={environments}
          onSelect={(env: Environment): void => {
            if (!branch || branch === selectedEnvironment?.branch) {
              setBranch(env.branch);
            }

            setError(null);
            setSelectedEnvironment(env);
          }}
        />
        <Form.Input
          name="branch"
          className="bg-gray-90"
          label="Branch"
          value={branch}
          onChange={e => setBranch(e.target.value)}
          fullWidth
        />
        {selectedEnvironment?.autoPublish && (
          <InfoBox className="mt-4">
            This environment has Auto Publish turned on. This deployment will be
            published if it is successful.
          </InfoBox>
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
