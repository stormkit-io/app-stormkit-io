import React, { useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Route, Routes } from "react-router-dom";
import { Tooltip } from "@mui/material";
import cn from "classnames";
import AppContextProvider, { AppContext } from "~/pages/apps/[id]/App.context";
import AppName from "~/components/AppName";
import Link from "~/components/Link";
import Form from "~/components/FormV2";
import Button from "~/components/ButtonV2";
import AppMenu from "./_components/AppMenu";
import DeployModal from "./_components/DeployModal";
import { routes } from "./routes";

const appMenuItems = ({
  app,
  toggleDeployModal,
}: {
  app: App;
  toggleDeployModal: (val: boolean) => void;
}) => [
  {
    id: "deploy-now",
    path: "",
    text: "Deploy now",
    icon: "fas fa-rocket",
    bg: "bg-pink-10",
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      toggleDeployModal(true);
    },
  },
  {
    path: `/apps/${app.id}/environments`,
    text: "Environments",
    icon: "fas fa-th-large",
  },
  { path: `/apps/${app.id}/team`, text: "Team", icon: "fas fa-users" },
  {
    path: `/apps/${app.id}/settings`,
    text: "Settings",
    icon: "fas fa-gear",
  },
];

export const AppLayout: React.FC = () => {
  const { app, environments } = useContext(AppContext);
  const { pathname } = useLocation();
  const [isDeployModalOpen, toggleDeployModal] = useState(false);
  const navigate = useNavigate();
  const menuItems = useMemo(
    () => appMenuItems({ app, toggleDeployModal }),
    [app, toggleDeployModal]
  );

  // Deduce the envId from the pathname because we cannot access
  // the :envId url parameter, as it's included inside
  // this component as a child.
  const envId = pathname.split("/environments/")?.[1]?.split("/")?.[0];
  const selectedEnvId = envId || environments?.[0]?.id || "";

  if (!selectedEnvId || environments.length === 0) {
    return <></>;
  }

  return (
    <main className="flex flex-col min-h-screen m-auto w-full">
      <header className="ml-16 flex-0 overflow-x-auto text-xs md:text-sm">
        <div
          className="flex flex-1 text-gray-80 items-center justify-start m-auto w-full max-w-screen-md my-2 px-4"
          style={{ minHeight: "54px" }}
        >
          <div className="flex flex-1 items-center">
            <AppName app={app} imageWidth={7} withLinkToRepo />
            {pathname.includes("environments") && (
              <Form.Select
                fullWidth={false}
                background="transparent"
                textColor="white"
                className="font-bold pt-1"
                onChange={e => {
                  if (pathname.includes(`/environments/${selectedEnvId}`)) {
                    navigate(
                      pathname.replace(
                        `/environments/${selectedEnvId}`,
                        `/environments/${e.target.value}`
                      )
                    );
                  } else {
                    navigate(`/apps/${app.id}/environments/${e.target.value}`);
                  }
                }}
                value={selectedEnvId}
              >
                {environments.map(e => (
                  <Form.Option key={e.id} value={e.id}>
                    {e.env}
                  </Form.Option>
                ))}
              </Form.Select>
            )}
          </div>
          <div className="flex items-center">
            {menuItems.map(item => (
              <Tooltip key={item.path} title={item.text} arrow>
                <span>
                  {item.path ? (
                    <Link
                      to={item.path}
                      onClick={item.onClick}
                      className={cn(
                        "hover:text-white p-2 flex items-center ml-4 w-8 rounded-full h-8 text-xs justify-center",
                        { "bg-blue-50": !item.bg },
                        item.bg
                      )}
                    >
                      <span className={item.icon} />
                    </Link>
                  ) : (
                    <Button
                      id={item.id}
                      type="button"
                      styled={false}
                      onClick={item.onClick}
                      className={cn(
                        "hover:text-white p-2 flex items-center ml-4 w-8 rounded-full h-8 text-xs justify-center",
                        { "bg-blue-50": !item.bg },
                        item.bg
                      )}
                    >
                      <span className={item.icon} />
                    </Button>
                  )}
                </span>
              </Tooltip>
            ))}
          </div>
        </div>
      </header>
      <AppMenu app={app} environments={environments} envId={selectedEnvId} />
      <div className="ml-16 flex-1 max-w-screen-md w-full self-center flex">
        <section className="w-full px-4">
          <Routes>
            {routes.map(r => (
              <Route {...r} key={r.path} />
            ))}
          </Routes>
        </section>
      </div>
      {isDeployModalOpen && (
        <DeployModal
          app={app}
          selected={environments.find(e => e.id === selectedEnvId)}
          environments={environments}
          toggleModal={toggleDeployModal}
        />
      )}
    </main>
  );
};

const WithAppProvider: React.FC = () => (
  <AppContextProvider>
    <AppLayout />
  </AppContextProvider>
);

export default WithAppProvider;
