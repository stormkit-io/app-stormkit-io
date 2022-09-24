import React, { useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { Route, Routes } from "react-router-dom";
import cn from "classnames";
import AppContextProvider, { AppContext } from "~/pages/apps/[id]/App.context";
import AppName from "~/components/AppName";
import Link from "~/components/Link";
import Form from "~/components/FormV2";
import AppMenu from "./_components/AppMenu";
import { routes } from "./routes";

const appMenuItems = (app: App) => [
  { path: `/apps/${app.id}/team`, text: "Team", icon: "fas fa-users" },
  {
    path: `/apps/${app.id}/settings`,
    text: "Settings",
    icon: "fas fa-gear",
    borderBottom: true,
  },
];

export const AppLayout: React.FC = () => {
  const { app, environments } = useContext(AppContext);
  const { pathname } = useLocation();
  const menuItems = useMemo(() => appMenuItems(app), [app]);
  const navigate = useNavigate();

  // Deduce the envId from the pathname because we cannot access
  // the :envId url parameter, as it's included inside
  // this component as a child.
  const envId = pathname.split("/environments/")?.[1]?.split("/")?.[0];
  const selectedEnvId = envId || environments?.[0]?.id || "";

  if (!selectedEnvId || environments.length === 0) {
    return <></>;
  }

  return (
    <main className={cn("flex flex-col min-h-screen m-auto w-full")}>
      <header className="ml-16 flex-0 overflow-x-auto text-xs md:text-sm">
        <div
          className="flex flex-1 text-gray-80 items-center justify-start m-auto w-full max-w-screen-md my-2 px-4"
          style={{ minHeight: "54px" }}
        >
          <div className="flex flex-1 items-center">
            <AppName app={app} imageWidth={7} />
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
              <Link
                key={item.path}
                to={item.path}
                className="hover:text-white p-2 flex items-center bg-blue-50 ml-4 w-8 rounded-full h-8 text-xs justify-center"
              >
                <span className={item.icon} />
              </Link>
            ))}
          </div>
        </div>
      </header>
      <AppMenu app={app} environments={environments} envId={selectedEnvId} />
      <div className="ml-16 flex-1">
        <section className="max-w-screen-md w-full m-auto px-4">
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
