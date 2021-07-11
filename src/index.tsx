import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "~/assets/styles/tailwind.css";
import "~/assets/styles/global.css";
import "~/assets/styles/transitions.css";
import Root from "~/pages/Root";

if (process.env.SENTRY) {
  Promise.all([import("@sentry/react"), import("@sentry/tracing")]).then(
    ([Sentry, { Integrations }]) => {
      Sentry.init({
        dsn: process.env.SENTRY,
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 1.0,
      });
    }
  );
}

// for hot reloading
if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(
  <Root Router={BrowserRouter} />,
  document.querySelector("#root")
);
