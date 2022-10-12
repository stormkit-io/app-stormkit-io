import React, { useMemo } from "react";
import Button from "~/components/ButtonV2";
import MobileHeader from "~/components/MobileHeader";
import { deployNow } from "~/utils/helpers/deployments";
import UserButtons from "../../_components/UserButtons";
import { appMenuItems } from "../menu_items";
import { withEnvMenuItems } from "./AppDesktopMenu";

interface Props {
  app: App;
  environments: Environment[];
  selectedEnvId: string;
}

const AppMobileMenu: React.FC<Props> = ({
  app,
  environments,
  selectedEnvId,
}) => {
  const envMenu = withEnvMenuItems({ app, environments, envId: selectedEnvId });
  const appMenu = useMemo(() => appMenuItems({ app }), [app]);
  const envName = useMemo(
    () => environments.find(e => e.id === selectedEnvId)?.name,
    [environments, selectedEnvId]
  );

  return (
    <MobileHeader
      menuItems={[
        { sectionTitle: "App", sectionLinks: appMenu },
        { sectionTitle: `${envName} environment`, sectionLinks: envMenu },
      ]}
      RightButtons={
        <div className="flex items-center text-gray-80">
          <Button
            type="button"
            styled={false}
            onClick={deployNow}
            className="hover:text-white p-2 flex items-center w-8 rounded-full h-8 text-xs justify-center bg-pink-10 mr-2"
          >
            <span className="fas fa-rocket" />
          </Button>
          <UserButtons />
        </div>
      }
    />
  );
};

export default AppMobileMenu;
