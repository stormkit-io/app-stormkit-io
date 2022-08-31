import React from "react";
import { Switch, Route } from "react-router";
import EnvironmentMenu from "./_components/EnvironmentMenu";
import routes from "./routes";
import EnvironmentContextProvider from "../Environment.context";

const EnvironmentsEntry = () => {
  return (
    <EnvironmentContextProvider>
      <EnvironmentMenu />
      <div className="mb-4">
        <Switch>
          {routes.map(route => (
            <Route {...route} key={route.path} />
          ))}
        </Switch>
      </div>
    </EnvironmentContextProvider>
  );
};

export default EnvironmentsEntry;
