import React, { useContext, useState } from "react";
import Container from "~/components/Container";
import InfoBox from "~/components/InfoBoxV2";
import Spinner from "~/components/Spinner";
import ConfirmModal from "~/components/ConfirmModal";
import DotDotDot from "~/components/DotDotDotV2";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { formattedDate } from "~/utils/helpers/deployments";
import { useFetchDeployments, deleteForever, stopDeployment } from "./actions";
import PublishModal from "./_components/PublishModal";
import ManifestModal from "./_components/ManifestModal";
import CommitInfo from "./_components/CommitInfo";

const Deployments: React.FC = () => {
  const { app, setRefreshToken } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const [deploymentToStop, setDeploymentToStop] = useState<Deployment>();
  const [deploymentManifest, setDeploymentManifest] = useState<Deployment>();
  const [deploymentToDelete, setDeploymentToDelete] = useState<Deployment>();
  const [deploymentToPublish, setDeploymentToPublish] = useState<Deployment>();
  const { deployments, loading, error } = useFetchDeployments({
    app,
    from: 0,
    filters: { envId: environment.id },
  });

  return (
    <Container title="Deployments" maxWidth="max-w-none" className="pb-4">
      {loading && (
        <div className="pb-4 flex w-full justify-center">
          <Spinner />
        </div>
      )}
      {!loading && error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
      {!loading &&
        !error &&
        deployments.map(deployment => (
          <div
            className="bg-blue-10 mx-2 md:mx-4 mb-2 md:mb-4 p-4 flex text-sm"
            key={deployment.id}
          >
            <CommitInfo
              app={app}
              environment={environment}
              deployment={deployment}
              showStatus
            />
            <div className="flex flex-col items-end justify-between">
              <DotDotDot
                items={[
                  {
                    text: "Publish",
                    className: "text-green-50",
                    disabled: deployment.exit !== 0,
                    onClick: () => {
                      setDeploymentToPublish(deployment);
                    },
                  },
                  {
                    text: "View details",
                    href: `/apps/${app.id}/deployments/${deployment.id}`,
                  },
                  {
                    text: "Manifest",
                    icon: "fas fa-scroll",
                    disabled: deployment.exit !== 0,
                    onClick: () => {
                      setDeploymentManifest(deployment);
                    },
                  },
                  {
                    text: "Preview",
                    icon: "fas fa-external-link-square-alt",
                    disabled: deployment.exit !== 0,
                    href: deployment.preview,
                  },
                  {
                    text: deployment.isRunning ? "Stop" : "Delete",
                    icon: deployment.isRunning
                      ? "fas fa-stop"
                      : "fas fa-trash-alt",
                    onClick: () => {
                      if (!deployment.isRunning) {
                        setDeploymentToDelete(deployment);
                      } else {
                        setDeploymentToStop(deployment);
                      }
                    },
                  },
                ]}
              ></DotDotDot>
              <div className="text-xs">
                {formattedDate(deployment.createdAt)}
              </div>
            </div>
          </div>
        ))}
      {deploymentToDelete && (
        <ConfirmModal
          onConfirm={({ setLoading, setError }) => {
            setLoading(true);
            deleteForever({
              appId: app.id,
              deploymentId: deploymentToDelete.id,
            })
              .then(() => {
                setLoading(false);
                setDeploymentToDelete(undefined);
                setRefreshToken(Date.now());
              })
              .catch(() => {
                setLoading(false);
                setError(
                  "Something went wrong while deleting deployment. Please try again."
                );
              });
          }}
          onCancel={() => {
            setDeploymentToDelete(undefined);
          }}
        >
          This will completely remove the deployment and the artifacts. This
          action is irreversible.
        </ConfirmModal>
      )}
      {deploymentToStop && (
        <ConfirmModal
          onConfirm={({ setLoading, setError }) => {
            setLoading(true);
            stopDeployment({
              appId: app.id,
              deploymentId: deploymentToStop.id,
            })
              .then(() => {
                setLoading(false);
                setDeploymentToStop(undefined);
                setRefreshToken(Date.now());
              })
              .catch(() => {
                setLoading(false);
                setError(
                  "Something went wrong while stopping deployment. Please try again."
                );
              });
          }}
          onCancel={() => {
            setDeploymentToDelete(undefined);
          }}
        >
          This will stop the deployment.
        </ConfirmModal>
      )}
      {deploymentToPublish && (
        <PublishModal
          app={app}
          environment={environment}
          deployment={deploymentToPublish}
          onUpdate={() => {
            setRefreshToken(Date.now());
          }}
          onClose={() => {
            setDeploymentToPublish(undefined);
          }}
        />
      )}
      {deploymentManifest && (
        <ManifestModal
          app={app}
          deployment={deploymentManifest}
          onClose={() => {
            setDeploymentManifest(undefined);
          }}
        />
      )}
    </Container>
  );
};

export default Deployments;
