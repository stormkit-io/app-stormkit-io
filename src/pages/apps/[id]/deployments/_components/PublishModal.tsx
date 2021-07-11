import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Modal, { ModalContextProps } from "~/components/Modal";
import EnvironmentSelector from "~/components/EnvironmentSelector";
import InfoBox from "~/components/InfoBox";
import Form from "~/components/Form";
import { RootContextProps } from "~/pages/Root.context";
import { connect } from "~/utils/context";
import { useFetchDeployments, publishDeployments } from "../actions";
import DeployTable from "./PublishModalDeployments";

const ModalContext = Modal.Context();

interface Props extends Pick<RootContextProps, "api"> {
  environments: Array<Environment>;
  deployment: Deployment;
  app: App;
}

const PublishModal: React.FC<Props & ModalContextProps> = ({
  isOpen,
  toggleModal,
  environments,
  deployment,
  api,
  app,
}): React.ReactElement => {
  const history = useHistory();
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("");
  const [publishError, setPublishError] = useState<string | null>(null);
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
          onSelect={e => e.id && setSelectedEnvironment(e.id)}
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
              setPublishError,
            })}
          />
        )}
      </div>
    </Modal>
  );
};

export default Object.assign(
  connect<Props, ModalContextProps>(PublishModal, [
    { Context: ModalContext, props: ["toggleModal", "isOpen"] },
  ]),
  ModalContext
);
