import React, { useContext, useState } from "react";
import Container from "~/components/Container";
import InfoBox from "~/components/InfoBoxV2";
import Spinner from "~/components/Spinner";
import ConfirmModal from "~/components/ConfirmModal";
import DotDotDot from "~/components/DotDotDotV2";
import Link from "~/components/Link";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { useFetchDeployments, deleteForever, stopDeployment } from "./actions";
import ExitStatus from "./_components/ExitStatus";
import Author from "./_components/Author";
import Sha from "./_components/Sha";
import PublishModal from "./_components/PublishModal";
import ManifestModal from "./_components/ManifestModal";
import ReleaseInfo from "./_components/ReleaseInfo";

const defaultMessage = (deployment: Deployment): React.ReactNode => {
  if (deployment.isRunning) {
    return "Commit message is being parsed...";
  }

  return deployment.exit === 0 ? (
    `#${deployment.id}`
  ) : (
    <>
      <div>Deployment failed.</div>
      <div>
        Stormkit has no access to the repo or the branch does not exist.
      </div>
    </>
  );
};

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
      {loading && <Spinner />}
      {!loading && error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
      {!loading &&
        !error &&
        deployments.map(deployment => (
          <div
            className="bg-blue-10 mx-4 mb-4 p-4 flex items-baseline text-sm"
            key={deployment.id}
          >
            <div className="mr-3">
              <ExitStatus
                code={deployment.isRunning ? null : deployment.exit}
              />
            </div>
            <div className="flex-1">
              <Link to={`/apps/${app.id}/deployments/${deployment.id}`}>
                {deployment.commit?.message || defaultMessage(deployment)}
              </Link>
              <div className="flex items-center">
                <Author author={deployment.commit.author} />
                <Sha
                  repo={app.repo}
                  provider={app.provider}
                  sha={deployment.commit.sha}
                />
                <ReleaseInfo
                  percentage={
                    deployment.published?.filter(
                      p => p.envId === environment.id
                    )[0]?.percentage
                  }
                />
              </div>
            </div>
            <div>
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
