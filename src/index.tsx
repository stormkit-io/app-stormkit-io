import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
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

ReactDOM.render(
  <Root Router={BrowserRouter} />,
  document.querySelector("#root")
);
