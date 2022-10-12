import React, { useState } from "react";
import { Tooltip } from "@mui/material";
import Button from "~/components/ButtonV2";
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
        <span>
          <Button
            id="deploy-now"
            type="button"
            styled={false}
            onClick={e => {
              e.preventDefault();
              toggleDeployModal(true);
            }}
            className="hover:text-white p-2 flex items-center w-8 rounded-full h-8 text-xs justify-center bg-pink-10"
          >
            <span className="fas fa-rocket" />
          </Button>
        </span>
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
