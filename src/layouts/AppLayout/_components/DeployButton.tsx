import React, { useState } from "react";
import { Tooltip } from "@mui/material";
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
      <Tooltip title="Deploy now" arrow>
        <IconButton
          id="deploy-now"
          onClick={e => {
            e.preventDefault();
            toggleDeployModal(true);
          }}
          className="hover:text-white bg-pink-10 text-sm rounded-none"
        >
          <RocketLaunch sx={{ fontSize: 16 }} />
          <div className="m-1">Deploy Now</div>
        </IconButton>
      </Tooltip>
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
