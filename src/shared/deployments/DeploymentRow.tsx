import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { grey } from "@mui/material/colors";
import LensIcon from "@mui/icons-material/Lens";
import CardRow from "~/components/CardRow";
import ConfirmModal from "~/components/ConfirmModal";
import { timeSince } from "~/utils/helpers/date";
import CommitInfo from "./CommitInfo";
import PublishModal from "./PublishModal";
import ManifestModal from "./ManifestModal";
import { deleteForever, stopDeployment } from "./actions";
import { useWithMenuItems } from "./actions";

interface Props {
  environment?: Environment;
  deployment: DeploymentV2;
  setRefreshToken: (v: number) => void;
  withAppName?: boolean;
}

export default function DeploymentRow({
  deployment,
  setRefreshToken,
  withAppName,
}: Props) {
  const isRunning = deployment.status === "running";
  const isSuccess = deployment.status === "success";
  const [showStopModal, setShowStopModal] = useState<boolean>();
  const [showManifest, setShowManifest] = useState<boolean>();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>();
  const [showPublishModal, setShowPublishModal] = useState<boolean>();
  const menuItems = useWithMenuItems({
    deployment,
    omittedItems: [],
    onManifestClick: () => setShowManifest(true),
    onStateChangeClick: () =>
      isRunning ? setShowStopModal(true) : setShowDeleteModal(true),
    onPublishClick: () => setShowPublishModal(true),
  });

  const iconProps = {
    fontSize: 12,
    position: "relative",
    top: 3.5,
    mr: 2,
  };

  return (
    <CardRow
      menuItems={menuItems}
      actions={
        <Typography
          sx={{
            fontSize: 11,
            color: grey[500],
          }}
        >
          {timeSince(deployment.createdAt * 1000)} ago
        </Typography>
      }
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        {isRunning && (
          <CircularProgress
            size={12}
            color="error"
            variant="indeterminate"
            sx={iconProps}
          />
        )}
        {!isRunning && (
          <LensIcon color={isSuccess ? "success" : "error"} sx={iconProps} />
        )}
        <Box sx={{ flex: 1 }}>
          <CommitInfo deployment={deployment} />
        </Box>
      </Box>
      {showDeleteModal && (
        <ConfirmModal
          onConfirm={({ setLoading, setError }) => {
            setLoading(true);
            deleteForever({
              appId: deployment.appId,
              deploymentId: deployment.id,
            })
              .then(() => {
                setLoading(false);
                setShowDeleteModal(undefined);
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
            setShowDeleteModal(undefined);
          }}
        >
          This will completely remove the deployment and the artifacts. This
          action is irreversible.
        </ConfirmModal>
      )}
      {showStopModal && (
        <ConfirmModal
          onConfirm={({ setLoading, setError }) => {
            setLoading(true);
            stopDeployment({
              appId: deployment.appId,
              deploymentId: deployment.id,
            })
              .then(() => {
                setLoading(false);
                setShowStopModal(undefined);
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
            setShowStopModal(undefined);
          }}
        >
          This will stop the deployment.
        </ConfirmModal>
      )}
      {showPublishModal && (
        <PublishModal
          deployment={deployment}
          onUpdate={() => {
            setRefreshToken(Date.now());
          }}
          onClose={() => {
            setShowPublishModal(undefined);
          }}
        />
      )}
      {showManifest && (
        <ManifestModal
          deployment={deployment}
          onClose={() => {
            setShowManifest(undefined);
          }}
        />
      )}
    </CardRow>
  );
}
