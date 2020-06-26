import React, { createContext } from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router";
import { connect } from "~/utils/context";
import RootContext from "~/pages/Root.context";
import AppContext from "~/pages/Apps/Apps.context";
import routes from "./routes";

const Context = createContext();

const EnvironmentsContext = ({ environments }) => {
  return (
    <Context.Provider value={{ environments }}>
      <Switch>
        {routes.map((route) => (
          <Route {...route} key={route.path} />
        ))}
      </Switch>
    </Context.Provider>
  );
};

EnvironmentsContext.propTypes = {
  api: PropTypes.object,
  app: PropTypes.object,
  environments: PropTypes.array,
};

const enhanced = connect(EnvironmentsContext, [
  { Context: RootContext, props: ["api"] },
  { Context: AppContext, props: ["app", "environments"] },
]);

export default Object.assign(enhanced, {
  Consumer: Context.Consumer,
  Provider: enhanced,
});
