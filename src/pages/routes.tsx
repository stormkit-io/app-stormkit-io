import React from "react";
import { Redirect, useLocation, RouteProps } from "react-router-dom";
import Async from "~/components/Async";
import Spinner from "~/components/Spinner";

Async.configure({ Loader: Spinner, props: { pageCenter: true } });

const routes: Array<RouteProps> = [
  {
    path: "/",
    exact: true,
    component: Async(() => import("~/pages/apps"))
  },
  {
    path: "/auth",
    component: Async(() => import("~/pages/auth"))
  },
  {
    path: "/logout",
    component: Async(() => import("~/pages/logout"))
  },
  {
    path: "/apps/new",
    exact: true,
    component: Async(() => import("~/pages/apps/new"))
  },
  {
    path: "/apps/new/:provider",
    exact: true,
    component: Async(() => import("~/pages/apps/new/[provider]"))
  },
  {
    path: "/app/:id",
    component: (): React.ReactElement => {
      const { pathname } = useLocation();
      return <Redirect to={pathname.replace("/app", "/apps")} />;
    }
  },
  {
    path: "/apps/:id",
    component: Async(() => import("~/pages/apps/App.context"))
  },
  {
    path: "/user",
    component: Async(() => import("~/pages/user"))
  }
];

export default routes;
