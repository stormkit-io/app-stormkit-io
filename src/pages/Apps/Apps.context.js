import React, { createContext } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "~/utils/context";
import RootContext from "~/pages/Root.context";
import { useFetchApp } from "./actions";

const Context = createContext();

const AppContext = ({ api, match, children }) => {
  const { id } = match.params;
  const { app, error, loading } = useFetchApp({ api, appId: id });

  return (
    <Context.Provider value={{ app, error, loading }}>
      {children}
    </Context.Provider>
  );
};

AppContext.propTypes = {
  api: PropTypes.object,
  match: PropTypes.object,
  children: PropTypes.node,
};

const enhanced = connect(withRouter(AppContext), [
  { Context: RootContext, props: ["api"] },
]);

export default Object.assign(enhanced, {
  Consumer: Context.Consumer,
  Provider: enhanced,
});
