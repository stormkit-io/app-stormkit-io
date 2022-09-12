import React, { useContext } from "react";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { BackButton } from "~/components/Buttons";
import Env from "~/pages/apps/[id]/environments/_components/Environment";
import { EnvironmentContext } from "../../Environment.context";

const EnvironmentMenu: React.FC = () => {
  const { app } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);

  return (
    <div className="w-full">
      <h1 className="mb-8 flex items-center">
        <BackButton to={`/apps/${app.id}/environments`} className="mr-4" />
        <span className="text-2xl text-white">Environments</span>
      </h1>
      <div className="flex">
        <Env app={app} environment={environment} />
      </div>
    </div>
  );
};

export default EnvironmentMenu;
