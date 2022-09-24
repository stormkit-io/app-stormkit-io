import React, { useMemo, useState } from "react";
import ConfirmModal from "~/components/ConfirmModal";
import DotDotDot from "~/components/DotDotDotV2";
import PublishModal from "./PublishModal";
import ManifestModal from "./ManifestModal";
import { deleteForever, stopDeployment } from "../actions";

interface Props {
  app: App;
  deployment: Deployment;
  environment: Environment;
  setRefreshToken: (val: number) => void;
  omittedItems?: string[];
}

const DeploymentMenu: React.FC<Props> = ({
  deployment,
  environment,
  app,
  setRefreshToken,
  omittedItems = [],
}) => {
  const [deploymentToStop, setDeploymentToStop] = useState<Deployment>();
  const [deploymentManifest, setDeploymentManifest] = useState<Deployment>();
  const [deploymentToDelete, setDeploymentToDelete] = useState<Deployment>();
  const [deploymentToPublish, setDeploymentToPublish] = useState<Deployment>();
  const menuItems = useMemo(() => {
    const items = [];

    items.push({
      text: "Publish",
      className: "text-green-50",
      disabled: deployment.exit !== 0,
      onClick: () => {
        setDeploymentToPublish(deployment);
      },
    });

    if (!omittedItems.includes("view-details")) {
      items.push({
        text: "View details",
        href: `/apps/${app.id}/environments/${environment.id}/deployments/${deployment.id}`,
      });
    }

    items.push(
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
        icon: deployment.isRunning ? "fas fa-stop" : "fas fa-trash-alt",
        onClick: () => {
          if (!deployment.isRunning) {
            setDeploymentToDelete(deployment);
          } else {
            setDeploymentToStop(deployment);
          }
        },
      }
    );

    return items;
  }, [omittedItems]);

  return (
    <>
      <DotDotDot items={menuItems}></DotDotDot>
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
    </>
  );
};

export default DeploymentMenu;
