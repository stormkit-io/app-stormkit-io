import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { StylesProvider } from "@material-ui/core/styles";
import RootContext from "./Root.context";
import routes from "./routes";

interface Props {
  Router: typeof BrowserRouter;
}

const Root: React.FC<Props> = ({ Router }): React.ReactElement => (
  <StylesProvider injectFirst>
    <Router>
      <RootContext.Provider>
        <Switch>
          {routes.map(route => (
            <Route
              {...route}
              key={Array.isArray(route.path) ? route.path[0] : route.path}
            />
          ))}
        </Switch>
      </RootContext.Provider>
    </Router>
  </StylesProvider>
);

export default Root;
