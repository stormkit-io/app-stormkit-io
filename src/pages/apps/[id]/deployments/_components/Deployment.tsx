import React, { useState } from "react";
import cn from "classnames";
import { formattedDate } from "~/utils/helpers/deployments";
import DotDotDot from "~/components/DotDotDot";
import Spinner from "~/components/Spinner";
import ExitStatus from "./ExitStatus";
import PublishModal from "./PublishModal";
import ManifestModal from "./Manifest";
import CommitInfo from "./CommitInfo";
import { deleteForever, stopDeployment, setLoadingArgs } from "../actions";

interface Props {
  deployment: Deployment;
  deployments: Array<Deployment>;
  environments: Array<Environment>;
  index: number;
  app: App;
  setDeployments: (value: Array<Deployment>) => void;
}

const Deployment: React.FC<Props> = ({
  deployment,
  deployments,
  environments,
  index,
  app,
  setDeployments,
}): React.ReactElement => {
  const [isPublishModalOpen, togglePublishModal] = useState(false);
  const [isManifestModalOpen, toggleManifestModal] = useState(false);
  const [loading, setLoading] = useState<setLoadingArgs>(null);

  const urls = {
    environment: `/apps/${deployment.appId}/environments/${deployment.config.env}`,
    deployment: `/apps/${deployment.appId}/deployments/${deployment.id}`,
    preview: deployment.preview,
  };

  const isDisabled = deployment.exit !== 0;

  return (
    <>
      <div
        data-testid={`deploy-${deployment.id}`}
        className={cn("flex w-full px-4 py-6 rounded", {
          "bg-gray-83": index % 2 === 1,
        })}
      >
        <div
          data-testid={`deploy-${deployment.id}-exit-status`}
          className="flex flex-grow-0 items-start mr-4"
        >
          <ExitStatus code={deployment.exit} className="text-lg" iconOnly />
        </div>
        <div className="flex flex-col flex-auto leading-loose text-sm">
          <CommitInfo deployment={deployment} environments={environments} />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-auto justify-end">
            <DotDotDot aria-label={`Deployment ${deployment.id} menu`}>
              <DotDotDot.Item
                onClick={close => {
                  togglePublishModal(true);
                  close();
                }}
                disabled={isDisabled}
              >
                <span className="text-pink-50">Publish</span>
              </DotDotDot.Item>
              <DotDotDot.Item
                onClick={close => {
                  toggleManifestModal(true);
                  close();
                }}
                disabled={isManifestModalOpen}
              >
                <span>Manifest</span>
              </DotDotDot.Item>
              <DotDotDot.Item href={urls.deployment}>
                View Details
              </DotDotDot.Item>
              <DotDotDot.Item
                href={urls.preview}
                disabled={isDisabled}
                icon="fas fa-external-link-square-alt mr-2"
                aria-label={`Preview deployment ${deployment.id}`}
              >
                Preview
              </DotDotDot.Item>
              {deployment.isRunning && (
                <DotDotDot.Item
                  aria-label={`Stop deployment ${deployment.id}`}
                  onClick={close => {
                    stopDeployment({
                      appId: app.id,
                      setDeployments,
                      setLoading,
                      deployments,
                      deploymentId: deployment.id,
                    }).then(close);
                  }}
                  icon="fas fa-stop-circle text-red-50 mr-2"
                >
                  {loading === "stop" ? (
                    <Spinner width={4} height={4} primary />
                  ) : (
                    "Stop"
                  )}
                </DotDotDot.Item>
              )}
              <DotDotDot.Item
                disabled={deployment.isRunning}
                icon="fas fa-trash-alt text-red-50 mr-2"
                onClick={() => {
                  deleteForever({
                    appId: app.id,
                    deploymentId: deployment.id,
                    setLoading,
                    setDeployments,
                    deployments,
                  });
                }}
              >
                {loading === "delete" ? (
                  <Spinner width={4} height={4} primary />
                ) : (
                  "Delete"
                )}
              </DotDotDot.Item>
            </DotDotDot>
          </div>
          <div className="text-sm">{formattedDate(deployment.createdAt)}</div>
        </div>
      </div>
      <PublishModal
        isOpen={isPublishModalOpen}
        toggleModal={togglePublishModal}
        app={app}
        environments={environments}
        deployment={deployment}
      />
      {isManifestModalOpen === true && (
        <ManifestModal
          app={app}
          deployment={deployment}
          toggleModal={toggleManifestModal}
        />
      )}
    </>
  );
};

export default Deployment;
