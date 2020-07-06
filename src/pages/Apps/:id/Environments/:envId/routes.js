import React from "react";
import Async from "~/components/Async";
import { Redirect } from "react-router-dom";

export default [
  {
    path: "/apps/:id/environments/:envId",
    exact: true,
    component: ({ match }) => <Redirect to={`${match.url}/logs`} />,
  },
  {
    path: "/apps/:id/environments/:envId/logs",
    component: Async(() => import("~/pages/Apps/:id/Environments/:envId/Logs")),
  },
  {
    path: "/apps/:id/environments/:envId/remote-config",
    component: Async(() =>
      import("~/pages/Apps/:id/Environments/:envId/RemoteConfig")
    ),
  },
  {
    path: "/apps/:id/environments/:envId/snippets",
    component: Async(() =>
      import("~/pages/Apps/:id/Environments/:envId/Snippets")
    ),
  },
];
