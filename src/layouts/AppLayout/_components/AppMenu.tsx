import React, { useMemo, useState } from "react";
import { Tooltip } from "@mui/material";
import Button from "~/components/ButtonV2";
import SideMenu from "~/components/SideMenu";
import DeployModal from "./DeployModal";
import HeaderButtons from "../../_components/HeaderButtons";
import { capitalize } from "~/utils/helpers/string";

interface Path {
  path: string;
  text: string;
  icon: string;
  children?: Path[];
  borderBottom?: boolean;
}

const paths = ({ app, env }: { app: App; env: Environment }): Array<Path> => {
  const envPath = `/apps/${app.id}/environments/${env.id}`;

  return [
    { path: `/apps/${app.id}/team`, text: "Team", icon: "fas fa-users" },
    {
      path: `/apps/${app.id}/settings`,
      text: "Settings",
      icon: "fas fa-cogs",
      borderBottom: true,
    },
    {
      path: `/apps/${app.id}/environments`,
      text: "Environments",
      icon: "fas fa-th-large",
      children: [
        { icon: "", text: `${capitalize(env.env)} environment`, path: "" },
        { icon: "far fa-chart-bar", text: "Logs", path: `${envPath}/logs` },
        { icon: "fas fa-code", text: "Snippets", path: `${envPath}/snippets` },
        {
          icon: "fas fa-flag",
          text: "Feature Flags",
          path: `${envPath}/feature-flags`,
        },
        {
          icon: "fas fa-globe",
          text: "Configure domain",
          path: `${envPath}/domain`,
        },
      ],
    },
    {
      path: `/apps/${app.id}/deployments`,
      text: "Deployments",
      icon: "fas fa-ship",
    },
  ];
};

interface Props {
  app: App;
  environments: Environment[];
  envId: string;
}

const AppMenu: React.FC<Props> = ({ app, environments, envId }) => {
  const [isDeployModalOpen, toggleDeployModal] = useState(false);
  const menuItems = useMemo(
    () => paths({ app, env: environments.find(e => e.id === envId)! }),
    [app, envId]
  );

  return (
    <SideMenu menuItems={menuItems}>
      <HeaderButtons>
        <Tooltip
          title={
            <Button
              className="p-4"
              styled={false}
              onClick={() => toggleDeployModal(true)}
            >
              Deploy now
            </Button>
          }
          arrow
          placement="right"
          classes={{
            tooltip: "bg-pink-10 custom-tooltip text-sm",
            arrow: "text-pink-10",
          }}
        >
          {/* required because button does not support holding a ref */}
          <div className="w-full">
            <Button
              aria-label="Deploy now"
              className="bg-pink-10 p-4 hover:text-white w-full"
              styled={false}
              category="action"
              onClick={() => toggleDeployModal(true)}
            >
              <span className="fas fa-rocket text-lg" />
            </Button>
          </div>
        </Tooltip>
        <Tooltip
          title={
            <Button
              className="p-4 block"
              href={`/apps/${app.id}/usage`}
              styled={false}
            >
              Usage
            </Button>
          }
          arrow
          placement="right"
          classes={{
            tooltip: "bg-blue-50 custom-tooltip text-sm",
            arrow: "text-blue-50",
          }}
        >
          {/* required because button does not support holding a ref */}
          <div className="w-full">
            <Button
              href={`/apps/${app.id}/usage`}
              styled={false}
              className="block p-4 text-center w-full"
            >
              <span className="fas fa-money-bill" />
            </Button>
          </div>
        </Tooltip>
        {isDeployModalOpen && (
          <DeployModal
            app={app}
            environments={environments}
            toggleModal={toggleDeployModal}
          />
        )}
      </HeaderButtons>
    </SideMenu>
  );
};

export default AppMenu;
