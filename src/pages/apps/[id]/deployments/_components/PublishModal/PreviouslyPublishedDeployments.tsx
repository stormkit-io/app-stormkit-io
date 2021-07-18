import React, { useState } from "react";
import Form from "~/components/Form";
import InfoBox from "~/components/InfoBox";
import Spinner from "~/components/Spinner";
import DeploymentRow from "./DeploymentRow";

interface PreviouslyPublishedDeploymentsProps {
  deployments: Array<Deployment>;
  envId: string;
  environments: Array<Environment>;
  loading: boolean;
  error: string | null;
  onSyncChange: (v: boolean) => void;
}

const PreviouslyPublishedDeployments: React.FC<PreviouslyPublishedDeploymentsProps> =
  ({
    deployments,
    envId,
    environments,
    loading,
    error,
  }): React.ReactElement => {
    const [isInSync, setIsInSync] = useState(true);

    if (deployments.length === 0) {
      return <></>;
    }

    return (
      <div>
        <div className="flex items-center mt-16 mb-8">
          <h2 className="text-base flex-auto">
            Currently published deployments in{" "}
            <span className="font-bold">
              {environments.filter(e => e.id === envId)[0].env}
            </span>
          </h2>
          <div>
            <Form.Switch
              checked={isInSync}
              onChange={e => setIsInSync(e.target.checked)}
            />
            Sync sliders
          </div>
        </div>

        {loading && (
          <div className="flex w-full justify-center">
            <Spinner primary />
          </div>
        )}
        {error && (
          <InfoBox type={InfoBox.ERROR}>
            <div>{error}</div>
          </InfoBox>
        )}

        {!loading &&
          !error &&
          deployments.map((d, index) => (
            <DeploymentRow
              key={d.id}
              index={index}
              deployment={d}
              envId={envId}
              environments={environments}
              isInSync={isInSync}
              initialPercentage={0}
              numberOfDeployments={deployments.length}
              displaySlider
            />
          ))}
      </div>
    );
  };

export default PreviouslyPublishedDeployments;
