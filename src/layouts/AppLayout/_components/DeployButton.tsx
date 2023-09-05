import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import RocketLaunch from "@mui/icons-material/RocketLaunch";
import DeployModal from "./DeployModal";

interface Props {
  app: App;
  environments: Environment[];
  selectedEnvId: string;
}

const DeployButton: React.FC<Props> = ({
  app,
  environments,
  selectedEnvId,
}) => {
  const [isDeployModalOpen, toggleDeployModal] = useState(false);

  return (
    <>
      <IconButton
        id="deploy-now"
        onClick={e => {
          e.preventDefault();
          toggleDeployModal(true);
        }}
        // className="hover:text-white bg-pink-10 text-sm rounded-none"
        sx={{
          bgcolor: "secondary.main",
          borderRadius: 1,
          fontSize: 13,
          ":hover": {
            bgcolor: "secondary.main",
            filter: "brightness(1.5)",
            transition: "all 0.25s ease-in",
          },
        }}
      >
        <RocketLaunch sx={{ fontSize: 16 }} />
        <div className="m-1">Deploy</div>
      </IconButton>
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
};

export default DeployButton;
