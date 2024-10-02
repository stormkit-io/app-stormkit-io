import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import RocketLaunch from "@mui/icons-material/RocketLaunch";
import DeployModal from "./DeployModal";

interface Props {
  app: App;
  environments: Environment[];
  selectedEnvId: string;
}

export default function DeployButton({
  app,
  environments,
  selectedEnvId,
}: Props) {
  const [params, _] = useSearchParams();
  const [isDeployModalOpen, toggleDeployModal] = useState(
    params.get("deploy") === ""
  );

  return (
    <>
      <Button
        id="deploy-now"
        onClick={e => {
          e.preventDefault();
          toggleDeployModal(true);
        }}
        color="secondary"
        variant="contained"
        size="medium"
        sx={{ borderRadius: 1 }}
      >
        <RocketLaunch sx={{ fontSize: 16 }} />
        <Typography component="span" sx={{ display: "inline-block", ml: 1 }}>
          Deploy
        </Typography>
      </Button>
      {isDeployModalOpen && (
        <DeployModal
          app={app}
          selected={environments.find(e => e.id === selectedEnvId)}
          environments={environments}
          toggleModal={toggleDeployModal}
        />
      )}
    </>
  );
}
