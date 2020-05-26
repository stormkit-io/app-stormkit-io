import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import routes from "./routes";

const Root = ({ Router, Context }) => (
  <Context.Provider Router={Router}>
    <Switch>
      {routes.map((route) => (
        <Route {...route} key={route.path} />
      ))}
    </Switch>
  </Context.Provider>
);

Root.propTypes = {
  Router: PropTypes.func,
  Context: PropTypes.func,
};

export default Root;
