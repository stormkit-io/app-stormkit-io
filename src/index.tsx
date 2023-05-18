// @ts-ignore
import { createRoot } from "react-dom/client";
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

const root = createRoot(document.querySelector("#root")!);
root.render(<Root Router={BrowserRouter} />);
