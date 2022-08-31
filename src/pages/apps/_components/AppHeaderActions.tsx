import React, { useState } from "react";
import Button from "~/components/Button";
import DeployModal from "./DeployModal";

interface Props {
  app: App;
  environments: Array<Environment>;
}

const HeaderActions: React.FC<Props> = ({ app, environments }) => {
  const [isOpen, toggleModal] = useState(false);

  return (
    <div className="mr-6">
      <Button
        primary
        className="rounded-xl py-3 font-bold"
        onClick={() => toggleModal(true)}
      >
        <span className="fas fa-rocket mr-4 text-lg" />
        <span className="text-sm">Deploy now</span>
      </Button>
      {isOpen && (
        <DeployModal
          app={app}
          environments={environments}
          toggleModal={toggleModal}
        />
      )}
    </div>
  );
};

export default HeaderActions;
