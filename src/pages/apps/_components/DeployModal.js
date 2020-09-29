import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "~/components/Modal";
import EnvironmentSelector from "~/components/EnvironmentSelector";
import InfoBox from "~/components/InfoBox";
import Form from "~/components/Form";
import Button from "~/components/Button";
import { connect } from "~/utils/context";
import { deploy } from "../actions";

const ModalContext = Modal.Context();

const DeployModal = ({
  isOpen,
  toggleModal,
  environments,
  api,
  app,
  history
}) => {
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [branch, setBranch] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
          setError,
          setLoading,
          history
        })}
      >
        <EnvironmentSelector
          className="mb-4"
          placeholder="Select an environment to deploy"
          environments={environments}
          onSelect={e => {
            if (!branch || branch === selectedEnvironment?.branch) {
              setBranch(e.branch);
            }

            setError(null);
            setSelectedEnvironment(e);
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

DeployModal.propTypes = {
  isOpen: PropTypes.bool,
  toggleModal: PropTypes.func,
  environments: PropTypes.array,
  api: PropTypes.object,
  app: PropTypes.object,
  history: PropTypes.object
};

export default Object.assign(
  connect(DeployModal, [
    { Context: ModalContext, props: ["toggleModal", "isOpen"] }
  ]),
  ModalContext
);
