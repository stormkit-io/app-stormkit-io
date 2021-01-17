import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Modal from "~/components/Modal";
import EnvironmentSelector from "~/components/EnvironmentSelector";
import InfoBox from "~/components/InfoBox";
import Form from "~/components/Form";
import { connect } from "~/utils/context";
import { useFetchDeployments, publishDeployments } from "../actions";
import DeployTable from "./PublishModalDeployments";

const ModalContext = Modal.Context();

const PublishModal = ({
  isOpen,
  toggleModal,
  environments,
  deployment,
  api,
  app,
  history
}) => {
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [publishError, setPublishError] = useState(null);
  const filters = { envId: selectedEnvironment, published: true };
  const result = useFetchDeployments({ api, app, filters, skipQuery: !isOpen });
  const { deployments, loading, error } = result;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => toggleModal(false)}
      className="max-w-screen-md"
    >
      <h3 className="mb-8 text-xl font-bold">Publish deployment</h3>
      <Form>
        <EnvironmentSelector
          className="mb-8"
          environments={environments}
          placeholder="Select an environment to publish"
          onSelect={e => setSelectedEnvironment(e.id)}
        />
      </Form>
      <div>
        {publishError && (
          <InfoBox type={InfoBox.ERROR} className="mb-4" scrollIntoView>
            {publishError}
          </InfoBox>
        )}
        {selectedEnvironment && (
          <DeployTable
            loading={loading}
            error={error}
            deployments={deployments.filter(d => d.id !== deployment.id)}
            deployment={deployment}
            environments={environments}
            envId={selectedEnvironment}
            handlePublishClick={publishDeployments({
              api,
              app,
              history,
              setPublishError
            })}
          />
        )}
      </div>
    </Modal>
  );
};

PublishModal.propTypes = {
  isOpen: PropTypes.bool,
  toggleModal: PropTypes.func,
  deployment: PropTypes.object,
  environments: PropTypes.array,
  api: PropTypes.object,
  app: PropTypes.object,
  history: PropTypes.object
};

export default Object.assign(
  connect(withRouter(PublishModal), [
    { Context: ModalContext, props: ["toggleModal", "isOpen"] }
  ]),
  ModalContext
);
