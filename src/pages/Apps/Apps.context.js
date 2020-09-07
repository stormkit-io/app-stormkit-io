import React, { createContext } from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import AppLayout from "~/layouts/AppLayout";
import { connect } from "~/utils/context";
import RootContext from "~/pages/Root.context";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import { useFetchApp } from "./actions";
import routes from "./routes";
import HeaderActions from "./_components/HeaderActions";
import { useFetchEnvironments } from "./:id/Environments/actions";

const Context = createContext();

const AppContext = ({ api, match, history, location }) => {
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
      <AppLayout
        app={app}
        actions={
          <HeaderActions
            app={app}
            api={api}
            history={history}
            environments={envs.environments}
          />
        }
      >
        {envs.loading && <Spinner primary />}
        {!envs.loading && (
          <Switch>
            {routes.map((route) => (
              <Route {...route} key={route.path} />
            ))}
          </Switch>
        )}
      </AppLayout>
    </Context.Provider>
  );
};

AppContext.propTypes = {
  api: PropTypes.object,
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
};

const enhanced = connect(AppContext, [
  { Context: RootContext, props: ["api"] },
]);

export default Object.assign(enhanced, {
  Consumer: Context.Consumer,
  Provider: enhanced,
});
