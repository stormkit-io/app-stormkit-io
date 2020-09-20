import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "~/assets/styles/tailwind.css";
import "~/assets/styles/global.css";
import "~/assets/styles/transitions.css";
import RootContext from "~/pages/Root.context";
import Root from "~/pages/Root";

// for hot reloading
if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(
  <Root Router={Router} Context={RootContext} />,
  document.querySelector("#root")
);
