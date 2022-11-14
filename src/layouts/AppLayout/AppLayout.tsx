import React, { useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { Route, Routes } from "react-router-dom";
import { Tooltip } from "@mui/material";
import AppContextProvider, { AppContext } from "~/pages/apps/[id]/App.context";
import AppName from "~/components/AppName";
import Form from "~/components/FormV2";
import Link from "~/components/Link";
import AppMobileMenu from "./_components/AppMobileMenu";
import AppDesktopMenu from "./_components/AppDesktopMenu";
import DeployButton from "./_components/DeployButton";
import { appMenuItems } from "./menu_items";
import { routes } from "./routes";

export const AppLayout: React.FC = () => {
  const { app, environments } = useContext(AppContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const appMenuItemsMemo = useMemo(() => appMenuItems({ app }), [app]);

  // Deduce the envId from the pathname because we cannot access
  // the :envId url parameter, as it's included inside
  // this component as a child.
  const envId = pathname.split("/environments/")?.[1]?.split("/")?.[0];
  const selectedEnvId =
    envId || environments?.find(e => e.name === "production")?.id || "";

  if (!selectedEnvId || environments.length === 0) {
    return <></>;
  }

  return (
    <main className="flex flex-col min-h-screen m-auto w-full">
      <AppMobileMenu
        app={app}
        environments={environments}
        selectedEnvId={selectedEnvId}
      />
      <AppDesktopMenu
        app={app}
        environments={environments}
        selectedEnvId={selectedEnvId}
      />
      <header className="md:ml-16 flex-0 overflow-x-auto text-xs md:text-sm mb-4 md:mb-0">
        <div
          className="flex flex-1 text-gray-80 items-center justify-start m-auto w-full max-w-screen-md my-2 px-4"
          style={{ minHeight: "54px" }}
        >
          <div className="flex flex-1 items-center justify-between md:justify-start">
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
          <div className="hidden md:flex items-center">
            <DeployButton
              app={app}
              environments={environments}
              selectedEnvId={selectedEnvId}
            />
            {appMenuItemsMemo.map(item => (
              <span key={item.path} className="inline-block ml-4">
                <Tooltip key={item.path || item.text} title={item.text} arrow>
                  <span>
                    <Link
                      to={item.path}
                      className="hover:text-white p-2 flex items-center w-8 rounded-full h-8 text-xs justify-center bg-blue-50"
                    >
                      <span className={item.icon} />
                    </Link>
                  </span>
                </Tooltip>
              </span>
            ))}
          </div>
        </div>
      </header>
      <div className="md:ml-16 flex-1 max-w-screen-md w-full self-center flex">
        <section className="w-full px-4">
          <Routes>
            {routes.map(r => (
              <Route {...r} key={r.path} />
            ))}
          </Routes>
        </section>
      </div>
    </main>
  );
};

const WithAppProvider: React.FC = () => (
  <AppContextProvider>
    <AppLayout />
  </AppContextProvider>
);

export default WithAppProvider;
