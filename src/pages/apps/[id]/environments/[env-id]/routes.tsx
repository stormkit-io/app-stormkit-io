import type { RouteProps } from "react-router";
import React from "react";
import { Navigate } from "react-router-dom";
import Async from "~/components/Async";

const routes: Array<RouteProps> = [
  {
    path: "/",
    element: <Navigate to={`logs`} />,
  },
  {
    path: "/logs",
    element: Async(
      () => import("~/pages/apps/[id]/environments/[env-id]/logs")
    ),
  },
  {
    path: "/feature-flags",
    element: Async(
      () => import("~/pages/apps/[id]/environments/[env-id]/feature-flags")
    ),
  },
  {
    path: "/snippets",
    element: Async(
      () => import("~/pages/apps/[id]/environments/[env-id]/snippets")
    ),
  },
  {
    path: "/domain",
    element: Async(
      () => import("~/pages/apps/[id]/environments/[env-id]/domain")
    ),
  },
];

export default routes;
