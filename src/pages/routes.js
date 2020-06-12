import Async from "~/components/Async";
import Spinner from "~/components/Spinner";

Async.configure({ Loader: Spinner, props: { pageCenter: true } });

export default [
  {
    path: "/",
    exact: true,
    component: Async(() => import("~/pages/Apps")),
  },
  {
    path: "/auth",
    component: Async(() => import("~/pages/Auth")),
  },
  {
    path: "/logout",
    component: Async(() => import("~/pages/Logout")),
  },
  {
    path: "/apps/new",
    exact: true,
    component: Async(() => import("~/pages/Apps/New")),
  },
  {
    path: "/apps/new/:provider",
    exact: true,
    component: Async(() => import("~/pages/Apps/New/:provider")),
  },
  {
    path: "/app/:id",
    exact: true,
    component: Async(() => import("~/pages/App/:id")),
  },
  {
    path: "/apps/:id",
    component: Async(() => import("~/pages/Apps/Apps.router")),
  },
];
