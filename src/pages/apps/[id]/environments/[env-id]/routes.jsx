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
    component: Async(() =>
      import("~/pages/apps/[id]/environments/[env-id]/logs")
    ),
  },
  {
    path: "/apps/:id/environments/:envId/feature-flags",
    component: Async(() =>
      import("~/pages/apps/[id]/environments/[env-id]/feature-flags")
    ),
  },
  {
    path: "/apps/:id/environments/:envId/snippets",
    component: Async(() =>
      import("~/pages/apps/[id]/environments/[env-id]/snippets")
    ),
  },
  {
    path: "/apps/:id/environments/:envId/domain",
    component: Async(() =>
      import("~/pages/apps/[id]/environments/[env-id]/domain")
    ),
  },
];
