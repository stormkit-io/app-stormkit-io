import type { MenuItem } from "~/components/SideMenu";
import React, { useMemo } from "react";
import { useLocation } from "react-router";
import { Tooltip } from "@mui/material";
import Button from "~/components/ButtonV2";
import SideMenu from "~/components/SideMenu";
import HeaderButtons from "../../_components/HeaderButtons";
import { capitalize } from "~/utils/helpers/string";

interface Path extends MenuItem {
  borderBottom?: boolean;
}

const paths = ({
  app,
  env,
  pathname,
}: {
  app: App;
  env: Environment;
  pathname: string;
}): Array<Path> => {
  const envPath = `/apps/${app.id}/environments/${env.id}`;

  return [
    {
      path: `/apps/${app.id}/environments`,
      text: "Environments",
      icon: "fas fa-th-large",
      isActive:
        pathname.includes("/environments") &&
        !pathname.includes("/deployments"),
      children: [
        { icon: "", text: `${capitalize(env.env)} environment`, path: "" },
        {
          icon: "far fa-chart-bar",
          text: "Logs",
          path: `${envPath}/logs`,
          isActive: pathname.includes("/logs"),
        },
        {
          icon: "fas fa-code",
          text: "Snippets",
          path: `${envPath}/snippets`,
          isActive: pathname.includes("/snippets"),
        },
        {
          icon: "fas fa-flag",
          text: "Feature Flags",
          path: `${envPath}/feature-flags`,
          isActive: pathname.includes("/feature-flags"),
        },
        {
          icon: "fas fa-globe",
          text: "Configure domain",
          path: `${envPath}/domain`,
          isActive: pathname.includes("/domain"),
        },
      ],
    },
    {
      path: `${envPath}/deployments`,
      text: "Deployments",
      icon: "fas fa-ship",
      isActive: pathname.includes("/deployments"),
    },
  ];
};

interface Props {
  app: App;
  environments: Environment[];
  envId: string;
}

const AppMenu: React.FC<Props> = ({ app, environments, envId }) => {
  const { pathname } = useLocation();
  const menuItems = useMemo(
    () =>
      paths({ app, env: environments.find(e => e.id === envId)!, pathname }),
    [app, envId, pathname]
  );

  return (
    <SideMenu menuItems={menuItems}>
      <HeaderButtons>
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
      </HeaderButtons>
    </SideMenu>
  );
};

export default AppMenu;
