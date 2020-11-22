import React, { createContext } from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import { connect } from "~/utils/context";
import MenuLayout from "~/layouts/MenuLayout";
import RootContext from "~/pages/Root.context";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import AppHeader from "./_components/AppHeader";
import AppMenu from "./_components/AppMenu";
import { useFetchApp } from "./actions";
import { useFetchEnvironments } from "./[id]/environments/actions";
import routes from "./routes";

const Context = createContext();

const AppContext = ({ api, match, location, history }) => {
  const { id } = match.params;
  const { app, error, loading } = useFetchApp({ api, appId: id, location });
  const envs = useFetchEnvironments({ api, app, location });

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

  return (
    <Context.Provider value={{ app, environments: envs.environments }}>
      <MenuLayout menu={<AppMenu app={app} />}>
        <div className="flex flex-grow-0 max-w-screen-lg m-auto w-full mb-24">
          <AppHeader
            app={app}
            api={api}
            envs={envs.environments}
            history={history}
          />
        </div>
        <div className="flex flex-auto max-w-screen-lg m-auto w-full">
          {envs.loading && <Spinner primary />}
          {!envs.loading && (
            <Switch>
              {routes.map(route => (
                <Route {...route} key={route.path} />
              ))}
            </Switch>
          )}
        </div>
      </MenuLayout>
    </Context.Provider>
  );
};

AppContext.propTypes = {
  api: PropTypes.object,
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object
};

const enhanced = connect(AppContext, [
  { Context: RootContext, props: ["api"] }
]);

export default Object.assign(enhanced, {
  Consumer: Context.Consumer,
  Provider: enhanced
});
