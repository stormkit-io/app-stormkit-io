import React, { createContext } from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router";
import { connect } from "~/utils/context";
import RootContext from "~/pages/Root.context";
import AppContext from "~/pages/Apps/Apps.context";
import InfoBox from "~/components/InfoBox";
import Spinner from "~/components/Spinner";
import { useFetchEnvironments } from "./actions";
import routes from "./routes";

const Context = createContext();

const EnvironmentsContext = ({ api, app }) => {
  const { environments, loading, error } = useFetchEnvironments({ api, app });

  if (error) {
    return <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>;
  }

  return (
    <Context.Provider value={{ environments }}>
      {loading && <Spinner primary />}
      {!loading && (
        <Switch>
          {routes.map((route) => (
            <Route {...route} key={route.path} />
          ))}
        </Switch>
      )}
    </Context.Provider>
  );
};

EnvironmentsContext.propTypes = {
  api: PropTypes.object,
  app: PropTypes.object,
};

const enhanced = connect(EnvironmentsContext, [
  { Context: RootContext, props: ["api"] },
  { Context: AppContext, props: ["app"] },
]);

export default Object.assign(enhanced, {
  Consumer: Context.Consumer,
  Provider: enhanced,
});
