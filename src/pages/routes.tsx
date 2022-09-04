import React from "react";
import { Navigate, useLocation, RouteProps } from "react-router-dom";
import Async from "~/components/Async";

const RedirectApps: React.FC = () => {
  const { pathname } = useLocation();
  <Navigate to={pathname.replace("/app", "/apps")} />;
  return <></>;
};

const routes: Array<RouteProps> = [
  {
    path: "/",
    element: Async(() => import("~/pages/apps")),
  },
  {
    path: "/auth",
    element: Async(() => import("~/pages/auth")),
  },
  {
    path: "/logout",
    element: Async(() => import("~/pages/logout")),
  },
  {
    path: "/apps/new",
    element: Async(() => import("~/pages/apps/new")),
  },
  {
    path: "/apps/new/:provider",
    element: Async(() => import("~/pages/apps/new/[provider]")),
  },
  {
    path: "/app/invitation/accept",
    element: Async(() => import("~/pages/app/invitation/Accept")),
  },
  {
    path: "/app/:id",
    element: <RedirectApps />,
  },
  {
    path: "/apps/:id/*",
    element: Async(() => import("~/pages/apps/App.context")),
  },
  {
    path: "/user/*",
    element: Async(() => import("~/pages/user")),
  },
];

export default routes;
