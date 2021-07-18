import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Modal, { ModalContextProps } from "~/components/Modal";
import EnvironmentSelector from "~/components/EnvironmentSelector";
import InfoBox from "~/components/InfoBox";
import Form from "~/components/Form";
import { RootContextProps } from "~/pages/Root.context";
import { AppContextProps } from "~/pages/apps/App.context";
import { connect } from "~/utils/context";
import { useFetchDeployments, publishDeployments } from "../../actions";
import DeploymentToBePublished from "./DeploymentRow";
import PreviouslyPublishedDeployments from "./PreviouslyPublishedDeployments";

const ModalContext = Modal.Context();

interface Props extends Pick<RootContextProps, "api">, AppContextProps {
  deployment: Deployment;
}

const PublishModal: React.FC<Props & ModalContextProps> = ({
  isOpen,
  toggleModal,
  environments,
  deployment: deploymentToBePublished,
  api,
  app,
}): React.ReactElement => {
  const skipQuery = !isOpen;
  const history = useHistory();
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("");
  const [publishError, setPublishError] = useState<string | null>(null);
  const [isInSync, setIsInSync] = useState(true);
  const filters = { envId: selectedEnvironment, published: true };
  const result = useFetchDeployments({ api, app, filters, skipQuery, from: 0 });
  const { deployments, loading, error } = result;

  const previouslyPublishedDeployments = deployments.filter(
    d => d.id !== deploymentToBePublished.id
  );

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
          <>
            <DeploymentToBePublished
              index={1}
              deployment={deploymentToBePublished}
              envId={selectedEnvironment}
              environments={environments}
              numberOfDeployments={deployments.length}
              initialPercentage={100}
              displaySlider={previouslyPublishedDeployments.length > 0}
              isInSync={isInSync}
              handlePublishClick={publishDeployments({
                api,
                app,
                history,
                setPublishError,
              })}
            />
            <PreviouslyPublishedDeployments
              loading={loading}
              error={error}
              deployments={previouslyPublishedDeployments}
              environments={environments}
              envId={selectedEnvironment}
              onSyncChange={setIsInSync}
            />
          </>
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
