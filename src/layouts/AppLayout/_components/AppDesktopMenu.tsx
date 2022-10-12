import React, { useMemo } from "react";
import { useLocation } from "react-router";
import { Tooltip } from "@mui/material";
import Button from "~/components/ButtonV2";
import SideMenu from "~/components/SideMenu";
import UserButtons from "../../_components/UserButtons";
import { envMenuItems } from "../menu_items";

interface Props {
  app: App;
  environments: Environment[];
  selectedEnvId: string;
}

interface WithEnvMenuItemsProps {
  app: App;
  environments: Environment[];
  envId: string;
}

export const withEnvMenuItems = ({
  envId,
  environments,
  app,
}: WithEnvMenuItemsProps) => {
  const { pathname } = useLocation();
  return useMemo(
    () =>
      envMenuItems({
        app,
        env: environments.find(e => e.id === envId)!,
        pathname,
      }),
    [app, envId, pathname]
  );
};

const AppSideMenu: React.FC<Props> = ({
  app,
  environments,
  selectedEnvId: envId,
}) => {
  const envMenu = withEnvMenuItems({ app, environments, envId });

  return (
    <div className="hidden md:block">
      <SideMenu menuItems={envMenu}>
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
              aria-label="Usage"
              className="block p-4 text-center w-full"
            >
              <span className="fas fa-money-bill" />
            </Button>
          </div>
        </Tooltip>
        <UserButtons />
      </SideMenu>
    </div>
  );
};

export default AppSideMenu;
