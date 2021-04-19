import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "~/assets/styles/tailwind.css";
import "~/assets/styles/global.css";
import "~/assets/styles/transitions.css";
import RootContext from "~/pages/Root.context";
import Root from "~/pages/Root";

if (process.env.SENTRY) {
  Promise.all([import("@sentry/react"), import("@sentry/tracing")]).then(
    ([Sentry, { Integrations }]) => {
      Sentry.init({
        dsn: process.env.SENTRY,
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 1.0
      });
    }
  );
}

// for hot reloading
if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(
  <Root Router={Router} Context={RootContext} />,
  document.querySelector("#root")
);
