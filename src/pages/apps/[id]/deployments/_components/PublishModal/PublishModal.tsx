import React, { useState } from "react";
import Modal from "~/components/Modal";
import EnvironmentSelector from "~/components/EnvironmentSelector";
import InfoBox from "~/components/InfoBox";
import Form from "~/components/Form";
import { useFetchDeployments, publishDeployments } from "../../actions";
import DeploymentToBePublished from "./DeploymentRow";
import PreviouslyPublishedDeployments from "./PreviouslyPublishedDeployments";

interface Props {
  app: App;
  environments: Environment[];
  deployment: Deployment;
  isOpen: boolean;
  toggleModal: (val: boolean) => void;
}

const PublishModal: React.FC<Props> = ({
  isOpen,
  toggleModal,
  environments,
  deployment: deploymentToBePublished,
  app,
}): React.ReactElement => {
  const skipQuery = !isOpen;
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("");
  const [publishError, setPublishError] = useState<string | null>(null);
  const [isInSync, setIsInSync] = useState(true);
  const filters = { envId: selectedEnvironment, published: true };
  const result = useFetchDeployments({ app, filters, skipQuery, from: 0 });
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
          defaultValue={selectedEnvironment}
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
                app,
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

export default PublishModal;
