import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { StylesProvider } from "@material-ui/core/styles";
import AuthContext from "./auth/Auth.context";
import routes from "./routes";

interface Props {
  Router: typeof BrowserRouter;
}

const Root: React.FC<Props> = ({ Router }): React.ReactElement => (
  <StylesProvider injectFirst>
    <Router>
      <AuthContext>
        <Switch>
          {routes.map(route => (
            <Route
              {...route}
              key={Array.isArray(route.path) ? route.path[0] : route.path}
            />
          ))}
        </Switch>
      </AuthContext>
    </Router>
  </StylesProvider>
);

export default Root;
