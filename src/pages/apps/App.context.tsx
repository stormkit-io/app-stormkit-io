import React, { createContext } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { connect } from "~/utils/context";
import Api from "~/utils/api/Api";
import MenuLayout from "~/layouts/MenuLayout";
import RootContext from "~/pages/Root.context";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import Link from "~/components/Link";
import Error404 from "~/components/Errors/Error404";
import AppHeader from "./_components/AppHeader";
import AppMenu from "./_components/AppMenu";
import { useFetchApp } from "./actions";
import { useFetchEnvironments } from "./[id]/environments/actions";
import routes from "./routes";

interface IContext {
  app?: App;
  environments?: Array<Environment>;
}

interface Props {
  api: Api;
}

interface MatchParams {
  id: string;
}

const Context = createContext<IContext>({});

const AppContext: React.FC<Props> = ({ api }) => {
  const match = useRouteMatch<MatchParams>();
  const { id } = match.params;
  const { app, error, loading } = useFetchApp({ api, appId: id });
  const envs = useFetchEnvironments({ api, app });

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

  if (!loading && !app) {
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
    <Context.Provider value={{ app, environments: envs.environments }}>
      <MenuLayout menu={<AppMenu app={app} />}>
        <div className="flex flex-grow-0 max-w-screen-lg m-auto w-full mb-24">
          <AppHeader app={app} api={api} envs={envs.environments} />
        </div>
        <div className="flex flex-auto max-w-screen-lg m-auto w-full">
          {envs.loading && <Spinner primary />}
          {!envs.loading && (
            <Switch>
              {routes.map(route => (
                <Route
                  {...route}
                  key={Array.isArray(route.path) ? route.path[0] : route.path}
                />
              ))}
            </Switch>
          )}
        </div>
      </MenuLayout>
    </Context.Provider>
  );
};

const enhanced = connect(AppContext, [
  { Context: RootContext, props: ["api"] }
]);

export default Object.assign(enhanced, {
  Consumer: Context.Consumer,
  Provider: enhanced
});
