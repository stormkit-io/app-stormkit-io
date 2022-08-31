import React, { useContext, useState } from "react";
import { AppContext } from "~/pages/apps/App.context";
import { PlusButton } from "~/components/Buttons";
import Environment from "./_components/Environment";
import EnvironmentFormModal from "./_components/EnvironmentFormModal";

const Environments: React.FC = (): React.ReactElement => {
  const { app, environments } = useContext(AppContext);
  const [isModalOpen, toggleModal] = useState<boolean>(false);

  return (
    <div className="mb-4">
      <div className="flex items-center mb-4">
        <h1 className="flex flex-auto items-center">
          <span className="text-2xl text-white">Environments</span>
        </h1>
        {environments.length > 1 && (
          <div className="flex-shrink-0">
            <PlusButton
              onClick={() => toggleModal(true)}
              className="text-white rounded"
              size="small"
              aria-label="Insert environment"
            />
          </div>
        )}
      </div>
      <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-2 gap-3">
        {environments.map(env => (
          <div key={env.id}>
            <Environment environment={env} app={app} isClickable />
          </div>
        ))}
        {environments.length === 1 && (
          <PlusButton
            onClick={() => toggleModal(true)}
            className="text-white rounded w-full bg-white-o-05 hover:text-gray-50"
            size="small"
            aria-label="Insert environment"
          />
        )}
      </div>
      {isModalOpen && (
        <EnvironmentFormModal app={app} toggleModal={toggleModal} isOpen />
      )}
    </div>
  );
};

export default Environments;
