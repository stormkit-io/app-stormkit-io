import React, { useEffect } from "react";
import { RouteProps } from "react-router";
import { useLocation, useNavigate } from "react-router-dom";
import Async from "~/components/Async";
import { LocalStorage } from "~/utils/storage";
import { LS_PROVIDER } from "~/utils/api/Api";

const RedirectApps: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    navigate(pathname.replace("/app", "/apps"));
  }, [navigate]);

  return <></>;
};

const RedirectNewApp: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/apps/new/${LocalStorage.get(LS_PROVIDER)}`);
  }, [navigate]);

  return <></>;
};

const RedirectToEnvPage: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    navigate(`${pathname}/environments`);
  }, [navigate]);

  return <></>;
};

const centerLayout = () => import("~/layouts/CenterLayout");

const routes: Array<RouteProps> = [
  {
    path: "/",
    element: Async(() => import("~/pages/apps"), centerLayout),
  },
  {
    path:"/clone",
    element: Async(() => import("~/pages/clone"), centerLayout),
  },
  {
    path: "/auth",
    element: Async(() => import("~/pages/auth"), centerLayout),
  },
  {
    path: "/logout",
    element: Async(() => import("~/pages/logout")),
  },
  {
    path: "/apps/new",
    element: <RedirectNewApp />,
  },
  {
    path: "/apps/new/github",
    element: Async(() => import("~/pages/apps/new/github"), centerLayout),
  },
  {
    path: "/apps/new/gitlab",
    element: Async(() => import("~/pages/apps/new/gitlab"), centerLayout),
  },
  {
    path: "/apps/new/bitbucket",
    element: Async(() => import("~/pages/apps/new/bitbucket"), centerLayout),
  },
  {
    path: "/apps/new/url",
    element: Async(() => import("~/pages/apps/new/url"), centerLayout),
  },
  {
    path: "/app/invitation/accept",
    element: Async(() => import("~/pages/app/invitation/Accept")),
  },
  {
    path: "/app/:id/*",
    element: <RedirectApps />,
  },
  {
    path: "/apps/:id",
    element: <RedirectToEnvPage />,
  },
  {
    path: "/apps/:id/*",
    element: Async(() => import("~/layouts/AppLayout")),
  },
  {
    path: "/user/*",
    element: Async(() => import("~/pages/user"), centerLayout),
  },
];

export default routes;
