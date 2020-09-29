import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import { StylesProvider } from "@material-ui/core/styles";
import routes from "./routes";

const Root = ({ Router, Context, defaultContext }) => (
  <StylesProvider injectFirst>
    <Context.Provider Router={Router} defaultContext={defaultContext}>
      <Switch>
        {routes.map(route => (
          <Route {...route} key={route.path} />
        ))}
      </Switch>
    </Context.Provider>
  </StylesProvider>
);

Root.propTypes = {
  defaultContext: PropTypes.object,
  Router: PropTypes.func,
  Context: PropTypes.func
};

export default Root;
