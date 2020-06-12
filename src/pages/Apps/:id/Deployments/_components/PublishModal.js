import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Modal from "~/components/Modal";
import Form from "~/components/Form";
import InfoBox from "~/components/InfoBox";
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
  history,
}) => {
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [publishError, setPublishError] = useState(null);
  const filters = { envId: selectedEnvironment, published: true };
  const result = useFetchDeployments({ api, app, filters });
  const { deployments, loading, error } = result;

  return (
    <Modal isOpen={isOpen} onClose={() => toggleModal(false)} margin="20%">
      <h3 className="mb-8 text-xl font-bold">Publish deployment</h3>
      <Form
        handleSubmit={({ environment }) => setSelectedEnvironment(environment)}
        className="mb-8"
      >
        <Form.Select
          name="environment"
          displayEmpty
          selected={selectedEnvironment}
          onChange={(v) => setSelectedEnvironment(v)}
        >
          <Form.Option disabled value="">
            Select an environment to publish
          </Form.Option>
          {environments.map((env) => (
            <Form.Option value={env.id} key={env.id}>
              <span>
                <span>{env.name || env.env}</span>{" "}
                {env.domain?.name && env.domain?.verified && (
                  <span className="text-xs opacity-75">
                    ({env.domain.name})
                  </span>
                )}
              </span>
            </Form.Option>
          ))}
        </Form.Select>
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
            deployments={deployments.filter((d) => d.id !== deployment.id)}
            deployment={deployment}
            environments={environments}
            envId={selectedEnvironment}
            handlePublishClick={publishDeployments({
              api,
              app,
              history,
              setPublishError,
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
  history: PropTypes.object,
};

export default Object.assign(
  connect(withRouter(PublishModal), [
    { Context: ModalContext, props: ["toggleModal", "isOpen"] },
  ]),
  ModalContext
);
