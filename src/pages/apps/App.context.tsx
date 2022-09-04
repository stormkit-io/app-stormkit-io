import React, { createContext } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import MenuLayout from "~/layouts/MenuLayout";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import Link from "~/components/Link";
import Error404 from "~/components/Errors/Error404";
import AppHeader from "./_components/AppHeader";
import AppMenu from "./_components/AppMenu";
import { useFetchApp } from "./actions";
import { useFetchEnvironments } from "./[id]/environments/actions";
import routes from "./routes";

export interface AppContextProps {
  app: App;
  environments: Array<Environment>;
  setRefreshToken: (val: number) => void;
}

export const AppContext = createContext<AppContextProps>({
  app: {} as App,
  environments: [],
  setRefreshToken: () => {},
});

const Provider: React.FC = () => {
  const { app, error, loading, setRefreshToken, refreshToken } = useFetchApp({
    appId: useParams().id,
  });

  const envs = useFetchEnvironments({ app, refreshToken });

  if (loading) {
    return <Spinner primary pageCenter />;
  }

  if (error || envs.error) {
    return (
      <InfoBox type={InfoBox.ERROR}>
        {error ||
          "Something went wrong on our side. Please try again. If the problem persists reach us out through Discord or email."}
      </InfoBox>
    );
  }

  if (!app) {
    return (
      <Error404>
        <p>
          O-oh, we couldn't find this app. Would you like to go back to
          <br />
          <Link to="/" secondary>
            My Apps
          </Link>
          ?
        </p>
      </Error404>
    );
  }

  return (
    <AppContext.Provider
      value={{
        app,
        environments: envs.environments,
        setRefreshToken,
      }}
    >
      <MenuLayout menu={<AppMenu app={app} />}>
        <div className="flex flex-grow-0 max-w-screen-lg m-auto w-full mb-24">
          <AppHeader app={app} envs={envs.environments} />
        </div>
        <div className="flex flex-auto max-w-screen-lg m-auto w-full">
          {envs.loading && <Spinner primary />}
          {!envs.loading && (
            <Routes>
              {routes.map(route => (
                <Route
                  {...route}
                  key={Array.isArray(route.path) ? route.path[0] : route.path}
                />
              ))}
            </Routes>
          )}
        </div>
      </MenuLayout>
    </AppContext.Provider>
  );
};

export default Provider;
