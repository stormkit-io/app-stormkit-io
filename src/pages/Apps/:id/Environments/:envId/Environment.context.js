import React, { createContext } from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router";
import { withRouter } from "react-router-dom";
import { connect } from "~/utils/context";
import AppsContext from "~/pages/Apps/Apps.context";
import EnvironmentsContext from "~/pages/Apps/:id/Environments/Environments.context";
import EnvironmentMenu from "./_components/EnvironmentMenu";
import routes from "./routes";

const Context = createContext();

const EnvironmentContext = ({ environments, match, app }) => {
  const { envId } = match.params;
  const environment = environments.filter((e) => e.id === envId)[0];

  if (!environment) {
    return "";
  }

  return (
    <Context.Provider value={{ environment, environments }}>
      <EnvironmentMenu environment={environment} app={app} />
      <div className="mb-4">
        <Switch>
          {routes.map((route) => (
            <Route {...route} key={route.path} />
          ))}
        </Switch>
      </div>
    </Context.Provider>
  );
};

EnvironmentContext.propTypes = {
  environments: PropTypes.array,
  app: PropTypes.object,
};

const enhanced = connect(withRouter(EnvironmentContext), [
  { Context: EnvironmentsContext, props: ["environments"] },
  { Context: AppsContext, props: ["app"] },
]);

export default Object.assign(enhanced, {
  Consumer: Context.Consumer,
  Provider: enhanced,
});
